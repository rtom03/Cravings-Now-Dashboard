import { syncGroupProducts } from "../services/foodics/groups.service";
import { FdGroup, FoodicsGroupsProducts } from "../types/index.types";
import { prisma } from "../utils/db";

const upsertGroup = async (group: FdGroup) => {
  return await prisma.group.upsert({
    where: { foodicsId: group.id },
    update: {
      name: group.name,
      nameLocalized: group.name_localized,
      image: group.image,
    },
    create: {
      foodicsId: group.id,
      name: group.name,
      nameLocalized: group.name_localized,
      image: group.image,
    },
  });
};
export const upsertGroupProducts = async (
  product: FoodicsGroupsProducts,
  // catId: string,
) => {
  return await prisma.groupProducts.upsert({
    where: { foodicsId: product.id },
    update: {
      name: product.name,
      nameLocalized: product.name_localized,
      sku: product.sku,
      groupName: "Burger Nation",
      image: product.image,
      description: product.description,
      descriptionLocalized: product.description_localized,
      isActive: product.is_active,
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
      pivot: product.pivot,
      // categoryId: catId,
    },
    create: {
      foodicsId: product.id,
      name: product.name,
      nameLocalized: product.name_localized,
      sku: product.sku,
      groupName: "Burger Nation",
      image: product.image,
      description: product.description,
      descriptionLocalized: product.description_localized,
      isActive: product.is_active,
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
      pivot: product.pivot,
      // categoryId: catId,
    },
  });
};

export const syncGrpEp = async () => {
  const id = "9dd356a1-1554-41e9-8157-d6202eb890ea";
  try {
    // const group = await syncGroup(id);
    const groupProducts = await syncGroupProducts(id);

    console.log("Updated");
    // return res.json({ group });
    // return res.json({ groupProducts });
    // return groupProducts;
  } catch (error) {
    console.log(error);
  }
};
