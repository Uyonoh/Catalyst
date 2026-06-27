const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_API_URL = "https://api.paystack.co";

if (!PAYSTACK_SECRET_KEY) {
  console.warn("Warning: PAYSTACK_SECRET_KEY is not defined in environment variables.");
}

interface InitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface VerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    customer: {
      id: number;
      customer_code: string;
      first_name: string | null;
      last_name: string | null;
      email: string;
      phone: string | null;
      metadata: any;
    };
    plan: string | null;
    subscription: string | null;
  };
}

/**
 * Initialize a Paystack transaction/subscription checkout.
 * @param email User's email address
 * @param amount Amount to charge in kobo (if charging directly) or plan code (for subscription)
 * @param callbackUrl Redirect URL after successful transaction
 * @param planCode Optional Paystack Plan code (e.g. PLN_xxxxxxxx) for recurring billing
 */
export async function initializeTransaction(
  email: string,
  currency: string,
  amount: number,
  callbackUrl: string,
  metadata: string, 
  planCode?: string
): Promise<InitializeResponse> {
  const body: any = {
    email,
    currency,
    amount: (amount * 100).toString(),
    callback_url: callbackUrl,
    metadata,
  };

  if (planCode) {
    body.plan = planCode;
  }

  const response = await fetch(`${PAYSTACK_API_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Payment failed with payload: ", body);
    console.error(`Paystack error: ${response.statusText} - ${errorText}`);
    throw new Error("An error occuured while initializing your payment, try again later or contact support!");
  }

  return response.json();
}

/**
 * Verify a transaction using its reference.
 * @param reference Paystack transaction reference string
 */
export async function verifyTransaction(reference: string): Promise<VerifyResponse> {
  const response = await fetch(`${PAYSTACK_API_URL}/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Verification failed with reference: ", reference);
    console.error(`Paystack error: ${response.statusText} - ${errorText}`);
    throw new Error(`Paystack verification error: ${response.statusText} - ${errorText}`);
  }

  return response.json();
}
