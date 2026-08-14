import express from "express";
import { syncCatEp } from "../controller/categoryController";

const categoryRoutes = express.Router();

categoryRoutes.get("/sync-cat", syncCatEp);
// categoryRoutes.get("/:id", getcategory);

export default categoryRoutes;
