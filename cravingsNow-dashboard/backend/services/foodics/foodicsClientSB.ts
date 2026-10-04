// foodics/foodicsClientSB.ts
import axios from "axios";
import axiosRetry from "axios-retry";
import { sleep } from "../../utils/sleep";

class RateLimiter {
  private timestamps: number[] = [];

  constructor(
    private maxRequests: number,
    private windowMs: number,
  ) {}

  async acquire(): Promise<void> {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);

    if (this.timestamps.length >= this.maxRequests) {
      const oldest = this.timestamps[0];
      const waitMs = this.windowMs - (now - oldest) + 50;
      await sleep(waitMs);
      return this.acquire();
    }

    this.timestamps.push(Date.now());
  }
}

// 75, not Foodics' documented 90 — deliberate margin, since the product
// sync showed retries firing even at 85.
const limiter = new RateLimiter(75, 60_000);

const foodicsClientSB = axios.create({
  baseURL: process.env.FOODICS_SANDBOX_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

foodicsClientSB.interceptors.request.use(async (config) => {
  await limiter.acquire(); // every request waits its turn here, before anything is sent
  config.headers.Authorization = `Bearer ${process.env.FOODICS_SANDBOX_API_TOKEN}`;
  return config;
});

axiosRetry(foodicsClientSB, {
  retries: 5,
  retryCondition: (error) => {
    return (
      error.response?.status === 429 ||
      axiosRetry.isNetworkOrIdempotentRequestError(error)
    );
  },
  retryDelay: (retryCount, error) => {
    const retryAfterHeader = error.response?.headers?.["retry-after"];
    if (retryAfterHeader) {
      const seconds = Number(retryAfterHeader);
      if (!Number.isNaN(seconds)) return seconds * 1000;
    }
    return axiosRetry.exponentialDelay(retryCount);
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.warn(
      `[foodicsClientSB] Retry ${retryCount} for ${requestConfig.url} — ${error.response?.status ?? error.message}`,
    );
  },
});

export default foodicsClientSB;
