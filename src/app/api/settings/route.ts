import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db, isDatabaseConfigured } from "@/lib/db"
import { getSessionOrDemoUser, PERSONAL_DATA_DATABASE_ERROR } from "@/lib/utils"

const SettingsSchema = z.object({
  handle: z.string().trim().optional(),
  leaderboardOpt: z.boolean(),
  maxTrades: z.number().int().min(1).max(100),
  maxLoss: z.number().positive(),
  tradingStart: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  tradingEnd: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  minRiskReward: z.number().positive(),
})

export async function GET() {
  const user = await getSessionOrDemoUser()
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
  }

  const [profile, rules] = await Promise.all([
    db.user.findUnique({
      where: { id: user.id },
      select: { handle: true, leaderboardOpt: true },
    }),
    db.disciplineRule.findMany({
      where: { userId: user.id, isActive: true },
      orderBy: { createdAt: "asc" },
    }),
  ])

  const maxTradesRule = rules.find((rule) => rule.ruleType === "MAX_TRADES_PER_DAY")
  const stopLossRule = rules.find((rule) => rule.ruleType === "HARD_STOP_LOSS")
  const windowRule = rules.find((rule) => rule.ruleType === "NO_TRADING_WINDOW")
  const rrRule = rules.find((rule) => rule.ruleType === "MIN_RISK_REWARD")

  return NextResponse.json({
    handle: profile?.handle || "",
    leaderboardOpt: profile?.leaderboardOpt ?? true,
    maxTrades: (maxTradesRule?.value as { maxTrades?: number })?.maxTrades || 3,
    maxLoss: (stopLossRule?.value as { maxLoss?: number })?.maxLoss || 5000,
    tradingStart: (windowRule?.value as { startTime?: string })?.startTime || "09:15",
    tradingEnd: (windowRule?.value as { endTime?: string })?.endTime || "15:15",
    minRiskReward: (rrRule?.value as { minRiskReward?: number })?.minRiskReward || 1,
  })
}

export async function POST(req: NextRequest) {
  const user = await getSessionOrDemoUser()
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
  }

  const parsed = SettingsSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  await db.user.update({
    where: { id: user.id },
    data: {
      handle: data.handle || null,
      leaderboardOpt: data.leaderboardOpt,
    },
  })

  await db.disciplineRule.deleteMany({
    where: {
      userId: user.id,
      ruleType: { in: ["MAX_TRADES_PER_DAY", "HARD_STOP_LOSS", "NO_TRADING_WINDOW", "MIN_RISK_REWARD"] },
    },
  })

  await db.disciplineRule.createMany({
    data: [
      {
        userId: user.id,
        label: "Maximum trades per day",
        description: `Limit trading to ${data.maxTrades} entries per day.`,
        ruleType: "MAX_TRADES_PER_DAY",
        value: { maxTrades: data.maxTrades },
      },
      {
        userId: user.id,
        label: "Hard daily stop loss",
        description: `Stop trading after ₹${data.maxLoss.toLocaleString("en-IN")} daily loss.`,
        ruleType: "HARD_STOP_LOSS",
        value: { maxLoss: data.maxLoss },
      },
      {
        userId: user.id,
        label: "Allowed trading window",
        description: `Trade only from ${data.tradingStart} to ${data.tradingEnd}.`,
        ruleType: "NO_TRADING_WINDOW",
        value: { startTime: data.tradingStart, endTime: data.tradingEnd },
      },
      {
        userId: user.id,
        label: "Minimum risk-to-reward",
        description: `Do not enter trades below a 1:${data.minRiskReward} risk-to-reward ratio.`,
        ruleType: "MIN_RISK_REWARD",
        value: { minRiskReward: data.minRiskReward },
      },
    ],
  })

  return NextResponse.json({ saved: true })
}
