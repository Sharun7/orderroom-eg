"use client"

import { useState } from "react"
import { TrendingUp, Users, ShoppingCart, CheckCircle, ArrowRight, Zap, Clock, RefreshCw, Package, ClipboardList } from "lucide-react"
import { TopBar } from "@/components/top-bar"
import { OrderStatusBoard, type DisplayOrder } from "@/components/order-status-board"
import Link from "next/link"

type DynamoEvent = {
  orderId: string
  eventType: string
  timestamp: string
  data?: Record<string, unknown>
}

export default function DashboardClient({
  vendorCount,
  ordersCount,
  confirmedCount,
  pendingCount,
  orders,
  recentEvents,
}: {
  vendorCount: number
  ordersCount: number
  confirmedCount: number
  pendingCount: number
  orders: DisplayOrder[]
  recentEvents: DynamoEvent[]
}) {
  const statCards = [
    { label: "Active Vendors", value: vendorCount.toString(), change: "in your network", icon: Users, iconColor: "text-[#60A5FA]", iconBg: "bg-[rgba(59,130,246,0.12)]" },
    { label: "Orders Today", value: ordersCount.toString(), change: `${pendingCount} pending`, icon: ShoppingCart, iconColor: "text-[#F59E0B]", iconBg: "bg-[rgba(245,158,11,0.12)]" },
    { label: "Confirmed", value: confirmedCount.toString(), change: `${confirmedCount}/${ordersCount} items`, icon: CheckCircle, iconColor: "text-[#34D399]", iconBg: "bg-[rgba(16,185,129,0.12)]" },
    { label: "Avg. Response", value: "52m", change: "vendor average", icon: TrendingUp, iconColor: "text-[#A78BFA]", iconBg: "bg-[rgba(139,92,246,0.12)]" },
  ]

  const [orderList] = useState<DisplayOrder[]>(orders)

  function handleSendOrder() {
    // Placeholder for order send action
  }

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title="Dashboard"
        subtitle={`Good morning. ${pendingCount > 0 ? `${pendingCount} order${pendingCount > 1 ? "s" : ""} waiting for confirmation.` : "All orders confirmed."}`}
        actions={
          <Link
            href="/orders/new"
            className="flex items-center gap-2 h-8 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-xs font-semibold rounded-lg transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            New Order
          </Link>
        }
      />

      <div className="top-accent-line flex-1 p-6 space-y-6 fade-in">
        {/* Stat cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.label} className="stat-card-glow bg-[#162236] border border-[#1E3050] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#64748B] mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-[#F7F5F0] count-up font-variant-numeric: tabular-nums">{card.value}</p>
                  <p className="text-xs text-[#64748B] mt-1">{card.change}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick action banner */}
        {pendingCount > 0 && (
          <div className="bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)] rounded-xl px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[rgba(245,158,11,0.15)] flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#F7F5F0]">
                  {pendingCount} item{pendingCount > 1 ? "s" : ""} awaiting confirmation
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">Resend reminders to vendors</p>
              </div>
            </div>
            <button
              onClick={handleSendOrder}
              className="flex items-center gap-2 h-8 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-xs font-semibold rounded-lg transition-colors"
            >
              Remind <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.label} className="bg-[#162236] border border-[#1E3050] rounded-xl p-5 hover:border-[#2A4060] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-[#64748B] font-medium">{card.label}</span>
                  <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#F7F5F0]">{card.value}</div>
                <div className="text-xs text-[#64748B] mt-1">{card.change}</div>
              </div>
            )
          })}
        </div>

        {/* Status board */}
        <OrderStatusBoard orders={orderList} onSendOrder={handleSendOrder} />

        {/* Bottom panels */}
        <div className="grid grid-cols-3 gap-4">
          {/* Quick actions */}
          <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#F7F5F0] mb-4">Quick Actions</h3>
            <div className="space-y-1.5">
              {[
                { label: "New daily order", href: "/orders/new", icon: Zap, color: "text-[#F59E0B]", bg: "bg-[rgba(245,158,11,0.1)]" },
                { label: "Manage vendors", href: "/vendors", icon: Users, color: "text-[#60A5FA]", bg: "bg-[rgba(59,130,246,0.1)]" },
                { label: "View all orders", href: "/orders", icon: ClipboardList, color: "text-[#34D399]", bg: "bg-[rgba(16,185,129,0.1)]" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1E2F45] group transition-colors">
                    <div className={`w-7 h-7 rounded-md ${item.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                    </div>
                    <span className="text-sm text-[#94A3B8] group-hover:text-[#F7F5F0] transition-colors">{item.label}</span>
                    <ArrowRight className="w-3 h-3 text-[#374151] group-hover:text-[#64748B] ml-auto transition-colors" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Today's summary */}
          <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#F7F5F0] mb-4">Today&apos;s Summary</h3>
            <div className="space-y-3">
              {[
                { label: "Total items ordered", value: ordersCount, color: "text-[#F7F5F0]" },
                { label: "Items confirmed", value: confirmedCount, color: "text-[#34D399]" },
                { label: "Items pending", value: pendingCount, color: "text-[#F59E0B]" },
                { label: "Vendors contacted", value: vendorCount, color: "text-[#60A5FA]" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent events */}
          <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#F7F5F0] mb-4">Recent Activity</h3>
            <div className="space-y-2 text-xs">
              {recentEvents.slice(0, 5).map((event, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  <p className="text-[#94A3B8]">
                    {event.eventType === "ORDER_SENT" && "Order sent"}
                    {event.eventType === "VENDOR_CONFIRMED" && "Vendor confirmed"}
                    {event.eventType === "VENDOR_REJECTED" && "Vendor rejected"}
                    {event.eventType === "ITEM_DELIVERED" && "Item delivered"}
                  </p>
                </div>
              ))}
              {recentEvents.length === 0 && (
                <p className="text-[#374151]">No activity yet today</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
