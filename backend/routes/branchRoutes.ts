import express from "express";
import { getBranch, getBranches } from "../controller/branchController";

const branchRoutes = express.Router();

branchRoutes.get("/", getBranches);
branchRoutes.get("/:id", getBranch);

export default branchRoutes;
