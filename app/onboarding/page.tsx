"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Zap, ArrowRight, ArrowLeft, Plus, Trash2, CheckCircle, Coffee, Hotel, UtensilsCrossed, Cake } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────
type Product = { name: string; unit: string; defaultQty: string }
type Vendor = { name: string; email: string; category: string; products: Product[] }

const VENDOR_CATEGORIES = ["Produce", "Meat & Seafood", "Dairy", "Bakery", "Beverages", "Dry Goods", "Other"]
const CATEGORY_ICONS: Record<string, typeof Coffee> = {
  Produce: UtensilsCrossed, "Meat & Seafood": UtensilsCrossed, Dairy: Coffee,
  Bakery: Cake, Beverages: Coffee, "Dry Goods": UtensilsCrossed, Other: Hotel,
}
const UNITS = ["kg", "g", "L", "ml", "pcs", "boxes", "bags", "crates", "bottles", "loaves"]

const SAMPLE_VENDORS: Vendor[] = [
  { name: "Fresh Farm Produce", email: "orders@freshfarm.io", category: "Produce", products: [{ name: "Romaine Lettuce", unit: "kg", defaultQty: "5" }, { name: "Cherry Tomatoes", unit: "kg", defaultQty: "3" }] },
  { name: "Alpine Dairy Co.", email: "supply@alpinedairy.com", category: "Dairy", products: [{ name: "Whole Milk", unit: "L", defaultQty: "20" }, { name: "Heavy Cream", unit: "L", defaultQty: "5" }] },
]

