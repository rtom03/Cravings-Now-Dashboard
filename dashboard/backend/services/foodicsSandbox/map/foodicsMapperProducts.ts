// services/foodicsProductMapper.ts

import {
  FoodicsProductCreatePayload,
  DBProductCreatePayload,
} from "../products";

function generateUniqueSku(existingSku: string): string {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${existingSku}-${suffix}`;
}
export function toSandboxCreatePayload(
  dbProducts: DBProductCreatePayload,
): FoodicsProductCreatePayload {
  return {
    name: dbProducts.name,
    image: dbProducts.image,
    is_active: dbProducts.isActive!,
    is_stock_product: dbProducts.isStockProduct!,
    pricing_method: dbProducts.pricingMethod,
    selling_method: dbProducts.sellingMethod,
    costing_method: dbProducts.costingMethod,
    price: dbProducts.price!,
    sku: generateUniqueSku(dbProducts.sku),
    category_id: "a2e27af9-d096-4682-a0c4-75fc070af84f", // ⚠️ live-account-specific reference — see comment above
  };
}
