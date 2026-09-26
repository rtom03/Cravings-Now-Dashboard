import { CustomerOrder } from "../generated/prisma/client";

interface PaystackCustomer {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface PaystackInitTrasaction {
  customerOrder: CustomerOrder;
  customerEmail: string;
  split: {
    type: "flat";
    currency: string;
    bearer_type: string;
    subaccounts: Array<{ subaccount: string; share: number }>;
  };
}

export { PaystackCustomer, PaystackInitTrasaction };
