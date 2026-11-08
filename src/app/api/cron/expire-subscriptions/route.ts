import { NextRequest, NextResponse } from "next/server"
import { db, isDatabaseConfigured } from "@/lib/db"

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 })
  }
  if (isDatabaseConfigured()) {
    await db.subscription.updateMany({
      where: {
        status: "CANCELLED",
        currentPeriodEnd: { lt: new Date() },
      },
      data: {
        plan: "FREE",
      },
    })
  }
  return NextResponse.json({ status: "Expired cancelled subscriptions downgraded to FREE" })
}
