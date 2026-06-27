// Aurora PostgreSQL connection (mock for UI demo - replace with real Aurora pg Pool in production)
// In production: import { Pool } from "pg"; export const pool = new Pool({ connectionString: process.env.AURORA_DATABASE_URL });

export type OrderStatus = "pending" | "sent" | "confirmed" | "delivered"

export interface Business {
  id: string
  name: string
  email: string
  plan: "starter" | "pro" | "enterprise"
  createdAt: string
}

export interface Vendor {
  id: string
  businessId: string
  name: string
  email: string
  phone?: string
  category: string
  contactName?: string
  isActive: boolean
  createdAt: string
}

export interface Product {
  id: string
  businessId: string
  vendorId: string
  name: string
  unit: string
  defaultQuantity: number
  pricePerUnit?: number
  isActive: boolean
}

export interface Order {
  id: string
  businessId: string
  vendorId: string
  vendorName: string
  vendorEmail: string
  status: OrderStatus
  deliveryDate: string
  totalItems: number
  notes?: string
  confirmationToken?: string
  confirmedAt?: string
  sentAt?: string
  createdAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  quantity: number
  unit: string
  pricePerUnit?: number
}

// Mock data for demo
export const MOCK_VENDORS: Vendor[] = [
  {
    id: "v1",
    businessId: "b1",
    name: "Fresh Farm Produce",
    email: "orders@freshfarm.com",
    phone: "+1 555-0101",
    category: "Produce",
    contactName: "Maria Santos",
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: "v2",
    businessId: "b1",
    name: "Prime Cuts Meats",
    email: "delivery@primecuts.com",
    phone: "+1 555-0102",
    category: "Meat & Seafood",
    contactName: "James Butcher",
    isActive: true,
    createdAt: "2024-01-20",
  },
  {
    id: "v3",
    businessId: "b1",
    name: "Golden Grain Bakery",
    email: "wholesale@goldengrain.com",
    phone: "+1 555-0103",
    category: "Bakery & Dry Goods",
    contactName: "Anne Miller",
    isActive: true,
    createdAt: "2024-02-01",
  },
  {
    id: "v4",
    businessId: "b1",
    name: "Ocean Select Seafood",
    email: "ops@oceanselect.com",
    phone: "+1 555-0104",
    category: "Meat & Seafood",
    contactName: "Tom Fisher",
    isActive: true,
    createdAt: "2024-02-10",
  },
  {
    id: "v5",
    businessId: "b1",
    name: "Alpine Dairy Co.",
    email: "orders@alpinedairy.com",
    phone: "+1 555-0105",
    category: "Dairy & Eggs",
    contactName: "Lisa Chen",
    isActive: false,
    createdAt: "2024-02-15",
  },
  {
    id: "v6",
    businessId: "b1",
    name: "ThermoStar Beverages",
    email: "b2b@thermostar.com",
    phone: "+1 555-0106",
    category: "Beverages",
    contactName: "Kevin Park",
    isActive: true,
    createdAt: "2024-03-01",
  },
]

export const MOCK_PRODUCTS: Product[] = [
  { id: "p1", businessId: "b1", vendorId: "v1", name: "Roma Tomatoes", unit: "kg", defaultQuantity: 10, pricePerUnit: 2.5, isActive: true },
  { id: "p2", businessId: "b1", vendorId: "v1", name: "Baby Spinach", unit: "bag", defaultQuantity: 5, pricePerUnit: 4.0, isActive: true },
  { id: "p3", businessId: "b1", vendorId: "v1", name: "Yellow Onions", unit: "kg", defaultQuantity: 8, pricePerUnit: 1.2, isActive: true },
  { id: "p4", businessId: "b1", vendorId: "v1", name: "Garlic Bulbs", unit: "kg", defaultQuantity: 2, pricePerUnit: 5.0, isActive: true },
  { id: "p5", businessId: "b1", vendorId: "v2", name: "Beef Tenderloin", unit: "kg", defaultQuantity: 5, pricePerUnit: 42.0, isActive: true },
  { id: "p6", businessId: "b1", vendorId: "v2", name: "Chicken Breast", unit: "kg", defaultQuantity: 10, pricePerUnit: 12.5, isActive: true },
  { id: "p7", businessId: "b1", vendorId: "v2", name: "Pork Ribs", unit: "kg", defaultQuantity: 4, pricePerUnit: 18.0, isActive: true },
  { id: "p8", businessId: "b1", vendorId: "v3", name: "Sourdough Loaves", unit: "pcs", defaultQuantity: 12, pricePerUnit: 6.5, isActive: true },
  { id: "p9", businessId: "b1", vendorId: "v3", name: "Brioche Buns", unit: "pcs", defaultQuantity: 24, pricePerUnit: 2.0, isActive: true },
  { id: "p10", businessId: "b1", vendorId: "v3", name: "All-Purpose Flour", unit: "kg", defaultQuantity: 20, pricePerUnit: 1.5, isActive: true },
  { id: "p11", businessId: "b1", vendorId: "v4", name: "Atlantic Salmon", unit: "kg", defaultQuantity: 6, pricePerUnit: 28.0, isActive: true },
  { id: "p12", businessId: "b1", vendorId: "v4", name: "Sea Bass Fillets", unit: "kg", defaultQuantity: 4, pricePerUnit: 35.0, isActive: true },
  { id: "p13", businessId: "b1", vendorId: "v6", name: "Sparkling Water 1L", unit: "case", defaultQuantity: 4, pricePerUnit: 18.0, isActive: true },
  { id: "p14", businessId: "b1", vendorId: "v6", name: "Orange Juice Fresh", unit: "L", defaultQuantity: 10, pricePerUnit: 5.5, isActive: true },
]

export const MOCK_ORDERS: Order[] = [
  {
    id: "o1",
    businessId: "b1",
    vendorId: "v1",
    vendorName: "Fresh Farm Produce",
    vendorEmail: "orders@freshfarm.com",
    status: "confirmed",
    deliveryDate: new Date().toISOString().split("T")[0],
    totalItems: 4,
    confirmationToken: "tok_abc123",
    confirmedAt: new Date(Date.now() - 3600000).toISOString(),
    sentAt: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "o2",
    businessId: "b1",
    vendorId: "v2",
    vendorName: "Prime Cuts Meats",
    vendorEmail: "delivery@primecuts.com",
    status: "sent",
    deliveryDate: new Date().toISOString().split("T")[0],
    totalItems: 3,
    confirmationToken: "tok_def456",
    sentAt: new Date(Date.now() - 5400000).toISOString(),
    createdAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: "o3",
    businessId: "b1",
    vendorId: "v3",
    vendorName: "Golden Grain Bakery",
    vendorEmail: "wholesale@goldengrain.com",
    status: "delivered",
    deliveryDate: new Date().toISOString().split("T")[0],
    totalItems: 3,
    confirmationToken: "tok_ghi789",
    confirmedAt: new Date(Date.now() - 10800000).toISOString(),
    sentAt: new Date(Date.now() - 14400000).toISOString(),
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "o4",
    businessId: "b1",
    vendorId: "v4",
    vendorName: "Ocean Select Seafood",
    vendorEmail: "ops@oceanselect.com",
    status: "pending",
    deliveryDate: new Date().toISOString().split("T")[0],
    totalItems: 2,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "o5",
    businessId: "b1",
    vendorId: "v6",
    vendorName: "ThermoStar Beverages",
    vendorEmail: "b2b@thermostar.com",
    status: "pending",
    deliveryDate: new Date().toISOString().split("T")[0],
    totalItems: 2,
    createdAt: new Date(Date.now() - 900000).toISOString(),
  },
]
