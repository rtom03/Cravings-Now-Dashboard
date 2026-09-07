import express from "express";
import { getBranch, getBranches } from "../controller/branchController";
import { authenticate, authorize } from "../middleware/authenticate";

const branchRoutes = express.Router();

branchRoutes.get("/", getBranches);
branchRoutes.get("/:id", authenticate, getBranch);

export default branchRoutes;
