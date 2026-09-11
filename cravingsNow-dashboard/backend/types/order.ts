// types/order.ts
export interface CreateOrderInput {
  branchId: string;
  customerId?: string;
  customerAddressId?: string;
  guests: number;
  kitchenNotes?: string;
  customerNotes?: string;
  couponCode?: string; // resolved to a couponId server-side, per the earlier flag
  dueAt?: string; // ISO string

  products: Array<{
    productId: string; // foodicsId of the product — this is what Foodics needs
    quantity: number;
    kitchenNotes?: string;
    options: Array<{
      modifierOptionId: string;
      quantity: number;
    }>;
  }>;

  charges: Array<{
    chargeId: string;
  }>;

  payment: {
    paymentMethodId: string;
    amount: number;
    tips?: number;
  };
}
