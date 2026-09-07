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
const upsertGroupProducts = async (
  product: FoodicsGroupsProducts,
  catId: string,
) => {
  return await prisma.groupProducts.upsert({
    where: { foodicsId: product.id },
    update: {
      name: product.name,
      nameLocalized: product.name_localized,
      sku: product.sku,
      // group_name: "Scoop'd Ordable Menu",
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
      categoryId: catId,
    },
    create: {
      foodicsId: product.id,
      name: product.name,
      nameLocalized: product.name_localized,
      sku: product.sku,
      // group_name: "Scoop'd Ordable Menu",
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
      categoryId: catId,
    },
  });
};

// const syncGrpEp = async (req: Request, res: Response) => {
//   const id = "9c1e4e06-5000-4603-ab30-b0ca5f146b51";
//   try {
//     // const group = await syncGroup(id);
//     const groupProducts = await syncGroupProducts(id);
//     // return res.json({ group });
//     return res.json({ groupProducts });
//   } catch (error) {
//     console.log(error);
//   }
// };
