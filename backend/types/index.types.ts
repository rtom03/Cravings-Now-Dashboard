type UserResponse = {
  name: String;
  email: String;
};

import { InputJsonValue, JsonNullClass } from "@prisma/client/runtime/client";
import { NullableJsonNullValueInput } from "../generated/prisma/internal/prismaNamespace";

type FoodicsBranchPivot = {
  price: number | null;
  is_active: boolean;
  is_in_stock: boolean;
  is_in_cashier_stock: boolean;
  cashier_quantity: string | null;
};
interface FoodicsBranch {
  id: string;
  name: string;
  reference: string;
  name_localized: string;
  type: number;
  latitude: string;
  longitude: string;
  phone: string | null;
  opening_from: string;
  opening_to: string;
  inventory_end_of_day_time: string;
  receipt_header: string;
  receipt_footer: string;
  settings: JsonNullClass | InputJsonValue;
  receives_online_orders: boolean;
  accepts_reservations: boolean;
  reservation_duration: number;
  reservation_times: NullableJsonNullValueInput | InputJsonValue | undefined;
  address: string | null;
  pivot: FoodicsBranchPivot | undefined;
}

// ─── Raw API response type (snake_case, as Foodics sends it) ──────────────────
interface FoodicsProductRaw {
  branches?: FoodicsBranch[];
  ingredients?: unknown[]; // shape unknown until we see a populated example
  id: string;
  categoryId: string;
  sku: string;
  barcode: string | null;
  name: string;
  name_localized: string | null;
  description: string | null;
  description_localized: string | null;
  image: string | null;
  is_active: boolean;
  is_stock_product: boolean;
  is_non_revenue: boolean;
  is_ready: boolean;
  pricing_method: number;
  selling_method: number;
  costing_method: number;
  preparation_time: number | null;
  price: number;
  cost: number | null;
  calories: number | null;
  walking_minutes_to_burn_calories: number | null;
  is_high_salt: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  meta: Record<string, unknown> | null;
}

interface FoodicsCategoryRaw {
  id: string;
  name: string;
  name_localized: string | null;
  reference: string;
  image: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface FoodicsGroupsProducts extends FoodicsProductRaw {
  pivot: { is_active: boolean };
  group_name: string;
}

interface FdGroup {
  id: string;
  foodics_id: string;
  name: string;
  name_localized: string;
  image: string | null;
}
type AuthPayload = {
  userId: string;
  role: "ADMIN" | "STORE" | "CUSTOMER";
  branchId?: string;
};

export {
  FoodicsBranch,
  FoodicsProductRaw,
  FoodicsCategoryRaw,
  FoodicsGroupsProducts,
  FdGroup,
  AuthPayload,
};
