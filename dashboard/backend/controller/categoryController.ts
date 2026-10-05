import { Request, Response } from "express";
import { FoodicsCategoryRaw } from "../types/index.types";
import { prisma } from "../utils/db";
import { syncCategories } from "../services/foodics/categories.service";
import {
  BN_CATEGORIES,
  KRISPY_KREME_CATEGORIES,
  SCOOPD_CATEGORIES,
} from "../utils/util";

const syncCatEp = async (req: Request, res: Response) => {
  try {
    const categories = await syncCategories();
    return res.json({ categories });
  } catch (error) {
    console.log(error);
  }
};

const upsertCategory = async (category: FoodicsCategoryRaw) => {
  return await prisma.category.upsert({
    where: { foodicsId: category.id },
    update: {
      name: category.name,
      nameLocalized: category.name_localized,
      reference: category.reference,
      image: category.image,
    },
    create: {
      foodicsId: category.id,
      name: category.name,
      nameLocalized: category.name_localized,
      reference: category.reference,
      image: category.image,
    },
  });
};

export const BRAND_CATEGORY_MAPPING: any = {
  "Krispy Kreme": KRISPY_KREME_CATEGORIES,

  Scoopd: SCOOPD_CATEGORIES,

  "Burger Nation": BN_CATEGORIES,
};

const syncBranchCat = async () => {
  const branches = await prisma.branch.findMany();
  // console.log(branches.length);
  for (const branch of branches) {
    console.log(branch);
    const brandKey = Object.keys(BRAND_CATEGORY_MAPPING).find((key) =>
      branch.name.startsWith(key),
    );
    // console.log(brandKey, branch.name);

    if (!brandKey) {
      continue;
    }
    const categoryNames = BRAND_CATEGORY_MAPPING[brandKey];
    // console.log(categoryNames);
    const categories = await prisma.category.findMany({
      where: {
        name: {
          in: categoryNames,
        },
      },
    });

    for (const category of categories) {
      console.log(`inserting ${category.name} and ${branch.name}`);
      await prisma.branchCategory.upsert({
        where: {
          branchId_categoryId: {
            branchId: branch.id,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          branchId: branch.id,
          categoryId: category.id,
        },
      });
    }
  }
};

// syncBranchCat();
export { upsertCategory, syncCatEp };
