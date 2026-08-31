import express from "express";
import { authenticate, authorize } from "../../middleware/authenticate";
import { getBranch, getBranches } from "../../controller/branchController";
import {
  getBranchByGroupId,
  getGroups,
  getModifiersByProductId,
  getProductByGroupId,
} from "../../controller/groupController";
import {
  createAdmin,
  loginAdmin,
} from "../../controller/admin/admin.authController";

const adminRoutes = express.Router();

adminRoutes.post("/sign-up", authenticate, authorize("ADMIN"), createAdmin);
adminRoutes.post("/sign-in", loginAdmin);

/// branch
adminRoutes.get("/branches", authenticate, authorize("ADMIN"), getBranches);
adminRoutes.get("/branches/:id", authenticate, authorize("ADMIN"), getBranch);
adminRoutes.get("/groups", authenticate, authorize("ADMIN"), getGroups);
adminRoutes.get(
  "/groups/products/:id",
  authenticate,
  authorize("ADMIN"),
  getProductByGroupId,
);

adminRoutes.get(
  "/groups/branches/:id",
  authenticate,
  authorize("ADMIN"),
  getBranchByGroupId,
);

adminRoutes.get("/groups/options/:id", authenticate, getModifiersByProductId);

export default adminRoutes;
