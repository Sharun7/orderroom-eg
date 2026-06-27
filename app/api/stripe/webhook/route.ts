/**
 * POST /api/stripe/webhook
 * Handles Stripe webhook events to keep subscription state in sync.
 *
 * Events handled:
 *   checkout.session.completed       — new subscription activated
 *   customer.subscription.updated    — plan changed / renewed
 *   customer.subscription.deleted    — subscription cancelled
 */

import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe, PLANS, planFromPriceId } from "@/lib/stripe"
import { upsertSubscription } from "@/lib/db"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get("stripe-signature") ?? ""

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET not set")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("[stripe/webhook] Signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {

      case "checkout.session.completed": {
        const cs = event.data.object as Stripe.Checkout.Session
        if (cs.mode !== "subscription") break

        const businessId = cs.metadata?.businessId
        if (!businessId) break

        const sub = await stripe.subscriptions.retrieve(cs.subscription as string)
        const item    = sub.items.data[0]
        const priceId = item?.price.id ?? ""
        const plan    = planFromPriceId(priceId)
        const periodEnd = (item as { current_period_end?: number })?.current_period_end

        await upsertSubscription({
          businessId,
          stripeCustomerId: cs.customer as string,
          stripePriceId:    priceId,
          stripeSubId:      sub.id,
          plan,
          status:           sub.status,
          vendorLimit:      PLANS[plan].vendorLimit,
          currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined,
        })
        break
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription
        const businessId = sub.metadata?.businessId
        if (!businessId) break

        const updItem   = sub.items.data[0]
        const priceId   = updItem?.price.id ?? ""
        const plan      = planFromPriceId(priceId)
        const updPeriodEnd = (updItem as { current_period_end?: number })?.current_period_end

        await upsertSubscription({
          businessId,
          stripeCustomerId: sub.customer as string,
          stripePriceId:    priceId,
          stripeSubId:      sub.id,
          plan,
          status:           sub.status,
          vendorLimit:      PLANS[plan].vendorLimit,
          currentPeriodEnd: updPeriodEnd ? new Date(updPeriodEnd * 1000) : undefined,
        })
        break
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const businessId = sub.metadata?.businessId
        if (!businessId) break

        await upsertSubscription({
          businessId,
          stripeCustomerId: sub.customer as string,
          stripeSubId:      sub.id,
          plan:             "free",
          status:           "cancelled",
          vendorLimit:      PLANS.free.vendorLimit,
        })
        break
      }
    }
  } catch (err) {
    console.error("[stripe/webhook] Handler error:", err)
    return NextResponse.json({ error: "Handler failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
