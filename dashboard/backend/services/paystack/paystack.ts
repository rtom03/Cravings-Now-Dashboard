import axios from "axios";
import type {
  PaystackCustomer,
  PaystackInitTransaction,
  PaystackInitResponse,
} from "../../types/paystack";

const PAYSTACK_TEST_SECRET_KEY = process.env.PAYSTACK_TEST_SECRET_KEY;
const CALL_BACK_URL = process.env.CALL_BACK_URL;

export const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${PAYSTACK_TEST_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

const toError = (context: string, error: any) => {
  const detail = error.response?.data?.message || error.message;
  return new Error(`${context}: ${detail}`);
};

export const createPaystackCustomer = async ({
  email,
  firstName,
  lastName,
  phone,
}: PaystackCustomer) => {
  try {
    const { data } = await paystack.post("/customer", {
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
    });
    if (!data.status) throw new Error(data.message);
    return data.data; // customer object incl. customer_code
  } catch (error) {
    throw toError("Paystack create customer failed", error);
  }
};

export const initializePaystackTransaction = async ({
  amountKobo,
  customerEmail,
  reference,
  split,
}: PaystackInitTransaction): Promise<PaystackInitResponse> => {
  try {
    const { data } = await paystack.post("/transaction/initialize", {
      email: customerEmail,
      amount: Math.round(amountKobo), // already in kobo
      reference,
      currency: "NGN",
      callback_url: `${CALL_BACK_URL}/payment/callback`,
      ...(split && { split }), // only send when provided
      // channels omitted -> uses your dashboard settings. If you want to restrict:
      // channels: ["card", "bank", "ussd", "qr", "bank_transfer"],
    });

    if (!data.status) {
      throw new Error(data.message);
    }

    return data.data as PaystackInitResponse;
  } catch (error) {
    throw toError("Paystack initialize failed", error);
  }
};
