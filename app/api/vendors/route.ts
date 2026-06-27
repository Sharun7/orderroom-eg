/**
 * GET  /api/vendors  — list all vendors + products for the session business
 * POST /api/vendors  — create a vendor and optionally seed initial products
 */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  getVendorsWithProducts,
  createVendor,
  createProduct,
  getSubscription,
  getVendorCount,
  type VendorCategory,
  type ProductUnit,
  type Product,
} from "@/lib/db"

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const vendors = await getVendorsWithProducts(session.user.businessId)
    return NextResponse.json({ vendors })
  } catch (err) {
    console.error("[api/vendors GET]", err)
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// POST
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, phone, category, products } = body as {
      name: string
      email: string
      phone?: string
      category: VendorCategory
      products?: { name: string; unit: ProductUnit; defaultQty?: number }[]
    }

    if (!name || !email || !category) {
      return NextResponse.json(
        { error: "name, email, and category are required" },
        { status: 400 },
      )
    }

    // ── Plan limit enforcement ──────────────────────────────────────────────
    const [sub, vendorCount] = await Promise.all([
      getSubscription(session.user.businessId).catch(() => null),
      getVendorCount(session.user.businessId).catch(() => 0),
    ])
    const vendorLimit = sub?.vendorLimit ?? 1  // default: Free plan = 1 vendor
    if (vendorCount >= vendorLimit) {
      return NextResponse.json(
        {
          error:       "Vendor limit reached",
          vendorLimit,
          vendorCount,
          currentPlan: sub?.plan ?? "free",
          upgradeUrl:  "/billing",
        },
        { status: 403 },
      )
    }
    // ───────────────────────────────────────────────────────────────────────

    const vendor = await createVendor({
      name,
      email,
      phone,
      category,
      businessId: session.user.businessId,
    })

    // Seed initial products if provided
    let seededProducts: Product[] = []
    if (products?.length) {
      seededProducts = await Promise.all(
        products.map((p) =>
          createProduct({
            name: p.name,
            unit: p.unit,
            defaultQty: p.defaultQty ?? 1,
            vendorId: vendor.id,
          }),
        ),
      )
    }

    return NextResponse.json({ vendor: { ...vendor, products: seededProducts } }, { status: 201 })
  } catch (err) {
    console.error("[api/vendors POST]", err)
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 })
  }
}
