/**
 * POST /api/orders/[id]/deliver
 * Marks a specific order item as delivered in Aurora PostgreSQL, then
 * emits ITEM_DELIVERED to DynamoDB.
 *
 * Body: { businessId, orderItemId, vendorId, markedBy? }
 */
import { NextRequest, NextResponse } from "next/server"
import { markOrderItemDelivered } from "@/lib/db"
import { logItemDelivered } from "@/lib/dynamo"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { businessId, orderItemId, vendorId, confirmToken, markedBy } = body as {
      businessId: string
      orderItemId: string
      vendorId: string
      confirmToken: string
      markedBy?: string
    }

    if (!businessId || !orderItemId || !vendorId || !confirmToken) {
      return NextResponse.json(
        { error: "businessId, orderItemId, vendorId, and confirmToken are required" },
        { status: 400 }
      )
    }

    // Update Aurora PostgreSQL
    const item = await markOrderItemDelivered(confirmToken)

    // Emit ITEM_DELIVERED to DynamoDB
    await logItemDelivered({
      orderId: id,
      orderItemId,
      vendorId,
      businessId,
      markedBy,
    })

    return NextResponse.json({ item })
  } catch (err) {
    console.error("[api/orders/[id]/deliver POST]", err)
    return NextResponse.json({ error: "Failed to mark delivery" }, { status: 500 })
  }
}
