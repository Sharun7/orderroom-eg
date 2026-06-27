/**
 * GET /api/orders/today
 * Returns the most recent order created today for the session business,
 * or null if none exists.
 * Used by the "New Order" wizard to prevent duplicate daily orders.
 */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const order = await prisma.order.findFirst({
      where: {
        businessId: session.user.businessId,
        createdAt: { gte: startOfToday },
      },
      include: {
        items: { include: { vendor: true, product: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ order: order ?? null })
  } catch (err) {
    console.error("[api/orders/today GET]", err)
    return NextResponse.json({ error: "Failed to fetch today's order" }, { status: 500 })
  }
}
