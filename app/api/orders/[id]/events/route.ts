/**
 * GET /api/orders/[id]/events
 * Returns all DynamoDB event log entries for a given order ID,
 * sorted oldest → newest.
 */
import { NextRequest, NextResponse } from "next/server"
import { getEventsByOrder } from "@/lib/dynamo"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const events = await getEventsByOrder(id)
    return NextResponse.json({ events })
  } catch (err) {
    console.error("[api/orders/[id]/events GET]", err)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
