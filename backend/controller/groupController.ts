import { Request, Response } from "express";
import { prisma } from "../utils/db";
import { IDParams } from "./branchController";
// import { syncAllProductModifiers } from "../services/foodics/modifier.service";
// import { syncBranches } from "../services/foodics/branches.service";

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

// syncAllProductModifiers();
// syncBranches();
export { getGroups, getBranchByGroupName, getProductsByGroupName };
