"use client"

import { use, useState } from "react"
import { CheckCircle2, Package, Calendar, Zap, XCircle, AlertCircle } from "lucide-react"

const MOCK_ORDER = {
  id: "o2",
  vendorName: "Prime Cuts Meats",
  businessName: "The Harbor Restaurant",
  deliveryDate: new Date().toISOString().split("T")[0],
  items: [
    { id: "i1", name: "Beef Tenderloin", quantity: 5,  unit: "kg" },
    { id: "i2", name: "Chicken Breast",  quantity: 10, unit: "kg" },
    { id: "i3", name: "Pork Ribs",       quantity: 4,  unit: "kg" },
  ],
  notes: "Please deliver between 6–8am, use side entrance.",
}

function ConfirmPageInner({ token }: { token: string }) {
  const [status, setStatus] = useState<"pending" | "confirming" | "confirmed" | "declined">("pending")
  const [declineReason, setDeclineReason] = useState("")
  const [showDeclineForm, setShowDeclineForm] = useState(false)

  const order = MOCK_ORDER
  const fmtDate = new Date(order.deliveryDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  async function handleConfirm() {
    setStatus("confirming")
    await new Promise((r) => setTimeout(r, 1000))
    setStatus("confirmed")
  }

  async function handleDecline() {
    setStatus("declined")
    setShowDeclineForm(false)
  }

  if (status === "confirmed") {
    return (
      <div className="min-h-screen bg-[#0F1B2D] flex items-center justify-center p-6">
        <div className="text-center max-w-sm fade-in">
          <div className="w-20 h-20 rounded-full bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
          </div>
          <h1 className="text-2xl font-semibold text-[#F7F5F0] mb-2">Order Confirmed</h1>
          <p className="text-sm text-[#64748B] leading-relaxed mb-6">
            Thank you. <span className="text-[#F7F5F0] font-medium">{order.businessName}</span> has been notified and the event has been logged.
          </p>
          <div className="space-y-2 text-left">
            <div className="bg-[#162236] border border-[#1E3050] rounded-xl px-5 py-4">
              <p className="text-xs text-[#64748B] mb-1">Delivery date</p>
              <p className="text-sm font-medium text-[#F7F5F0]">{fmtDate}</p>
            </div>
            <div className="bg-[#162236] border border-[rgba(16,185,129,0.15)] rounded-xl px-5 py-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <p className="text-xs text-[#34D399]">Event logged to DynamoDB — <span className="font-mono">VENDOR_CONFIRMED</span></p>
            </div>
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
          <div className="w-20 h-20 rounded-full bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.15)] flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-[#EF4444]" />
          </div>
          <h1 className="text-2xl font-semibold text-[#F7F5F0] mb-2">Order Declined</h1>
          <p className="text-sm text-[#64748B] leading-relaxed mb-4">
            You&apos;ve declined this order. <span className="text-[#F7F5F0] font-medium">{order.businessName}</span> has been notified.
          </p>
          {declineReason && (
            <div className="bg-[#162236] border border-[#1E3050] rounded-xl px-4 py-3 text-left mb-4">
              <p className="text-xs text-[#64748B] mb-1">Your reason</p>
              <p className="text-sm text-[#94A3B8]">{declineReason}</p>
            </div>
          )}
          <div className="bg-[#162236] border border-[rgba(239,68,68,0.15)] rounded-xl px-5 py-3 flex items-center gap-2 text-left">
            <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            <p className="text-xs text-[#F87171]">Event logged to DynamoDB — <span className="font-mono">VENDOR_REJECTED</span></p>
          </div>
          <p className="text-xs text-[#374151] mt-6">Powered by OrderRoom</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F1B2D] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md fade-in">
        {/* Branding */}
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-[#0F1B2D]" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-[#F7F5F0] text-sm">OrderRoom</span>
        </div>

        <div className="bg-[#162236] border border-[#1E3050] rounded-2xl overflow-hidden shadow-xl">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#1E3050] bg-[#0D1825]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-[#64748B] uppercase tracking-wider mb-1">Order request from</p>
                <h1 className="text-lg font-semibold text-[#F7F5F0]">{order.businessName}</h1>
                <p className="text-sm text-[#64748B] mt-0.5">To: <span className="text-[#94A3B8]">{order.vendorName}</span></p>
              </div>
              <div className="bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] rounded-lg px-3 py-1.5 text-right flex-shrink-0">
                <p className="text-[10px] text-[#64748B]">Ref</p>
                <p className="text-xs font-mono text-[#F59E0B]">{token.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Delivery date */}
          <div className="px-6 py-3.5 border-b border-[#1E3050] flex items-center gap-3 bg-[rgba(59,130,246,0.04)]">
            <Calendar className="w-4 h-4 text-[#60A5FA] flex-shrink-0" />
            <div>
              <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Requested delivery</p>
              <p className="text-sm font-medium text-[#F7F5F0]">{fmtDate}</p>
            </div>
          </div>

          {/* Items */}
          <div className="px-6 py-5 border-b border-[#1E3050]">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""} requested
            </p>
            <div className="space-y-2.5">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-1">
                  <div className="w-8 h-8 rounded-lg bg-[#1E2F45] flex items-center justify-center flex-shrink-0">
                    <Package className="w-3.5 h-3.5 text-[#64748B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F7F5F0]">{item.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#F7F5F0]">{item.quantity}</p>
                    <p className="text-xs text-[#64748B]">{item.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="px-6 py-4 border-b border-[#1E3050] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#F59E0B] mb-1">Note from buyer</p>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="px-6 py-5 space-y-3">
            <button
              onClick={handleConfirm}
              disabled={status === "confirming"}
              className="w-full h-12 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {status === "confirming"
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <CheckCircle2 className="w-4.5 h-4.5" />
              }
              {status === "confirming" ? "Confirming…" : "Confirm Order"}
            </button>

            {!showDeclineForm ? (
              <button
                onClick={() => setShowDeclineForm(true)}
                className="w-full h-10 border border-[#1E3050] text-[#64748B] hover:text-[#EF4444] hover:border-[rgba(239,68,68,0.3)] text-sm font-medium rounded-xl transition-colors"
              >
                Cannot fulfill — Decline
              </button>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="Optional: reason for declining…"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0F1B2D] border border-[rgba(239,68,68,0.3)] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#EF4444] transition-colors resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => setShowDeclineForm(false)} className="flex-1 h-9 border border-[#1E3050] text-[#64748B] text-sm rounded-lg hover:bg-[#1E2F45] transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleDecline} className="flex-1 h-9 bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] text-[#F87171] text-sm font-medium rounded-lg hover:bg-[rgba(239,68,68,0.25)] transition-colors">
                    Confirm Decline
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-xs text-[#374151]">No account required to confirm</p>
          <p className="text-xs text-[#374151]">Powered by <span className="text-[#64748B]">OrderRoom</span></p>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  return <ConfirmPageInner token={token} />
}
