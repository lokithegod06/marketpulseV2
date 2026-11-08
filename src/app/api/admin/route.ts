import { NextRequest, NextResponse } from "next/server"
import { db, isDatabaseConfigured } from "@/lib/db"
import { getSessionOrDemoUser } from "@/lib/utils"

export async function POST(req: NextRequest) {
  const user = await getSessionOrDemoUser()
  const body = await req.json()
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ created: true, course: body, author: user.email })
  }
  const course = await db.course.create({
    data: {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category || "STRATEGY",
      difficulty: body.difficulty || "INTERMEDIATE",
      isPublished: Boolean(body.isPublished),
    },
  })
  return NextResponse.json({ course }, { status: 201 })
}
