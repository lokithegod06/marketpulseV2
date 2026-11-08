import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db, isDatabaseConfigured } from "@/lib/db"
import { getSessionOrDemoUser, PERSONAL_DATA_DATABASE_ERROR } from "@/lib/utils"

const RuleSchema = z.object({
  label: z.string().min(3),
  description: z.string().optional(),
  ruleType: z.enum([
    "MAX_TRADES_PER_DAY",
    "HARD_STOP_LOSS",
    "NO_TRADING_WINDOW",
    "MIN_RISK_REWARD",
    "NO_REVENGE_TRADE_WINDOW",
    "CUSTOM",
  ]),
  value: z.record(z.any()),
  penaltyPoints: z.number().int().min(1).max(25).default(5),
})

export async function GET() {
  const user = await getSessionOrDemoUser()
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
  }
  const rules = await db.disciplineRule.findMany({ where: { userId: user.id } })
  return NextResponse.json({ rules })
}

export async function POST(req: NextRequest) {
  const user = await getSessionOrDemoUser()
  const body = await req.json()
  const parsed = RuleSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
  }
  const rule = await db.disciplineRule.create({
    data: {
      userId: user.id,
      label: parsed.data.label,
      description: parsed.data.description,
      ruleType: parsed.data.ruleType,
      value: parsed.data.value,
      penaltyPoints: parsed.data.penaltyPoints,
    },
  })
  return NextResponse.json({ rule }, { status: 201 })
}
