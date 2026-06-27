"use client"

import { useState } from "react"
import { TrendingUp, Users, ShoppingCart, CheckCircle, ArrowRight, Zap } from "lucide-react"
import { TopBar } from "@/components/top-bar"
import { OrderStatusBoard } from "@/components/order-status-board"
import { MOCK_ORDERS } from "@/lib/db"
import type { Order, OrderStatus } from "@/lib/db"
import Link from "next/link"

const STAT_CARDS = [
  {
    label: "Active Vendors",
    value: "5",
    change: "+1 this week",
    icon: Users,
    iconColor: "text-[#60A5FA]",
    iconBg: "bg-[rgba(59,130,246,0.12)]",
  },
  {
    label: "Orders Today",
    value: "5",
    change: "2 pending",
    icon: ShoppingCart,
    iconColor: "text-[#F59E0B]",
    iconBg: "bg-[rgba(245,158,11,0.12)]",
  },
  {
    label: "Confirmed",
    value: "3",
    change: "60% confirmation rate",
    icon: CheckCircle,
    iconColor: "text-[#34D399]",
    iconBg: "bg-[rgba(16,185,129,0.12)]",
  },
  {
    label: "Avg. Order Time",
    value: "52s",
    change: "-8s vs last week",
    icon: TrendingUp,
    iconColor: "text-[#A78BFA]",
    iconBg: "bg-[rgba(139,92,246,0.12)]",
  },
]

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)

  function handleSendOrder(orderId: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "sent" as OrderStatus, sentAt: new Date().toISOString() }
          : o,
      ),
    )
  }

  const pendingCount = orders.filter((o) => o.status === "pending").length

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title="Dashboard"
        subtitle={`Good morning, Alex. ${pendingCount > 0 ? `${pendingCount} order${pendingCount > 1 ? "s" : ""} waiting to be sent.` : "All orders are on track."}`}
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

      <div className="flex-1 p-6 space-y-6 fade-in">
        {/* Quick send banner */}
        {pendingCount > 0 && (
          <div className="bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)] rounded-xl px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[rgba(245,158,11,0.15)] flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#F7F5F0]">
                  {pendingCount} order{pendingCount > 1 ? "s" : ""} ready to send
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">Send all pending orders to vendors in one click</p>
              </div>
            </div>
            <button
              onClick={() => orders.filter((o) => o.status === "pending").forEach((o) => handleSendOrder(o.id))}
              className="flex items-center gap-2 h-8 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-xs font-semibold rounded-lg transition-colors"
            >
              Send all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className="bg-[#162236] border border-[#1E3050] rounded-xl p-5 hover:border-[#2A4060] transition-colors"
              >
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

        {/* Main status board */}
        <OrderStatusBoard orders={orders} onSendOrder={handleSendOrder} />

        {/* Recent activity */}
        <div className="grid grid-cols-3 gap-4">
          {/* Quick actions */}
          <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#F7F5F0] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "Add new vendor", href: "/vendors", color: "text-[#60A5FA]" },
                { label: "Add products", href: "/products", color: "text-[#F59E0B]" },
                { label: "Place order", href: "/orders/new", color: "text-[#34D399]" },
                { label: "View all orders", href: "/orders", color: "text-[#A78BFA]" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between py-2 border-b border-[#1E3050] last:border-0 group"
                >
                  <span className={`text-sm ${item.color} group-hover:underline`}>{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#374151] group-hover:text-[#64748B] transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Today's summary */}
          <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#F7F5F0] mb-4">Today&apos;s Summary</h3>
            <div className="space-y-3">
              {[
                { label: "Total vendors contacted", value: orders.length, color: "text-[#F7F5F0]" },
                { label: "Emails sent", value: orders.filter((o) => o.sentAt).length, color: "text-[#60A5FA]" },
                { label: "Confirmations received", value: orders.filter((o) => o.confirmedAt).length, color: "text-[#34D399]" },
                { label: "Deliveries completed", value: orders.filter((o) => o.status === "delivered").length, color: "text-[#A78BFA]" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming deliveries */}
          <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#F7F5F0] mb-4">Upcoming Deliveries</h3>
            <div className="space-y-3">
              {orders
                .filter((o) => o.status === "confirmed" || o.status === "delivered")
                .map((order) => (
                  <div key={order.id} className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        order.status === "delivered" ? "bg-[#A78BFA]" : "bg-[#34D399]"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#F7F5F0] truncate">{order.vendorName}</p>
                      <p className="text-[10px] text-[#64748B]">{order.totalItems} items</p>
                    </div>
                    <span className={`text-[10px] font-medium ${order.status === "delivered" ? "text-[#A78BFA]" : "text-[#34D399]"}`}>
                      {order.status === "delivered" ? "Done" : "ETA Today"}
                    </span>
                  </div>
                ))}
              {orders.filter((o) => o.status === "confirmed" || o.status === "delivered").length === 0 && (
                <p className="text-xs text-[#374151]">No confirmed deliveries yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
