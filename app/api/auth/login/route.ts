import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { prisma } = require("@/lib/prisma") as any

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Return success — login will be handled by NextAuth
    return NextResponse.json(
      { success: true, userId: user.id },
      { status: 200 }
    )
  } catch (error) {
    console.error("[api/auth/login] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
