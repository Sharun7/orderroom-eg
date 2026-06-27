import VendorsPageClient from "./page-client"
import type { Vendor, Product } from "@/lib/db"

// Demo vendors with products — shown when DB is not connected
const DEMO_VENDORS: (Vendor & { products: Product[] })[] = [
  {
    id: "v1", name: "Fresh Farm Produce", email: "orders@freshfarm.com", phone: "+1 555-0101",
    category: "vegetables", businessId: "b1", createdAt: new Date("2024-01-15"),
    products: [
      { id: "p1", name: "Roma Tomatoes",  unit: "kg",  defaultQty: 10, vendorId: "v1" },
      { id: "p2", name: "Baby Spinach",   unit: "bag", defaultQty: 5,  vendorId: "v1" },
      { id: "p3", name: "Yellow Onions",  unit: "kg",  defaultQty: 8,  vendorId: "v1" },
      { id: "p4", name: "Garlic Bulbs",   unit: "kg",  defaultQty: 2,  vendorId: "v1" },
    ],
  },
  {
    id: "v2", name: "Prime Cuts Meats", email: "delivery@primecuts.com", phone: "+1 555-0102",
    category: "meat", businessId: "b1", createdAt: new Date("2024-01-20"),
    products: [
      { id: "p5", name: "Beef Tenderloin", unit: "kg", defaultQty: 5,  vendorId: "v2" },
      { id: "p6", name: "Chicken Breast",  unit: "kg", defaultQty: 10, vendorId: "v2" },
      { id: "p7", name: "Pork Ribs",       unit: "kg", defaultQty: 4,  vendorId: "v2" },
    ],
  },
  {
    id: "v3", name: "Golden Grain Bakery", email: "wholesale@goldengrain.com", phone: "+1 555-0103",
    category: "packaging", businessId: "b1", createdAt: new Date("2024-02-01"),
    products: [
      { id: "p8",  name: "Sourdough Loaves",  unit: "piece", defaultQty: 12, vendorId: "v3" },
      { id: "p9",  name: "Brioche Buns",       unit: "piece", defaultQty: 24, vendorId: "v3" },
      { id: "p10", name: "All-Purpose Flour",  unit: "kg",    defaultQty: 20, vendorId: "v3" },
    ],
  },
  {
    id: "v4", name: "Ocean Select Seafood", email: "ops@oceanselect.com", phone: "+1 555-0104",
    category: "meat", businessId: "b1", createdAt: new Date("2024-02-10"),
    products: [
      { id: "p11", name: "Atlantic Salmon",  unit: "kg", defaultQty: 6, vendorId: "v4" },
      { id: "p12", name: "Sea Bass Fillets", unit: "kg", defaultQty: 4, vendorId: "v4" },
    ],
  },
  {
    id: "v5", name: "Alpine Dairy Co.", email: "orders@alpinedairy.com", phone: "+1 555-0105",
    category: "dairy", businessId: "b1", createdAt: new Date("2024-02-15"),
    products: [
      { id: "p13", name: "Full-Cream Milk", unit: "litre", defaultQty: 20, vendorId: "v5" },
    ],
  },
  {
    id: "v6", name: "ThermoStar Beverages", email: "b2b@thermostar.com", phone: "+1 555-0106",
    category: "beverages", businessId: "b1", createdAt: new Date("2024-03-01"),
    products: [
      { id: "p14", name: "Sparkling Water 1L", unit: "box",   defaultQty: 4,  vendorId: "v6" },
      { id: "p15", name: "Fresh Orange Juice", unit: "litre", defaultQty: 10, vendorId: "v6" },
    ],
  },
]

export default function VendorsPage() {
  return <VendorsPageClient initialVendors={DEMO_VENDORS} />
}
