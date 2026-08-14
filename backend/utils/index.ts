import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Response } from "express";
import { AuthPayload } from "../types/index.types";

dotenv.config();

const createJWT = (
  res: Response,
  userId: String,
  role: AuthPayload["role"],
) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ userId, role }, secret, {
    expiresIn: "1d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // ✅ false on localhost, true in prod
    sameSite: isProduction ? "none" : "lax", // ✅ "lax" works on localhost
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
  });

  return token;
};

export default createJWT;
