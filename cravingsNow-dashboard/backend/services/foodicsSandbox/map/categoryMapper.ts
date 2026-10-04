import { FoodicsCategoryCreatePayload, FoodicsLiveCategory } from "../category";

/**
 * Converts a live Foodics category into a valid sandbox CREATE payload.
 *
 * Explicit field-by-field pick, same reasoning as the product mapper: an
 * allowlist can't accidentally leak a future read-only field Foodics adds
 * to their response, the way an omit-based approach could.
 *
 * Unlike products, nothing here is nulled out — `reference` and
 * `alpha_dash` are intrinsic to this category (same category of field as a
 * product's `sku`), not pointers to another live-only record, so they're
 * safe to carry across as-is.
 */
export function toSandboxCategoryPayload(
  liveCategory: FoodicsLiveCategory,
): FoodicsCategoryCreatePayload {
  return {
    id: liveCategory.id,
    name: liveCategory.name,
    name_localized: liveCategory.name_localized,
    alpha_dash: liveCategory.alpha_dash,
    reference: liveCategory.reference,
    image: liveCategory.image,
  };
}
