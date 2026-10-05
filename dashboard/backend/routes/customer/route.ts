import express from "express";
import { authenticate, authorize } from "../../middleware/authenticate";
import {
  createAddress,
  customerLogin,
  deleteAddress,
  getAddresses,
  meVerified,
  updateAddress,
} from "../../controller/customerController";

const customerRoutes = express.Router();

customerRoutes.post("/auth/google", customerLogin);

customerRoutes.post(
  "/addresses",
  authenticate,
  authorize("CUSTOMER"),
  createAddress,
);
customerRoutes.get("/me", authenticate, authorize("CUSTOMER"), meVerified);
customerRoutes.get(
  "/addresses",
  authenticate,
  authorize("CUSTOMER"),
  getAddresses,
);
customerRoutes.patch(
  "/addresses/:id",
  authenticate,
  authorize("CUSTOMER"),
  updateAddress,
);
customerRoutes.delete(
  "/customer/addresses/:id",
  authenticate,
  authorize("CUSTOMER"),
  deleteAddress,
);
export default customerRoutes;
