import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getOrdersWithItems } from "@/lib/db"
import OrdersPageClient from "./page-client"

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.businessId) {
    redirect("/login")
  }

  // Fetch all orders for the business
  const orders = await getOrdersWithItems(session.user.businessId)

  // Transform for display
  const displayOrders = orders.map((order) => ({
    id: order.id,
    businessId: order.businessId,
    status: order.status,
    notes: order.notes,
    date: order.date,
    createdAt: order.createdAt,
    vendorName: order.items[0]?.vendor.name || "Multiple vendors",
    vendorEmail: order.items[0]?.vendor.email || "",
    totalItems: order.items.length,
    sentAt: order.createdAt.toISOString(),
    confirmedAt: order.items.some((item) => item.confirmedAt)
      ? order.items.find((item) => item.confirmedAt)?.confirmedAt?.toISOString()
      : undefined,
  }))

  return <OrdersPageClient initialOrders={displayOrders} />
}
