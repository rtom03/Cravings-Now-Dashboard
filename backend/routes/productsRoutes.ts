import express from "express";
import { authenticate, authorize } from "../middleware/authenticate";
import {
  getProductDetails,
  updateProductOption,
} from "../controller/productController";
// import { syncGrpEp } from "../controller/groupController";

const productsRoutes = express.Router();

productsRoutes.patch(
  "/modifier-options/:id",
  authenticate,
  authorize("ADMIN"),
  updateProductOption,
);
productsRoutes.get("/product-details/:id", authenticate, getProductDetails);

export default productsRoutes;
