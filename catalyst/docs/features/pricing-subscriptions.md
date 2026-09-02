# Subscriptions & Token Economics

Catalyst operates on a tiered subscription and token model designed to balance developer exploration with high-capacity model optimization.

## Plan Comparison

| Feature / Tier | Spark (Free) | Orbit (Basic) | Nova (Plus - Popular) | Pulsar (Pro) | Infinity (Ultra) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Price** | $0 / forever | $1/mo (orig. $3) | $3/mo (orig. $7) | $5/mo (orig. $12) | $10/mo (orig. $20) |
| **Weekly Token Limit** | 25 tokens | 100 tokens | 250 tokens | 500 tokens | Unlimited |
| **Saved Prompts** | 20 | 50 | 100 | 200 | Unlimited |
| **Managed Workspaces** | 1 | 3 | 10 | 30 | Unlimited |
| **Model Access** | GPT-3.5, Gemini Flash | GPT-4o, Claude Opus, Midjourney | GPT-4o, Claude Opus, Midjourney | All Models + Priority | All Models + Custom API Keys |
| **Support / Features** | Community | Standard | Priority + Analytics | Dedicated + Audit Logs | Dedicated Account Mgr |

---

## Token Consumption Mechanics

- **Prompt Optimization**: Each prompt optimization pass in the Studio consumes **2 tokens**.
- **Media Optimization / Image Prompts**: High-fidelity multimodal/image prompt expansions consume **3 tokens**.
- **Token Refresh Cycle**: Free and tiered token allowances reset weekly.
- **Paystack Billing Integration**: Subscriptions are processed via automated Paystack recurring billing with real-time currency detection and webhook sync.
