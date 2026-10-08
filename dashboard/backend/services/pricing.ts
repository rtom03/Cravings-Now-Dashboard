import { parsePrice } from "../lib/price";
import { CreateOrderInput } from "../types/order";
import { prisma } from "../utils/db";
import { calculateProcessingFeeKobo } from "./chargeCalc";
import { findNearestBranch } from "./locationServices";
import { calculateLineTax } from "./taxCalculator";
import { getActiveTaxGroup } from "./taxService";

const toKobo = (naira: number) => Math.round(naira * 100);

// TODO: real delivery logic (distance/zone). Flat env value for now.
const DELIVERY_FEE_KOBO = Number(process.env.DELIVERY_FEE_KOBO ?? 0);

// ASSUMED Coupon fields (type: "PERCENT" | "FIXED", value). Adjust to your model,
// and add active/expiry/usage-limit checks here.
function computeDiscountKobo(coupon: any, baseKobo: number): number {
  if (!coupon) return 0;
  const raw =
    coupon.type === "PERCENT"
      ? Math.round((baseKobo * coupon.value) / 100)
      : toKobo(coupon.value);
  return Math.min(Math.max(raw, 0), baseKobo);
}

// split an integer amount across weights with no kobo lost
function allocate(totalKobo: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (!sum || !totalKobo) return weights.map(() => 0);
  const out = weights.map((w) => Math.floor((totalKobo * w) / sum));
  let rem = totalKobo - out.reduce((a, b) => a + b, 0);
  for (let i = 0; rem > 0; i = (i + 1) % out.length, rem--) out[i]++;
  return out;
}

