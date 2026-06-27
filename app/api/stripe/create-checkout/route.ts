/**
 * POST /api/stripe/create-checkout
 * Creates a Stripe Checkout Session for the selected plan.
 * Returns { url } — the redirect URL for the hosted Stripe checkout page.
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe, PLANS, type PlanKey } from "@/lib/stripe"
import { getSubscription } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.businessId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { plan } = (await req.json()) as { plan: PlanKey }

  const planConfig = PLANS[plan]
  if (!planConfig || !planConfig.priceId) {
    return NextResponse.json({ error: "Invalid plan or price not configured" }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const businessId = session.user.businessId

  // Reuse existing Stripe customer if we already have one
  const existing = await getSubscription(businessId).catch(() => null)
  const customer = existing?.stripeCustomerId ?? undefined

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer,
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${appUrl}/billing?success=1`,
    cancel_url:  `${appUrl}/billing?cancelled=1`,
    metadata: { businessId },
    subscription_data: {
      metadata: { businessId },
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
