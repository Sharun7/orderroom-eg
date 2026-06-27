"use client"

import { useState } from "react"
import { Plus, Mail, Phone, MoreHorizontal, Search, X, Check } from "lucide-react"
import { TopBar } from "@/components/top-bar"
import type { Vendor } from "@/lib/db"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Demo seed data (matches Prisma Vendor model — no isActive / contactName)
// ---------------------------------------------------------------------------
const SEED_VENDORS: Vendor[] = [
  { id: "v1", name: "Fresh Farm Produce",   email: "orders@freshfarm.com",      phone: "+1 555-0101", category: "vegetables", businessId: "b1", createdAt: new Date("2024-01-15") },
  { id: "v2", name: "Prime Cuts Meats",     email: "delivery@primecuts.com",     phone: "+1 555-0102", category: "meat",       businessId: "b1", createdAt: new Date("2024-01-20") },
  { id: "v3", name: "Golden Grain Bakery",  email: "wholesale@goldengrain.com",  phone: "+1 555-0103", category: "packaging",  businessId: "b1", createdAt: new Date("2024-02-01") },
  { id: "v4", name: "Ocean Select Seafood", email: "ops@oceanselect.com",        phone: "+1 555-0104", category: "meat",       businessId: "b1", createdAt: new Date("2024-02-10") },
  { id: "v5", name: "Alpine Dairy Co.",     email: "orders@alpinedairy.com",     phone: "+1 555-0105", category: "dairy",      businessId: "b1", createdAt: new Date("2024-02-15") },
  { id: "v6", name: "ThermoStar Beverages", email: "b2b@thermostar.com",         phone: "+1 555-0106", category: "beverages",  businessId: "b1", createdAt: new Date("2024-03-01") },
]

const CATEGORY_COLORS: Record<string, string> = {
  vegetables: "bg-[rgba(16,185,129,0.12)] text-[#34D399]",
  meat:        "bg-[rgba(239,68,68,0.12)] text-[#F87171]",
  dairy:       "bg-[rgba(59,130,246,0.12)] text-[#60A5FA]",
  beverages:   "bg-[rgba(139,92,246,0.12)] text-[#A78BFA]",
  packaging:   "bg-[rgba(245,158,11,0.12)] text-[#FCD34D]",
  other:       "bg-[rgba(100,116,139,0.12)] text-[#94A3B8]",
}

function VendorCard({ vendor, onDelete }: { vendor: Vendor; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const catColor = CATEGORY_COLORS[vendor.category] ?? CATEGORY_COLORS.other
  const initials = vendor.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div className="bg-[#162236] border border-[#1E3050] rounded-xl p-5 transition-all hover:border-[#2A4060] relative group">
      {/* Menu */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-md bg-[#1E2F45] flex items-center justify-center hover:bg-[#253650] transition-colors"
          >
            <MoreHorizontal className="w-3.5 h-3.5 text-[#64748B]" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 w-40 bg-[#1E2F45] border border-[#2A4060] rounded-lg py-1 z-10 shadow-xl">
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full text-left px-3 py-2 text-xs text-[#94A3B8] hover:bg-[#253650] hover:text-[#F7F5F0] transition-colors"
              >
                Edit vendor
              </button>
              <button
                onClick={() => { onDelete(vendor.id); setMenuOpen(false) }}
                className="w-full text-left px-3 py-2 text-xs text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
              >
                Delete vendor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Avatar & name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#1E2F45] flex items-center justify-center text-sm font-semibold text-[#F7F5F0] flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[#F7F5F0] truncate pr-8">{vendor.name}</h3>
          <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize", catColor)}>
            {vendor.category}
          </span>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{vendor.email}</span>
        </div>
        {vendor.phone && (
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{vendor.phone}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#1E3050]">
        <span className="flex items-center gap-1.5 text-xs font-medium text-[#34D399]">
          <Check className="w-3 h-3" /> Active
        </span>
        <span className="text-[10px] text-[#374151]">
          Since {new Date(vendor.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </span>
      </div>
    </div>
  )
}

function AddVendorModal({ onClose, onAdd }: { onClose: () => void; onAdd: (v: Omit<Vendor, "id" | "createdAt">) => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", category: "vegetables" as const })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onAdd({ ...form, businessId: "b1" })
    onClose()
  }

  const CATEGORIES = ["vegetables", "meat", "dairy", "beverages", "packaging", "other"] as const

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
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Vendor / Business Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Fresh Farm Produce"
              required
              className="w-full h-10 px-3.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Email (for order delivery) *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="orders@vendor.com"
              required
              className="w-full h-10 px-3.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 555-0100"
                className="w-full h-10 px-3.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as typeof form.category })}
                className="w-full h-10 px-3.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors capitalize"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 border border-[#1E3050] text-[#94A3B8] text-sm font-medium rounded-lg hover:bg-[#1E2F45] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-10 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-sm font-semibold rounded-lg transition-colors"
            >
              Add Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(SEED_VENDORS)
  const [search, setSearch] = useState("")
  const [showAdd, setShowAdd] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("all")

  const categories = Array.from(new Set(vendors.map((v) => v.category)))

  const filtered = vendors.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === "all" || v.category === categoryFilter
    return matchSearch && matchCat
  })

  function handleDelete(id: string) {
    setVendors((prev) => prev.filter((v) => v.id !== id))
  }

  function handleAdd(data: Omit<Vendor, "id" | "createdAt">) {
    const newVendor: Vendor = {
      id: `v${Date.now()}`,
      createdAt: new Date(),
      ...data,
    }
    setVendors((prev) => [newVendor, ...prev])
  }

  return (
    <div className="flex-1 flex flex-col">
      {showAdd && <AddVendorModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}

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
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#162236] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] transition-colors"
            />
          </div>
          <div className="flex items-center gap-1 bg-[#162236] border border-[#1E3050] rounded-lg p-1">
            <button
              onClick={() => setCategoryFilter("all")}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                categoryFilter === "all" ? "bg-[#1E2F45] text-[#F7F5F0]" : "text-[#64748B] hover:text-[#94A3B8]",
              )}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize",
                  categoryFilter === c ? "bg-[#1E2F45] text-[#F7F5F0]" : "text-[#64748B] hover:text-[#94A3B8]",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="ml-auto text-xs text-[#64748B]">{filtered.length} of {vendors.length} vendors</div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} onDelete={handleDelete} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#374151] text-sm">No vendors found.</div>
        )}
      </div>
    </div>
  )
}
