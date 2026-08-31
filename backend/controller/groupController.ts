import { Request, Response } from "express";
import { prisma } from "../utils/db";
import { IDParams } from "./branchController";

const getGroups = async (req: Request, res: Response) => {
  try {
    const groups = await prisma.group.findMany();
    res.status(201).json(groups);
  } catch (error) {
    console.log(error);
    res.status(500).json(`An err occured while fetching data ${error}`);
  }
};

const getBranchByGroupId = async (req: Request<IDParams>, res: Response) => {
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

const getProductByGroupId = async (req: Request<IDParams>, res: Response) => {
  const { id } = req.params;
  try {
    const group = await prisma.group.findUnique({ where: { id: id } });

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }
    console.log(group.name);
    const products = await prisma.groupProducts.findMany({
      where: {
        group_name: {
          contains: group?.name,
          mode: "insensitive",
        },
      },
      include: { category: true },
    });
    res.status(201).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json(`An err occured while fetching data ${error}`);
  }
};

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
export {
  getGroups,
  getBranchByGroupId,
  getProductByGroupId,
  getProductDetails,
};
