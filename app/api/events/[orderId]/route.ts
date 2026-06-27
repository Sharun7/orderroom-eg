/**
 * GET /api/events/[orderId]
 * Returns all DynamoDB events for a specific order, sorted oldest → newest.
 * Auth-gated: session required (future: validate orderId belongs to business).
 */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getEventsByOrder } from "@/lib/dynamo"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId } = await params
    const events = await getEventsByOrder(orderId)
    return NextResponse.json({ events })
  } catch (err) {
    console.error("[api/events/[orderId] GET]", err)
    return NextResponse.json({ error: "Failed to fetch order events" }, { status: 500 })
  }
}
