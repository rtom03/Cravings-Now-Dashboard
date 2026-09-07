// middleware/authMiddleware.ts
import jwt from "jsonwebtoken";
import { prisma } from "../utils/db.js";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  const jwtSecret = process.env.JWT_SECRET;
  let token = req.cookies?.token;
  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }

  try {
    // Decode the token
    const decodedToken = jwt.verify(token, jwtSecret!);
    // console.log(decodedToken);
    // Prisma: find user by ID
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Not authorized. User not found." });
    }

    // Attach user info to request
    req.user = {
      userId: user.id,
      username: user.email,
    };

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }
};

export { adminAuth };
