# Paystack Dashboard Setup Guide

To fully connect our Paystack library and backend routes with your actual Paystack account, you will need to set up two recurring plans in your Paystack Dashboard.

Follow these simple steps:

---

## 1. Register / Log In to Paystack
1. Visit [Paystack](https://dashboard.paystack.com/) and register or log in to your developer account.
2. Ensure you are in **Test Mode** (toggle at the top-right of your dashboard) to prevent real charges during development.

---

## 2. Obtain your API Keys
1. In the Paystack Dashboard, navigate to **Settings** > **API Keys & Webhooks**.
2. Copy your **Test Secret Key** (starts with `sk_test_`).
3. Add this key to your local `.env` or `.env.local` file:
   ```env
   PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
   ```

---

## 3. Create Subscription Plans
You need to create recurring plans so that Paystack can automatically handle subscription billing for Pro and Enterprise tiers.

### Plan A: Pro Tier ($10/month)
1. Navigate to **Plans** in the left sidebar, and click **Create Plan**.
2. Enter the following details:
   - **Plan Name:** `Catalyst Pro Tier`
   - **Description:** `Access to Premium models (GPT-4o, Claude Opus) and 50,000 daily tokens.`
   - **Amount:** `10.00` (or local equivalent in NGN: e.g. `15000.00` if billing in Naira)
   - **Interval:** `Monthly`
3. Click **Create**.
4. Once created, copy the **Plan Code** (starts with `PLN_` e.g., `PLN_xxxxxxxxx`).
5. Add it to your `.env` or `.env.local` file:
   ```env
   NEXT_PUBLIC_PAYSTACK_PLAN_PRO=PLN_your_pro_plan_code_here
   ```

### Plan B: Enterprise Tier ($50/month)
1. Click **Create Plan** again.
2. Enter the following details:
   - **Plan Name:** `Catalyst Enterprise Tier`
   - **Description:** `Unlimited tokens, premium models, and priority support.`
   - **Amount:** `50.00` (or local equivalent in NGN: e.g., `75000.00` if billing in Naira)
   - **Interval:** `Monthly`
3. Click **Create**.
4. Copy the **Plan Code** (starts with `PLN_` e.g., `PLN_yyyyyyyyy`).
5. Add it to your `.env` or `.env.local` file:
   ```env
   NEXT_PUBLIC_PAYSTACK_PLAN_ENTERPRISE=PLN_your_enterprise_plan_code_here
   ```

---

## 4. Setup your Webhook URL
When a subscription payment succeeds, Paystack will notify our app via a webhook.

1. In the Paystack Dashboard, navigate to **Settings** > **API Keys & Webhooks**.
2. Scroll to the **Webhook URL** field.
3. During local development, use a tunneling service like **ngrok** to expose your local port (e.g., `http://localhost:3000`):
   ```bash
   ngrok http 3000
   ```
4. Set the webhook URL to:
   ```text
   https://your-ngrok-subdomain.ngrok-free.app/api/billing/webhook
   ```
5. Click **Save Changes**.

---

Now your backend is fully equipped to handle Paystack checkouts! Let us know when you've obtained these keys and are ready to build the API routes.
