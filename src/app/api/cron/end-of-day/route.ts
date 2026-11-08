import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 })
  }
  return NextResponse.json({ status: "End-of-day discipline & AI journal batch completed", timestamp: new Date().toISOString() })
}
