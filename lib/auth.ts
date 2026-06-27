import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Mock user store — replace with Aurora PostgreSQL query in production
const MOCK_USERS = [
  {
    id: "u1",
    email: "demo@orderroom.io",
    password: "demo1234",
    name: "Alex Rivera",
    businessId: "b1",
    businessName: "The Harbor Restaurant",
  },
]

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
        const user = MOCK_USERS.find(
          (u) => u.email === credentials.email && u.password === credentials.password,
        )
        if (!user) return null
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          businessId: user.businessId,
          businessName: user.businessName,
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
        token.businessId = (user as any).businessId
        token.businessName = (user as any).businessName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).businessId = token.businessId
        ;(session.user as any).businessName = token.businessName
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
