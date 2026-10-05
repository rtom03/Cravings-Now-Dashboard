import { Category, ProductProps } from "../types/type";

export interface CategoryWithProductCount extends Category {
  productCount: number;
}

export function getCategoriesWithProductCount(
  products: Partial<ProductProps>[],
): CategoryWithProductCount[] {
  const categoriesById = new Map<string, CategoryWithProductCount>();

  for (const product of products) {
    // Partial<ProductProps> means `category` is optional now — this guard
    // is what makes that safe rather than crashing on product.category.id
    // when a caller passes an incomplete object.
    if (!product.category?.id) continue;

    const key = product.category.id;
    const existing = categoriesById.get(key);

    if (existing) {
      existing.productCount += 1;
    } else {
      categoriesById.set(key, {
        ...product.category,
        productCount: 1,
      });
    }
  }

  return Array.from(categoriesById.values());
}
