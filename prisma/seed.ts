/**
 * prisma/seed.ts
 * Seed the database with a demo business, user, vendors, products, and orders.
 * Run with: pnpm db:seed
 */

import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

async function main() {
  console.log("Seeding database…")

  // ------------------------------------------------------------------
  // Business
  // ------------------------------------------------------------------
  const business = await prisma.business.upsert({
    where: { email: "admin@harborrestaurant.com" },
    update: {},
    create: {
      name: "The Harbor Restaurant",
      email: "admin@harborrestaurant.com",
      phone: "+1 555-0100",
      type: "restaurant",
    },
  })

  // ------------------------------------------------------------------
  // Owner user  (password: demo1234)
  // ------------------------------------------------------------------
  const passwordHash = await bcrypt.hash("demo1234", 12)
  await prisma.user.upsert({
    where: { email: "demo@orderroom.io" },
    update: { passwordHash },
    create: {
      name: "Alex Rivera",
      email: "demo@orderroom.io",
      passwordHash,
      role: "owner",
      businessId: business.id,
    },
  })

  // ------------------------------------------------------------------
  // Vendors
  // ------------------------------------------------------------------
  const [freshFarm, primeCuts, goldenGrain, oceanSelect, alpineDairy, thermoStar] =
    await Promise.all([
      prisma.vendor.upsert({
        where: { id: "seed-vendor-1" },
        update: {},
        create: {
          id: "seed-vendor-1",
          name: "Fresh Farm Produce",
          email: "orders@freshfarm.com",
          phone: "+1 555-0101",
          category: "vegetables",
          businessId: business.id,
        },
      }),
      prisma.vendor.upsert({
        where: { id: "seed-vendor-2" },
        update: {},
        create: {
          id: "seed-vendor-2",
          name: "Prime Cuts Meats",
          email: "delivery@primecuts.com",
          phone: "+1 555-0102",
          category: "meat",
          businessId: business.id,
        },
      }),
      prisma.vendor.upsert({
        where: { id: "seed-vendor-3" },
        update: {},
        create: {
          id: "seed-vendor-3",
          name: "Golden Grain Bakery",
          email: "wholesale@goldengrain.com",
          phone: "+1 555-0103",
          category: "packaging",
          businessId: business.id,
        },
      }),
      prisma.vendor.upsert({
        where: { id: "seed-vendor-4" },
        update: {},
        create: {
          id: "seed-vendor-4",
          name: "Ocean Select Seafood",
          email: "ops@oceanselect.com",
          phone: "+1 555-0104",
          category: "meat",
          businessId: business.id,
        },
      }),
      prisma.vendor.upsert({
        where: { id: "seed-vendor-5" },
        update: {},
        create: {
          id: "seed-vendor-5",
          name: "Alpine Dairy Co.",
          email: "orders@alpinedairy.com",
          phone: "+1 555-0105",
          category: "dairy",
          businessId: business.id,
        },
      }),
      prisma.vendor.upsert({
        where: { id: "seed-vendor-6" },
        update: {},
        create: {
          id: "seed-vendor-6",
          name: "ThermoStar Beverages",
          email: "b2b@thermostar.com",
          phone: "+1 555-0106",
          category: "beverages",
          businessId: business.id,
        },
      }),
    ])

  // ------------------------------------------------------------------
  // Products
  // ------------------------------------------------------------------
  const productSeeds = [
    { id: "seed-p1",  name: "Roma Tomatoes",       unit: "kg",    defaultQty: 10, vendorId: freshFarm.id },
    { id: "seed-p2",  name: "Baby Spinach",         unit: "bag",   defaultQty: 5,  vendorId: freshFarm.id },
    { id: "seed-p3",  name: "Yellow Onions",        unit: "kg",    defaultQty: 8,  vendorId: freshFarm.id },
    { id: "seed-p4",  name: "Garlic Bulbs",         unit: "kg",    defaultQty: 2,  vendorId: freshFarm.id },
    { id: "seed-p5",  name: "Beef Tenderloin",      unit: "kg",    defaultQty: 5,  vendorId: primeCuts.id },
    { id: "seed-p6",  name: "Chicken Breast",       unit: "kg",    defaultQty: 10, vendorId: primeCuts.id },
    { id: "seed-p7",  name: "Pork Ribs",            unit: "kg",    defaultQty: 4,  vendorId: primeCuts.id },
    { id: "seed-p8",  name: "Sourdough Loaves",     unit: "piece", defaultQty: 12, vendorId: goldenGrain.id },
    { id: "seed-p9",  name: "Brioche Buns",         unit: "piece", defaultQty: 24, vendorId: goldenGrain.id },
    { id: "seed-p10", name: "All-Purpose Flour",    unit: "kg",    defaultQty: 20, vendorId: goldenGrain.id },
    { id: "seed-p11", name: "Atlantic Salmon",      unit: "kg",    defaultQty: 6,  vendorId: oceanSelect.id },
    { id: "seed-p12", name: "Sea Bass Fillets",     unit: "kg",    defaultQty: 4,  vendorId: oceanSelect.id },
    { id: "seed-p13", name: "Full-Cream Milk",      unit: "litre", defaultQty: 20, vendorId: alpineDairy.id },
    { id: "seed-p14", name: "Sparkling Water 1L",   unit: "box",   defaultQty: 4,  vendorId: thermoStar.id },
    { id: "seed-p15", name: "Fresh Orange Juice",   unit: "litre", defaultQty: 10, vendorId: thermoStar.id },
  ]

  for (const p of productSeeds) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    })
  }

  // ------------------------------------------------------------------
  // Today's Order with mixed statuses
  // ------------------------------------------------------------------
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const order = await prisma.order.upsert({
    where: { id: "seed-order-today" },
    update: {},
    create: {
      id: "seed-order-today",
      businessId: business.id,
      date: today,
      status: "partial",
      notes: "Morning service prep",
    },
  })

  // Create order items with different statuses
  await Promise.all([
    // Fresh Farm Produce → Confirmed
    prisma.orderItem.upsert({
      where: { id: "seed-oi1" },
      update: {},
      create: {
        id: "seed-oi1",
        orderId: order.id,
        vendorId: freshFarm.id,
        productId: "seed-p1", // Roma Tomatoes
        quantity: 20,
        unit: "kg",
        vendorStatus: "confirmed",
        confirmedAt: new Date(Date.now() - 3600000),
      },
    }),
    prisma.orderItem.upsert({
      where: { id: "seed-oi2" },
      update: {},
      create: {
        id: "seed-oi2",
        orderId: order.id,
        vendorId: freshFarm.id,
        productId: "seed-p2", // Baby Spinach
        quantity: 3,
        unit: "bag",
        vendorStatus: "confirmed",
        confirmedAt: new Date(Date.now() - 3600000),
      },
    }),

    // Prime Cuts Meats → Sent (pending vendor response)
    prisma.orderItem.upsert({
      where: { id: "seed-oi3" },
      update: {},
      create: {
        id: "seed-oi3",
        orderId: order.id,
        vendorId: primeCuts.id,
        productId: "seed-p5", // Beef Tenderloin
        quantity: 8,
        unit: "kg",
        vendorStatus: "pending",
      },
    }),
    prisma.orderItem.upsert({
      where: { id: "seed-oi4" },
      update: {},
      create: {
        id: "seed-oi4",
        orderId: order.id,
        vendorId: primeCuts.id,
        productId: "seed-p6", // Chicken Breast
        quantity: 15,
        unit: "kg",
        vendorStatus: "pending",
      },
    }),

    // Ocean Select Seafood → Pending
    prisma.orderItem.upsert({
      where: { id: "seed-oi5" },
      update: {},
      create: {
        id: "seed-oi5",
        orderId: order.id,
        vendorId: oceanSelect.id,
        productId: "seed-p11", // Atlantic Salmon
        quantity: 5,
        unit: "kg",
        vendorStatus: "pending",
      },
    }),

    // ThermoStar Beverages → Confirmed
    prisma.orderItem.upsert({
      where: { id: "seed-oi6" },
      update: {},
      create: {
        id: "seed-oi6",
        orderId: order.id,
        vendorId: thermoStar.id,
        productId: "seed-p14", // Sparkling Water
        quantity: 8,
        unit: "box",
        vendorStatus: "confirmed",
        confirmedAt: new Date(Date.now() - 1800000),
      },
    }),

    // Golden Grain Bakery → Delivered
    prisma.orderItem.upsert({
      where: { id: "seed-oi7" },
      update: {},
      create: {
        id: "seed-oi7",
        orderId: order.id,
        vendorId: goldenGrain.id,
        productId: "seed-p8", // Sourdough Loaves
        quantity: 15,
        unit: "piece",
        vendorStatus: "confirmed",
        confirmedAt: new Date(Date.now() - 7200000),
        deliveredAt: new Date(Date.now() - 3600000),
      },
    }),
    prisma.orderItem.upsert({
      where: { id: "seed-oi8" },
      update: {},
      create: {
        id: "seed-oi8",
        orderId: order.id,
        vendorId: goldenGrain.id,
        productId: "seed-p9", // Brioche Buns
        quantity: 20,
        unit: "piece",
        vendorStatus: "confirmed",
        confirmedAt: new Date(Date.now() - 7200000),
        deliveredAt: new Date(Date.now() - 3600000),
      },
    }),
  ])

  // ------------------------------------------------------------------
  // Subscription
  // ------------------------------------------------------------------
  await prisma.subscription.upsert({
    where: { businessId: business.id },
    update: {},
    create: {
      businessId: business.id,
      plan: "free",
      status: "active",
      vendorLimit: 1,
    },
  })

  console.log("Seed complete.")
  console.log(`  Business : ${business.name} (${business.id})`)
  console.log(`  Login    : demo@orderroom.io / demo1234`)
  console.log(`  Order    : ${order.id} (today, ${await prisma.orderItem.count({ where: { orderId: order.id } })} items)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
