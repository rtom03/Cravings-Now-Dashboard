import { Request, Response } from "express";
import { prisma } from "../utils/db";
import { FoodicsProductRaw } from "../types/index.types";
import {
  syncProducts,
  // syncProductsWCatFilter,
} from "../services/foodics/product.service";

export const syncProdFd = async (req: Request, res: Response) => {
  try {
    console.log("Upsertting");
    // const products = await syncProductsWCatFilter();

    const products = await syncProducts();
    console.log("Done");
    return res.json({ products });
  } catch (error) {
    console.log(error);
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
      include: { branches: true },
    });

    return res.json({ products });
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    return res.status(500).json({
      message: error?.message || "Failed to fetch products",
    });
  }
};

const upsertProducts = async (product: FoodicsProductRaw, id?: string) => {
  return prisma.product.upsert({
    where: {
      foodicsId: product.id,
    },
    update: {
      sku: product.sku,
      barcode: product.barcode,
      name: product.name,
      nameLocalized: product.name_localized,
      description: product.description,
      descriptionLocalized: product.description_localized,
      image: product.image,
      isActive: product.is_active,
      isStockProduct: product.is_stock_product,
      isNonRevenue: product.is_non_revenue,
      isReady: product.is_ready,
      pricingMethod: product.pricing_method,
      sellingMethod: product.selling_method,
      costingMethod: product.costing_method,
      preparationTime: product.preparation_time,
      price: product.price,
      cost: product.cost,
      calories: product.calories,
      walkingMinutesToBurnCalories: product.walking_minutes_to_burn_calories,
      isHighSalt: product.is_high_salt,
      categoryId: id,
    },
    create: {
      foodicsId: product.id,
      sku: product.sku,
      barcode: product.barcode,
      name: product.name,
      nameLocalized: product.name_localized,
      description: product.description,
      descriptionLocalized: product.description_localized,
      image: product.image,
      isActive: product.is_active,
      isStockProduct: product.is_stock_product,
      isNonRevenue: product.is_non_revenue,
      isReady: product.is_ready,
      pricingMethod: product.pricing_method,
      sellingMethod: product.selling_method,
      costingMethod: product.costing_method,
      preparationTime: product.preparation_time,
      price: product.price,
      cost: product.cost,
      calories: product.calories,
      walkingMinutesToBurnCalories: product.walking_minutes_to_burn_calories,
      isHighSalt: product.is_high_salt,
    },
  });
};

export const upsertProductBranches = async (
  productId: string,
  branches: FoodicsProductRaw["branches"],
) => {
  if (!branches?.length) return;

  for (const foodicsBranch of branches) {
    const branch = await prisma.branch.findUnique({
      where: {
        foodicsId: foodicsBranch.id,
      },
    });
    // console.log(foodicsBranch);

    if (!branch) {
      console.warn(
        `Branch ${foodicsBranch.id} not found. Skipping ProductBranch sync.`,
      );
      continue;
    }

    await prisma.productBranch.upsert({
      where: {
        productId_branchId: {
          productId,
          branchId: branch.id,
        },
      },

      update: {
        price: foodicsBranch.pivot?.price,
        isActive: foodicsBranch.pivot?.is_active,
        is_in_stock: foodicsBranch.pivot?.is_in_stock,
      },

      create: {
        productId,
        branchId: branch.id,

        price: foodicsBranch.pivot?.price,
        isActive: foodicsBranch.pivot?.is_active,
        is_in_stock: foodicsBranch.pivot?.is_in_stock,
      },
    });
  }
};

const getProduct = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

// const category = await prisma.category.findUnique({
//   where: {
//     foodicsId: "95ed4a7c-e01e-4ab5-85a9-148263feecc5",
//   },
// });

// console.log(category);

export { getProducts, upsertProducts };
