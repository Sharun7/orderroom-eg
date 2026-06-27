/**
 * GET /api/stripe/portal
 * Creates a Stripe Customer Portal session so the customer can manage
 * their subscription, invoices, and payment method.
 */

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { getSubscription } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.businessId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sub = await getSubscription(session.user.businessId).catch(() => null)
  if (!sub?.stripeCustomerId) {
    return NextResponse.json({ error: "No billing customer found" }, { status: 404 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  const portalSession = await stripe.billingPortal.sessions.create({
    customer:   sub.stripeCustomerId,
    return_url: `${appUrl}/billing`,
  })

  return NextResponse.json({ url: portalSession.url })
}
