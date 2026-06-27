"use client"

import { useState } from "react"
import { Plus, Search, Package, DollarSign, X, ChevronDown } from "lucide-react"
import { TopBar } from "@/components/top-bar"
import { MOCK_PRODUCTS, MOCK_VENDORS, type Product } from "@/lib/db"
import { cn } from "@/lib/utils"

function AddProductModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (p: Partial<Product>) => void
}) {
  const [form, setForm] = useState({
    vendorId: MOCK_VENDORS[0].id,
    name: "",
    unit: "kg",
    defaultQuantity: 1,
    pricePerUnit: 0,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onAdd({ ...form, isActive: true })
    onClose()
  }

  const UNITS = ["kg", "L", "pcs", "case", "bag", "box", "dozen"]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#162236] border border-[#1E3050] rounded-2xl w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E3050]">
          <h2 className="text-base font-semibold text-[#F7F5F0]">Add New Product</h2>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#94A3B8] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Vendor *</label>
            <div className="relative">
              <select
                value={form.vendorId}
                onChange={(e) => setForm({ ...form, vendorId: e.target.value })}
                className="w-full h-10 px-3.5 pr-9 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors appearance-none"
              >
                {MOCK_VENDORS.filter((v) => v.isActive).map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Product Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Roma Tomatoes"
              required
              className="w-full h-10 px-3.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Unit *</label>
              <div className="relative">
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full h-10 px-3 pr-8 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm focus:outline-none focus:border-[#F59E0B] transition-colors appearance-none"
                >
                  {UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#64748B] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Default Qty</label>
              <input
                type="number"
                min={1}
                value={form.defaultQuantity}
                onChange={(e) => setForm({ ...form, defaultQuantity: Number(e.target.value) })}
                className="w-full h-10 px-3.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm focus:outline-none focus:border-[#F59E0B] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Price / Unit</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.pricePerUnit}
                onChange={(e) => setForm({ ...form, pricePerUnit: Number(e.target.value) })}
                className="w-full h-10 px-3.5 rounded-lg bg-[#0F1B2D] border border-[#1E3050] text-[#F7F5F0] text-sm focus:outline-none focus:border-[#F59E0B] transition-colors"
              />
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
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [search, setSearch] = useState("")
  const [selectedVendor, setSelectedVendor] = useState<string>("all")
  const [showAdd, setShowAdd] = useState(false)

  const vendorMap = Object.fromEntries(MOCK_VENDORS.map((v) => [v.id, v]))

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchVendor = selectedVendor === "all" || p.vendorId === selectedVendor
    return matchSearch && matchVendor
  })

  // Group by vendor
  const grouped = filtered.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.vendorId]) acc[p.vendorId] = []
    acc[p.vendorId].push(p)
    return acc
  }, {})

  function handleAdd(data: Partial<Product>) {
    const newProduct: Product = {
      id: `p${Date.now()}`,
      businessId: "b1",
      vendorId: data.vendorId ?? MOCK_VENDORS[0].id,
      name: data.name ?? "",
      unit: data.unit ?? "kg",
      defaultQuantity: data.defaultQuantity ?? 1,
      pricePerUnit: data.pricePerUnit,
      isActive: true,
    }
    setProducts((prev) => [newProduct, ...prev])
  }

  function handleToggle(id: string) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
  }

  return (
    <div className="flex-1 flex flex-col">
      {showAdd && <AddProductModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}

      <TopBar
        title="Products"
        subtitle={`${products.length} products across ${MOCK_VENDORS.filter((v) => v.isActive).length} vendors`}
        actions={
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 h-8 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </button>
        }
      />

      <div className="flex-1 p-6 fade-in">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#162236] border border-[#1E3050] text-[#F7F5F0] text-sm placeholder-[#374151] focus:outline-none focus:border-[#F59E0B] transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedVendor("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                selectedVendor === "all"
                  ? "bg-[#1E2F45] text-[#F7F5F0] border border-[#2A4060]"
                  : "text-[#64748B] hover:text-[#94A3B8] bg-[#162236] border border-[#1E3050]",
              )}
            >
              All Vendors
            </button>
            {MOCK_VENDORS.filter((v) => v.isActive).map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVendor(v.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                  selectedVendor === v.id
                    ? "bg-[#1E2F45] text-[#F7F5F0] border border-[#2A4060]"
                    : "text-[#64748B] hover:text-[#94A3B8] bg-[#162236] border border-[#1E3050]",
                )}
              >
                {v.name.split(" ")[0]}
              </button>
            ))}
          </div>
          <div className="ml-auto text-xs text-[#64748B]">{filtered.length} products</div>
        </div>

        {/* Grouped by vendor */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([vendorId, vendorProducts]) => {
            const vendor = vendorMap[vendorId]
            if (!vendor) return null
            return (
              <div key={vendorId}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1E2F45] flex items-center justify-center text-xs font-semibold text-[#F7F5F0] flex-shrink-0">
                    {vendor.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="text-sm font-semibold text-[#F7F5F0]">{vendor.name}</h3>
                  <span className="text-xs text-[#64748B]">{vendorProducts.length} products</span>
                  <div className="flex-1 h-px bg-[#1E3050]" />
                </div>

                <div className="bg-[#162236] border border-[#1E3050] rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1E3050]">
                        <th className="text-left text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Product</th>
                        <th className="text-left text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-4 py-3">Unit</th>
                        <th className="text-left text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-4 py-3">Default Qty</th>
                        <th className="text-left text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-4 py-3">Price</th>
                        <th className="text-left text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-4 py-3">Status</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {vendorProducts.map((product, i) => (
                        <tr
                          key={product.id}
                          className={cn(
                            "transition-colors hover:bg-[#1E2F45]",
                            i !== vendorProducts.length - 1 && "border-b border-[#1E3050]",
                          )}
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-[#1E2F45] flex items-center justify-center flex-shrink-0">
                                <Package className="w-3.5 h-3.5 text-[#64748B]" />
                              </div>
                              <span className="text-sm font-medium text-[#F7F5F0]">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-[#94A3B8] bg-[#1E2F45] px-2 py-1 rounded-md">{product.unit}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-[#F7F5F0]">{product.defaultQuantity}</span>
                          </td>
                          <td className="px-4 py-3">
                            {product.pricePerUnit ? (
                              <div className="flex items-center gap-1 text-sm text-[#F7F5F0]">
                                <DollarSign className="w-3 h-3 text-[#64748B]" />
                                {product.pricePerUnit.toFixed(2)} / {product.unit}
                              </div>
                            ) : (
                              <span className="text-xs text-[#374151]">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "text-xs font-medium px-2 py-0.5 rounded-full",
                                product.isActive
                                  ? "bg-[rgba(16,185,129,0.12)] text-[#34D399]"
                                  : "bg-[rgba(100,116,139,0.12)] text-[#64748B]",
                              )}
                            >
                              {product.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleToggle(product.id)}
                              className="text-xs text-[#64748B] hover:text-[#94A3B8] transition-colors"
                            >
                              {product.isActive ? "Disable" : "Enable"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#374151] text-sm">
            No products found.
          </div>
        )}
      </div>
    </div>
  )
}
