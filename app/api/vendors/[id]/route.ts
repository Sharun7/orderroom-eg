/**
 * PUT    /api/vendors/[id] — update vendor name, email, phone, category
 * DELETE /api/vendors/[id] — soft-delete (hard delete for now, no data loss risk)
 */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getVendorById, updateVendor, deleteVendor, type VendorCategory } from "@/lib/db"

// ---------------------------------------------------------------------------
// PUT
// ---------------------------------------------------------------------------

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { name, email, phone, category } = body as {
      name?: string
      email?: string
      phone?: string
      category?: VendorCategory
    }

    // Confirm the vendor belongs to this business
    const existing = await getVendorById(id, session.user.businessId)
    if (!existing) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    const vendor = await updateVendor(id, session.user.businessId, {
      ...(name     && { name }),
      ...(email    && { email }),
      ...(phone    !== undefined && { phone }),
      ...(category && { category }),
    })

    return NextResponse.json({ vendor })
  } catch (err) {
    console.error("[api/vendors/[id] PUT]", err)
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const existing = await getVendorById(id, session.user.businessId)
    if (!existing) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    await deleteVendor(id, session.user.businessId)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[api/vendors/[id] DELETE]", err)
    return NextResponse.json({ error: "Failed to delete vendor" }, { status: 500 })
  }
}
