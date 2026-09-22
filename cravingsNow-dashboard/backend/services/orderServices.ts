import { CreateOrderInput } from "../types/order";
import { getActiveTaxGroup } from "./taxService";
import { prisma } from "../utils/db";
import { calculateLineTax } from "./taxCalculator";
import { parsePrice } from "../lib/price";
import { findNearestBranch } from "./locationServices";

export async function createOrder(input: CreateOrderInput) {
  // --- Resolve coupon ---
  let couponId: string | undefined;
  if (input.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: input.couponCode },
    });
    if (!coupon) throw new Error("Invalid coupon code");
    couponId = coupon.id;
  }

  if (input.customerId) {
    const customer = await prisma.customer.findUnique({
      where: { id: input.customerId },
    });
    if (!customer) throw new Error(`Unknown customer: ${input.customerId}`);
  }

  if (input.customerAddressId) {
    const address = await prisma.customerAddress.findUnique({
      where: { id: input.customerAddressId },
    });
    if (!address)
      throw new Error(`Unknown customer address: ${input.customerAddressId}`);
  }

  const { taxGroupId, taxes: activeTaxes } = await getActiveTaxGroup();

  // --- Load every product in the cart, WITH its groupName — this is the
  // only source of brand identity. No brandId is ever read from `input`. ---
  const productIds = input.products.map((p) => p.productId);
  const dbProducts = await prisma.groupProducts.findMany({
    where: { id: { in: productIds } },
  });
  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  const optionIds = (input?.products ?? []).flatMap((p) =>
    (p?.options ?? []).map((o) => o.modifierOptionId),
  );
  const dbOptions = await prisma.modifierOption.findMany({
    where: { id: { in: optionIds } },
  });
  const optionMap = new Map(dbOptions.map((o) => [o.id, o]));

  // --- THE SPLIT: group cart lines by the product's OWN groupName,
  // not by anything the client asserted. A product's brand is a fact
  // about the product, never a client-supplied value. ---
  const linesByGroupName = new Map<string, typeof input.products>();
  for (const line of input.products) {
    const product = productMap.get(line.productId);
    if (!product) throw new Error(`Unknown product: ${line.productId}`);

    const existing = linesByGroupName.get(product.groupName!) ?? [];
    existing.push(line);
    linesByGroupName.set(product.groupName!, existing);
  }

  // --- For each brand present in the cart, resolve its Foodics identity
  // AT THIS SPECIFIC PHYSICAL BRANCH. input.branchId alone is never
  // sufficient — it identifies the location, not any brand's Foodics
  // branch_id at that location. ---
  type BuiltOrder = ReturnType<typeof buildBrandOrderData> & {
    branchId: string;
  };

  const builtOrders: BuiltOrder[] = [];
  let customerOrderSubtotal = 0;

  const { branchId: resolvedBranchId } = await findNearestBranch(
    input.location.latitude,
    input.location.longitude,
  );

  const resolvedBranch = await prisma.branch.findUnique({
    where: { id: resolvedBranchId },
  });

  const branchesAtLocation = await prisma.branch.findMany({
    where: {
      address: resolvedBranch?.address,
      groupName: { in: [...linesByGroupName.keys()] },
    },
  });
  // console.log(branchesAtLocation, ...linesByGroupName.keys());
  const branchByGroupName = new Map(
    branchesAtLocation.map((b) => [b.groupName, b]),
  );
  for (const [groupName, lines] of linesByGroupName) {
    const branch = branchByGroupName.get(groupName);
    const built = buildBrandOrderData(
      lines,
      productMap,
      optionMap,
      activeTaxes,
      taxGroupId,
    );
    customerOrderSubtotal += built.subtotal;
    builtOrders.push({
      ...built,
      branchId: branch?.id!,
    });
  }

  // --- Charges — untouched, stay at CustomerOrder level, never split ---
  const chargeIds = input.charges.map((c) => c.chargeId);
  const dbCharges = await prisma.charge.findMany({
    where: { id: { in: chargeIds } },
  });
  let chargesTotal = 0;
  const chargeLines = dbCharges.map((charge) => {
    const amount = parsePrice(charge.value);
    chargesTotal += amount;
    return { chargeId: charge.id, amount, taxExclusiveAmount: amount };
  });

  const customerOrderTotal =
    builtOrders.reduce((sum, o) => sum + o.totalPrice, 0) + chargesTotal;

  // --- One transaction: CustomerOrder + one Order per brand + one
  // OrderSyncJob per Order, all committed together or not at all ---
  const customerOrder = await prisma.$transaction(async (tx) => {
    const created = await tx.customerOrder.create({
      data: {
        customerId: input.customerId,
        customerAddressId: input.customerAddressId,
        subtotalPrice: customerOrderSubtotal,
        totalPrice: customerOrderTotal,
        couponId,
        dueAt: input.dueAt ? new Date(input.dueAt) : undefined,
        charges: { create: chargeLines },
      },
    });
    console.log(builtOrders.length);
    for (const built of builtOrders) {
      const order = await tx.order.create({
        data: {
          customerOrderId: created.id,
          type: "DELIVERY",
          source: "API",
          status: "Pending",
          guests: 1,
          kitchenNotes: "",
          customerNotes: "",
          businessDate: new Date(),
          subtotalPrice: built.subtotal,
          discountAmount: 0,
          roundingAmount: 0,
          totalPrice: built.totalPrice,
          taxExclusiveDiscountAmount: 0,
          branchId: built.branchId, // local Branch.id — satisfies the orders_branch_id_fkey constraint, // the RESOLVED, brand-specific Foodics id — never input.branchId directly
          customerId: input.customerId,
          customerAddressId: input.customerAddressId,
          products: {
            create: built.productLines.map((line) => ({
              productId: line.productId,
              foodicsId: line.foodicsId,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              totalPrice: line.totalPrice,
              totalCost: 0,
              discountAmount: 0,
              taxExclusiveDiscountAmount: 0,
              taxExclusiveUnitPrice: line.taxExclusiveUnitPrice,
              taxExclusiveTotalPrice: line.taxExclusiveTotalPrice,
              status: "Pending",
              isIngredientsWasted: false,
              isIngredientsReturned: false,
              addedAt: new Date(),
              taxes: { create: line.tax },
              options: {
                create: (line.options ?? []).map((opt) => ({
                  modifierOptionId: opt.modifierOptionId,
                  foodicsId: opt.foodicsId,
                  quantity: opt.quantity,
                  unitPrice: opt.unitPrice,
                  totalPrice: opt.totalPrice,
                  totalCost: 0,
                  taxExclusiveUnitPrice: opt.taxExclusiveUnitPrice,
                  taxExclusiveTotalPrice: opt.taxExclusiveTotalPrice,
                  taxes: { create: opt.tax },
                })),
              },
            })),
          },
        },
      });

      await tx.orderSyncJob.create({ data: { orderId: order.id } });
    }

    return created;
  });

  return customerOrder;
  // console.log(result);
}

