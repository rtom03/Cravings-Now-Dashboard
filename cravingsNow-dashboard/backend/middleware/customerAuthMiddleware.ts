import jwt from "jsonwebtoken";
import { prisma } from "../utils/db.js";
import { NextFunction, Request, Response } from "express";

const customerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jwtSecret = process.env.JWT_SECRET;

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }

  try {
    const decodedToken = jwt.verify(token, jwtSecret!) as {
      userId: string;
      role: string;
    };

    const customer = await prisma.customer.findUnique({
      where: { id: decodedToken.userId },
      select: { id: true, email: true },
    });

    if (!customer) {
      return res.status(401).json({
        status: false,
        message: "Not authorized. Customer not found.",
      });
    }

    req.customer = {
      customerId: customer.id,
      email: customer.email!,
    };

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }
};

export { customerAuth };
