import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/lib/db"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      businessId: string
      role: string
    }
  }
  interface User {
    businessId: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    businessId: string
    role: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const user = await getUserByEmail(credentials.email)
          if (!user || !user.passwordHash) return null

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.passwordHash,
          )
          if (!passwordMatch) return null

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            businessId: user.businessId,
            role: user.role,
          }
        } catch {
          // DB not yet connected (e.g. DATABASE_URL not set in this env) —
          // fall through to null so the app still renders without crashing.
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.businessId = user.businessId
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.businessId = token.businessId
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "orderroom-dev-secret-change-in-prod",
}
