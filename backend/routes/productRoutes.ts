import express from "express";
import { getBranch, getBranches } from "../controller/branchController";
import { syncProducts } from "../services/foodics/product.service";
import { getProducts, syncProdFd } from "../controller/productController";

const productRoutes = express.Router();

// productRoutes.get("/", getProducts);
productRoutes.get("/", syncProdFd);
// productRoutes.get("/:id", getproduct);

export default productRoutes;
