// types/foodicsCategory.ts

import foodicsClient from "../foodics/client";
import foodicsClientSB from "../foodics/foodicsClientSB";
import { toSandboxCategoryPayload } from "./map/categoryMapper";

// The exact shape Foodics accepts for POST /categories
export interface FoodicsCategoryCreatePayload {
  id: string;
  name: string;
  name_localized: string | null;
  alpha_dash: string;
  reference: string;
  image: string | null;
}

// What GET /categories/:id (or a list endpoint) from LIVE actually returns —
// a superset, with server-managed fields the create endpoint neither wants
// nor accepts.
export interface FoodicsLiveCategory extends FoodicsCategoryCreatePayload {
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// services/foodicsCategorySync.ts

/**
 * Fetches every category belonging to a live group.
 *
 * ⚠️ Assumption, same as getGroupsProductsById: this returns an array
 * directly. Confirm the real response shape against Postman — if it's
 * wrapped (e.g. { categories: [...] } or { data: [...] }), unwrap it here,
 * once, so nothing downstream has to know about the envelope.
 */
export const getCategoriesFromLive = async (): Promise<
  FoodicsLiveCategory[]
> => {
  try {
    const response = await foodicsClient.get(`/categories`);
    return response.data.data; // adjust once the real shape is confirmed
  } catch (error: any) {
    throw new Error(
      error?.message || "Failed to fetch categories from live Foodics",
    );
  }
};

/**
 * Creates a category in the SANDBOX Foodics account from a prepared payload.
 */
export const createCategoryFoodicsSB = async (
  payload: FoodicsCategoryCreatePayload,
) => {
  try {
    const response = await foodicsClientSB.post("categories", payload);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.message || "Failed to create category in sandbox Foodics",
    );
  }
};

export interface CategorySyncResult {
  liveCategoryId: string;
  categoryName: string;
  success: boolean;
  sandboxCategoryId?: string;
  error?: string;
}

/**
 * Syncs every category belonging to a live group into sandbox.
 * Sequential, with per-category error isolation — one rejected category
 * (duplicate `reference`/`alpha_dash` already in sandbox, a validation
 * rule Foodics enforces more strictly there, etc.) doesn't abort the rest
 * of the batch, same reasoning as the product sync.
 */
export const syncCategoriesLiveToSandbox = async (): Promise<
  CategorySyncResult[]
> => {
  const liveCategories = await getCategoriesFromLive();
  //   console.log(liveCategories);

  const results: CategorySyncResult[] = [];

  for (const liveCategory of liveCategories) {
    try {
      const payload = toSandboxCategoryPayload(liveCategory);
      const created = await createCategoryFoodicsSB(payload);

      results.push({
        liveCategoryId: liveCategory.id,
        categoryName: liveCategory.name,
        success: true,
        sandboxCategoryId: created?.data?.id, // adjust to match the real create-response shape
      });
    } catch (error: any) {
      results.push({
        liveCategoryId: liveCategory.id,
        categoryName: liveCategory.name,
        success: false,
        error: error?.message || "Unknown error",
      });
    }
  }

  return results;
};