function buildBrandOrderData(
  lines: CreateOrderInput["products"],
  productMap: Map<string, any>,
  optionMap: Map<string, any>,
  activeTaxes: Awaited<ReturnType<typeof getActiveTaxGroup>>["taxes"],
  taxGroupId: string,
) {
  let subtotal = 0;
  let totalPrice = 0;

  const productLines = lines.map((line) => {
    const product = productMap.get(line.productId)!;
    const taxExclusiveUnitPrice = parsePrice(product.price);
    const productTax = calculateLineTax(
      taxExclusiveUnitPrice,
      line.quantity,
      activeTaxes,
      taxGroupId,
    );
    subtotal += productTax.taxExclusiveTotalPrice;
    totalPrice += productTax.totalPrice;

    const options = (line.options ?? []).map((opt) => {
      const modifierOption = optionMap.get(opt.modifierOptionId);
      if (!modifierOption)
        throw new Error(`Unknown modifier option: ${opt.modifierOptionId}`);

      const optionTaxExclusiveUnitPrice = parsePrice(modifierOption.price);
      const optionTax = calculateLineTax(
        optionTaxExclusiveUnitPrice,
        opt.quantity,
        activeTaxes,
        taxGroupId,
      );
      subtotal += optionTax.taxExclusiveTotalPrice;
      totalPrice += optionTax.totalPrice;

      return {
        modifierOptionId: opt.modifierOptionId,
        foodicsId: opt.foodicsId,
        quantity: opt.quantity,
        unitPrice: optionTax.unitPrice,
        totalPrice: optionTax.totalPrice,
        taxExclusiveUnitPrice: optionTax.taxExclusiveUnitPrice,
        taxExclusiveTotalPrice: optionTax.taxExclusiveTotalPrice,
        tax: {
          taxGroupId,
          amount: optionTax.combinedAmount,
          rate: optionTax.combinedRate,
        },
      };
    });

    return {
      productId: line.productId,
      foodicsId: line.foodicsId,
      quantity: line.quantity,
      unitPrice: productTax.unitPrice,
      totalPrice: productTax.totalPrice,
      taxExclusiveUnitPrice: productTax.taxExclusiveUnitPrice,
      taxExclusiveTotalPrice: productTax.taxExclusiveTotalPrice,
      tax: {
        taxGroupId,
        amount: productTax.combinedAmount,
        rate: productTax.combinedRate,
      },
      options,
    };
  });

  return { subtotal, totalPrice, productLines };
}

// const allBranchesWithThatAddress = await prisma.branch.findMany({
//     where: { address: resolvedBranch?.address },
//   });
//   console.log(
//     "branches at that address (no groupName filter):",
//     allBranchesWithThatAddress.map((b) => ({
//       groupName: JSON.stringify(b.groupName),
//       address: JSON.stringify(b.address),
//     })),
//   );
