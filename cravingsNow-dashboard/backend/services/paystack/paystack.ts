import axios from "axios";
import { PaystackCustomer, PaystackInitTrasaction } from "../../types/paystack";
import { CustomerOrder } from "../../generated/prisma/client";

const PAYSTACK_TEST_SECRET_KEY = process.env.PAYSTACK_TEST_SECRET_KEY;
const CALL_BACK_URL = process.env.CALL_BACK_URL;

export const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${PAYSTACK_TEST_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export const createPaystackCustomer = async ({
  email,
  firstName,
  lastName,
  phone,
}: PaystackCustomer) => {
  const { data } = await paystack.post("/customer", {
    email,
    first_name: firstName,
    last_name: lastName,
    phone,
  });
  return data.data; // returns customer object with customer_code
};

export const initializePaystackTransaction = async ({
  customerOrder,
  customerEmail,
  split,
}: PaystackInitTrasaction) => {
  try {
    const { data } = await paystack.post("/transaction/initialize", {
      email: customerEmail,
      amount: Math.round(customerOrder.totalPrice * 100), // kobo
      reference: customerOrder.id, // ties Paystack's transaction directly to your own order — your idempotency key
      split,
      currency: "NGN",
      channels: [
        "card",
        "bank",
        "apple_pay",
        "ussd",
        "qr",
        "mobile_money",
        "bank_transfer",
        "eft",
        "capitec_pay",
        "payattitude",
      ],
      callback_url: `${CALL_BACK_URL}/payment/success`,
      split_code: "",
      subaccount: "",
      transaction_charge: "",
      bearer: "",
    });

    return data.data;
  } catch (error: any) {
    console.log(error.response?.data || error.message);
  }
};
