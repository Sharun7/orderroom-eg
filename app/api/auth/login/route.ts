import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      )
    }

    // Demo mode: Accept demo credentials without database
    if (email === "demo@orderroom.io" && password === "demo1234") {
      return NextResponse.json(
        { 
          success: true, 
          userId: "demo-user-id",
          email: email,
          name: "Alex Rivera"
        },
        { status: 200 }
      )
    }

    // For production, try to use real database
    try {
      const { prisma } = await import("@/lib/prisma")
      
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

      return NextResponse.json(
        { success: true, userId: user.id },
        { status: 200 }
      )
    } catch (dbError) {
      console.error("[api/auth/login] Database error:", dbError)
      // If database is not available, reject non-demo credentials
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error("[api/auth/login] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
