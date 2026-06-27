/**
 * GET /api/orders/[id]
 * Returns a single order with all items, vendor details, and product details.
 * Scoped to the session's businessId.
 */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getOrderById } from "@/lib/db"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const order = await getOrderById(id, session.user.businessId)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (err) {
    console.error("[api/orders/[id] GET]", err)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}
