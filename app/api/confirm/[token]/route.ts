/**
 * POST /api/confirm/[token]
 * Handles vendor confirmation or rejection via a one-time token link.
 * Writes the result to Aurora PostgreSQL and emits
 * VENDOR_CONFIRMED or VENDOR_REJECTED to DynamoDB.
 *
 * Body: { action: "confirm" | "reject", reason? }
 * Headers: x-forwarded-for (IP), user-agent
 */
import { NextRequest, NextResponse } from "next/server"
import { getOrderItemByToken, confirmOrderItem, rejectOrderItem } from "@/lib/db"
import { logVendorConfirmed, logVendorRejected } from "@/lib/dynamo"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const body = await req.json()
    const { action, reason } = body as { action: "confirm" | "reject"; reason?: string }

    if (!action || !["confirm", "reject"].includes(action)) {
      return NextResponse.json({ error: "action must be 'confirm' or 'reject'" }, { status: 400 })
    }

    // Look up order item by confirm token in Aurora PostgreSQL
    const orderItem = await getOrderItemByToken(token)
    if (!orderItem) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 })
    }
    if (orderItem.vendorStatus !== "pending") {
      return NextResponse.json(
        { error: "This order has already been responded to", status: orderItem.vendorStatus },
        { status: 409 }
      )
    }

    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? ""
    const userAgent = req.headers.get("user-agent") ?? ""

    if (action === "confirm") {
      // Update Aurora
      const updated = await confirmOrderItem(token)

      // Emit to DynamoDB
      await logVendorConfirmed({
        orderId: orderItem.orderId,
        orderItemId: orderItem.id,
        vendorId: orderItem.vendorId,
        businessId: orderItem.order.businessId,
        ip,
        userAgent,
      })

      return NextResponse.json({ success: true, action: "confirmed", item: updated })
    } else {
      // Update Aurora
      const updated = await rejectOrderItem(token)

      // Emit to DynamoDB
      await logVendorRejected({
        orderId: orderItem.orderId,
        orderItemId: orderItem.id,
        vendorId: orderItem.vendorId,
        businessId: orderItem.order.businessId,
        reason,
        ip,
      })

      return NextResponse.json({ success: true, action: "rejected", item: updated })
    }
  } catch (err) {
    console.error("[api/confirm/[token] POST]", err)
    return NextResponse.json({ error: "Confirmation failed" }, { status: 500 })
  }
}
