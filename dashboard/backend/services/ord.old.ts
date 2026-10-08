import { CreateOrderInput } from "../types/order";
import { getActiveTaxGroup } from "./taxService";
import { prisma } from "../utils/db";
import { calculateLineTax } from "./taxCalculator";
import { parsePrice } from "../lib/price";
import { findNearestBranch } from "./locationServices";
import { initializePaystackTransaction } from "./paystack/paystack";
import { calculateProcessingFeeKobo } from "./chargeCalc";
import { Order, Prisma } from "../generated/prisma/client";
import { randomUUID, createHash } from "crypto";

export async function createOrder(input: CreateOrderInput) {
  const key = input.idempotencyKey; // controller: req.header("Idempotency-Key")
  const requestHash = createHash("sha256")
    .update(
      JSON.stringify({
        c: input.customerId,
        a: input.customerAddressId,
        k: input.couponCode ?? null,
        p: [...input.products]
          .map((p) => ({
            id: p.productId,
            q: p.quantity,
            o: (p.options ?? [])
              .map((o) => `${o.modifierOptionId}:${o.quantity}`)
              .sort(),
          }))
          .sort((x, y) => x.id.localeCompare(y.id)),
      }),
    )
    .digest("hex");

  if (key) {
    const existing = await prisma.customerOrder.findUnique({
      where: { idempotencyKey: key },
    });
    if (existing) return replay(existing, requestHash);
  }

  function replay(
    existing: {
      requestHash: string | null;
      paystackAuthUrl: string | null;
    } & Record<string, any>,
    hash: string,
  ) {
    if (existing.requestHash !== hash)
      throw Object.assign(
        new Error("Idempotency key reused with a different request"),
        { status: 422 },
      );
    if (!existing.paystackAuthUrl)
      throw Object.assign(
        new Error("Order is still being processed, retry shortly"),
        { status: 409 },
      );
    return {
      ...existing,
      authorizationUrl: existing.paystackAuthUrl,
      replayed: true,
    };
  }
  // --- Resolve coupon ---
  let couponId: string | undefined;

  const productIds = input.products.map((p) => p.productId);
  const optionIds = (input?.products ?? []).flatMap((p) =>
    (p?.options ?? []).map((o) => o.modifierOptionId),
  );
  const t0 = Date.now();
  const lap = (l: string) =>
    console.log(`[createOrder] ${l}: ${Date.now() - t0}ms`);
  // call lap("reads") after Promise.all, lap("branches") after findMany,
  // lap("tx") after $transaction, lap("paystack") after initialize, lap("done") before return
  const [
    coupon,
    customer,
    address,
    taxGroup,
    dbProducts,
    dbOptions,
    nearest,
    processingFeeCharge,
  ] = await Promise.all([
    input.couponCode
      ? prisma.coupon.findUnique({ where: { code: input.couponCode } })
      : null,
    input.customerId
      ? prisma.customer.findUnique({ where: { id: input.customerId } })
      : null,
    input.customerAddressId
      ? prisma.customerAddress.findUnique({
          where: { id: input.customerAddressId },
        })
      : null,
    getActiveTaxGroup(),
    prisma.groupProducts.findMany({ where: { id: { in: productIds } } }),
    prisma.modifierOption.findMany({ where: { id: { in: optionIds } } }),
    findNearestBranch(input.location.latitude, input.location.longitude),
    prisma.charge.findFirst({
      where: { isActive: true, type: "ProcessingFee" },
    }),
  ]);
  lap("branches");

  if (input.couponCode && !coupon) throw new Error("Invalid coupon code");
  if (input.customerId && !customer)
    throw new Error(`Unknown customer: ${input.customerId}`);
  if (input.customerAddressId && !address)
    throw new Error(`Unknown customer address: ${input.customerAddressId}`);
  if (!processingFeeCharge)
    throw new Error("No active payment processing fee charge configured");

  // --- Load every product in the cart, WITH its groupName — this is the
  // only source of brand identity. No brandId is ever read from `input`. ---

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));
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
  // console.log("linesByGroupName:", Object.fromEntries(linesByGroupName));

  // --- For each brand present in the cart, resolve its Foodics identity
  // AT THIS SPECIFIC PHYSICAL BRANCH. input.branchId alone is never
  // sufficient — it identifies the location, not any brand's Foodics
  // branch_id at that location. ---

  const resolvedBranch = await prisma.branch.findUnique({
    where: { id: nearest.branchId },
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
  type BuiltOrder = ReturnType<typeof buildBrandOrderData> & {
    branchId: string;
  };

  const builtOrders: BuiltOrder[] = [];
  let customerOrderSubtotal = 0;
  for (const [groupName, lines] of linesByGroupName) {
    const branch = branchByGroupName.get(groupName);
    const built = buildBrandOrderData(
      lines,
      productMap,
      optionMap,
      taxGroup.taxes,
      taxGroup.taxGroupId,
    );
    customerOrderSubtotal += built.subtotal;
    if (!branch)
      throw new Error(`No branch for brand "${groupName}" at this location`);
    builtOrders.push({
      ...built,
      branchId: branch?.id,
    });
  }
  // right after builtOrders is fully populated, before paystackSplit

  const paystackSplit = {
    type: "flat" as const,
    currency: "NGN",
    bearer_type: "account" as const,
    subaccounts: await Promise.all(
      builtOrders.map((built) => {
        const branch = branchesAtLocation.find((b) => b.id === built.branchId);
        if (!branch?.paystackSubaccount) {
          throw new Error(
            `Branch ${built.branchId} has no Paystack subaccount configured`,
          );
        }
        return {
          subaccount: branch.paystackSubaccount,
          share: Math.round(built.totalPrice * 100), // kobo
        };
      }),
    ),
  };

  // --- Charges — stay at CustomerOrder level, never split ---
  const preFeeSubtotal = builtOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const preFeeSubtotalKobo = Math.round(preFeeSubtotal * 100);
  const processingFeeKobo = calculateProcessingFeeKobo(
    processingFeeCharge,
    preFeeSubtotalKobo,
  );
  const processingFeeAmount = processingFeeKobo / 100; // naira, for storage only
  const chargeLines = [
    {
      chargeId: processingFeeCharge.id,
      amount: processingFeeAmount,
      taxExclusiveAmount: processingFeeAmount,
    },
  ];

  const totalKobo = preFeeSubtotalKobo + processingFeeKobo;
  const customerOrderTotal = totalKobo / 100; // naira, for storage only

  const customerOrderId = randomUUID();
  const orderRows: any[] = [],
    jobRows: any[] = [],
    productRows: any[] = [],
    productTaxRows: any[] = [],
    optionRows: any[] = [],
    optionTaxRows: any[] = [];

  for (const built of builtOrders) {
    const orderId = randomUUID();
    orderRows.push({
      id: orderId,
      customerOrderId,
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
      branchId: built.branchId,
      customerId: input.customerId!,
    });
    jobRows.push({ orderId });

    for (const line of built.productLines) {
      const opId = randomUUID();
      productRows.push({
        id: opId,
        orderId,
        productId: line.productId,
        foodicsId: line.foodicsId,
        foodicsSandBoxId: line.foodicsSandBoxId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        totalPrice: line.totalPrice,
        totalCost: 0,
        discountAmount: 0,
        taxExclusiveUnitPrice: line.taxExclusiveUnitPrice,
        taxExclusiveTotalPrice: line.taxExclusiveTotalPrice,
        addedAt: new Date(),
      });
      productTaxRows.push({ orderProductId: opId, ...line.tax });

      for (const opt of line.options ?? []) {
        const optId = randomUUID();
        optionRows.push({
          id: optId,
          orderProductId: opId,
          modifierOptionId: opt.modifierOptionId,
          foodicsId: opt.foodicsId,
          foodicsSandBoxId: opt.foodicsSandBoxId,
          quantity: opt.quantity,
          unitPrice: opt.unitPrice,
          totalPrice: opt.totalPrice,
          totalCost: 0,
          taxExclusiveUnitPrice: opt.taxExclusiveUnitPrice,
          taxExclusiveTotalPrice: opt.taxExclusiveTotalPrice,
        });
        optionTaxRows.push({ orderProductOptionId: optId, ...opt.tax });
      }
    }
  }
  lap("built");

  const commitOrder = () =>
    prisma.$transaction([
      prisma.customerOrder.create({
        data: {
          id: customerOrderId,
          customerId: input.customerId,
          customerAddressId: input.customerAddressId,
          subtotalPrice: customerOrderSubtotal,
          totalPrice: customerOrderTotal,
          couponId,
          dueAt: input.dueAt ? new Date(input.dueAt) : undefined,
          paystackReference: customerOrderId,
          idempotencyKey: key,
          requestHash,
          charges: { create: chargeLines },
        },
      }),
      prisma.order.createMany({ data: orderRows }),
      prisma.orderProduct.createMany({ data: productRows }),
      prisma.orderProductTax.createMany({ data: productTaxRows }),
      prisma.orderProductOption.createMany({ data: optionRows }),
      prisma.orderProductOptionTax.createMany({ data: optionTaxRows }),
      // prisma.orderSyncJob.createMany({ data: jobRows }),
    ]);

  const [txRes, payRes] = await Promise.allSettled([
    commitOrder(),
    initializePaystackTransaction({
      customerEmail: input.customerEmail,
      amountKobo: totalKobo,
      reference: customerOrderId,
      split: paystackSplit,
    }),
  ]);
  lap("tx+paystack");

  if (txRes.status === "rejected") {
    const e = txRes.reason;
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002" && key) {
        const existing = await prisma.customerOrder.findUnique({
          where: { idempotencyKey: key },
        });
        if (existing) return replay(existing, requestHash); // lost the race
      }
      if (e.code === "P2003")
        throw Object.assign(new Error("Invalid customer or address"), {
          status: 400,
        });
    }
    throw e;
  }
  if (payRes.status === "rejected") {
    console.error("[createOrder] paystack init failed", payRes.reason);
    throw Object.assign(
      new Error("Payment initialization failed, please retry"),
      { status: 502 },
    );
  }

  const authorizationUrl = payRes.value!.authorization_url;
  const customerOrder = await prisma.customerOrder.update({
    where: { id: customerOrderId },
    data: {
      paystackAuthUrl: authorizationUrl,
      paystackReference: payRes.value!.reference,
    },
  });
  return { ...customerOrder, authorizationUrl };
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
        foodicsSandBoxId: opt.foodicsSandBoxId,
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
      foodicsSandBoxId: line.foodicsSandBoxId,
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
