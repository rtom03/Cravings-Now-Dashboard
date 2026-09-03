import { Request, Response } from "express";
import { prisma } from "../utils/db";
import { IDParams } from "./branchController";

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

const updateProductById = async (req: Request<IDParams>, res: Response) => {
  const { id } = req.params;
};

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
