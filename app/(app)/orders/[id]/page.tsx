"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Send, CheckCircle2, Package, ExternalLink, Copy } from "lucide-react"
import Link from "next/link"
import { TopBar } from "@/components/top-bar"
import { StatusBadge } from "@/components/status-badge"
import { EventLog } from "@/components/event-log"
import type { DisplayOrder } from "@/components/order-status-board"
import type { OrderStatus } from "@/lib/db"
import { cn } from "@/lib/utils"

// Demo seed data — matches the DisplayOrder (Prisma Order + display fields)
const SEED_ORDERS: DisplayOrder[] = [
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
]

// Static demo items for the detail view
const DEMO_ITEMS = [
  { id: "i1", name: "Beef Tenderloin",  quantity: 5,  unit: "kg" },
  { id: "i2", name: "Chicken Breast",   quantity: 10, unit: "kg" },
  { id: "i3", name: "Pork Ribs",        quantity: 4,  unit: "kg" },
]


export default function OrderDetailPage() {
  const params  = useParams()
  const orderId = params.id as string
  const [copied, setCopied] = useState(false)

  const order = SEED_ORDERS.find((o) => o.id === orderId) ?? SEED_ORDERS[1]
  const confirmToken = `tok_${order.id}`
  const confirmUrl   = `${typeof window !== "undefined" ? window.location.origin : ""}/confirm/${confirmToken}`

  function copyLink() {
    navigator.clipboard.writeText(confirmUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
    { key: "draft",     label: "Created"          },
    { key: "sent",      label: "Email Sent"        },
    { key: "confirmed", label: "Vendor Confirmed"  },
    { key: "delivered", label: "Delivered"         },
  ]
  const stepKeys  = STATUS_STEPS.map((s) => s.key)
  const currentIdx = stepKeys.indexOf(order.status as OrderStatus)

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title="Order Detail"
        subtitle={`#${order.id.toUpperCase()} · ${order.vendorName}`}
        actions={
          <Link
            href="/orders"
            className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#94A3B8] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
        }
      />

      <div className="flex-1 p-6 fade-in">
        <div className="max-w-4xl grid grid-cols-3 gap-5">
          {/* Left: order info + items */}
          <div className="col-span-2 space-y-5">
            {/* Header card */}
            <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-[#F7F5F0]">{order.vendorName}</h2>
                  <p className="text-sm text-[#64748B] mt-0.5">{order.vendorEmail}</p>
                </div>
                <StatusBadge status={order.status as OrderStatus} size="md" />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1E3050]">
                <div>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-wider mb-1">Delivery Date</p>
                  <p className="text-sm font-medium text-[#F7F5F0]">
                    {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-wider mb-1">Created</p>
                  <p className="text-sm font-medium text-[#F7F5F0]">
                    {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-wider mb-1">Total Items</p>
                  <p className="text-sm font-medium text-[#F7F5F0]">{order.totalItems} products</p>
                </div>
              </div>
            </div>

            {/* Items table */}
            <div className="bg-[#162236] border border-[#1E3050] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1E3050]">
                <h3 className="text-sm font-semibold text-[#F7F5F0]">Order Items</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1E3050]">
                    <th className="text-left text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Product</th>
                    <th className="text-right text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-4 py-3">Qty</th>
                    <th className="text-right text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_ITEMS.map((item, i) => (
                    <tr
                      key={item.id}
                      className={cn("hover:bg-[#1E2F45] transition-colors", i !== DEMO_ITEMS.length - 1 && "border-b border-[#1E3050]")}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#1E2F45] flex items-center justify-center">
                            <Package className="w-3.5 h-3.5 text-[#64748B]" />
                          </div>
                          <span className="text-sm text-[#F7F5F0]">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-[#94A3B8]">{item.quantity}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-xs text-[#64748B] bg-[#1E2F45] px-2 py-0.5 rounded-md">{item.unit}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* DynamoDB Event Log */}
            <EventLog orderId={order.id} pollInterval={15000} />
          </div>

          {/* Right: actions panel */}
          <div className="space-y-4">
            {/* Status progress */}
            <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-5">
              <h3 className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-3">Order Status</h3>
              <div className="space-y-2">
                {STATUS_STEPS.map(({ key, label }, i) => {
                  const isDone    = i <= currentIdx
                  const isCurrent = i === currentIdx
                  return (
                    <div key={key} className="flex items-center gap-2.5">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold",
                        isCurrent ? "bg-[#F59E0B] text-[#0F1B2D]"
                        : isDone  ? "bg-[#10B981] text-white"
                        :           "bg-[#1E2F45] text-[#374151]",
                      )}>
                        {isDone && !isCurrent ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
                      </div>
                      <span className={cn("text-xs", isDone ? "text-[#F7F5F0]" : "text-[#374151]")}>{label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Confirmation link */}
            {order.status === "sent" && (
              <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-5">
                <h3 className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-3">Confirmation Link</h3>
                <p className="text-xs text-[#64748B] mb-3">Share with vendor to confirm manually:</p>
                <div className="bg-[#0F1B2D] border border-[#1E3050] rounded-lg px-3 py-2 text-xs text-[#94A3B8] break-all mb-3">
                  /confirm/{confirmToken}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyLink}
                    className="flex-1 flex items-center justify-center gap-1.5 h-8 border border-[#1E3050] rounded-lg text-xs text-[#64748B] hover:bg-[#1E2F45] hover:text-[#94A3B8] transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <Link
                    href={`/confirm/${confirmToken}`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-1.5 h-8 border border-[#1E3050] rounded-lg text-xs text-[#64748B] hover:bg-[#1E2F45] hover:text-[#94A3B8] transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Preview
                  </Link>
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-5 space-y-2">
              <h3 className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-3">Actions</h3>
              {order.status === "draft" && (
                <button className="w-full flex items-center justify-center gap-2 h-9 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-xs font-semibold rounded-lg transition-colors">
                  <Send className="w-3.5 h-3.5" /> Send Order
                </button>
              )}
              <button className="w-full flex items-center justify-center gap-2 h-9 border border-[#1E3050] text-[#64748B] text-xs font-medium rounded-lg hover:bg-[#1E2F45] hover:text-[#94A3B8] transition-colors">
                Resend Email
              </button>
              <button className="w-full flex items-center justify-center gap-2 h-9 border border-[rgba(239,68,68,0.2)] text-[#EF4444] text-xs font-medium rounded-lg hover:bg-[rgba(239,68,68,0.08)] transition-colors">
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
