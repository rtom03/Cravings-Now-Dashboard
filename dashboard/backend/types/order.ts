// types/order.ts — extend CreateOrderInput
export interface CreateOrderInput {
  customerId?: string;
  idempotencyKey: string;
  customerAddressId?: string;
  customerEmail: string;
  location: { latitude: number; longitude: number };
  couponCode?: string;
  dueAt?: string;

  products: Array<{
    productId: string;
    foodicsId?: string;
    foodicsSandBoxId?: string;
    groupName: string | null; // NEW — which brand this line belongs to, drives the split
    quantity: number;
    kitchenNotes?: string;
    options: Array<{
      modifierOptionId: string;
      quantity: number;
      foodicsId?: string;
      foodicsSandBoxId?: string;
    }>;
  }>;
}
