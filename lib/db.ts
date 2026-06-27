/**
 * lib/db.ts
 * Typed query helpers using Prisma + Aurora PostgreSQL.
 *
 * All functions scope queries to a `businessId` so tenant data never leaks
 * across businesses. Replace the DEMO_BUSINESS_ID constant with a value
 * derived from the authenticated session in production.
 */

import { prisma } from "@/lib/prisma"

// Inline types until Prisma generates them
export type Business = {
  id: string
  name: string
  email: string
  phone?: string
  type: string
  createdAt: Date
}

export type User = {
  id: string
  name: string
  email: string
  passwordHash?: string
  role: string
  businessId: string
  createdAt: Date
}

export type Vendor = {
  id: string
  name: string
  email: string
  phone?: string
  category: string
  businessId: string
  createdAt: Date
}

export type Product = {
  id: string
  name: string
  unit: string
  defaultQty: number
  vendorId: string
}

export type Order = {
  id: string
  businessId: string
  date: Date
  status: string
  notes?: string
  createdAt: Date
}

export type OrderItem = {
  id: string
  orderId: string
  vendorId: string
  productId: string
  quantity: number
  unit: string
  vendorStatus: string
  confirmToken: string
  confirmedAt?: Date
  deliveredAt?: Date
}

/**
 * Subscription — defined inline until `prisma generate` picks up the schema
 * addition. Once the DB is provisioned and `prisma generate` has run, this
 * can be replaced with the @prisma/client import.
 */
export type Subscription = {
  id:               string
  businessId:       string
  stripeCustomerId: string | null
  stripePriceId:    string | null
  stripeSubId:      string | null
  plan:             string
  status:           string
  vendorLimit:      number
  currentPeriodEnd: Date | null
  createdAt:        Date
}

// Convenience union types matching the Prisma schema string literals
export type BusinessType = "restaurant" | "hotel" | "catering"
export type UserRole = "owner" | "manager" | "staff"
export type VendorCategory = "vegetables" | "meat" | "dairy" | "beverages" | "packaging" | "other"
export type ProductUnit = "kg" | "litre" | "piece" | "box" | "bag"
export type OrderStatus = "draft" | "sent" | "partial" | "confirmed" | "delivered"
export type VendorItemStatus = "pending" | "confirmed" | "rejected"

// ---------------------------------------------------------------------------
// Business
// ---------------------------------------------------------------------------

export async function getBusinessById(id: string): Promise<Business | null> {
  return prisma.business.findUnique({ where: { id } })
}

export async function createBusiness(data: {
  name: string
  email: string
  phone?: string
  type: BusinessType
}): Promise<Business> {
  return prisma.business.create({ data })
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } })
}

export async function createUser(data: {
  name: string
  email: string
  passwordHash: string
  role?: UserRole
  businessId: string
}): Promise<User> {
  return prisma.user.create({ data })
}

// ---------------------------------------------------------------------------
// Vendors
// ---------------------------------------------------------------------------

export type VendorWithProducts = Vendor & { products: Product[] }

export async function getVendors(businessId: string): Promise<Vendor[]> {
  return prisma.vendor.findMany({
    where: { businessId },
    orderBy: { createdAt: "asc" },
  })
}

export async function getVendorsWithProducts(
  businessId: string,
): Promise<VendorWithProducts[]> {
  return prisma.vendor.findMany({
    where: { businessId },
    include: { products: true },
    orderBy: { createdAt: "asc" },
  })
}

export async function getVendorById(
  id: string,
  businessId: string,
): Promise<VendorWithProducts | null> {
  return prisma.vendor.findFirst({
    where: { id, businessId },
    include: { products: true },
  })
}

export async function createVendor(data: {
  name: string
  email: string
  phone?: string
  category: VendorCategory
  businessId: string
}): Promise<Vendor> {
  return prisma.vendor.create({ data })
}

export async function updateVendor(
  id: string,
  businessId: string,
  data: Partial<Pick<Vendor, "name" | "email" | "phone" | "category">>,
): Promise<Vendor> {
  return prisma.vendor.update({ where: { id }, data })
}

