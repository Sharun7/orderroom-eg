/**
 * POST /api/orders/[id]/send
 * Marks the order as "sent" in Aurora PostgreSQL, then emits one ORDER_SENT
 * event per order item to the DynamoDB order_events table.
 *
 * In production this would also dispatch emails via Resend / SES.
 */
import { NextRequest, NextResponse } from "next/server"
import { getOrderById, updateOrderStatus } from "@/lib/db"
import { logOrderSent } from "@/lib/dynamo"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { businessId } = body as { businessId: string }

    if (!businessId) {
      return NextResponse.json({ error: "businessId is required" }, { status: 400 })
    }

    const order = await getOrderById(id, businessId)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update order status in Aurora
    const updated = await updateOrderStatus(id, "sent")

    // Emit ORDER_SENT to DynamoDB — one event per order item (per vendor line)
    await Promise.all(
      order.items.map((item) =>
        logOrderSent({
          orderId: id,
          orderItemId: item.id,
          vendorId: item.vendorId,
          businessId,
          recipientEmail: item.vendor.email,
          emailId: `em_${item.id.slice(0, 8)}`,
        })
      )
    )

    return NextResponse.json({ order: updated })
  } catch (err) {
    console.error("[api/orders/[id]/send POST]", err)
    return NextResponse.json({ error: "Failed to send order" }, { status: 500 })
  }
}
