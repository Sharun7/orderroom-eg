import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getOrderEventsForBusiness } from "@/lib/dynamo"
import DashboardClient from "@/components/dashboard-client"

// Inline types until Prisma generates them
type Vendor = { id: string; name: string; email: string; phone?: string; category: string; businessId: string; createdAt: Date }
type Product = { id: string; name: string; unit: string; defaultQty: number; vendorId: string }
type Order = { id: string; businessId: string; date: Date; status: string; notes?: string; createdAt: Date }
type OrderItem = { id: string; orderId: string; vendorId: string; productId: string; quantity: number; unit: string; vendorStatus: string; confirmToken: string; confirmedAt?: Date; deliveredAt?: Date }

type OrderWithItems = Order & {
  items: (OrderItem & {
    vendor: Vendor
    product: Product
  })[]
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.businessId) {
    redirect("/login")
  }

  const businessId = session.user.businessId

  // Fetch today's order with all items, vendors, and products
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayOrder: OrderWithItems | null = await prisma.order.findFirst({
    where: {
      businessId,
      date: {
        gte: today,
        lt: new Date(today.getTime() + 86400000), // tomorrow
      },
    },
    include: {
      items: {
        include: {
          vendor: true,
          product: true,
        },
      },
    },
  })

  // Fetch vendor count
  const vendorCount = await prisma.vendor.count({ where: { businessId } })

  // Fetch recent events from DynamoDB
  const recentEvents = await getOrderEventsForBusiness(businessId)

  // Transform data for client component
  const orders = todayOrder
    ? [
        {
          id: todayOrder.id,
          businessId: todayOrder.businessId,
          status: todayOrder.status,
          notes: todayOrder.notes,
          date: todayOrder.date,
          createdAt: todayOrder.createdAt,
          vendorName: todayOrder.items[0]?.vendor.name || "Unknown",
          vendorEmail: todayOrder.items[0]?.vendor.email || "",
          totalItems: todayOrder.items.length,
          sentAt: todayOrder.createdAt.toISOString(),
          confirmedAt: todayOrder.items.some((oi: OrderItem) => oi.confirmedAt)
            ? todayOrder.items.find((oi: OrderItem) => oi.confirmedAt)?.confirmedAt?.toISOString()
            : undefined,
        },
      ]
    : []

  const confirmedCount = todayOrder
    ? todayOrder.items.filter((oi: OrderItem) => oi.vendorStatus === "confirmed").length
    : 0

  const pendingCount = todayOrder
    ? todayOrder.items.filter((oi: OrderItem) => oi.vendorStatus === "pending").length
    : 0

  return (
    <DashboardClient
      vendorCount={vendorCount}
      ordersCount={todayOrder?.items.length || 0}
      confirmedCount={confirmedCount}
      pendingCount={pendingCount}
      orders={orders}
      recentEvents={recentEvents}
    />
  )
}
