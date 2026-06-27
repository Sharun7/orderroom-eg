/**
 * GET /api/events
 * Returns the most recent DynamoDB events for the session business.
 * Used by the dashboard activity feed.
 * Query param: ?limit=50 (default 50, max 100)
 */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getEventsByBusiness } from "@/lib/dynamo"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const rawLimit = parseInt(searchParams.get("limit") ?? "50", 10)
    const limit = Math.min(Math.max(rawLimit, 1), 100)

    const events = await getEventsByBusiness(session.user.businessId, limit)
    return NextResponse.json({ events })
  } catch (err) {
    console.error("[api/events GET]", err)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
