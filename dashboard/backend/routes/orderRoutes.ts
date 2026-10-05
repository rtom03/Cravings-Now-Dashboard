import express from "express";
import { signIn } from "../controller/userController";
import {
  createOrderHandler,
  paymentStatusHandler,
} from "../controller/orderController";

const orderRoute = express.Router();

// userRoute.post("/sign-up", signUp);
orderRoute.post("/", createOrderHandler);
orderRoute.post("/:id/payment-status", paymentStatusHandler);
// GET /payment/callback

export default orderRoute;
