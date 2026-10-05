// controllers/order.controller.ts
import { Request, Response } from "express";
import { createOrder } from "../services/orderServices";
import { prisma } from "../utils/db";
import { paystack } from "../services/paystack/paystack";
import { markPaid } from "./paystackWebhookHandler";
import { IDParams } from "./branchController";

export async function createOrderHandler(req: Request, res: Response) {
  try {
    const idempotencyKey = req.header("Idempotency-Key");
    if (!idempotencyKey)
      return res.status(400).json({ error: "Idempotency-Key header required" });

    const order = await createOrder({ ...req.body, idempotencyKey }); // frontend owns input validation, per your stated approach
    return res.status(201).json(order);
  } catch (err) {
    console.error("createOrder failed:", err);
    return res.status(400).json({
      error: err instanceof Error ? err.message : "Failed to create order",
    });
  }
}

// GET /api/orders/:id/payment-status
export async function paymentStatusHandler(
  req: Request<IDParams>,
  res: Response,
) {
  const order = await prisma.customerOrder.findUnique({
    where: { id: req.params.id },
  });
  if (!order /* || order.customerId !== req.user.id */)
    return res.sendStatus(404);

  if (order.paymentStatus === "Pending") {
    const { data } = await paystack.get(
      `/transaction/verify/${encodeURIComponent(order.id)}`,
    );
    if (data.data.status === "success")
      await markPaid(
        order.id,
        data.data.amount,
        data.data.currency,
        data.data.channel,
      );
  }
  const fresh = await prisma.customerOrder.findUnique({
    where: { id: order.id },
    select: { paymentStatus: true },
  });
  res.json(fresh);
}
