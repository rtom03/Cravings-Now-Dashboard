import express from "express";
import { signIn } from "../controller/userController";

const userRoute = express.Router();

// userRoute.post("/sign-up", signUp);
userRoute.post("/sign-in", signIn);

export default userRoute;
