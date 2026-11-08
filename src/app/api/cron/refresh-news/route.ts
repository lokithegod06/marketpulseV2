import { NextRequest, NextResponse } from "next/server"
import { getCuratedNews } from "@/lib/rss"

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 })
  }
  const items = await getCuratedNews()
  return NextResponse.json({ refreshed: true, count: items.length })
}
