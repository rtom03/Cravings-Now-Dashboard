import { Request, Response } from "express";
import { prisma } from "../utils/db";
import { IDParams } from "./branchController";
import { Prisma } from "../generated/prisma/client";

const getProductDetails = async (req: Request<IDParams>, res: Response) => {
  const { id } = req.params;
  try {
    const productOption = await prisma.groupProducts.findUnique({
      where: { id: id },
      include: {
        groupProductModifiers: {
          include: {
            modifier: {
              include: {
                options: {
                  include: { modifierOption: { include: { branches: true } } },
                },
              },
            },
          },
        },
      },
    });
    res.status(201).json(productOption);
  } catch (error) {
    console.log(error);
    res.status(500).json(`An err occured while fetching data ${error}`);
  }
};

// Only these keys are ever written to the DB, regardless of what
// else shows up in req.body. No shape/type checking here — frontend
// owns that now.
const UPDATABLE_FIELDS = [
  "description",
  "price",
  "cost",
  "sku",
  "calories",
  "image",
  "isActive",
  "isReady",
  "isHighSalt",
  "isNonRevenue",
  "isStockProduct",
  "preparationTime",
  "costingMethod",
  "pricingMethod",
  "sellingMethod",
  "walkingMinutesToBurnCalories",
  "reactivateAt",
] as const;

function pickUpdatableFields(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const key of UPDATABLE_FIELDS) {
    if (key in body) data[key] = body[key];
  }
  return data;
}

export async function updateProduct(req: Request<IDParams>, res: Response) {
  const { id } = req.params;
  const data = pickUpdatableFields(req.body);

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: "No fields provided to update" });
  }

  try {
    const updated = await prisma.groupProducts.update({
      where: { id },
      data,
      include: { category: true },
    });
    return res.json(updated);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.error("updateProduct failed:", err);
    return res.status(500).json({ error: "Failed to update product" });
  }
}

const deleteProductById = async (req: Request<IDParams>, res: Response) => {
  const { id } = req.params;
};

/// update option image
const updateProductOption = async (req: Request<IDParams>, res: Response) => {
  const { id } = req.params;

  try {
    const option = await prisma.modifierOption.findUnique({
      where: { id },
    });

    if (!option) {
      return res.status(404).json({
        message: "Modifier option not found",
      });
    }

    const {
      sku,
      name,
      image,
      nameLocalized,
      isActive,
      isInStock,
      costingMethod,
      price,
      cost,
      calories,
      index: optionIndex,
    } = req.body;

    const updateData = {
      ...(sku !== undefined && { sku }),
      ...(name !== undefined && { name }),
      ...(image !== undefined && { image }),
      ...(nameLocalized !== undefined && { nameLocalized }),
      ...(isActive !== undefined && { isActive }),
      ...(isInStock !== undefined && { isInStock }),
      ...(costingMethod !== undefined && { costingMethod }),
      ...(price !== undefined && { price }),
      ...(cost !== undefined && { cost }),
      ...(calories !== undefined && { calories }),
      ...(optionIndex !== undefined && { index: optionIndex }),
    };

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No fields provided for update",
      });
    }

    const updatedOption = await prisma.modifierOption.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(updatedOption);
  } catch (error: any) {
    console.error("Update modifier option error:", error);

    if (error?.code === "P2002") {
      return res.status(409).json({
        message: "SKU already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to update modifier option",
    });
  }
};

const updateProductModifierOption = async (req: Request, res: Response) => {};

export { getProductDetails, updateProductOption };
