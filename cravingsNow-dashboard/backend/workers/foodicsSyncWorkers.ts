// workers/foodicsSyncWorker.ts
import { SyncStatus } from "../generated/prisma/enums";
import { buildFoodicsOrderPayload } from "../services/foodicsPayload";
import { prisma } from "../utils/db";

const FOODICS_API_BASE = process.env.FOODICS_API_BASE!;
const FOODICS_API_TOKEN = process.env.FOODICS_API_TOKEN!;

function backoffMs(attempts: number): number {
  return Math.min(2 ** attempts * 1000, 5 * 60_000); // caps at 5 minutes
}

export async function processPendingSyncJobs() {
  // Claim eligible jobs. Prisma can't compare two columns (attempts < maxAttempts)
  // directly in `where`, so we filter that part in app code after fetching —
  // flagged when we designed this table.
  const candidates = await prisma.orderSyncJob.findMany({
    where: {
      status: { in: [SyncStatus.Pending, SyncStatus.Failed] },
      nextAttemptAt: { lte: new Date() },
      claimedAt: null,
    },
    include: {
      order: {
        include: {
          products: { include: { options: true } },
          charges: true,
          payments: true,
        },
      },
    },
    take: 20, // process in small batches, not the whole backlog at once
  });

  const jobs = candidates.filter((j) => j.attempts < j.maxAttempts);

  for (const job of jobs) {
    // Claim: mark as processing so a concurrent worker run doesn't grab it too
    await prisma.orderSyncJob.update({
      where: { id: job.id },
      data: { status: SyncStatus.Processing, claimedAt: new Date() },
    });

    try {
      const payload = buildFoodicsOrderPayload(job.order as any);

      const res = await fetch(`${FOODICS_API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${FOODICS_API_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Foodics API ${res.status}: ${errBody}`);
      }

      const foodicsOrder = await res.json();

      await prisma.$transaction([
        prisma.order.update({
          where: { id: job.orderId },
          data: { foodicsId: foodicsOrder.id },
        }),
        prisma.orderSyncJob.update({
          where: { id: job.id },
          data: { status: SyncStatus.Synced, claimedAt: null },
        }),
      ]);
    } catch (err) {
      const attempts = job.attempts + 1;
      const failed = attempts >= job.maxAttempts;

      await prisma.orderSyncJob.update({
        where: { id: job.id },
        data: {
          attempts,
          status: failed ? SyncStatus.Failed : SyncStatus.Pending,
          lastError: err instanceof Error ? err.message : String(err),
          nextAttemptAt: new Date(Date.now() + backoffMs(attempts)),
          claimedAt: null,
        },
      });

      console.error(`Sync job ${job.id} failed (attempt ${attempts}):`, err);
    }
  }
}
