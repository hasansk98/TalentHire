# Razorpay Integration Setup

To enable Indian INR subscriptions with Razorpay, follow these steps:

## 1. Razorpay Dashboard Setup
1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Go to **Settings** > **API Keys**.
3. Generate a new **Key ID** and **Key Secret**.
4. (Optional) Go to **Settings** > **Webhooks** and add your webhook URL: `https://your-app-url.run.app/api/v1/billing/webhook`.
5. Secret for webhook should be saved as `RAZORPAY_WEBHOOK_SECRET`.

## 2. Environment Variables
Add the following to your environment variables in AI Studio:
- `RAZORPAY_KEY_ID`: Your Razorpay Key ID.
- `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret.
- `RAZORPAY_WEBHOOK_SECRET`: Your Razorpay Webhook Secret (if using webhooks).

## 3. Testing
- Use Razorpay [Test Mode](https://razorpay.com/docs/payments/dashboard/settings/api-keys/#test-mode) for development.
- Test card details can be found [here](https://razorpay.com/docs/payments/payments/test-card-details/).

## 4. Production
- Switch to **Live Mode** in Razorpay Dashboard.
- Update the environment variables with Live Keys.
- Ensure your domain is whitelisted in Razorpay settings.
