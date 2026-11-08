import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL
  return Boolean(url && !url.includes("ep-xxx.neon.tech") && !url.includes("user:pass"))
}
