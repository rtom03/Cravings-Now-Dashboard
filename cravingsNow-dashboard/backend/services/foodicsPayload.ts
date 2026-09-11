// services/foodicsPayload.ts
import {
  Order,
  OrderProduct,
  OrderProductOption,
  OrderCharge,
  OrderPayment,
} from "@prisma/client";

type FullOrder = Order & {
  products: (OrderProduct & { options: OrderProductOption[] })[];
  charges: OrderCharge[];
  payments: OrderPayment[];
};

export function buildFoodicsOrderPayload(order: FullOrder) {
  return {
    type: mapOrderType(order.type),
    source: mapOrderSource(order.source),
    status: mapOrderStatus(order.status),
    guests: order.guests,
    kitchen_notes: order.kitchenNotes ?? "",
    customer_notes: order.customerNotes ?? "",
    business_date: order.businessDate.toISOString().split("T")[0],
    subtotal_price: order.subtotalPrice,
    discount_amount: order.discountAmount,
    rounding_amount: order.roundingAmount,
    total_price: order.totalPrice,
    tax_exclusive_discount_amount: order.taxExclusiveDiscountAmount,
    branch_id: order.branchId, // must be Foodics' branch ID, not your internal one — confirm this mapping exists
    creator_id: order.creatorId ?? undefined,
    customer_id: order.customerId ?? undefined,
    customer_address_id: order.customerAddressId ?? undefined,
    coupon_code: undefined, // Foodics wants the code, not couponId — needs a reverse lookup if you only stored couponId
    due_at: order.dueAt ? formatFoodicsDate(order.dueAt) : undefined,

    payments: order.payments.map((p) => ({
      payment_method_id: p.paymentMethodId,
      amount: p.amount,
      tips: (p as any).tips ?? 0, // add `tips` to OrderPayment if not already present
      meta: {},
    })),

    charges: order.charges.map((c) => ({
      charge_id: c.chargeId,
      taxes: [], // needs OrderChargeTax lookup once loaded
    })),

    products: order.products.map((p) => ({
      product_id: p.productId,
      quantity: p.quantity,
      unit_price: p.unitPrice,
      total_price: p.totalPrice,
      discount_amount: p.discountAmount,
      tax_exclusive_discount_amount: p.taxExclusiveDiscountAmount,
      tax_exclusive_unit_price: p.taxExclusiveUnitPrice,
      tax_exclusive_total_price: p.taxExclusiveTotalPrice,
      kitchen_notes: p.kitchenNotes ?? "",
      taxes: [], // needs OrderProductTax lookup once loaded
      options: p.options.map((o) => ({
        modifier_option_id: o.modifierOptionId,
        quantity: o.quantity,
        partition: o.partition ?? 1,
        unit_price: o.unitPrice,
        total_price: o.totalPrice,
        tax_exclusive_unit_price: o.taxExclusiveUnitPrice ?? o.unitPrice,
        tax_exclusive_total_price: o.taxExclusiveTotalPrice ?? o.totalPrice,
        taxes: [], // needs OrderProductOptionTax lookup once loaded
      })),
    })),
  };
}

function mapOrderType(type: string): number {
  const map: Record<string, number> = {
    DELIVERY: 2 /* example — confirm real Foodics values */,
  };
  return map[type] ?? 1;
}
function mapOrderSource(source: string): number {
  const map: Record<string, number> = {
    API: 2 /* confirm real Foodics enum values */,
  };
  return map[source] ?? 2;
}
function mapOrderStatus(status: string): number {
  const map: Record<string, number> = {
    Pending: 1 /* confirm real Foodics enum values */,
  };
  return map[status] ?? 1;
}
function formatFoodicsDate(d: Date): string {
  return d.toISOString().slice(0, 19).replace("T", " ");
}
