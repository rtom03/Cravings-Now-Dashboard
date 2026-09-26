import { AuthPayload } from "./index.types";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      customer?: { customerId: string; email: string };
    }
  }
}
export {};
