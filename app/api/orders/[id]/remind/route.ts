/**
 * POST /api/orders/[id]/remind
 * Sends a reminder for a specific order item (vendor hasn't responded).
 * Emits REMINDER_SENT to DynamoDB.
 *
 * Body: { businessId, orderItemId, vendorId, recipientEmail, attemptNumber? }
 */
import { NextRequest, NextResponse } from "next/server"
import { logReminderSent } from "@/lib/dynamo"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { businessId, orderItemId, vendorId, recipientEmail, attemptNumber } = body as {
      businessId: string
      orderItemId: string
      vendorId: string
      recipientEmail: string
      attemptNumber?: number
    }

    if (!businessId || !orderItemId || !vendorId || !recipientEmail) {
      return NextResponse.json(
        { error: "businessId, orderItemId, vendorId, and recipientEmail are required" },
        { status: 400 }
      )
    }

    // In production: send email via Resend / SES here.
    // emailId would come back from the email provider.
    const emailId = `rem_${orderItemId.slice(0, 8)}_${Date.now()}`

    // Emit REMINDER_SENT to DynamoDB
    const event = await logReminderSent({
      orderId: id,
      orderItemId,
      vendorId,
      businessId,
      recipientEmail,
      attemptNumber: attemptNumber ?? 1,
      emailId,
    })

    return NextResponse.json({ event, emailId })
  } catch (err) {
    console.error("[api/orders/[id]/remind POST]", err)
    return NextResponse.json({ error: "Failed to send reminder" }, { status: 500 })
  }
}
