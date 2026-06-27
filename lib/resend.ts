/**
 * lib/resend.ts
 * Resend email client + typed helpers for sending vendor order emails.
 *
 * Falls back to a dry-run console log when RESEND_API_KEY is not set
 * so the app renders and the send route works without a live key in dev.
 */

import { Resend } from "resend"
import { VendorOrderEmail } from "@/emails/vendor-order"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const EMAIL_FROM = process.env.EMAIL_FROM ?? "OrderRoom <orders@orderroom.app>"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

// Lazy singleton
const globalForResend = globalThis as unknown as { _resend?: Resend }
const resend: Resend =
  globalForResend._resend ??
  (globalForResend._resend = new Resend(RESEND_API_KEY ?? "re_placeholder"))

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrderEmailItem {
  name: string
  quantity: number
  unit: string
}

export interface SendOrderEmailArgs {
  to: string
  vendorName: string
  businessName: string
  deliveryDate: string           // ISO date string e.g. "2026-06-30"
  items: OrderEmailItem[]
  notes?: string
  confirmToken: string           // → /confirm/[token]
  rejectToken: string            // → /reject/[token]  (same token, different route)
  businessEmail: string
}

export interface SendEmailResult {
  id?: string
  error?: string
}

// ---------------------------------------------------------------------------
// sendOrderEmail
// ---------------------------------------------------------------------------

export async function sendOrderEmail(
  args: SendOrderEmailArgs,
): Promise<SendEmailResult> {
  const confirmUrl = `${APP_URL}/confirm/${args.confirmToken}`
  const rejectUrl  = `${APP_URL}/reject/${args.rejectToken}`

  const subject = `Order from ${args.businessName} — ${new Date(args.deliveryDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`

  // Dry-run if no real key
  if (!RESEND_API_KEY || RESEND_API_KEY === "re_placeholder") {
    console.log("[resend] DRY RUN — would send email:", { to: args.to, subject, confirmUrl })
    return { id: `dry_run_${Date.now()}` }
  }

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to:   args.to,
      subject,
      react: VendorOrderEmail({
        vendorName:    args.vendorName,
        businessName:  args.businessName,
        deliveryDate:  args.deliveryDate,
        items:         args.items,
        notes:         args.notes,
        confirmUrl,
        rejectUrl,
        businessEmail: args.businessEmail,
      }),
    })

    if (result.error) {
      console.error("[resend] API error:", result.error)
      return { error: result.error.message }
    }

    return { id: result.data?.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[resend] sendOrderEmail failed:", message)
    return { error: message }
  }
}
