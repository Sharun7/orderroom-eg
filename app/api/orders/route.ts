/**
 * GET  /api/orders — list all orders for the session business
 * POST /api/orders — create a new order + log ORDER_CREATED to DynamoDB
 */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getOrdersWithItems, createOrder } from "@/lib/db"
import { logOrderCreated } from "@/lib/dynamo"

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await getOrdersWithItems(session.user.businessId)
    return NextResponse.json({ orders })
  } catch (err) {
    console.error("[api/orders GET]", err)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// POST
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { notes, items } = body as {
      notes?: string
      items: { vendorId: string; productId: string; quantity: number; unit: string }[]
    }

    if (!items?.length) {
      return NextResponse.json({ error: "items are required" }, { status: 400 })
    }

    const businessId = session.user.businessId

    // Write to Aurora PostgreSQL
    const order = await createOrder({ businessId, notes, items })

    // Emit one ORDER_CREATED event per distinct vendor to DynamoDB
    const vendorIds = [...new Set(items.map((i) => i.vendorId))]
    await Promise.all(
      vendorIds.map((vendorId) =>
        logOrderCreated({ orderId: order.id, vendorId, businessId, notes }),
      ),
    )

    return NextResponse.json({ order }, { status: 201 })
  } catch (err) {
    console.error("[api/orders POST]", err)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
