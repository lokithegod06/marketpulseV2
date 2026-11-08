// src/lib/discipline.ts
// Section 2.3: Rule-based Discipline Scoring Algorithm (0–100)
import { db, isDatabaseConfigured } from "./db"

export interface ViolationItem {
  rule: string
  deduction: number
  timestamp: string
}

export interface DisciplineEvaluation {
  score: number
  baseScore: number
  violations: ViolationItem[]
  perfectDayBonus: number
}

export function evaluateTradesAgainstRules(
  tradesToday: {
    direction: string
    pnl?: number | null
    disciplineChecks?: { label: string; checked: boolean }[]
    createdAt?: Date | string
  }[],
  maxTradesLimit = 3,
  maxDailyLoss = 5000
): DisciplineEvaluation {
  const baseScore = 100
  let totalDeductions = 0
  const violations: ViolationItem[] = []

  // 1. Check extra trades over daily limit (-5 points per extra trade)
  if (tradesToday.length > maxTradesLimit) {
    const extra = tradesToday.length - maxTradesLimit
    const deduction = extra * 5
    totalDeductions += deduction
    violations.push({
      rule: `Trade over daily limit (${tradesToday.length}/${maxTradesLimit})`,
      deduction,
      timestamp: new Date().toISOString(),
    })
  }

  // 2. Check cumulative stop-loss breach (-8 points)
  const netLoss = tradesToday.reduce((acc, t) => acc + Number(t.pnl || 0), 0)
  if (netLoss < -Math.abs(maxDailyLoss)) {
    totalDeductions += 8
    violations.push({
      rule: `Hard Daily Stop Loss breached (₹${Math.abs(netLoss)})`,
      deduction: 8,
      timestamp: new Date().toISOString(),
    })
  }

  // 3. Check individual trade checklist items (stop-loss override, midday chop, revenge trade)
  tradesToday.forEach((trade) => {
    const checks = Array.isArray(trade.disciplineChecks) ? trade.disciplineChecks : []
    checks.forEach((c) => {
      if (!c.checked) {
        const lower = c.label.toLowerCase()
        if (lower.includes("stop loss")) {
          totalDeductions += 8
          violations.push({
            rule: "Stop loss breach (manual override)",
            deduction: 8,
            timestamp: new Date().toISOString(),
          })
        } else if (lower.includes("midday") || lower.includes("chop")) {
          totalDeductions += 5
          violations.push({
            rule: "Midday chop trade (11:30–1:15 PM)",
            deduction: 5,
            timestamp: new Date().toISOString(),
          })
        } else if (lower.includes("revenge")) {
          totalDeductions += 8
          violations.push({
            rule: "Revenge trade detected",
            deduction: 8,
            timestamp: new Date().toISOString(),
          })
        } else {
          totalDeductions += 2
          violations.push({
            rule: `Unchecked rule: ${c.label}`,
            deduction: 2,
            timestamp: new Date().toISOString(),
          })
        }
      }
    })
  })

  const perfectDayBonus = violations.length === 0 && tradesToday.length > 0 ? 2 : 0
  const score = Math.max(0, Math.min(100, baseScore - totalDeductions))

  return {
    score,
    baseScore,
    violations,
    perfectDayBonus,
  }
}

export async function checkDisciplineRules(userId: string, _latestTrade?: unknown) {
  if (!isDatabaseConfigured()) throw new Error("DATABASE_UNAVAILABLE")

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const tradesToday = await db.trade.findMany({
    where: {
      userId,
      date: { gte: startOfDay },
    },
  })

  const evaluation = evaluateTradesAgainstRules(
    tradesToday.map((t) => ({
      direction: t.direction,
      pnl: t.pnl ? Number(t.pnl) : 0,
      disciplineChecks: (t.disciplineChecks as { label: string; checked: boolean }[]) || [],
      createdAt: t.createdAt,
    }))
  )

  const todayDate = new Date(new Date().toISOString().split("T")[0])

  await db.disciplineScore.upsert({
    where: {
      userId_date: {
        userId,
        date: todayDate,
      },
    },
    update: {
      score: evaluation.score,
      violations: evaluation.violations as unknown as object,
    },
    create: {
      userId,
      date: todayDate,
      score: evaluation.score,
      baseScore: 100,
      violations: evaluation.violations as unknown as object,
    },
  })

  return evaluation
}
