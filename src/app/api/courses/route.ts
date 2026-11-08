import { NextResponse } from "next/server"
import { DEFAULT_COURSES } from "@/lib/courses"
import { db, isDatabaseConfigured } from "@/lib/db"
import { getSessionOrDemoUser } from "@/lib/utils"

export async function GET() {
  const user = await getSessionOrDemoUser()
  const isPro = user.plan === "PRO"

  if (isDatabaseConfigured()) {
    const dbCourses = await db.course.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    })
    if (dbCourses.length > 0) {
      return NextResponse.json({
        courses: dbCourses.map((c) => ({
          ...c,
          content: isPro ? c.content : null,
        })),
        isPro,
      })
    }
  }

  return NextResponse.json({
    courses: DEFAULT_COURSES.map((c) => ({
      ...c,
      content: isPro ? c.content : null,
    })),
    isPro,
  })
}
