import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { db, isDatabaseConfigured } from "./db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: isDatabaseConfigured() ? PrismaAdapter(db) : undefined,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "demo-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo-google-client-secret",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !isDatabaseConfigured()) return null

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email as string },
            include: { subscription: true },
          })
          if (!user || !user.password) return null
          const valid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )
          if (!valid) return null
          return user
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        if (isDatabaseConfigured() && user.id) {
          try {
            const sub = await db.subscription.findUnique({
              where: { userId: user.id },
            })
            token.plan = sub?.plan ?? "FREE"
          } catch {
            token.plan = "FREE"
          }
        } else {
          token.plan = (user as { plan?: string }).plan ?? "FREE"
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as { id?: string; plan?: string }).id = token.id as string | undefined
        ;(session.user as { id?: string; plan?: string }).plan = (token.plan as string) || "FREE"
      }
      return session
    },
  },
})
