/**
 * GET|POST /api/auth/[...nextauth]
 * NextAuth.js catch-all route handler (App Router style).
 */
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
