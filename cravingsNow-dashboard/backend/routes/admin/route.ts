import express from "express";
import { authenticate, authorize } from "../../middleware/authenticate";
import { getBranch, getBranches } from "../../controller/branchController";
import {
  getBranchByGroupName,
  getGroups,
  getProductsByGroupName,
} from "../../controller/groupController";
import {
  createAdmin,
  loginAdmin,
} from "../../controller/admin/admin.authController";

const adminRoutes = express.Router();

adminRoutes.post("/sign-up", createAdmin);
adminRoutes.post("/sign-in", loginAdmin);

/// branch
adminRoutes.get("/branches", authenticate, authorize("ADMIN"), getBranches);
adminRoutes.get("/branches/:id", authenticate, authorize("ADMIN"), getBranch);
adminRoutes.get("/groups", getGroups);
adminRoutes.get("/groups/products/:id", getProductsByGroupName);

adminRoutes.get(
  "/groups/branches/:id",
  authenticate,
  authorize("ADMIN"),
  getBranchByGroupName,
);

export default adminRoutes;