export async function priceCart(input: CreateOrderInput) {
  const productIds = input.products.map((p) => p.productId);
  const optionIds = input.products.flatMap((p) =>
    (p.options ?? []).map((o) => o.modifierOptionId),
  );

  const [
    coupon,
    customer,
    address,
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
    prisma.groupProducts.findMany({ where: { id: { in: productIds } } }),
    prisma.modifierOption.findMany({ where: { id: { in: optionIds } } }),
    findNearestBranch(input.location.latitude, input.location.longitude),
    prisma.charge.findFirst({
      where: { isActive: true, type: "ProcessingFee" },
    }),
  ]);
  if (input.couponCode && !coupon) throw new Error("Invalid coupon code");
  if (input.customerId && !customer)
    throw new Error(`Unknown customer: ${input.customerId}`);
  if (input.customerAddressId && !address)
    throw new Error(`Unknown customer address: ${input.customerAddressId}`);
  if (!processingFeeCharge)
    throw new Error("No active payment processing fee charge configured");

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));
  const optionMap = new Map(dbOptions.map((o) => [o.id, o]));

  // group lines by the product's own groupName (brand)
  const linesByGroupName = new Map<string, typeof input.products>();
  // console.log(input);

  for (const line of input.products) {
    const product = productMap.get(line.productId);
    if (!product) throw new Error(`Unknown product: ${line.productId}`);
    const existing = linesByGroupName.get(product.groupName!) ?? [];
    existing.push(line);
    linesByGroupName.set(product.groupName!, existing);
  }

  const resolvedBranch = await prisma.branch.findUnique({
    where: { id: nearest.branchId },
  });

  if (!resolvedBranch?.addressTag) {
    throw new Error("Nearest branch has no addressTag");
  }
  // console.log(resolvedBranch);
  const branchesAtLocation = await prisma.branch.findMany({
    where: {
      addressTag: resolvedBranch.addressTag,
      groupName: { in: [...linesByGroupName.keys()] },
    },
  });
  const branchByGroupName = new Map(
    branchesAtLocation.map((b) => [b.groupName, b]),
  );

  console.log(branchesAtLocation);

  // --- per-brand build ---
  const builtOrders: (ReturnType<typeof buildBrandOrderData> & {
    groupName: string;
    branchId: string;
    paystackSubaccount: string;
  })[] = [];

  for (const [groupName, lines] of linesByGroupName) {
    const branch = branchByGroupName.get(groupName);
    if (!branch)
      throw new Error(`No branch for brand "${groupName}" at this location`);
    if (!branch.paystackSubaccount)
      throw new Error(
        `Branch ${branch.id} has no Paystack subaccount configured`,
      );

    const built = buildBrandOrderData(lines, productMap, optionMap);
    builtOrders.push({
      ...built,
      groupName,
      branchId: branch.id,
      paystackSubaccount: branch.paystackSubaccount,
    });
  }

  // --- all money below is integer kobo ---
  const brandKobo = builtOrders.map((o) => ({
    subtotal: o.subtotalKobo, // tax-exclusive
  }));

  const itemsSubtotalKobo = brandKobo.reduce((s, b) => s + b.subtotal, 0);

  const discountKobo = computeDiscountKobo(coupon, itemsSubtotalKobo);
  const discountByBrand = allocate(
    discountKobo,
    brandKobo.map((b) => b.subtotal),
  );
  const brandPayableKobo = brandKobo.map(
    (b, i) => b.subtotal - discountByBrand[i],
  );

  const deliveryFeeKobo = DELIVERY_FEE_KOBO / 100;
  const preFeeKobo = itemsSubtotalKobo - discountKobo + deliveryFeeKobo;
  const paystackServiceKobo = calculateProcessingFeeKobo(
    processingFeeCharge,
    preFeeKobo,
  );
  const totalKobo = preFeeKobo + paystackServiceKobo;
  console.log(totalKobo / 100);

  // --- public quote (what the client may see) ---
  const quote = {
    currency: "NGN" as const,
    items: builtOrders.flatMap((o) =>
      o.productLines.map((l) => ({
        brand: o.groupName,
        productId: l.productId,
        name: (productMap.get(l.productId) as any)?.name ?? "Item", // ASSUMED field
        quantity: l.quantity,
        unitKobo: l.unitKobo,
        lineKobo: l.lineKobo,
        foodicsSandboxId: l.foodicsSandBoxId,
        foodicsId: l.foodicsId,

        options: l.options.map((op) => ({
          name: (optionMap.get(op.modifierOptionId) as any)?.name ?? "Option", // ASSUMED field
          quantity: op.quantity,
          unitKobo: op.unitKobo,
          lineKobo: op.lineKobo,
        })),
      })),
    ),
    subtotalKobo: itemsSubtotalKobo,
    discountKobo: discountKobo,
    couponCode: coupon?.code ?? null,
    deliveryFeeKobo: deliveryFeeKobo,
    paystackServiceKobo: paystackServiceKobo,
    totalKobo: totalKobo,
  };

  // --- server-only data used by createOrder ---
  const internal = {
    couponId: coupon?.id as string | undefined,
    builtOrders: builtOrders.map((o, i) => ({
      ...o,
      discountKobo: discountByBrand[i],
      payableKobo: brandPayableKobo[i],
    })),
    chargeLines: [
      {
        chargeId: processingFeeCharge.id,
        amount: paystackServiceKobo / 100,
        taxExclusiveAmount: paystackServiceKobo / 100,
      },
    ],
    paystackSplit: {
      type: "flat" as const,
      currency: "NGN",
      bearer_type: "account" as const,
      // brand shares only; delivery + service fee stay with the main account
      subaccounts: builtOrders.map((o, i) => ({
        subaccount: o.paystackSubaccount,
        share: brandPayableKobo[i],
      })),
    },
    customerOrder: {
      subtotalPrice: itemsSubtotalKobo / 100,
      totalPrice: totalKobo / 100,
    },
  };

  return { quote, internal };
}

// buildBrandOrderData: unchanged from your file

function buildBrandOrderData(
  lines: CreateOrderInput["products"],
  productMap: Map<string, any>,
  optionMap: Map<string, any>,
) {
  let subtotalKobo = 0;

  const productLines = lines.map((line) => {
    const product = productMap.get(line.productId)!;
    const unitKobo = toKobo(parsePrice(product.price));
    const lineKobo = unitKobo * line.quantity;
    subtotalKobo += lineKobo;

    const options = (line.options ?? []).map((opt) => {
      const mo = optionMap.get(opt.modifierOptionId);
      if (!mo)
        throw new Error(`Unknown modifier option: ${opt.modifierOptionId}`);
      const optUnitKobo = toKobo(parsePrice(mo.price));
      const optLineKobo = optUnitKobo * opt.quantity;
      subtotalKobo += optLineKobo;

      return {
        modifierOptionId: opt.modifierOptionId,
        foodicsId: opt.foodicsId,
        foodicsSandBoxId: opt.foodicsSandBoxId,
        quantity: opt.quantity,
        unitKobo: optUnitKobo,
        lineKobo: optLineKobo,
      };
    });

    return {
      productId: line.productId,
      foodicsId: line.foodicsId,
      foodicsSandBoxId: line.foodicsSandBoxId,
      quantity: line.quantity,
      unitKobo,
      lineKobo,
      options,
    };
  });

  return { subtotalKobo, productLines };
}
