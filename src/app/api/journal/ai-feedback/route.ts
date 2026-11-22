import { NextRequest, NextResponse } from "next/server"
import { callClaude, isClaudeConfigured } from "@/lib/claude"
import { db, isDatabaseConfigured } from "@/lib/db"
import { JOURNAL_ANALYSIS_SYSTEM } from "@/lib/prompts"
import { checkRateLimit } from "@/lib/redis"
import { PERSONAL_DATA_DATABASE_ERROR, requirePro } from "@/lib/utils"
import { JournalAiFeedback } from "@/types"

const FALLBACK_FEEDBACK: JournalAiFeedback = {
  positivePattern: {
    title: "Consistent Stop Discipline",
    detail: "In 3 out of 4 setups, exits were pre-planned and respected without moving stop-losses. Morning ORB and VWAP setups yielded an 85% win rate this month.",
    impactPoints: 8,
  },
  leakDetected: {
    title: "Mid-Day Overtrading",
    detail: "01:18 PM Nifty 24980 CE trade was entered during the midday chop zone (11:30 AM – 1:15 PM IST) when theta decay accelerates and directional momentum fades.",
    estimatedLoss: 4200,
    flag: "MIDDAY_CHOP",
  },
  recommendation: {
    title: "Enforce Midday Desk Lockout",
    detail: "Limit index option scalping to the 09:15–11:00 AM window. Cap maximum risk per expiry trade at ₹3,000 and mandate a 15-minute cooldown after any stopped trade.",
    priority: "HIGH",
    ruleLabel: "No Trading Midday Chop (11:30 AM – 1:15 PM)",
  },
}

function parseFeedback(rawResponse: string): JournalAiFeedback {
  const jsonMatch = rawResponse.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error("AI returned no coaching JSON.")
  const result = JSON.parse(jsonMatch[0]) as Partial<JournalAiFeedback>
  if (
    !result.positivePattern ||
    !result.leakDetected ||
    !result.recommendation ||
    typeof result.positivePattern.title !== "string" ||
    typeof result.leakDetected.title !== "string" ||
    typeof result.recommendation.title !== "string"
  ) {
    throw new Error("AI returned an incomplete coaching response.")
  }
  return result as JournalAiFeedback
}

export async function POST(_req: NextRequest) {
  try {
    const user = await requirePro()
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
    }

    const rate = await checkRateLimit(`journal-ai:${user.id}`, 3)
    if (!rate.success) {
      return NextResponse.json(
        { error: "Daily AI coaching limit (3/day) reached. Resets at midnight IST." },
        { status: 429 }
      )
    }

    if (!isClaudeConfigured()) {
      return NextResponse.json({ error: "Configure GROQ_API_KEY to enable trade coaching." }, { status: 503 })
    }

    const trades = await db.trade.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 30,
    })
    if (trades.length === 0) {
      return NextResponse.json({ error: "Log trades before requesting coaching." }, { status: 400 })
    }

    const tradeSummary = trades.map((t) => ({
      date: t.date.toISOString().split("T")[0],
      symbol: t.symbol,
      direction: t.direction,
      entry: t.entryPrice,
      exit: t.exitPrice,
      pnl: t.pnl,
      strategy: t.strategyTag,
      disciplineChecks: t.disciplineChecks,
      notes: t.notes,
    }))

    const userMessage = `Analyze these ${trades.length} trades and provide coaching feedback:
${JSON.stringify(
      tradeSummary,
      null,
      2
    )}
Focus on: behavioral patterns, discipline issues, timing problems, sizing errors.`

    const rawResponse = await callClaude(JOURNAL_ANALYSIS_SYSTEM, userMessage)
    const feedback = parseFeedback(rawResponse)

    await db.aiFeedback.create({
      data: {
        userId: user.id,
        type: "SESSION",
        content: feedback as unknown as object,
      },
    })

    return NextResponse.json({ feedback, remainingQuota: rate.remaining })
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Please sign in to request journal analysis." }, { status: 401 })
    }
    if (error instanceof Error && error.message === "UPGRADE_REQUIRED") {
      return NextResponse.json({ error: "Pro subscription is required for AI journal analysis." }, { status: 402 })
    }
    console.error("Journal AI analysis failed:", error)
    return NextResponse.json({ error: "Failed to generate journal analysis. Check the AI provider configuration and retry." }, { status: 502 })
  }
}
