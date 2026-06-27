/**
 * POST /api/orders
 * Creates a new order in Aurora PostgreSQL, then emits ORDER_CREATED
 * to the DynamoDB order_events table for each distinct vendor.
 */
import { NextRequest, NextResponse } from "next/server"
import { createOrder } from "@/lib/db"
import { logOrderCreated } from "@/lib/dynamo"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { businessId, notes, items } = body as {
      businessId: string
      notes?: string
      items: { vendorId: string; productId: string; quantity: number; unit: string }[]
    }

    if (!businessId || !items?.length) {
      return NextResponse.json({ error: "businessId and items are required" }, { status: 400 })
    }

    // Write to Aurora PostgreSQL
    const order = await createOrder({ businessId, notes, items })

    // Emit one ORDER_CREATED event per distinct vendor to DynamoDB
    const vendorIds = [...new Set(items.map((i) => i.vendorId))]
    await Promise.all(
      vendorIds.map((vendorId) =>
        logOrderCreated({ orderId: order.id, vendorId, businessId, notes })
      )
    )

    return NextResponse.json({ order }, { status: 201 })
  } catch (err) {
    console.error("[api/orders POST]", err)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
