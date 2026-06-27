import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getOrderEventsForBusiness } from "@/lib/dynamo"
import DashboardClient from "@/components/dashboard-client"
import type { DisplayOrder } from "@/components/order-status-board"

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

// Shape must match DynamoEvent in dashboard-client.tsx
type DashboardEvent = { orderId: string; eventType: string; timestamp: string; data?: Record<string, unknown> }

const DEMO_EVENTS: DashboardEvent[] = [
  { orderId: "demo-order-1", eventType: "ORDER_SENT",        timestamp: new Date(Date.now() - 3600000).toISOString(), data: { vendorName: "Fresh Farm Co." } },
  { orderId: "demo-order-1", eventType: "VENDOR_CONFIRMED",  timestamp: new Date(Date.now() - 1800000).toISOString(), data: { vendorName: "Prime Cuts" } },
  { orderId: "demo-order-1", eventType: "VENDOR_CONFIRMED",  timestamp: new Date(Date.now() - 900000).toISOString(),  data: { vendorName: "Ocean Select" } },
]

const DEMO_ORDERS: DisplayOrder[] = [
  {
    id: "demo-order-1",
    businessId: "demo-business-id",
    status: "sent",
    notes: null,
    date: new Date(),
    createdAt: new Date(Date.now() - 3600000),
    vendorName: "Fresh Farm Co.",
    vendorEmail: "freshfarm@demo.com",
    totalItems: 5,
    sentAt: new Date(Date.now() - 3600000).toISOString(),
    confirmedAt: new Date(Date.now() - 1800000).toISOString(),
  },
]

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.businessId) {
    redirect("/login")
  }

  const businessId = session.user.businessId
  const isDemo = businessId === "demo-business-id"

  // For demo session, return demo data immediately without any DB calls
  if (isDemo) {
    return (
      <DashboardClient
        vendorCount={6}
        ordersCount={5}
        confirmedCount={3}
        pendingCount={2}
        orders={DEMO_ORDERS}
        recentEvents={DEMO_EVENTS}
      />
    )
  }

  // Real DB queries for authenticated non-demo users
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let todayOrder: OrderWithItems | null = null
  let vendorCount = 0
  let recentEvents: DashboardEvent[] = []

  try {
    todayOrder = await prisma.order.findFirst({
      where: {
        businessId,
        date: { gte: today, lt: new Date(today.getTime() + 86400000) },
      },
      include: { items: { include: { vendor: true, product: true } } },
    }) as OrderWithItems | null
    vendorCount = await prisma.vendor.count({ where: { businessId } })
    const rawEvents = await getOrderEventsForBusiness(businessId)
    recentEvents = rawEvents.map((e) => ({
      orderId: e.orderId,
      eventType: e.eventType,
      timestamp: e.timestamp,
      data: e.metadata ? { raw: e.metadata } : undefined,
    }))
  } catch {
    // DB not yet seeded — show empty state
  }

  const orders: DisplayOrder[] = todayOrder
    ? [
        {
          id: todayOrder.id,
          businessId: todayOrder.businessId,
          status: todayOrder.status,
          notes: todayOrder.notes ?? null,
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
