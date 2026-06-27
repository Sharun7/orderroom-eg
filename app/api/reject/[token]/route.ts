/**
 * POST /api/reject/[token]
 * Public route — vendor declines an order via the link in their email.
 * Delegates to the confirm route with action="reject".
 *
 * Body: { reason?: string }
 */
import { NextRequest, NextResponse } from "next/server"
import { getOrderItemByToken, rejectOrderItem } from "@/lib/db"
import { logVendorRejected } from "@/lib/dynamo"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params
    const body = await req.json().catch(() => ({}))
    const { reason } = body as { reason?: string }

    const orderItem = await getOrderItemByToken(token)
    if (!orderItem) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 })
    }

    if (orderItem.vendorStatus !== "pending") {
      return NextResponse.json(
        { error: "This order has already been responded to", status: orderItem.vendorStatus },
        { status: 409 },
      )
    }

    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? ""

    // Update Aurora
    const updated = await rejectOrderItem(token)

    // Emit to DynamoDB
    await logVendorRejected({
      orderId:     orderItem.orderId,
      orderItemId: orderItem.id,
      vendorId:    orderItem.vendorId,
      businessId:  orderItem.order.businessId,
      reason,
      ip,
    })

    return NextResponse.json({ success: true, action: "rejected", item: updated })
  } catch (err) {
    console.error("[api/reject/[token] POST]", err)
    return NextResponse.json({ error: "Rejection failed" }, { status: 500 })
  }
}
