import { Request, Response } from "express";
import { prisma } from "../utils/db";
import { IDParams } from "./branchController";
import { syncTaxGroup } from "../syncFromFoodics/taxGroup";
import { Product } from "../types/group";
import { syncGrpEp } from "../syncFromFoodics/group";
// import { syncAllProductModifiers } from "../services/foodics/modifier.service";
// import { syncBranches } from "../services/foodics/branches.service";

const mapProduct = (product: any): Product => {
  return {
    id: product.id,
    sku: product.sku,
    barcode: product.barcode,
    name: product.name,
    image: product.image,
    nameLocalized: product.nameLocalized,
    description: product.description,
    price: product.price,
    isActive: product.isActive,
    isStockProduct: product?.isStockProduct,
    isNonRevenue: product?.isNonRevenue,
    isReady: product?.isReady,
    pricingMethod: product.pricingMethod,
    sellingMethod: product.sellingMethod,
    costingMethod: product.costingMethod,
    cost: product.cost,
    calories: product.calories,
    walkingMinutesToBurnCalories: product.walkingMinutesToBurnCalories,
    isHighSalt: product.isHighSalt,
    meta: product.meta,
    reactivateAt: product.reactivateAt,
    category: product?.category,
    modifiers: product.groupProductModifiers.map(
      (groupProductModifier: any) => ({
        id: groupProductModifier.modifier.id,
        name: groupProductModifier.modifier.name,
        minimumOptions: groupProductModifier.minimumOptions,
        maximumOptions: groupProductModifier.maximumOptions,
        options: groupProductModifier.modifier.options.map(
          (option: any) => option.modifierOption,
        ),
      }),
    ),
  };
};

const getGroups = async (req: Request, res: Response) => {
  try {
    const groups = await prisma.group.findMany();
    res.status(201).json(groups);
  } catch (error) {
    console.log(error);
    res.status(500).json(`An err occured while fetching data ${error}`);
  }
};

const getBranchByGroupName = async (req: Request<IDParams>, res: Response) => {
  const { id } = req.params;
  try {
    const group = await prisma.group.findUnique({ where: { id: id } });

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }
    const branches = await prisma.branch.findMany({
      where: {
        name: {
          contains: group?.name,
          mode: "insensitive",
        },
      },
    });
    res.status(201).json({ branches });
  } catch (error) {
    console.log(error);
    res.status(500).json(`An err occured while fetching data ${error}`);
  }
};

const getProductsByGroupName = async (
  req: Request<IDParams>,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const group = await prisma.group.findUnique({ where: { id: id } });

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }
    // console.log(group.name);
    const products = await prisma.groupProducts.findMany({
      where: {
        groupName: {
          contains: group?.name,
          mode: "insensitive",
        },
      },
      include: {
        category: true,
        groupProductModifiers: {
          include: {
            modifier: {
              include: {
                options: {
                  where: {
                    modifierOption: {
                      isActive: true,
                    },
                  },
                  include: {
                    modifierOption: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    // res.status(201).json({ products });
    const mappedProducts = products.map(mapProduct);

    res.status(200).json({
      products: mappedProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(`An err occured while fetching data ${error}`);
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.groupProducts.findMany({
      include: {
        category: true,
        groupProductModifiers: {
          include: {
            modifier: {
              include: {
                options: {
                  where: {
                    modifierOption: {
                      isActive: true,
                    },
                  },
                  include: {
                    modifierOption: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const mappedProducts = products.map(mapProduct);

    res.status(200).json({
      products: mappedProducts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "An error occurred while fetching products",
    });
  }
};

// syncAllProductModifiers();
// syncBranches();
// syncTaxGroup();
// syncTax();
// syncGrpEp();

export { getGroups, getBranchByGroupName, getProductsByGroupName, getProducts };