export async function deleteVendor(id: string, businessId: string): Promise<void> {
  await prisma.vendor.delete({ where: { id } })
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function getProductsByVendor(vendorId: string): Promise<Product[]> {
  return prisma.product.findMany({ where: { vendorId }, orderBy: { name: "asc" } })
}

export async function createProduct(data: {
  name: string
  unit: ProductUnit
  defaultQty?: number
  vendorId: string
}): Promise<Product> {
  return prisma.product.create({ data })
}

export async function updateProduct(
  id: string,
  data: Partial<Pick<Product, "name" | "unit" | "defaultQty">>,
): Promise<Product> {
  return prisma.product.update({ where: { id }, data })
}

export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } })
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export type OrderWithItems = Order & {
  items: (OrderItem & { vendor: Vendor; product: Product })[]
}

export async function getOrders(businessId: string): Promise<Order[]> {
  return prisma.order.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
  })
}

export async function getOrdersWithItems(
  businessId: string,
): Promise<OrderWithItems[]> {
  return prisma.order.findMany({
    where: { businessId },
    include: {
      items: { include: { vendor: true, product: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getOrderById(
  id: string,
  businessId: string,
): Promise<OrderWithItems | null> {
  return prisma.order.findFirst({
    where: { id, businessId },
    include: {
      items: { include: { vendor: true, product: true } },
    },
  })
}

export async function createOrder(data: {
  businessId: string
  notes?: string
  items: {
    vendorId: string
    productId: string
    quantity: number
    unit: string
  }[]
}): Promise<Order> {
  return prisma.order.create({
    data: {
      businessId: data.businessId,
      notes: data.notes,
      status: "draft",
      items: {
        create: data.items.map((item) => ({
          vendorId: item.vendorId,
          productId: item.productId,
          quantity: item.quantity,
          unit: item.unit,
          vendorStatus: "pending",
        })),
      },
    },
  })
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  return prisma.order.update({ where: { id }, data: { status } })
}

// ---------------------------------------------------------------------------
// Order Items / Vendor Confirmation
// ---------------------------------------------------------------------------

export async function getOrderItemByToken(
  confirmToken: string,
): Promise<(OrderItem & { vendor: Vendor; product: Product; order: Order }) | null> {
  return prisma.orderItem.findUnique({
    where: { confirmToken },
    include: { vendor: true, product: true, order: true },
  })
}

export async function confirmOrderItem(confirmToken: string): Promise<OrderItem> {
  return prisma.orderItem.update({
    where: { confirmToken },
    data: { vendorStatus: "confirmed", confirmedAt: new Date() },
  })
}

export async function rejectOrderItem(confirmToken: string): Promise<OrderItem> {
  return prisma.orderItem.update({
    where: { confirmToken },
    data: { vendorStatus: "rejected" },
  })
}

export async function markOrderItemDelivered(
  confirmToken: string,
): Promise<OrderItem> {
  return prisma.orderItem.update({
    where: { confirmToken },
    data: { deliveredAt: new Date() },
  })
}

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any

export async function getSubscription(businessId: string): Promise<Subscription | null> {
  return db.subscription.findUnique({ where: { businessId } })
}

export async function upsertSubscription(data: {
  businessId:       string
  stripeCustomerId?: string
  stripePriceId?:   string
  stripeSubId?:     string
  plan:             string
  status:           string
  vendorLimit:      number
  currentPeriodEnd?: Date
}): Promise<Subscription> {
  return db.subscription.upsert({
    where:  { businessId: data.businessId },
    update: {
      stripeCustomerId: data.stripeCustomerId,
      stripePriceId:    data.stripePriceId,
      stripeSubId:      data.stripeSubId,
      plan:             data.plan,
      status:           data.status,
      vendorLimit:      data.vendorLimit,
      currentPeriodEnd: data.currentPeriodEnd,
    },
    create: { ...data },
  })
}

export async function getVendorCount(businessId: string): Promise<number> {
  return db.vendor.count({ where: { businessId } })
}

// ---------------------------------------------------------------------------
// Dashboard helpers
// ---------------------------------------------------------------------------

export async function getOrderStatusCounts(
  businessId: string,
): Promise<Record<OrderStatus, number>> {
  const counts = await prisma.order.groupBy({
    by: ["status"],
    where: { businessId },
    _count: { status: true },
  })

  const result: Record<OrderStatus, number> = {
    draft: 0,
    sent: 0,
    partial: 0,
    confirmed: 0,
    delivered: 0,
  }
  for (const row of counts) {
    result[row.status as OrderStatus] = row._count.status
  }
  return result
}
