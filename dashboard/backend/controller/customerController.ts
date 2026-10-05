import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env";
import createJWT from "../utils";
import { prisma } from "../utils/db";
import { Request, Response } from "express";
import { IDParams } from "./branchController";

export const client = new OAuth2Client(env.google.client_id);

const customerLogin = async (req: Request, res: Response) => {
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
};

const meVerified = async (req: Request, res: Response) => {
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
};

const createAddress = async (req: Request, res: Response) => {
  const { name, description, type, latitude, longitude, deliveryZoneId } =
    req.body;

  if (latitude == null || longitude == null) {
    return res
      .status(400)
      .json({ message: "latitude and longitude are required" });
  }

  const address = await prisma.customerAddress.create({
    data: {
      name,
      description,
      type: type ?? "OTHER",
      latitude: String(latitude),
      longitude: String(longitude),
      customerId: req.user!.userId,
      deliveryZoneId: deliveryZoneId ?? null,
    },
  });

  res.status(201).json({ address });
};

const getAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await prisma.customerAddress.findMany({
      where: { customerId: req.user!.userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    res.json({ addresses });
  } catch (error) {
    console.log(error);
  }
};

const updateAddress = async (req: Request<IDParams>, res: Response) => {
  const { id } = req.params;
  const { name, description, type, latitude, longitude } = req.body;

  const existing = await prisma.customerAddress.findFirst({
    where: { id, customerId: req.user!.userId, deletedAt: null },
  });

  if (!existing) {
    return res.status(404).json({ message: "Address not found" });
  }

  const address = await prisma.customerAddress.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(type !== undefined && { type }),
      ...(latitude !== undefined && { latitude: String(latitude) }),
      ...(longitude !== undefined && { longitude: String(longitude) }),
    },
  });

  res.json({ address });
};

const deleteAddress = async (req: Request<IDParams>, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.customerAddress.findFirst({
    where: { id, customerId: req.user!.userId, deletedAt: null },
  });

  if (!existing) {
    return res.status(404).json({ message: "Address not found" });
  }

  await prisma.customerAddress.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  res.status(204).send();
};
export {
  customerLogin,
  meVerified,
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
};
