import { NextResponse } from "next/server"
import { getCuratedNewsWithSource } from "@/lib/rss"
import { getSessionOrDemoUser } from "@/lib/utils"

export async function GET() {
  try {
    const user = await getSessionOrDemoUser()
    const { items, source } = await getCuratedNewsWithSource()
    const isPro = user.plan === "PRO"
    return NextResponse.json({
      items: isPro ? items : items.slice(0, 3),
      isPro,
      source,
    })
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch news wire", detail: String(err) }, { status: 500 })
  }
}
