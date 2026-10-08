import dotenv from "dotenv";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL, // use the POOLED url if your host offers one
  max: 10,
  idleTimeoutMillis: 10_000, // drop idle conns before the server does
  connectionTimeoutMillis: 10_000, // fail fast instead of hanging ~85s
  keepAlive: true, // TCP keepalive so idle conns aren't silently cut
});
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
// Single shared instance (avoids connection exhaustion on hot reload)
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
// const prisma = new PrismaClient({ adapter });

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Stop the app if DB connection fails
  }
}

const withRetry = async <T>(fn: () => Promise<T>, retries = 2): Promise<T> => {
  try {
    return await fn();
  } catch (err: any) {
    const transient = ["P1017", "P1001", "P1002", "P2024"].includes(err?.code);
    if (transient && retries > 0) {
      await new Promise((r) => setTimeout(r, 300));
      return withRetry(fn, retries - 1);
    }
    throw err;
  }
};
export { prisma, withRetry };
