// controller/paystackWebhook.ts
import crypto from "crypto";
import { Request, Response } from "express";
import { prisma } from "../utils/db";

const PAYSTACK_TEST_SECRET_KEY = process.env.PAYSTACK_TEST_SECRET_KEY;

export async function paystackWebhookHandler(req: Request, res: Response) {
  const sig = Buffer.from(req.header("x-paystack-signature") ?? "");
  const expected = Buffer.from(
    crypto
      .createHmac("sha512", PAYSTACK_TEST_SECRET_KEY!)
      .update(req.body)
      .digest("hex"),
  );
  if (sig.length !== expected.length || !crypto.timingSafeEqual(sig, expected))
    return res.sendStatus(401);

  const event = JSON.parse(req.body.toString());
  if (event.event !== "charge.success") return res.sendStatus(200); // ignore others

  try {
    const d = event.data;
    await markPaid(d.reference, d.amount, d.currency, d.channel);
    return res.sendStatus(200);
  } catch (e) {
    console.error("[paystack webhook]", e);
    return res.sendStatus(500); // Paystack retries on non-200
  }
}

export async function markPaid(
  reference: string,
  amountKobo: number,
  currency: string,
  channel?: string,
) {
  const order = await prisma.customerOrder.findUnique({
    where: { id: reference },
  }); // reference === id
  if (!order) {
    console.error("[markPaid] unknown reference", reference);
    return;
  }

  // never trust the event alone: amount and currency must match what we charged
  if (currency !== "NGN" || amountKobo !== Math.round(order.totalPrice * 100)) {
    console.error("[markPaid] amount mismatch", {
      reference,
      amountKobo,
      expected: order.totalPrice,
    });
    return; // alert on this: possible tampering or a bug
  }

  // idempotent: Paystack retries and may send duplicates
  const { count } = await prisma.customerOrder.updateMany({
    where: { id: order.id, paymentStatus: { not: "Paid" } },
    data: {
      paymentStatus: "Paid",
      paidAt: new Date(),
      paymentChannel: channel,
    },
  });
  return { firstTime: count === 1 };
}
