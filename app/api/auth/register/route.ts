/**
 * POST /api/auth/register
 * Creates a new Business + owner User in Aurora PostgreSQL.
 * Hashes the password with bcryptjs (12 rounds).
 *
 * Body: { businessName, businessType, name, email, password }
 */
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createBusiness, createUser, getUserByEmail } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { businessName, businessType, name, email, password } = body as {
      businessName: string
      businessType: string
      name: string
      email: string
      password: string
    }

    if (!businessName || !name || !email || !password) {
      return NextResponse.json(
        { error: "businessName, name, email, and password are required" },
        { status: 400 },
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      )
    }

    // Duplicate check
    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create business
    const business = await createBusiness({
      name: businessName,
      email,
      type: (businessType as "restaurant" | "hotel" | "catering") ?? "restaurant",
    })

    // Create owner user
    const user = await createUser({
      name,
      email,
      passwordHash,
      role: "owner",
      businessId: business.id,
    })

    return NextResponse.json(
      { user: { id: user.id, name: user.name, email: user.email, businessId: user.businessId } },
      { status: 201 },
    )
  } catch (err) {
    console.error("[api/auth/register POST]", err)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
