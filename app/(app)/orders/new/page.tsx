"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  Package,
  Minus,
  Plus,
  Send,
  Check,
  X,
  Calendar,
  FileText,
  Zap,
} from "lucide-react"
import { TopBar } from "@/components/top-bar"
import { MOCK_VENDORS, MOCK_PRODUCTS, type Vendor, type Product } from "@/lib/db"
import { cn } from "@/lib/utils"

interface CartItem {
  product: Product
  quantity: number
}

interface VendorCart {
  vendor: Vendor
  items: CartItem[]
}

type Step = "select-vendors" | "set-quantities" | "review"

export default function NewOrderPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("select-vendors")
  const [selectedVendorIds, setSelectedVendorIds] = useState<Set<string>>(new Set())
  const [vendorCarts, setVendorCarts] = useState<VendorCart[]>([])
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const activeVendors = MOCK_VENDORS.filter((v) => v.isActive)

  function toggleVendor(vendor: Vendor) {
    setSelectedVendorIds((prev) => {
      const next = new Set(prev)
      if (next.has(vendor.id)) {
        next.delete(vendor.id)
      } else {
        next.add(vendor.id)
      }
      return next
    })
  }

  function proceedToQuantities() {
    const carts: VendorCart[] = []
    selectedVendorIds.forEach((vid) => {
      const vendor = MOCK_VENDORS.find((v) => v.id === vid)!
      const products = MOCK_PRODUCTS.filter((p) => p.vendorId === vid && p.isActive)
      if (products.length > 0) {
        carts.push({
          vendor,
          items: products.map((p) => ({ product: p, quantity: p.defaultQuantity })),
        })
      }
    })
    setVendorCarts(carts)
    setStep("set-quantities")
  }

  function updateQuantity(vendorId: string, productId: string, delta: number) {
    setVendorCarts((prev) =>
      prev.map((vc) =>
        vc.vendor.id === vendorId
          ? {
              ...vc,
              items: vc.items.map((item) =>
                item.product.id === productId
                  ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                  : item,
              ),
            }
          : vc,
      ),
    )
  }

  function setQuantity(vendorId: string, productId: string, value: number) {
    setVendorCarts((prev) =>
      prev.map((vc) =>
        vc.vendor.id === vendorId
          ? {
              ...vc,
              items: vc.items.map((item) =>
                item.product.id === productId
                  ? { ...item, quantity: Math.max(0, value) }
                  : item,
              ),
            }
          : vc,
      ),
    )
  }

  async function handleSendOrders() {
    setSending(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSent(true)
    setSending(false)
    setTimeout(() => router.push("/dashboard"), 1800)
  }

  const totalOrders = vendorCarts.length
  const totalItems = vendorCarts.reduce((sum, vc) => sum + vc.items.filter((i) => i.quantity > 0).length, 0)

  const STEPS = [
    { key: "select-vendors", label: "Select Vendors" },
    { key: "set-quantities", label: "Set Quantities" },
    { key: "review", label: "Review & Send" },
  ]

  if (sent) {
    return (
      <div className="flex-1 flex flex-col">
        <TopBar title="New Order" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center fade-in">
            <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.15)] flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-[#10B981]" />
            </div>
            <h2 className="text-xl font-semibold text-[#F7F5F0] mb-2">Orders sent successfully!</h2>
            <p className="text-sm text-[#64748B]">
              {totalOrders} vendor email{totalOrders > 1 ? "s" : ""} sent. Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <TopBar title="New Order" subtitle="Place today's vendor orders" />

      <div className="flex-1 p-6 fade-in">
        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => {
            const stepOrder = ["select-vendors", "set-quantities", "review"]
            const currentIndex = stepOrder.indexOf(step)
            const stepIndex = stepOrder.indexOf(s.key)
            const isActive = step === s.key
            const isDone = stepIndex < currentIndex
            return (
              <div key={s.key} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                      isActive
                        ? "bg-[#F59E0B] text-[#0F1B2D]"
                        : isDone
                          ? "bg-[#10B981] text-[#0F1B2D]"
                          : "bg-[#1E2F45] text-[#64748B]",
                    )}
                  >
                    {isDone ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isActive ? "text-[#F7F5F0]" : isDone ? "text-[#64748B]" : "text-[#374151]",
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-[#374151] mx-1" />}
              </div>
            )
          })}
        </div>

        {/* Step 1: Select vendors */}
        {step === "select-vendors" && (
          <div className="max-w-2xl space-y-4">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[#F7F5F0]">Which vendors are you ordering from today?</h2>
              <p className="text-sm text-[#64748B] mt-1">Select all vendors you need to contact. Orders will be emailed to each vendor.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {activeVendors.map((vendor) => {
                const isSelected = selectedVendorIds.has(vendor.id)
                const productCount = MOCK_PRODUCTS.filter((p) => p.vendorId === vendor.id && p.isActive).length
                return (
                  <button
                    key={vendor.id}
                    onClick={() => toggleVendor(vendor)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                      isSelected
                        ? "border-[#F59E0B] bg-[rgba(245,158,11,0.08)]"
                        : "border-[#1E3050] bg-[#162236] hover:border-[#2A4060]",
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors",
                        isSelected ? "bg-[#F59E0B] border-[#F59E0B]" : "border-[#374151]",
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-[#0F1B2D]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F7F5F0] truncate">{vendor.name}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{productCount} products · {vendor.category}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (selectedVendorIds.size === activeVendors.length) {
                    setSelectedVendorIds(new Set())
                  } else {
                    setSelectedVendorIds(new Set(activeVendors.map((v) => v.id)))
                  }
                }}
                className="text-xs text-[#F59E0B] hover:underline"
              >
                {selectedVendorIds.size === activeVendors.length ? "Deselect all" : "Select all"}
              </button>
              <span className="text-xs text-[#64748B]">{selectedVendorIds.size} selected</span>
              <div className="flex-1" />
              <button
                onClick={proceedToQuantities}
                disabled={selectedVendorIds.size === 0}
                className="flex items-center gap-2 h-9 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Set quantities */}
        {step === "set-quantities" && (
          <div className="max-w-3xl space-y-5">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[#F7F5F0]">Adjust quantities for each vendor</h2>
              <p className="text-sm text-[#64748B] mt-1">Default quantities are pre-filled. Set to 0 to skip an item.</p>
            </div>

            {vendorCarts.map((vc) => (
              <div key={vc.vendor.id} className="bg-[#162236] border border-[#1E3050] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#1E3050] flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1E2F45] flex items-center justify-center text-xs font-semibold text-[#F7F5F0] flex-shrink-0">
                    {vc.vendor.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="text-sm font-semibold text-[#F7F5F0]">{vc.vendor.name}</h3>
                  <span className="text-xs text-[#64748B]">→ {vc.vendor.email}</span>
                </div>
                <div className="p-4 space-y-3">
                  {vc.items.map((item) => (
                    <div
                      key={item.product.id}
                      className={cn(
                        "flex items-center gap-4 py-2 transition-opacity",
                        item.quantity === 0 && "opacity-40",
                      )}
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#1E2F45] flex items-center justify-center flex-shrink-0">
                        <Package className="w-3.5 h-3.5 text-[#64748B]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#F7F5F0] truncate">{item.product.name}</p>
                        {item.product.pricePerUnit && (
                          <p className="text-xs text-[#64748B]">
                            ${item.product.pricePerUnit.toFixed(2)} / {item.product.unit}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(vc.vendor.id, item.product.id, -1)}
                          className="w-7 h-7 rounded-lg bg-[#1E2F45] hover:bg-[#253650] flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5 text-[#94A3B8]" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={item.quantity}
                          onChange={(e) => setQuantity(vc.vendor.id, item.product.id, Number(e.target.value))}
                          className="w-14 h-7 text-center rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-sm text-[#F7F5F0] focus:outline-none focus:border-[#F59E0B] transition-colors"
                        />
                        <button
                          onClick={() => updateQuantity(vc.vendor.id, item.product.id, 1)}
                          className="w-7 h-7 rounded-lg bg-[#1E2F45] hover:bg-[#253650] flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#94A3B8]" />
                        </button>
                        <span className="text-xs text-[#64748B] w-7">{item.product.unit}</span>
                      </div>
                      {item.product.pricePerUnit && item.quantity > 0 && (
                        <span className="text-xs font-medium text-[#F7F5F0] w-16 text-right">
                          ${(item.product.pricePerUnit * item.quantity).toFixed(2)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep("select-vendors")}
                className="h-9 px-5 border border-[#1E3050] text-[#94A3B8] text-sm font-medium rounded-lg hover:bg-[#1E2F45] transition-colors"
              >
                Back
              </button>
              <div className="flex-1" />
              <button
                onClick={() => setStep("review")}
                className="flex items-center gap-2 h-9 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-sm font-semibold rounded-lg transition-colors"
              >
                Review Orders <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Send */}
        {step === "review" && (
          <div className="max-w-2xl space-y-5">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[#F7F5F0]">Review and send orders</h2>
              <p className="text-sm text-[#64748B] mt-1">
                {totalOrders} order emails will be sent. Vendors can confirm with a single click.
              </p>
            </div>

            {/* Order summary cards */}
            {vendorCarts.map((vc) => {
              const activeItems = vc.items.filter((i) => i.quantity > 0)
              const subtotal = activeItems.reduce(
                (sum, i) => sum + (i.product.pricePerUnit ?? 0) * i.quantity,
                0,
              )
              return (
                <div key={vc.vendor.id} className="bg-[#162236] border border-[#1E3050] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#1E2F45] flex items-center justify-center text-xs font-semibold text-[#F7F5F0]">
                        {vc.vendor.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#F7F5F0]">{vc.vendor.name}</p>
                        <p className="text-xs text-[#64748B]">{vc.vendor.email}</p>
                      </div>
                    </div>
                    {subtotal > 0 && (
                      <span className="text-sm font-semibold text-[#F7F5F0]">${subtotal.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {activeItems.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between text-xs">
                        <span className="text-[#94A3B8]">{item.product.name}</span>
                        <span className="text-[#F7F5F0] font-medium">
                          {item.quantity} {item.product.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Delivery & notes */}
            <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-5 space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] mb-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="h-9 px-3 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm focus:outline-none focus:border-[#F59E0B] transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] mb-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Notes to vendors (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please deliver between 6–8am, use side entrance"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] transition-colors resize-none"
                />
              </div>
            </div>

            {/* Email preview note */}
            <div className="bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.2)] rounded-xl p-4">
              <p className="text-xs text-[#60A5FA]">
                <span className="font-semibold">How it works:</span> Each vendor receives a clear order email with a &ldquo;Confirm Order&rdquo; button. One click confirms — no account required.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("set-quantities")}
                className="flex items-center gap-1.5 h-10 px-5 border border-[#1E3050] text-[#94A3B8] text-sm font-medium rounded-lg hover:bg-[#1E2F45] transition-colors"
              >
                <X className="w-4 h-4" /> Back
              </button>
              <div className="flex-1" />
              <button
                onClick={handleSendOrders}
                disabled={sending}
                className="flex items-center gap-2 h-10 px-6 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0F1B2D] border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send {totalOrders} Order{totalOrders > 1 ? "s" : ""}
                    <span className="text-[10px] font-normal opacity-70 ml-1">({totalItems} items)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
