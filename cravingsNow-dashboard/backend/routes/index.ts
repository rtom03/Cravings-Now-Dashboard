import express from "express";
import userRoute from "./userRoutes";
import branchRoutes from "./branchRoutes";
import categoryRoutes from "./categoryRoute";
import adminRoutes from "./admin/route";
import storeRoutes from "./store/route";
import productsRoutes from "./productsRoutes";

const routes = express.Router();

routes.use("/user", userRoute);
routes.use("/branches", branchRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/products", productsRoutes);
routes.use("/admin", adminRoutes);
routes.use("/store", storeRoutes);

export default routes;
