import {
  FoodicsModifier,
  FoodicsModifierOption,
  ProductModifierModifierOptionsProps,
} from "../types/index.types";
import { prisma } from "../utils/db";
import { recordModifierProduct } from "../utils/util";

export async function syncProductModifiers(
  data: ProductModifierModifierOptionsProps,
  id: string,
) {
  for (const productData of data.modifiers) {
    let modifier = await syncModifier(productData);

    for (const option of productData.options) {
      const optionData = await syncOptions(option);
      await syncModifierOptionModifier(modifier.id, optionData.id);
    }
    const dbModifer = await prisma.modifier.findUnique({
      where: { id: modifier.id },
    });
    const dbgroupProduct = await prisma.groupProducts.findUnique({
      where: { foodicsId: id },
    });
    await syncGroupProductModifier(
      dbgroupProduct?.id!,
      dbModifer?.id!,
      productData,
    );
  }
  await recordModifierProduct(id);
}

const syncModifier = async (data: FoodicsModifier) => {
  console.log("SYNCING MODIFIERS");
  return await prisma.modifier.upsert({
    where: {
      foodicsId: data.id,
    },
    update: {
      name: data.name,
      nameLocalized: data.name_localized,
      reference: data.reference,
      isReady: data.is_ready,
    },
    create: {
      foodicsId: data.id,
      name: data.name,
      nameLocalized: data.name_localized,
      reference: data.reference,
      isReady: data.is_ready,
    },
  });
};

const syncOptions = async (option: FoodicsModifierOption) => {
  console.log("SYNCING OPTIONS");
  const optionData = await prisma.modifierOption.upsert({
    where: {
      foodicsId: option.id,
    },
    update: {
      name: option.name,
      nameLocalized: option.name_localized,
      sku: option.sku!,
      isActive: option.is_active,
      price: option.price!,
      costingMethod: option.costing_method,
    },

    create: {
      foodicsId: option.id,
      name: option.name,
      nameLocalized: option.name_localized,
      sku: option.sku!,
      isActive: option.is_active,
      price: option.price!,
      costingMethod: option.costing_method,
    },
  });

  for (const branch of option.branches) {
    const dbBranch = await prisma.branch.findUnique({
      where: { foodicsId: branch.id },
    });

    await prisma.modifierOptionBranch.upsert({
      where: {
        modifierOptionId_branchId: {
          modifierOptionId: optionData.id,
          branchId: dbBranch?.id!,
        },
      },
      update: {
        price: branch.pivot.price,
        isActive: branch.pivot.is_active,
        isInStock: branch.pivot.is_in_stock,
      },
      create: {
        modifierOptionId: optionData.id,
        branchId: dbBranch?.id!,
        price: branch.pivot.price,
        isActive: branch.pivot.is_active,
        isInStock: branch.pivot.is_in_stock,
      },
    });
  }
  return optionData;
};

const syncModifierOptionModifier = async (
  modifierId: string,
  optionId: string,
) => {
  console.log("Syncing MODIFIER OPTIONSMODIFIER");

  return await prisma.modifierOptionModifier.upsert({
    where: {
      modifierId_modifierOptionId: {
        modifierId: modifierId,
        modifierOptionId: optionId,
      },
    },
    update: {},
    create: {
      modifierId: modifierId,
      modifierOptionId: optionId,
    },
  });
};

const syncGroupProductModifier = async (
  productId: string,
  modifierId: string,
  data: FoodicsModifier,
) => {
  console.log(`Syncing product modifier ${productId}`);

  return await prisma.groupProductModifier.upsert({
    where: {
      groupProductId_modifierId: {
        groupProductId: productId,
        modifierId: modifierId,
      },
    },
    update: {
      minimumOptions: data.pivot.minimum_options,
      maximumOptions: data.pivot.maximum_options,
      freeOptions: data.pivot.free_options,
      uniqueOptions: data.pivot.unique_options,
      isSplittableInHalf: data.pivot.is_splittable_in_half,
      defaultOptionsIds: data.pivot.default_options_ids!,
      excludedOptionsIds: data.pivot.excluded_options_ids!,
      index: data.pivot.index,
    },
    create: {
      groupProductId: productId,
      modifierId: modifierId,
      minimumOptions: data.pivot.minimum_options,
      maximumOptions: data.pivot.maximum_options,
      freeOptions: data.pivot.free_options,
      uniqueOptions: data.pivot.unique_options,
      isSplittableInHalf: data.pivot.is_splittable_in_half,
      defaultOptionsIds: data.pivot.default_options_ids!,
      excludedOptionsIds: data.pivot.excluded_options_ids!,
      index: data.pivot.index,
    },
  });
};
