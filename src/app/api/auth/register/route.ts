import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { db, isDatabaseConfigured } from "@/lib/db"
import { PERSONAL_DATA_DATABASE_ERROR } from "@/lib/utils"

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  handle: z.string().min(3).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = RegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
    }

    const existing = await db.user.findUnique({ where: { email: parsed.data.email } })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10)
    const user = await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword,
        handle: parsed.data.handle || parsed.data.email.split("@")[0],
        subscription: {
          create: {
            plan: "FREE",
            status: "TRIALING",
          },
        },
      },
    })

    return NextResponse.json(
      { user: { id: user.id, name: user.name, email: user.email, handle: user.handle } },
      { status: 201 }
    )
  } catch (err) {
    return NextResponse.json({ error: "Registration failed", detail: String(err) }, { status: 500 })
  }
}
