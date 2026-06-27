/**
 * lib/stripe.ts
 * Stripe client singleton + plan configuration.
 */

import Stripe from "stripe"

// Server-side Stripe client (never expose to browser)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2026-06-24.dahlia" as const,
  typescript: true,
})

// ---------------------------------------------------------------------------
// Plan configuration
// ---------------------------------------------------------------------------

export type PlanKey = "free" | "starter" | "pro"

export const PLANS: Record<PlanKey, {
  name: string
  price: number        // USD per month
  priceId: string      // Stripe Price ID (from env)
  vendorLimit: number
  features: string[]
}> = {
  free: {
    name:        "Free",
    price:       0,
    priceId:     "",
    vendorLimit: 1,
    features: [
      "1 vendor",
      "Unlimited orders",
      "Email confirmations",
      "DynamoDB event log",
    ],
  },
  starter: {
    name:        "Starter",
    price:       29,
    priceId:     process.env.STRIPE_STARTER_PRICE_ID ?? "",
    vendorLimit: 10,
    features: [
      "Up to 10 vendors",
      "Unlimited orders",
      "Email confirmations",
      "DynamoDB event log",
      "Auto reminder emails",
      "Daily digest",
    ],
  },
  pro: {
    name:        "Pro",
    price:       79,
    priceId:     process.env.STRIPE_PRO_PRICE_ID ?? "",
    vendorLimit: 999,
    features: [
      "Unlimited vendors",
      "Unlimited orders",
      "Email confirmations",
      "DynamoDB event log",
      "Auto reminder emails",
      "Daily digest",
      "Priority support",
      "Custom sender domain",
    ],
  },
}

/**
 * Derive the PlanKey from a Stripe Price ID.
 */
export function planFromPriceId(priceId: string): PlanKey {
  if (priceId === process.env.STRIPE_PRO_PRICE_ID)     return "pro"
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return "starter"
  return "free"
}
