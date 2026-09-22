import express from "express";
import { signIn } from "../controller/userController";
import { createOrderHandler } from "../controller/orderController";

const orderRoute = express.Router();

// userRoute.post("/sign-up", signUp);
orderRoute.post("/", createOrderHandler);

export default orderRoute;
