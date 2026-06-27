"use client"

import { useState } from "react"
import { Plus, Send, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { TopBar } from "@/components/top-bar"
import { StatusBadge } from "@/components/status-badge"
import type { Order, OrderStatus } from "@/lib/db"
import { cn } from "@/lib/utils"

// Display order type - Order with vendor and timing info
type DemoOrder = Order & {
  vendorName: string
  vendorEmail: string
  totalItems: number
  sentAt?: string
  confirmedAt?: string
}

function formatTime(value?: string | Date): string {
  if (!value) return "—"
  const d = typeof value === "string" ? new Date(value) : value
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

export default function OrdersPageClient({
  initialOrders,
}: {
  initialOrders: DemoOrder[]
}) {
  // Fallback to demo seed data if no orders provided
  const fallbackSeed: DemoOrder[] = [
  {
    id: "o1", businessId: "b1", status: "confirmed", notes: null,
    date: new Date(), createdAt: new Date(Date.now() - 7200000),
    vendorName: "Fresh Farm Produce", vendorEmail: "orders@freshfarm.com", totalItems: 4,
    sentAt: new Date(Date.now() - 7200000).toISOString(),
    confirmedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "o2", businessId: "b1", status: "sent", notes: null,
    date: new Date(), createdAt: new Date(Date.now() - 5400000),
    vendorName: "Prime Cuts Meats", vendorEmail: "delivery@primecuts.com", totalItems: 3,
    sentAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: "o3", businessId: "b1", status: "delivered", notes: null,
    date: new Date(), createdAt: new Date(Date.now() - 14400000),
    vendorName: "Golden Grain Bakery", vendorEmail: "wholesale@goldengrain.com", totalItems: 3,
    sentAt: new Date(Date.now() - 14400000).toISOString(),
    confirmedAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: "o4", businessId: "b1", status: "draft", notes: null,
    date: new Date(), createdAt: new Date(Date.now() - 1800000),
    vendorName: "Ocean Select Seafood", vendorEmail: "ops@oceanselect.com", totalItems: 2,
  },
  {
    id: "o5", businessId: "b1", status: "draft", notes: null,
    date: new Date(), createdAt: new Date(Date.now() - 900000),
    vendorName: "ThermoStar Beverages", vendorEmail: "b2b@thermostar.com", totalItems: 2,
  },
  ]

  const finalSeed = initialOrders.length > 0 ? initialOrders : fallbackSeed

  const [orders] = useState<DemoOrder[]>(finalSeed)

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  })

  const pendingCount   = orders.filter((o) => o.status === "draft").length
  const sentCount      = orders.filter((o) => o.status === "sent").length
  const confirmedCount = orders.filter((o) => o.status === "confirmed").length
  const deliveredCount = orders.filter((o) => o.status === "delivered").length

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title="Orders"
        subtitle={today}
        actions={
          <Link
            href="/orders/new"
            className="flex items-center gap-2 h-8 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Order
          </Link>
        }
      />

      <div className="flex-1 p-6 space-y-6 fade-in">
        {/* Summary strip */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Draft",     value: pendingCount,   color: "text-[#94A3B8]", bg: "bg-[rgba(100,116,139,0.12)]" },
            { label: "Sent",      value: sentCount,      color: "text-[#60A5FA]", bg: "bg-[rgba(59,130,246,0.12)]" },
            { label: "Confirmed", value: confirmedCount, color: "text-[#34D399]", bg: "bg-[rgba(16,185,129,0.12)]" },
            { label: "Delivered", value: deliveredCount, color: "text-[#A78BFA]", bg: "bg-[rgba(139,92,246,0.12)]" },
          ].map((s) => (
            <div key={s.label} className={cn("rounded-xl border border-[#1E3050] px-5 py-4 flex items-center gap-3", s.bg)}>
              <span className={cn("text-3xl font-bold", s.color)}>{s.value}</span>
              <span className="text-sm text-[#64748B]">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Orders table */}
        <div className="bg-[#162236] border border-[#1E3050] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1E3050] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#F7F5F0]">Today&apos;s Orders</h3>
            <span className="text-xs text-[#64748B]">{orders.length} total</span>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E3050]">
                <th className="text-left text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Vendor</th>
                <th className="text-left text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-4 py-3">Items</th>
                <th className="text-left text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-4 py-3">Created</th>
                <th className="text-left text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-4 py-3">Sent</th>
                <th className="text-left text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-4 py-3">Confirmed</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr
                  key={order.id}
                  className={cn(
                    "transition-colors hover:bg-[#1E2F45]",
                    i !== orders.length - 1 && "border-b border-[#1E3050]",
                  )}
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-[#F7F5F0]">{order.vendorName}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{order.vendorEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={order.status as OrderStatus} size="sm" />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-[#94A3B8]">{order.totalItems} items</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                      <Clock className="w-3 h-3" />
                      {formatTime(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {order.sentAt ? (
                      <div className="flex items-center gap-1.5 text-xs text-[#60A5FA]">
                        <Send className="w-3 h-3" />
                        {formatTime(order.sentAt)}
                      </div>
                    ) : (
                      <span className="text-xs text-[#374151]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {order.confirmedAt ? (
                      <span className="text-xs text-[#34D399]">{formatTime(order.confirmedAt)}</span>
                    ) : (
                      <span className="text-xs text-[#374151]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#F59E0B] transition-colors"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
