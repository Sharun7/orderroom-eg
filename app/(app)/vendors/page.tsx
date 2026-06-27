"use client"

import { useState } from "react"
import {
  Plus, Mail, Phone, Search, X, Check, Package,
  Trash2, Pencil, ChevronRight, ShoppingCart, Clock,
} from "lucide-react"
import { TopBar } from "@/components/top-bar"
import type { Vendor, Product } from "@/lib/db"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------
type DemoVendor = Vendor & { products: Product[]; orderCount: number; lastOrdered?: string }

const SEED_VENDORS: DemoVendor[] = [
  {
    id: "v1", name: "Fresh Farm Produce",   email: "orders@freshfarm.com",     phone: "+1 555-0101",
    category: "vegetables", businessId: "b1", createdAt: new Date("2024-01-15"),
    orderCount: 48, lastOrdered: "Today",
    products: [
      { id: "p1", name: "Roma Tomatoes",   unit: "kg",  defaultQty: 10, vendorId: "v1" },
      { id: "p2", name: "Baby Spinach",    unit: "bag", defaultQty: 5,  vendorId: "v1" },
      { id: "p3", name: "Yellow Onions",   unit: "kg",  defaultQty: 8,  vendorId: "v1" },
      { id: "p4", name: "Garlic Bulbs",    unit: "kg",  defaultQty: 2,  vendorId: "v1" },
    ],
  },
  {
    id: "v2", name: "Prime Cuts Meats",     email: "delivery@primecuts.com",    phone: "+1 555-0102",
    category: "meat", businessId: "b1", createdAt: new Date("2024-01-20"),
    orderCount: 36, lastOrdered: "Yesterday",
    products: [
      { id: "p5", name: "Beef Tenderloin", unit: "kg", defaultQty: 5,  vendorId: "v2" },
      { id: "p6", name: "Chicken Breast",  unit: "kg", defaultQty: 10, vendorId: "v2" },
      { id: "p7", name: "Pork Ribs",       unit: "kg", defaultQty: 4,  vendorId: "v2" },
    ],
  },
  {
    id: "v3", name: "Golden Grain Bakery",  email: "wholesale@goldengrain.com", phone: "+1 555-0103",
    category: "bakery", businessId: "b1", createdAt: new Date("2024-02-01"),
    orderCount: 29, lastOrdered: "2 days ago",
    products: [
      { id: "p8",  name: "Sourdough Loaves",  unit: "piece", defaultQty: 12, vendorId: "v3" },
      { id: "p9",  name: "Brioche Buns",      unit: "piece", defaultQty: 24, vendorId: "v3" },
      { id: "p10", name: "All-Purpose Flour", unit: "kg",    defaultQty: 20, vendorId: "v3" },
    ],
  },
  {
    id: "v4", name: "Ocean Select Seafood", email: "ops@oceanselect.com",       phone: "+1 555-0104",
    category: "seafood", businessId: "b1", createdAt: new Date("2024-02-10"),
    orderCount: 22, lastOrdered: "3 days ago",
    products: [
      { id: "p11", name: "Atlantic Salmon",   unit: "kg", defaultQty: 6, vendorId: "v4" },
      { id: "p12", name: "Sea Bass Fillets",  unit: "kg", defaultQty: 4, vendorId: "v4" },
    ],
  },
  {
    id: "v5", name: "Alpine Dairy Co.",     email: "orders@alpinedairy.com",    phone: "+1 555-0105",
    category: "dairy", businessId: "b1", createdAt: new Date("2024-02-15"),
    orderCount: 18, lastOrdered: "5 days ago",
    products: [
      { id: "p13", name: "Whole Milk",         unit: "litre", defaultQty: 20, vendorId: "v5" },
      { id: "p14", name: "Heavy Cream",        unit: "litre", defaultQty: 5,  vendorId: "v5" },
    ],
  },
  {
    id: "v6", name: "ThermoStar Beverages", email: "b2b@thermostar.com",        phone: "+1 555-0106",
    category: "beverages", businessId: "b1", createdAt: new Date("2024-03-01"),
    orderCount: 14, lastOrdered: "1 week ago",
    products: [
      { id: "p15", name: "Sparkling Water 1L", unit: "box",   defaultQty: 4,  vendorId: "v6" },
      { id: "p16", name: "Fresh Orange Juice", unit: "litre", defaultQty: 10, vendorId: "v6" },
    ],
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  vegetables: "bg-[rgba(16,185,129,0.12)] text-[#34D399]",
  meat:        "bg-[rgba(239,68,68,0.12)]  text-[#F87171]",
  seafood:     "bg-[rgba(59,130,246,0.12)] text-[#60A5FA]",
  bakery:      "bg-[rgba(245,158,11,0.12)] text-[#F59E0B]",
  dairy:       "bg-[rgba(99,102,241,0.12)] text-[#818CF8]",
  beverages:   "bg-[rgba(139,92,246,0.12)] text-[#A78BFA]",
  packaging:   "bg-[rgba(100,116,139,0.12)] text-[#94A3B8]",
  other:       "bg-[rgba(100,116,139,0.12)] text-[#94A3B8]",
}

const UNITS = ["kg", "litre", "piece", "box", "bag"] as const
const CATEGORIES = ["vegetables", "meat", "seafood", "bakery", "dairy", "beverages", "packaging", "other"] as const

const INPUT = "w-full h-9 px-3 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] transition-colors"

// ---------------------------------------------------------------------------
// Add Vendor Modal
// ---------------------------------------------------------------------------
function AddVendorModal({
  onClose, onAdd,
}: { onClose: () => void; onAdd: (v: Omit<Vendor, "id" | "createdAt">) => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", category: "vegetables" })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onAdd({ ...form, businessId: "b1" })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#162236] border border-[#1E3050] rounded-2xl w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E3050]">
          <h2 className="text-base font-semibold text-[#F7F5F0]">Add New Vendor</h2>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#94A3B8] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Vendor Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Fresh Farm Produce" required className={INPUT} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Order Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="orders@vendor.com" required className={INPUT} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555-0100" className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={INPUT + " appearance-none"}>
                {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-10 border border-[#1E3050] text-[#94A3B8] text-sm font-medium rounded-lg hover:bg-[#1E2F45] transition-colors">Cancel</button>
            <button type="submit" className="flex-1 h-10 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-sm font-semibold rounded-lg transition-colors">Add Vendor</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Vendor Detail Drawer
// ---------------------------------------------------------------------------
function VendorDrawer({
  vendor, onClose, onUpdate, onDelete,
}: {
  vendor: DemoVendor
  onClose: () => void
  onUpdate: (id: string, data: Partial<DemoVendor>) => void
  onDelete: (id: string) => void
}) {
  const [tab, setTab] = useState<"info" | "products">("info")
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: vendor.name, email: vendor.email, phone: vendor.phone ?? "", category: vendor.category })
  const [products, setProducts] = useState<Product[]>(vendor.products)
  const [addingProduct, setAddingProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: "", unit: "kg", defaultQty: 1 })

  const catColor = CATEGORY_COLORS[vendor.category] ?? CATEGORY_COLORS.other
  const initials = vendor.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  function saveInfo() {
    onUpdate(vendor.id, { ...form })
    setEditing(false)
  }

  function addProduct() {
    if (!newProduct.name.trim()) return
    const p: Product = { id: `p${Date.now()}`, ...newProduct, vendorId: vendor.id }
    setProducts((prev) => [...prev, p])
    setNewProduct({ name: "", unit: "kg", defaultQty: 1 })
    setAddingProduct(false)
  }

  function removeProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />
      {/* Panel */}
      <div className="w-96 bg-[#0F1B2D] border-l border-[#1E3050] flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="px-5 py-5 border-b border-[#1E3050] flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#162236] border border-[#1E3050] flex items-center justify-center text-sm font-bold text-[#F7F5F0] flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-[#F7F5F0] truncate">{vendor.name}</h2>
            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize", catColor)}>{vendor.category}</span>
          </div>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#94A3B8] transition-colors mt-0.5">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 border-b border-[#1E3050]">
          {[
            { label: "Orders", value: vendor.orderCount },
            { label: "Products", value: products.length },
            { label: "Since", value: new Date(vendor.createdAt).toLocaleDateString("en-US", { month: "short", year: "2-digit" }) },
          ].map((s) => (
            <div key={s.label} className="px-4 py-3 text-center border-r border-[#1E3050] last:border-0">
              <p className="text-base font-bold text-[#F7F5F0]">{s.value}</p>
              <p className="text-[10px] text-[#64748B]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-[#1E3050]">
          {(["info", "products"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-3 text-xs font-medium capitalize transition-colors border-b-2",
                tab === t ? "border-[#F59E0B] text-[#F7F5F0]" : "border-transparent text-[#64748B] hover:text-[#94A3B8]",
              )}
            >
              {t === "info" ? "Contact Info" : `Products (${products.length})`}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Info tab ── */}
          {tab === "info" && (
            <div className="p-5 space-y-5">
              {!editing ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-[#64748B] flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#64748B]">Order email</p>
                        <p className="text-sm text-[#F7F5F0]">{vendor.email}</p>
                      </div>
                    </div>
                    {vendor.phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-[#64748B] flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-[#64748B]">Phone</p>
                          <p className="text-sm text-[#F7F5F0]">{vendor.phone}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#64748B] flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#64748B]">Last ordered</p>
                        <p className="text-sm text-[#F7F5F0]">{vendor.lastOrdered ?? "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <ShoppingCart className="w-4 h-4 text-[#64748B] flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#64748B]">Total orders placed</p>
                        <p className="text-sm text-[#F7F5F0]">{vendor.orderCount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1.5 h-8 px-3 border border-[#1E3050] text-[#94A3B8] text-xs rounded-lg hover:bg-[#162236] hover:text-[#F7F5F0] transition-colors"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => { onDelete(vendor.id); onClose() }}
                      className="flex items-center gap-1.5 h-8 px-3 border border-[rgba(239,68,68,0.25)] text-[#EF4444] text-xs rounded-lg hover:bg-[rgba(239,68,68,0.08)] transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#94A3B8] mb-1">Name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={INPUT} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#94A3B8] mb-1">Order Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={INPUT} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#94A3B8] mb-1">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={INPUT} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#94A3B8] mb-1">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={INPUT + " appearance-none"}>
                      {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setEditing(false)} className="flex-1 h-9 border border-[#1E3050] text-[#94A3B8] text-xs rounded-lg hover:bg-[#162236] transition-colors">Cancel</button>
                    <button onClick={saveInfo} className="flex-1 h-9 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-xs font-semibold rounded-lg transition-colors">Save</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Products tab ── */}
          {tab === "products" && (
            <div className="p-5 space-y-3">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2 border-b border-[#1E3050] last:border-0">
                  <div className="w-7 h-7 rounded-lg bg-[#162236] flex items-center justify-center flex-shrink-0">
                    <Package className="w-3.5 h-3.5 text-[#64748B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F7F5F0] truncate">{p.name}</p>
                    <p className="text-[10px] text-[#64748B]">Default: {p.defaultQty} {p.unit}</p>
                  </div>
                  <button onClick={() => removeProduct(p.id)} className="text-[#374151] hover:text-[#EF4444] transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {addingProduct ? (
                <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-4 space-y-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#94A3B8] mb-1">Product Name</label>
                    <input
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="e.g. Roma Tomatoes"
                      autoFocus
                      className={INPUT}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-[#94A3B8] mb-1">Unit</label>
                      <select value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} className={INPUT + " appearance-none"}>
                        {UNITS.map((u) => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[#94A3B8] mb-1">Default Qty</label>
                      <input
                        type="number" min={1}
                        value={newProduct.defaultQty}
                        onChange={(e) => setNewProduct({ ...newProduct, defaultQty: Number(e.target.value) })}
                        className={INPUT}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAddingProduct(false)} className="flex-1 h-8 border border-[#1E3050] text-[#94A3B8] text-xs rounded-lg hover:bg-[#1E2F45] transition-colors">Cancel</button>
                    <button onClick={addProduct} disabled={!newProduct.name.trim()} className="flex-1 h-8 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-xs font-semibold rounded-lg transition-colors disabled:opacity-50">Add</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingProduct(true)}
                  className="w-full flex items-center justify-center gap-2 h-9 border border-dashed border-[#1E3050] text-[#64748B] hover:text-[#94A3B8] hover:border-[#2A4060] text-xs rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add product
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Vendor Card
// ---------------------------------------------------------------------------
function VendorCard({ vendor, onSelect }: { vendor: DemoVendor; onSelect: () => void }) {
  const catColor = CATEGORY_COLORS[vendor.category] ?? CATEGORY_COLORS.other
  const initials = vendor.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  return (
    <button
      onClick={onSelect}
      className="w-full bg-[#162236] border border-[#1E3050] rounded-xl p-5 text-left transition-all hover:border-[#2A4060] hover:bg-[#1a2a40] group"
    >
      {/* Avatar & name */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#1E2F45] flex items-center justify-center text-sm font-bold text-[#F7F5F0] flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#F7F5F0] truncate">{vendor.name}</h3>
          <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize", catColor)}>
            {vendor.category}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-[#374151] group-hover:text-[#64748B] transition-colors flex-shrink-0 mt-1" />
      </div>

      {/* Contact */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <Mail className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{vendor.email}</span>
        </div>
        {vendor.phone && (
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Phone className="w-3 h-3 flex-shrink-0" />
            <span>{vendor.phone}</span>
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-3 border-t border-[#1E3050]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-[#64748B]">
            <Package className="w-3 h-3" /> {vendor.products.length} products
          </span>
          <span className="flex items-center gap-1 text-xs text-[#64748B]">
            <ShoppingCart className="w-3 h-3" /> {vendor.orderCount} orders
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#34D399]">
          <Check className="w-3 h-3" /> Active
        </div>
      </div>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function VendorsPage() {
  const [vendors, setVendors] = useState<DemoVendor[]>(SEED_VENDORS)
  const [search, setSearch] = useState("")
  const [showAdd, setShowAdd] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState("all")

  const categories = Array.from(new Set(vendors.map((v) => v.category)))
  const selectedVendor = vendors.find((v) => v.id === selectedId) ?? null

  const filtered = vendors.filter((v) => {
    const q = search.toLowerCase()
    const matchSearch = v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q) || v.category.includes(q)
    const matchCat    = categoryFilter === "all" || v.category === categoryFilter
    return matchSearch && matchCat
  })

  function handleDelete(id: string) {
    setVendors((prev) => prev.filter((v) => v.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  function handleAdd(data: Omit<Vendor, "id" | "createdAt">) {
    const v: DemoVendor = {
      id: `v${Date.now()}`, createdAt: new Date(), orderCount: 0, products: [],
      ...data,
    }
    setVendors((prev) => [v, ...prev])
  }

  function handleUpdate(id: string, data: Partial<DemoVendor>) {
    setVendors((prev) => prev.map((v) => v.id === id ? { ...v, ...data } : v))
  }

  return (
    <div className="flex-1 flex flex-col">
      {showAdd && <AddVendorModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      {selectedVendor && (
        <VendorDrawer
          vendor={selectedVendor}
          onClose={() => setSelectedId(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}

      <TopBar
        title="Vendors"
        subtitle={`${vendors.length} vendors`}
        actions={
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 h-8 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Vendor
          </button>
        }
      />

      <div className="flex-1 p-6 fade-in">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors…"
              className="h-9 pl-9 pr-3 rounded-lg bg-[#162236] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] transition-colors w-52"
            />
          </div>
          <div className="flex items-center gap-1 bg-[#162236] border border-[#1E3050] rounded-lg p-1">
            <button
              onClick={() => setCategoryFilter("all")}
              className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors", categoryFilter === "all" ? "bg-[#1E2F45] text-[#F7F5F0]" : "text-[#64748B] hover:text-[#94A3B8]")}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={cn("px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors", categoryFilter === c ? "bg-[#1E2F45] text-[#F7F5F0]" : "text-[#64748B] hover:text-[#94A3B8]")}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-[#64748B]">{filtered.length} of {vendors.length}</span>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} onSelect={() => setSelectedId(vendor.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-sm text-[#374151]">No vendors found.</p>
            {search && (
              <button onClick={() => setSearch("")} className="mt-2 text-xs text-[#F59E0B] hover:underline">Clear search</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
