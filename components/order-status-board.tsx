"use client"

import { useState } from "react"
import { Send, CheckCircle2, Clock, Package, MoreHorizontal, ChevronRight } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"
import type { Order, OrderStatus } from "@/lib/db"
import { cn } from "@/lib/utils"

// Extended type for demo / dashboard usage — real DB will JOIN on items
export type DisplayOrder = Order & {
  vendorName: string
  vendorEmail: string
  totalItems: number
  sentAt?: string
  confirmedAt?: string
}

interface OrderStatusBoardProps {
  orders: DisplayOrder[]
  onSendOrder?: (orderId: string) => void
}

function countByStatus(orders: DisplayOrder[]): Record<OrderStatus, number> {
  return {
    draft:     orders.filter((o) => o.status === "draft").length,
    sent:      orders.filter((o) => o.status === "sent").length,
    partial:   orders.filter((o) => o.status === "partial").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }
}

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function OrderCard({ order, onSend }: { order: DisplayOrder; onSend?: (id: string) => void }) {
  const [sending, setSending] = useState(false)

  async function handleSend() {
    setSending(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSending(false)
    onSend?.(order.id)
  }

  const borderColor =
    order.status === "confirmed" ? "border-[rgba(16,185,129,0.2)]"
    : order.status === "delivered" ? "border-[rgba(139,92,246,0.2)]"
    : order.status === "sent" ? "border-[rgba(59,130,246,0.2)]"
    : "border-[#1E3050]"

  return (
    <div className={cn("bg-[#162236] border rounded-xl p-4 transition-all hover:border-[#2A4060] group", borderColor)}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-[#F7F5F0] truncate">{order.vendorName}</h3>
          <p className="text-xs text-[#64748B] mt-0.5 truncate">{order.vendorEmail}</p>
        </div>
        <StatusBadge status={order.status as OrderStatus} size="sm" />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <Package className="w-3 h-3" />
          <span>{order.totalItems} items</span>
        </div>
        {order.sentAt && (
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Clock className="w-3 h-3" />
            <span>Sent {formatRelativeTime(order.sentAt)}</span>
          </div>
        )}
        {order.confirmedAt && (
          <div className="flex items-center gap-1.5 text-xs text-[#10B981]">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex gap-1">
          {(["draft", "sent", "confirmed", "delivered"] as const).map((s, i) => {
            const steps = ["draft", "sent", "confirmed", "delivered"]
            const isCompleted = i <= steps.indexOf(order.status)
            const colors: Record<string, string> = {
              draft:     "bg-[#475569]",
              sent:      "bg-[#3B82F6]",
              partial:   "bg-[#F59E0B]",
              confirmed: "bg-[#10B981]",
              delivered: "bg-[#8B5CF6]",
            }
            return (
              <div
                key={s}
                className={cn("h-1 flex-1 rounded-full transition-all", isCompleted ? colors[order.status] : "bg-[#1E3050]")}
              />
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        {order.status === "draft" ? (
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-1.5 text-xs font-medium text-[#F59E0B] hover:text-[#D97706] transition-colors disabled:opacity-60"
          >
            {sending ? (
              <div className="w-3 h-3 border border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
            {sending ? "Sending..." : "Send Order"}
          </button>
        ) : (
          <span className="text-xs text-[#475569]">
            {order.status === "delivered" ? "Completed" : "Awaiting response"}
          </span>
        )}
        <button className="text-[#475569] hover:text-[#94A3B8] transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export function OrderStatusBoard({ orders, onSendOrder }: OrderStatusBoardProps) {
  const counts = countByStatus(orders)
  const today  = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  const columns: { status: OrderStatus; label: string; icon: React.ReactNode; accent: string }[] = [
    { status: "draft",     label: "Draft",     icon: <Clock        className="w-3.5 h-3.5 text-[#94A3B8]" />, accent: "#475569" },
    { status: "sent",      label: "Sent",      icon: <Send         className="w-3.5 h-3.5 text-[#60A5FA]" />, accent: "#3B82F6" },
    { status: "confirmed", label: "Confirmed", icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />, accent: "#10B981" },
    { status: "delivered", label: "Delivered", icon: <Package      className="w-3.5 h-3.5 text-[#A78BFA]" />, accent: "#8B5CF6" },
  ]

  return (
    <div className="bg-[#0D1825] border border-[#1E3050] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#1E3050] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-medium text-[#10B981]">Live</span>
          </div>
          <h2 className="text-base font-semibold text-[#F7F5F0]">Today&apos;s Order Status Board</h2>
          <p className="text-xs text-[#64748B] mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <span className="font-medium text-[#F7F5F0]">{orders.length}</span> vendors
          </div>
          <div className="h-4 w-px bg-[#1E3050]" />
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <span className="font-medium text-[#10B981]">{counts.confirmed + counts.delivered}</span> confirmed
          </div>
          <a href="/orders/new" className="flex items-center gap-1.5 text-xs font-medium text-[#F59E0B] hover:text-[#D97706] transition-colors">
            New Order <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-4 divide-x divide-[#1E3050]">
        {columns.map(({ status, label, icon, accent }) => {
          const colOrders = orders.filter((o) => o.status === status)
          return (
            <div key={status} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="text-xs font-medium text-[#94A3B8]">{label}</span>
                </div>
                <span
                  className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${accent}20`, color: accent }}
                >
                  {colOrders.length}
                </span>
              </div>

              <div className="space-y-3">
                {colOrders.map((order) => (
                  <OrderCard key={order.id} order={order} onSend={onSendOrder} />
                ))}
                {colOrders.length === 0 && (
                  <div className="h-24 flex items-center justify-center rounded-xl border border-dashed border-[#1E3050] text-xs text-[#374151]">
                    No orders
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