// ─── Step Progress ────────────────────────────────────────────────────────────
function StepProgress({ step, total }: { step: number; total: number }) {
  const labels = ["Welcome", "Your vendors", "First order", "Done"]
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all ${
            i < step ? "bg-[#F59E0B] text-[#0F1B2D]" : i === step ? "bg-[#F59E0B] text-[#0F1B2D] ring-2 ring-[rgba(245,158,11,0.3)] ring-offset-2 ring-offset-[#0F1B2D]" : "bg-[#162236] border border-[#1E3050] text-[#374151]"
          }`}>
            {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
          </div>
          <span className={`hidden sm:block text-xs font-medium transition-colors ${i <= step ? "text-[#94A3B8]" : "text-[#374151]"}`}>{labels[i]}</span>
          {i < total - 1 && <div className={`h-px w-6 sm:w-10 transition-colors ${i < step ? "bg-[#F59E0B]" : "bg-[#1E3050]"}`} />}
        </div>
      ))}
    </div>
  )
}

// ─── Step 0: Welcome ─────────────────────────────────────────────────────────
function WelcomeStep({ onNext }: { onNext: () => void }) {
  const businessTypes = [
    { icon: UtensilsCrossed, label: "Restaurant" },
    { icon: Hotel, label: "Hotel" },
    { icon: Coffee, label: "Café / Bar" },
    { icon: Cake, label: "Bakery" },
  ]
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="w-16 h-16 rounded-2xl bg-[rgba(245,158,11,0.12)] border border-[rgba(245,158,11,0.2)] flex items-center justify-center mx-auto mb-6">
        <Zap className="w-7 h-7 text-[#F59E0B]" />
      </div>
      <h1 className="text-2xl font-semibold text-[#F7F5F0] mb-3 tracking-tight">Welcome to OrderRoom</h1>
      <p className="text-sm text-[#64748B] leading-relaxed mb-8 max-w-sm mx-auto">
        We&apos;ll get you set up in about 5 minutes. You&apos;ll add your vendors and their products, and we&apos;ll show you how to place your first daily order.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {businessTypes.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 bg-[#162236] border border-[#1E3050] rounded-xl px-4 py-3.5 cursor-pointer hover:border-[rgba(245,158,11,0.4)] transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-[rgba(245,158,11,0.08)] flex items-center justify-center flex-shrink-0 group-hover:bg-[rgba(245,158,11,0.15)] transition-colors">
              <Icon className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <span className="text-sm font-medium text-[#94A3B8] group-hover:text-[#F7F5F0] transition-colors">{label}</span>
          </div>
        ))}
      </div>
      <button onClick={onNext} className="w-full h-11 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors">
        Let&apos;s get started <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── Step 1: Add Vendors ──────────────────────────────────────────────────────
function VendorsStep({ vendors, onChange, onNext, onBack }: { vendors: Vendor[]; onChange: (v: Vendor[]) => void; onNext: () => void; onBack: () => void }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(vendors.length > 0 ? 0 : null)
  const [newVendor, setNewVendor] = useState<Vendor>({ name: "", email: "", category: "", products: [] })
  const [adding, setAdding] = useState(vendors.length === 0)

  function addProduct() {
    setNewVendor((v) => ({ ...v, products: [...v.products, { name: "", unit: "kg", defaultQty: "" }] }))
  }
  function updateProduct(i: number, field: keyof Product, val: string) {
    setNewVendor((v) => { const p = [...v.products]; p[i] = { ...p[i], [field]: val }; return { ...v, products: p } })
  }
  function removeProduct(i: number) {
    setNewVendor((v) => ({ ...v, products: v.products.filter((_, idx) => idx !== i) }))
  }
  function saveVendor() {
    if (!newVendor.name || !newVendor.email || !newVendor.category) return
    onChange([...vendors, newVendor])
    setNewVendor({ name: "", email: "", category: "", products: [] })
    setAdding(false)
    setActiveIndex(vendors.length)
  }
  function useSample() {
    onChange(SAMPLE_VENDORS)
    setAdding(false)
    setActiveIndex(0)
  }

  const inputCls = "w-full h-9 px-3 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[rgba(245,158,11,0.3)] transition-colors"

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-7">
        <h2 className="text-xl font-semibold text-[#F7F5F0] tracking-tight">Add your vendors</h2>
        <p className="text-sm text-[#64748B] mt-1">Each vendor will receive a tailored email with their items when you place a daily order.</p>
      </div>

      {vendors.length === 0 && !adding && (
        <div className="bg-[#162236] border border-dashed border-[#1E3050] rounded-xl p-8 text-center mb-5">
          <p className="text-sm text-[#64748B] mb-4">No vendors yet. Add your first one or load sample data to explore.</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setAdding(true)} className="h-9 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] font-semibold text-sm rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" /> Add vendor
            </button>
            <button onClick={useSample} className="h-9 px-5 border border-[#1E3050] text-[#94A3B8] hover:text-[#F7F5F0] hover:border-[#2A4060] text-sm rounded-lg transition-colors">
              Load sample vendors
            </button>
          </div>
        </div>
      )}

      {/* Vendor list */}
      {vendors.length > 0 && (
        <div className="space-y-2 mb-4">
          {vendors.map((v, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${activeIndex === i ? "bg-[rgba(245,158,11,0.06)] border-[rgba(245,158,11,0.25)]" : "bg-[#162236] border-[#1E3050] hover:border-[#2A4060]"}`} onClick={() => setActiveIndex(activeIndex === i ? null : i)}>
              <div className="w-8 h-8 rounded-lg bg-[rgba(245,158,11,0.1)] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[#F59E0B]">{v.name.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F7F5F0] truncate">{v.name}</p>
                <p className="text-xs text-[#64748B] truncate">{v.email} · {v.category} · {v.products.length} product{v.products.length !== 1 ? "s" : ""}</p>
              </div>
              <CheckCircle className="w-4 h-4 text-[#34D399] flex-shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* Add vendor form */}
      {adding && (
        <div className="bg-[#162236] border border-[rgba(245,158,11,0.2)] rounded-xl p-5 mb-4 space-y-4">
          <p className="text-xs font-semibold text-[#F59E0B] uppercase tracking-wider">New vendor</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Vendor name *</label>
              <input value={newVendor.name} onChange={(e) => setNewVendor((v) => ({ ...v, name: e.target.value }))} placeholder="Fresh Farm Produce" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Vendor email *</label>
              <input type="email" value={newVendor.email} onChange={(e) => setNewVendor((v) => ({ ...v, email: e.target.value }))} placeholder="orders@vendor.com" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Category *</label>
            <select value={newVendor.category} onChange={(e) => setNewVendor((v) => ({ ...v, category: e.target.value }))} className={inputCls + " appearance-none"}>
              <option value="" disabled>Select category…</option>
              {VENDOR_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-[#94A3B8]">Products</label>
              <button type="button" onClick={addProduct} className="text-xs text-[#F59E0B] hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add product
              </button>
            </div>
            {newVendor.products.length === 0 && (
              <p className="text-xs text-[#374151] italic">No products yet — add at least one so the order form can prefill quantities.</p>
            )}
            <div className="space-y-2">
              {newVendor.products.map((p, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
                  <input value={p.name} onChange={(e) => updateProduct(i, "name", e.target.value)} placeholder="Product name" className={inputCls} />
                  <select value={p.unit} onChange={(e) => updateProduct(i, "unit", e.target.value)} className={inputCls + " w-20 appearance-none"}>
                    {UNITS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                  <input value={p.defaultQty} onChange={(e) => updateProduct(i, "defaultQty", e.target.value)} placeholder="Qty" type="number" min="0" className={inputCls + " w-16"} />
                  <button type="button" onClick={() => removeProduct(i)} className="text-[#374151] hover:text-[#F87171] transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button onClick={saveVendor} disabled={!newVendor.name || !newVendor.email || !newVendor.category} className="h-9 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] font-semibold text-sm rounded-lg flex items-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <CheckCircle className="w-4 h-4" /> Save vendor
            </button>
            <button onClick={() => setAdding(false)} className="h-9 px-4 border border-[#1E3050] text-[#64748B] hover:text-[#94A3B8] text-sm rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {!adding && vendors.length > 0 && (
        <button onClick={() => setAdding(true)} className="w-full h-9 border border-dashed border-[#1E3050] hover:border-[rgba(245,158,11,0.3)] text-[#64748B] hover:text-[#F59E0B] text-sm rounded-xl flex items-center justify-center gap-2 transition-colors mb-4">
          <Plus className="w-4 h-4" /> Add another vendor
        </button>
      )}

      <div className="flex items-center justify-between mt-6">
        <button onClick={onBack} className="h-9 px-4 border border-[#1E3050] text-[#64748B] hover:text-[#94A3B8] text-sm rounded-lg flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={onNext} disabled={vendors.length === 0} className="h-9 px-6 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] font-semibold text-sm rounded-lg flex items-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Step 2: First Order Preview ──────────────────────────────────────────────
function FirstOrderStep({ vendors, onNext, onBack }: { vendors: Vendor[]; onNext: () => void; onBack: () => void }) {
  const [quantities, setQuantities] = useState<Record<string, Record<number, string>>>(() => {
    const init: Record<string, Record<number, string>> = {}
    vendors.forEach((v) => { init[v.name] = {}; v.products.forEach((p, i) => { init[v.name][i] = p.defaultQty }) })
    return init
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-7">
        <h2 className="text-xl font-semibold text-[#F7F5F0] tracking-tight">Preview: today&apos;s order</h2>
        <p className="text-sm text-[#64748B] mt-1">This is what the order form will look like every morning. Quantities are pre-filled from your defaults.</p>
      </div>

      <div className="space-y-4 mb-8">
        {vendors.map((vendor) => (
          <div key={vendor.name} className="bg-[#162236] border border-[#1E3050] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1E3050]">
              <div className="w-7 h-7 rounded-md bg-[rgba(245,158,11,0.1)] flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-[#F59E0B]">{vendor.name.slice(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#F7F5F0]">{vendor.name}</p>
                <p className="text-xs text-[#64748B]">{vendor.email}</p>
              </div>
            </div>
            {vendor.products.length === 0 ? (
              <div className="px-4 py-3"><p className="text-xs text-[#374151] italic">No products — will appear empty in the form</p></div>
            ) : (
              <div className="divide-y divide-[#1E2F45]">
                {vendor.products.map((product, pi) => (
                  <div key={pi} className="flex items-center justify-between px-4 py-2.5">
                    <div>
                      <p className="text-sm text-[#F7F5F0]">{product.name}</p>
                      <p className="text-xs text-[#64748B]">per {product.unit}</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={quantities[vendor.name]?.[pi] ?? ""}
                      onChange={(e) => setQuantities((q) => ({ ...q, [vendor.name]: { ...q[vendor.name], [pi]: e.target.value } }))}
                      className="w-20 h-8 px-2.5 text-center rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm focus:outline-none focus:border-[#F59E0B] transition-colors"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.15)] rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-[rgba(245,158,11,0.15)] flex items-center justify-center mt-0.5 flex-shrink-0">
          <Zap className="w-3 h-3 text-[#F59E0B]" />
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">When you hit &ldquo;Send orders&rdquo; each vendor receives an email with only their items and a one-click confirmation link. No login required for them.</p>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="h-9 px-4 border border-[#1E3050] text-[#64748B] hover:text-[#94A3B8] text-sm rounded-lg flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={onNext} className="h-9 px-6 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] font-semibold text-sm rounded-lg flex items-center gap-2 transition-colors">
          Finish setup <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Step 3: Done ─────────────────────────────────────────────────────────────
function DoneStep({ vendorCount, onGo }: { vendorCount: number; onGo: () => void }) {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="w-20 h-20 rounded-2xl bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.2)] flex items-center justify-center">
          <CheckCircle className="w-9 h-9 text-[#34D399]" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#F59E0B] flex items-center justify-center">
          <span className="text-[10px] font-bold text-[#0F1B2D]">{vendorCount}</span>
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-[#F7F5F0] mb-3 tracking-tight">You&apos;re all set!</h2>
      <p className="text-sm text-[#64748B] leading-relaxed mb-8 max-w-sm mx-auto">
        {vendorCount} vendor{vendorCount !== 1 ? "s" : ""} added. Tomorrow morning, come back and place your first real order in under 60 seconds.
      </p>
      <div className="grid grid-cols-3 gap-3 mb-8 text-left">
        {[
          { icon: "01", label: "Open OrderRoom every morning", desc: "Pre-filled quantities waiting for you" },
          { icon: "02", label: "Adjust and send", desc: "All vendors notified simultaneously" },
          { icon: "03", label: "Track confirmations", desc: "Live dashboard shows who has confirmed" },
        ].map((item) => (
          <div key={item.icon} className="bg-[#162236] border border-[#1E3050] rounded-xl p-3.5">
            <div className="text-[#F59E0B] font-mono text-xs font-bold mb-2">{item.icon}</div>
            <p className="text-xs font-medium text-[#F7F5F0] leading-snug mb-1">{item.label}</p>
            <p className="text-[10px] text-[#64748B] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
      <button onClick={onGo} className="w-full h-11 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors">
        Go to dashboard <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [vendors, setVendors] = useState<Vendor[]>([])

  const TOTAL_STEPS = 4

  return (
    <div className="min-h-screen bg-[#0F1B2D] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1E3050] bg-[#0D1825]">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
              <Zap className="w-3.5 h-3.5 text-[#0F1B2D]" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[#F7F5F0] text-sm">OrderRoom</span>
          </div>
          <StepProgress step={step} total={TOTAL_STEPS} />
          <span className="text-xs text-[#374151]">Step {step + 1} / {TOTAL_STEPS}</span>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-3xl fade-in">
          {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
          {step === 1 && <VendorsStep vendors={vendors} onChange={setVendors} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
          {step === 2 && <FirstOrderStep vendors={vendors} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <DoneStep vendorCount={vendors.length} onGo={() => router.push("/dashboard")} />}
        </div>
      </main>
    </div>
  )
}
