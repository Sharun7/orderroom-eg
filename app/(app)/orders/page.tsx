import OrdersPageClient from "./page-client"
import type { Order, OrderStatus } from "@/lib/db"

type DemoOrder = Order & {
  vendorName: string
  vendorEmail: string
  totalItems: number
  sentAt?: string
  confirmedAt?: string
}

const DEMO_ORDERS: DemoOrder[] = [
  {
    id: "o1", businessId: "b1", status: "confirmed" as OrderStatus, notes: null,
    date: new Date(), createdAt: new Date(Date.now() - 7200000),
    vendorName: "Fresh Farm Produce", vendorEmail: "orders@freshfarm.com", totalItems: 4,
    sentAt: new Date(Date.now() - 7200000).toISOString(),
    confirmedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "o2", businessId: "b1", status: "sent" as OrderStatus, notes: null,
    date: new Date(), createdAt: new Date(Date.now() - 5400000),
    vendorName: "Prime Cuts Meats", vendorEmail: "delivery@primecuts.com", totalItems: 3,
    sentAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: "o3", businessId: "b1", status: "delivered" as OrderStatus, notes: null,
    date: new Date(Date.now() - 86400000), createdAt: new Date(Date.now() - 86400000 - 14400000),
    vendorName: "Golden Grain Bakery", vendorEmail: "wholesale@goldengrain.com", totalItems: 3,
    sentAt: new Date(Date.now() - 86400000 - 14400000).toISOString(),
    confirmedAt: new Date(Date.now() - 86400000 - 10800000).toISOString(),
  },
  {
    id: "o4", businessId: "b1", status: "sent" as OrderStatus, notes: null,
    date: new Date(), createdAt: new Date(Date.now() - 2700000),
    vendorName: "Ocean Select Seafood", vendorEmail: "ops@oceanselect.com", totalItems: 2,
    sentAt: new Date(Date.now() - 2700000).toISOString(),
  },
  {
    id: "o5", businessId: "b1", status: "confirmed" as OrderStatus, notes: null,
    date: new Date(Date.now() - 172800000), createdAt: new Date(Date.now() - 172800000),
    vendorName: "Alpine Dairy Co.", vendorEmail: "orders@alpinedairy.com", totalItems: 1,
    sentAt: new Date(Date.now() - 172800000).toISOString(),
    confirmedAt: new Date(Date.now() - 172800000 + 3600000).toISOString(),
  },
]

export default function OrdersPage() {
  return <OrdersPageClient initialOrders={DEMO_ORDERS} />
}
