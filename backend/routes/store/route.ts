import express from "express";
import { authenticate, authorize } from "../../middleware/authenticate";
import {
  createSUser,
  loginSUser,
} from "../../controller/store/store.authController";

const storeRoutes = express.Router();

storeRoutes.post("/sign-up", authenticate, authorize("ADMIN"), createSUser);
storeRoutes.post("/sign-in", loginSUser);

export default storeRoutes;
