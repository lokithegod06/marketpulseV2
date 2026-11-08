import { NextResponse } from "next/server"
import { db, isDatabaseConfigured } from "@/lib/db"
import { getSessionOrDemoUser, PERSONAL_DATA_DATABASE_ERROR } from "@/lib/utils"

export async function GET() {
  try {
    const user = await getSessionOrDemoUser()
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
    }
    const [scores, trades] = await Promise.all([
      db.disciplineScore.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
        take: 30,
      }),
      db.trade.findMany({
        where: { userId: user.id },
        select: { date: true },
        orderBy: { date: "desc" },
        take: 90,
      }),
    ])
    const dateKey = (date: Date) => date.toISOString().slice(0, 10)
    const previousTradingDay = (date: Date) => {
      const previous = new Date(date)
      previous.setUTCDate(previous.getUTCDate() - 1)
      if (previous.getUTCDay() === 0) previous.setUTCDate(previous.getUTCDate() - 2)
      if (previous.getUTCDay() === 6) previous.setUTCDate(previous.getUTCDate() - 1)
      return previous
    }
    const tradeDates = Array.from(new Set(trades.map((trade) => dateKey(trade.date))))
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const mostRecentAllowed = dateKey(
      today.getUTCDay() === 0 || today.getUTCDay() === 1
        ? previousTradingDay(today)
        : today
    )
    let streak = 0
    if (tradeDates.length && (tradeDates[0] === dateKey(today) || tradeDates[0] === mostRecentAllowed)) {
      streak = 1
      let expected = previousTradingDay(new Date(`${tradeDates[0]}T00:00:00.000Z`))
      for (const date of tradeDates.slice(1)) {
        if (date !== dateKey(expected)) break
        streak += 1
        expected = previousTradingDay(expected)
      }
    }
    return NextResponse.json({
      currentScore: trades.length ? scores[0]?.score ?? null : null,
      streak: trades.length ? streak : null,
      history30d: scores.map((score) => score.score),
      scores,
    })
  } catch (error) {
    const status = error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 500
    return NextResponse.json({ error: "Failed to fetch discipline score." }, { status })
  }
}
