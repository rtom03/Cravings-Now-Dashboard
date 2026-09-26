import express, { Request, Response } from "express";
import { signIn } from "../controller/userController";
import { prisma } from "../utils/db";
import { env } from "../config/env";
import { OAuth2Client } from "google-auth-library";
import createJWT from "../utils";
import { authenticate, authorize } from "../middleware/authenticate";

export const client = new OAuth2Client(env.google.client_id);
const userRoute = express.Router();

// userRoute.post("/sign-up", signUp);
userRoute.post("/sign-in", signIn);
userRoute.post("/auth/google", async (req, res) => {
  const { idToken } = req.body;

  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.google.client_id,
  });
  const payload = ticket.getPayload();

  let customer = await prisma.customer.findUnique({
    where: { googleId: payload?.sub },
  });

  if (!customer) {
    customer = await prisma.customer.findFirst({
      where: { email: payload?.email },
    });

    customer = customer
      ? await prisma.customer.update({
          where: { id: customer.id },
          data: { googleId: payload?.sub },
        })
      : await prisma.customer.create({
          data: {
            googleId: payload?.sub,
            email: payload?.email,
            name: payload?.name,
            isLoyaltyEnabled: false,
            isBlacklisted: false,
            isHouseAccountEnabled: true,
          },
        });
  }

  const token = createJWT(res, customer.id, "CUSTOMER"); // ← confirm this role value matches your AuthPayload["role"] union
  res.json({
    token,
    user: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
    },
  });
});

userRoute.get(
  "/me",
  authenticate,
  authorize("CUSTOMER"),
  async (req: Request, res: Response) => {
    const customer = await prisma.customer.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ user: customer });
  },
);
export default userRoute;
