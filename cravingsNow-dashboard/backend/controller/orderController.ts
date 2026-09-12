// controllers/order.controller.ts
import { Request, Response } from "express";
import { createOrder } from "../services/orderServices";

export async function createOrderHandler(req: Request, res: Response) {
  try {
    const order = await createOrder(req.body); // frontend owns input validation, per your stated approach
    return res.status(201).json({ id: order.id, status: order.status });
  } catch (err) {
    console.error("createOrder failed:", err);
    return res.status(400).json({
      error: err instanceof Error ? err.message : "Failed to create order",
    });
  }
}
