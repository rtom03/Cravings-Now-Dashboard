import express from "express";
import userRoute from "./userRoutes";
import branchRoutes from "./branchRoutes";
import categoryRoutes from "./categoryRoute";
import groupRoutes from "./groupRoutes";
import adminRoutes from "./admin/route";
import storeRoutes from "./store/route";

const routes = express.Router();

routes.use("/user", userRoute);
routes.use("/branches", branchRoutes);
routes.use("/categories", categoryRoutes);
// routes.use("/groups", groupRoutes);
routes.use("/admin", adminRoutes);
routes.use("/store", storeRoutes);

export default routes;
