import { NextResponse } from "next/server"
import { db, isDatabaseConfigured } from "@/lib/db"
import { evaluateTradesAgainstRules } from "@/lib/discipline"
import { getSessionOrDemoUser, PERSONAL_DATA_DATABASE_ERROR } from "@/lib/utils"

function getUtcDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function previousTradingDay(date: Date) {
  const previous = new Date(date)
  previous.setUTCDate(previous.getUTCDate() - 1)
  if (previous.getUTCDay() === 0) previous.setUTCDate(previous.getUTCDate() - 2)
  if (previous.getUTCDay() === 6) previous.setUTCDate(previous.getUTCDate() - 1)
  return previous
}

export async function GET() {
  try {
    const user = await getSessionOrDemoUser()
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
    }

    const [trades, scores, rules] = await Promise.all([
      db.trade.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
        take: 90,
      }),
      db.disciplineScore.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
        take: 30,
      }),
      db.disciplineRule.findMany({
        where: { userId: user.id, isActive: true },
        orderBy: { createdAt: "asc" },
      }),
    ])

    const tradeDates = Array.from(new Set(trades.map((trade) => getUtcDateKey(trade.date))))
    let streak = 0
    if (tradeDates.length > 0) {
      const current = new Date(`${tradeDates[0]}T00:00:00.000Z`)
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)
      const mostRecentAllowed = getUtcDateKey(
        today.getUTCDay() === 0 || today.getUTCDay() === 1
          ? previousTradingDay(today)
          : today
      )

      if (tradeDates[0] === getUtcDateKey(today) || tradeDates[0] === mostRecentAllowed) {
        streak = 1
        let expected = previousTradingDay(current)
        for (const date of tradeDates.slice(1)) {
          if (date !== getUtcDateKey(expected)) break
          streak += 1
          expected = previousTradingDay(expected)
        }
      }
    }

    const checkedCount = trades.reduce((count, trade) => {
      const checks = Array.isArray(trade.disciplineChecks)
        ? (trade.disciplineChecks as { checked?: boolean }[])
        : []
      return count + checks.filter((check) => check.checked).length
    }, 0)
    const checkCount = trades.reduce((count, trade) => {
      const checks = Array.isArray(trade.disciplineChecks) ? trade.disciplineChecks : []
      return count + checks.length
    }, 0)
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const tradesToday = trades.filter((trade) => trade.date >= today)
    const calculated = evaluateTradesAgainstRules(
      tradesToday.map((trade) => ({
        direction: trade.direction,
        pnl: trade.pnl ? Number(trade.pnl) : 0,
        disciplineChecks: Array.isArray(trade.disciplineChecks)
          ? (trade.disciplineChecks as { label: string; checked: boolean }[])
          : [],
      }))
    )
    const currentScore =
      trades.length === 0
        ? null
        : scores[0]?.score ?? (tradesToday.length ? calculated.score : null)

    return NextResponse.json({
      hasActivity: trades.length > 0,
      tradeCount: trades.length,
      currentScore,
      streak,
      compliancePct: checkCount ? Math.round((checkedCount / checkCount) * 100) : null,
      rules,
      recentScores: scores,
    })
  } catch (error) {
    const status = error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 500
    return NextResponse.json({ error: "Failed to fetch discipline data." }, { status })
  }
}
