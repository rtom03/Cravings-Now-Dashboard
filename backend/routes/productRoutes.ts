import express from "express";

import { syncProdFd } from "../controller/productController";

const productRoutes = express.Router();

// productRoutes.get("/", getProducts);
productRoutes.get("/", syncProdFd);
// productRoutes.get("/:id", getproduct);

export default productRoutes;
