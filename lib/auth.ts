import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { getUserByEmail, createBusiness, createUser } from "@/lib/db"

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
    // Credentials (email + password)
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
          // DB not yet connected — fall through so the app renders without crashing.
          return null
        }
      },
    }),

    // Google OAuth
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId:     process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    /**
     * signIn — called for every provider.
     * For Google OAuth: auto-provision a Business + User row on first sign-in.
     */
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const existing = await getUserByEmail(user.email)
          if (!existing) {
            const business = await createBusiness({
              name:  user.name ?? user.email.split("@")[0],
              email: user.email,
              type:  "restaurant",
            })
            const newUser = await createUser({
              name:         user.name ?? "Owner",
              email:        user.email,
              passwordHash: "", // no password for OAuth users
              role:         "owner",
              businessId:   business.id,
            })
            // Attach to the NextAuth user object for the jwt callback
            user.id         = newUser.id
            user.businessId = newUser.businessId
            user.role       = newUser.role
          } else {
            user.id         = existing.id
            user.businessId = existing.businessId
            user.role       = existing.role
          }
        } catch {
          // DB not reachable — allow sign-in anyway so Google flow doesn't break
        }
      }
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.id         = user.id
        token.businessId = user.businessId
        token.role       = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id         = token.id
        session.user.businessId = token.businessId
        session.user.role       = token.role
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
