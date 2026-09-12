import { CreateOrderInput } from "../types/order";
import { getActiveTaxGroup } from "./taxService";
import { prisma } from "../utils/db";
import { calculateLineTax } from "./taxCalculator";
import { parsePrice } from "../lib/price";

export async function createOrder(input: CreateOrderInput) {
  // --- Resolve coupon code -> couponId ---
  let couponId: string | undefined;
  if (input.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: input.couponCode },
    });
    if (!coupon) throw new Error("Invalid coupon code");
    couponId = coupon.id;
  }

  // --- Load VAT + GST once (7.5% + 5%), applied uniformly to every line ---
  const { taxGroupId, taxes: activeTaxes } = await getActiveTaxGroup();

  // --- Load product pricing from our cache (synced from Foodics) ---
  const productIds = input.products.map((p) => p.productId);
  const dbProducts = await prisma.groupProducts.findMany({
    where: { id: { in: productIds } },
  });
  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  // --- Load modifier-option pricing ONCE, across all lines — avoids an
  // N+1 query inside the per-line loop below ---
  const optionIds = input.products.flatMap((p) =>
    p.options.map((o) => o.modifierOptionId),
  );
  const dbOptions = await prisma.modifierOption.findMany({
    where: { id: { in: optionIds } },
  });
  const optionMap = new Map(dbOptions.map((o) => [o.id, o]));

  // --- Load charge amounts ONCE, same pattern ---
  const chargeIds = input.charges.map((c) => c.chargeId);
  const dbCharges = await prisma.charge.findMany({
    where: { id: { in: chargeIds } },
  });
  const chargeMap = new Map(dbCharges.map((c) => [c.id, c]));

  let taxExclusiveSubtotal = 0;
  let taxInclusiveTotal = 0;

  // --- Product lines (no async needed inside — all data was pre-fetched above) ---
  const productLines = input.products.map((line) => {
    const product = productMap.get(line.productId);
    if (!product) throw new Error(`Unknown product: ${line.productId}`);

    const taxExclusiveUnitPrice = parsePrice(product.price);
    const productTax = calculateLineTax(
      taxExclusiveUnitPrice,
      line.quantity,
      activeTaxes,
      taxGroupId,
    );

    taxExclusiveSubtotal += productTax.taxExclusiveTotalPrice;
    taxInclusiveTotal += productTax.totalPrice;

    const optionLines = line.options.map((opt) => {
      const modifierOption = optionMap.get(opt.modifierOptionId);
      if (!modifierOption) {
        throw new Error(`Unknown modifier option: ${opt.modifierOptionId}`);
      }

      const optionTaxExclusiveUnitPrice = parsePrice(modifierOption.price);
      const optionTax = calculateLineTax(
        optionTaxExclusiveUnitPrice,
        opt.quantity,
        activeTaxes,
        taxGroupId,
      );

      taxExclusiveSubtotal += optionTax.taxExclusiveTotalPrice;
      taxInclusiveTotal += optionTax.totalPrice;

      return {
        modifierOptionId: opt.modifierOptionId,
        quantity: opt.quantity,
        unitPrice: optionTax.unitPrice,
        totalPrice: optionTax.totalPrice,
        taxExclusiveUnitPrice: optionTax.taxExclusiveUnitPrice,
        taxExclusiveTotalPrice: optionTax.taxExclusiveTotalPrice,
        totalCost: 0, // requires modifierOption.cost if you want this populated
        tax: {
          taxGroupId: optionTax.taxGroupId,
          amount: optionTax.combinedAmount,
          rate: optionTax.combinedRate,
        },
      };
    });

    return {
      productId: line.productId,
      quantity: line.quantity,
      unitPrice: productTax.unitPrice,
      totalPrice: productTax.totalPrice,
      taxExclusiveUnitPrice: productTax.taxExclusiveUnitPrice,
      taxExclusiveTotalPrice: productTax.taxExclusiveTotalPrice,
      discountAmount: 0,
      taxExclusiveDiscountAmount: 0,
      totalCost: 0,
      status: "Pending",
      isIngredientsWasted: false,
      isIngredientsReturned: false,
      addedAt: new Date(),
      kitchenNotes: line.kitchenNotes,
      tax: {
        taxGroupId: productTax.taxGroupId,
        amount: productTax.combinedAmount,
        rate: productTax.combinedRate,
      },
      options: optionLines,
    };
  });

  // --- Charge lines — the piece that was completely missing ---
  const chargeLines = input.charges.map((c) => {
    const charge = chargeMap.get(c.chargeId);
    if (!charge) throw new Error(`Unknown charge: ${c.chargeId}`);

    const chargeTaxExclusiveAmount = parsePrice(charge.value);
    const chargeTax = calculateLineTax(
      chargeTaxExclusiveAmount,
      1,
      activeTaxes,
      taxGroupId,
    );

    taxExclusiveSubtotal += chargeTax.taxExclusiveTotalPrice;
    taxInclusiveTotal += chargeTax.totalPrice;

    return {
      chargeId: c.chargeId,
      amount: chargeTax.totalPrice,
      taxExclusiveAmount: chargeTax.taxExclusiveTotalPrice,
      tax: {
        taxGroupId: chargeTax.taxGroupId,
        amount: chargeTax.combinedAmount,
        rate: chargeTax.combinedRate,
      },
    };
  });

  const subtotal = taxExclusiveSubtotal;
  const totalPrice = taxInclusiveTotal; // extend once discounts stack on top

  // --- Single transaction: order + children + sync job, all-or-nothing ---
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        type: "DELIVERY",
        source: "API",
        guests: input.guests,
        kitchenNotes: input.kitchenNotes ?? "",
        customerNotes: input.customerNotes ?? "",
        businessDate: new Date(),
        subtotalPrice: subtotal,
        discountAmount: 0,
        roundingAmount: 0,
        totalPrice,
        taxExclusiveDiscountAmount: 0,
        branchId: input.branchId,
        customerId: input.customerId,
        customerAddressId: input.customerAddressId,
        couponId,
        dueAt: input.dueAt ? new Date(input.dueAt) : undefined,
        products: {
          create: productLines.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            totalPrice: line.totalPrice,
            totalCost: line.totalCost,
            discountAmount: line.discountAmount,
            taxExclusiveDiscountAmount: line.taxExclusiveDiscountAmount,
            taxExclusiveUnitPrice: line.taxExclusiveUnitPrice,
            taxExclusiveTotalPrice: line.taxExclusiveTotalPrice,
            isIngredientsWasted: line.isIngredientsWasted,
            isIngredientsReturned: line.isIngredientsReturned,
            addedAt: line.addedAt,
            kitchenNotes: line.kitchenNotes,
            product: input.products,

            taxes: {
              create: {
                taxGroupId: line.tax.taxGroupId,
                amount: line.tax.amount,
                rate: line.tax.rate,
              },
            },
            options: {
              create: line.options.map((opt) => ({
                modifierOptionId: opt.modifierOptionId,
                quantity: opt.quantity,
                unitPrice: opt.unitPrice,
                totalPrice: opt.totalPrice,
                totalCost: opt.totalCost,
                taxExclusiveUnitPrice: opt.taxExclusiveUnitPrice,
                taxExclusiveTotalPrice: opt.taxExclusiveTotalPrice,
                taxes: {
                  create: {
                    taxGroupId: opt.tax.taxGroupId,
                    amount: opt.tax.amount,
                    rate: opt.tax.rate,
                  },
                },
              })),
            },
          })),
        },
        charges: {
          create: chargeLines.map((c) => ({
            chargeId: c.chargeId,
            amount: c.amount,
            taxExclusiveAmount: c.taxExclusiveAmount,
            taxes: {
              create: {
                taxGroupId: c.tax.taxGroupId,
                amount: c.tax.amount,
                rate: c.tax.rate,
              },
            },
          })),
        },
        payments: {
          create: [
            {
              paymentMethodId: input.payment.paymentMethodId,
              amount: input.payment.amount,
              tendered: input.payment.amount,
              businessDate: new Date(),
              addedAt: new Date(),
            },
          ],
        },
      },
    });

    await tx.orderSyncJob.create({
      data: { orderId: created.id },
    });

    return created;
  });
  return order;
}
