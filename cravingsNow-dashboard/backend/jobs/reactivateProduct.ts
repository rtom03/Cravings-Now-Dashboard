// jobs/reactivateProducts.ts
import cron from "node-cron";
import { prisma } from "../utils/db";

// runs every minute — adjust cadence to how precise you need the reactivation to be
cron.schedule("* * * * *", async () => {
  const now = new Date();

  const result = await prisma.groupProducts.updateMany({
    where: {
      isActive: false,
      reactivateAt: { lte: now },
    },
    data: {
      isActive: true,
      reactivateAt: null,
    },
  });

  if (result.count > 0) {
    console.log(
      `Reactivated ${result.count} product(s) at ${now.toISOString()}`,
    );
  }
});
