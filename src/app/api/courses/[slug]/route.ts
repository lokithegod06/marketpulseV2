import { NextRequest, NextResponse } from "next/server"
import { DEFAULT_COURSES } from "@/lib/courses"
import { requirePro } from "@/lib/utils"

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await requirePro()
    const course = DEFAULT_COURSES.find((c) => c.slug === params.slug) || DEFAULT_COURSES[0]
    return NextResponse.json({ course })
  } catch {
    return NextResponse.json({ error: "Pro subscription required to read full course modules" }, { status: 403 })
  }
}
