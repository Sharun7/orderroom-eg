"use client"

import { useState } from "react"
import { CheckCircle2, Package, Calendar, Zap, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock order data — in production, fetch from Aurora PostgreSQL by token
const MOCK_ORDER = {
  id: "o2",
  vendorName: "Prime Cuts Meats",
  businessName: "The Harbor Restaurant",
  deliveryDate: new Date().toISOString().split("T")[0],
  items: [
    { name: "Beef Tenderloin", quantity: 5, unit: "kg", price: 42.0 },
    { name: "Chicken Breast", quantity: 10, unit: "kg", price: 12.5 },
    { name: "Pork Ribs", quantity: 4, unit: "kg", price: 18.0 },
  ],
  notes: "Please deliver between 6–8am, use side entrance.",
}

export default function ConfirmPage({ params }: { params: { token: string } }) {
  const [status, setStatus] = useState<"pending" | "confirming" | "confirmed" | "declined">("pending")

  const order = MOCK_ORDER
  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function handleConfirm() {
    setStatus("confirming")
    // In production: POST /api/confirm with token, update Aurora + log to DynamoDB
    await new Promise((r) => setTimeout(r, 1000))
    setStatus("confirmed")
  }

  async function handleDecline() {
    setStatus("declined")
  }

  if (status === "confirmed") {
    return (
      <div className="min-h-screen bg-[#0F1B2D] flex items-center justify-center p-6">
        <div className="text-center max-w-sm fade-in">
          <div className="w-20 h-20 rounded-full bg-[rgba(16,185,129,0.15)] flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
          </div>
          <h1 className="text-2xl font-semibold text-[#F7F5F0] mb-2">Order Confirmed!</h1>
          <p className="text-sm text-[#64748B] leading-relaxed">
            Thank you for confirming. <span className="text-[#F7F5F0] font-medium">{order.businessName}</span> has been notified.
          </p>
          <div className="mt-6 bg-[#162236] border border-[rgba(16,185,129,0.2)] rounded-xl px-5 py-4 text-left">
            <p className="text-xs text-[#64748B] mb-1">Delivery date</p>
            <p className="text-sm font-medium text-[#F7F5F0]">
              {new Date(order.deliveryDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <p className="text-xs text-[#374151] mt-6">Powered by OrderRoom</p>
        </div>
      </div>
    )
  }

  if (status === "declined") {
    return (
      <div className="min-h-screen bg-[#0F1B2D] flex items-center justify-center p-6">
        <div className="text-center max-w-sm fade-in">
          <div className="w-20 h-20 rounded-full bg-[rgba(239,68,68,0.1)] flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-10 h-10 text-[#EF4444]" />
          </div>
          <h1 className="text-2xl font-semibold text-[#F7F5F0] mb-2">Order Declined</h1>
          <p className="text-sm text-[#64748B] leading-relaxed">
            You&apos;ve declined this order. <span className="text-[#F7F5F0] font-medium">{order.businessName}</span> will be notified.
          </p>
          <p className="text-xs text-[#374151] mt-8">Powered by OrderRoom</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F1B2D] flex items-center justify-center p-6">
      <div className="w-full max-w-md fade-in">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#0F1B2D]" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-[#F7F5F0] text-sm">OrderRoom</span>
        </div>

        <div className="bg-[#162236] border border-[#1E3050] rounded-2xl overflow-hidden">
          {/* Order header */}
          <div className="px-6 py-5 border-b border-[#1E3050]">
            <p className="text-xs text-[#64748B] mb-1">Order from</p>
            <h1 className="text-lg font-semibold text-[#F7F5F0]">{order.businessName}</h1>
            <p className="text-sm text-[#64748B] mt-1">
              To: <span className="text-[#F7F5F0]">{order.vendorName}</span>
            </p>
          </div>

          {/* Delivery info */}
          <div className="px-6 py-4 border-b border-[#1E3050] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#64748B]" />
            <span className="text-sm text-[#64748B]">Delivery:</span>
            <span className="text-sm font-medium text-[#F7F5F0]">
              {new Date(order.deliveryDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Items */}
          <div className="px-6 py-4 border-b border-[#1E3050]">
            <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-3">Order Items</p>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1E2F45] flex items-center justify-center flex-shrink-0">
                    <Package className="w-3.5 h-3.5 text-[#64748B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#F7F5F0]">{item.name}</p>
                    <p className="text-xs text-[#64748B]">${item.price.toFixed(2)} / {item.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#F7F5F0]">{item.quantity} {item.unit}</p>
                    <p className="text-xs text-[#64748B]">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#1E3050]">
              <span className="text-sm font-medium text-[#64748B]">Estimated Total</span>
              <span className="text-base font-bold text-[#F7F5F0]">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="px-6 py-4 border-b border-[#1E3050]">
              <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-2">Notes</p>
              <p className="text-sm text-[#94A3B8] leading-relaxed">{order.notes}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="px-6 py-5 space-y-3">
            <button
              onClick={handleConfirm}
              disabled={status === "confirming"}
              className="w-full h-11 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {status === "confirming" ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4.5 h-4.5" />
              )}
              {status === "confirming" ? "Confirming..." : "Confirm Order"}
            </button>
            <button
              onClick={handleDecline}
              className="w-full h-10 border border-[#1E3050] text-[#64748B] hover:text-[#EF4444] hover:border-[rgba(239,68,68,0.3)] text-sm font-medium rounded-xl transition-colors"
            >
              Decline Order
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#374151] mt-5">
          Powered by <span className="text-[#64748B]">OrderRoom</span> — No account required to confirm
        </p>
      </div>
    </div>
  )
}
