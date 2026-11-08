import { NextResponse } from "next/server"
import { SCREENER_CATALOG } from "@/lib/screener-catalog"

export async function GET() {
  return NextResponse.json({ screeners: SCREENER_CATALOG })
}
