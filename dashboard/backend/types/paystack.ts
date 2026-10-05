export interface PaystackCustomer {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface PaystackSplit {
  type: "flat" | "percentage";
  bearer_type: "account" | "subaccount" | "all-proportional" | "all";
  bearer_subaccount?: string; // required when bearer_type is "subaccount"
  subaccounts: Array<{ subaccount: string; share: number }>; // flat: kobo, percentage: 0-100
}

export interface PaystackInitTransaction {
  amountKobo: number;
  customerEmail: string;
  reference: string;
  split?: PaystackSplit;
}

export interface PaystackInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}
