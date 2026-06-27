import DashboardClient from "@/components/dashboard-client"
import type { DisplayOrder } from "@/components/order-status-board"

// Demo events shown in the activity feed
const DEMO_EVENTS = [
  { orderId: "demo-order-1", eventType: "ORDER_SENT",        timestamp: new Date(Date.now() - 3600000).toISOString(), data: { vendorName: "Fresh Farm Produce" } },
  { orderId: "demo-order-1", eventType: "VENDOR_CONFIRMED",  timestamp: new Date(Date.now() - 1800000).toISOString(), data: { vendorName: "Prime Cuts Meats" } },
  { orderId: "demo-order-2", eventType: "ORDER_SENT",        timestamp: new Date(Date.now() - 900000).toISOString(),  data: { vendorName: "Ocean Select Seafood" } },
  { orderId: "demo-order-2", eventType: "VENDOR_CONFIRMED",  timestamp: new Date(Date.now() - 600000).toISOString(),  data: { vendorName: "Golden Grain Bakery" } },
]

const DEMO_ORDERS: DisplayOrder[] = [
  {
    id: "demo-order-1",
    businessId: "demo-business-id",
    status: "confirmed",
    notes: null,
    date: new Date(),
    createdAt: new Date(Date.now() - 3600000),
    vendorName: "Fresh Farm Produce",
    vendorEmail: "orders@freshfarm.com",
    totalItems: 4,
    sentAt: new Date(Date.now() - 3600000).toISOString(),
    confirmedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "demo-order-2",
    businessId: "demo-business-id",
    status: "sent",
    notes: null,
    date: new Date(),
    createdAt: new Date(Date.now() - 5400000),
    vendorName: "Prime Cuts Meats",
    vendorEmail: "delivery@primecuts.com",
    totalItems: 3,
    sentAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: "demo-order-3",
    businessId: "demo-business-id",
    status: "sent",
    notes: null,
    date: new Date(),
    createdAt: new Date(Date.now() - 2700000),
    vendorName: "Ocean Select Seafood",
    vendorEmail: "ops@oceanselect.com",
    totalItems: 2,
    sentAt: new Date(Date.now() - 2700000).toISOString(),
  },
]

export default function DashboardPage() {
  return (
    <DashboardClient
      vendorCount={6}
      ordersCount={9}
      confirmedCount={4}
      pendingCount={2}
      orders={DEMO_ORDERS}
      recentEvents={DEMO_EVENTS}
    />
  )
}
