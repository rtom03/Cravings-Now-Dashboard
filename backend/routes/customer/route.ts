import express from "express";
import { authorize } from "../../middleware/authenticate";

const customerRoutes = express.Router();

customerRoutes.get("sign-up", authorize("CUSTOMER"));
customerRoutes.get("sign-in", authorize("CUSTOMER"));

export default customerRoutes;
