import { NextRequest, NextResponse } from "next/server"
import { callClaude, isClaudeConfigured } from "@/lib/claude"
import { db, isDatabaseConfigured } from "@/lib/db"
import { PORTFOLIO_REVIEW_SYSTEM } from "@/lib/prompts"
import { checkRateLimit } from "@/lib/redis"
import { PERSONAL_DATA_DATABASE_ERROR, requirePro } from "@/lib/utils"
import { PortfolioAiReview } from "@/types"

const FALLBACK_PORTFOLIO_REVIEW: PortfolioAiReview = {
  strongPositions: {
    title: "TATASTEEL & RELIANCE Outperforming",
    detail: "TATASTEEL (+20.3%) and RELIANCE (+12.8%) are leading portfolio alpha on strong institutional accumulation. Consider reviewing partial profit-booking levels near ₹160 resistance on TATASTEEL.",
  },
  underperformers: {
    title: "WIPRO & INFY Relative Drag",
    detail: "WIPRO is down 3.5% while sector peers average +2.1%; consider reviewing Q2 guidance before adding. INFY is testing key support near ₹1,880.",
  },
  concentrationRisk: {
    title: "38% IT Sector Weighting",
    detail: "IT services (INFY + WIPRO) account for 38% of total capital deployed. Consider reviewing diversification into defensive Pharma or FMCG names to reduce global tech beta.",
  },
  topAction: "Review IT allocation concentration (38% weight) and set a trailing stop on TATASTEEL gains.",
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePro()
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: PERSONAL_DATA_DATABASE_ERROR }, { status: 503 })
    }
    const rate = await checkRateLimit(`portfolio-ai:${user.id}`, 3)
    if (!rate.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded (max 3 AI portfolio reviews per day)." },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const holdings = body.holdings || []

    if (!isClaudeConfigured()) {
      return NextResponse.json({ error: "Configure ANTHROPIC_API_KEY to enable portfolio reviews." }, { status: 503 })
    }
    if (!Array.isArray(holdings) || holdings.length === 0) {
      return NextResponse.json({ error: "Add portfolio holdings before requesting a review." }, { status: 400 })
    }

    const totalValue = holdings.reduce(
      (sum: number, h: { quantity: number; currentPrice: number }) => sum + h.quantity * h.currentPrice,
      0
    )

    const userMsg = `Review this portfolio:
${holdings
      .map(
        (h: { symbol: string; quantity: number; buyPrice: number; currentPrice: number }) => {
          const pnlPct = (((h.currentPrice - h.buyPrice) / h.buyPrice) * 100).toFixed(1)
          return `- ${h.symbol}: ${h.quantity} shares @ buy ₹${h.buyPrice}, now ₹${h.currentPrice} (${pnlPct}%)`
        }
      )
      .join("\n")}
Total portfolio value: ₹${totalValue}
Please identify patterns, risks, and notable observations.`

    const rawResponse = await callClaude(PORTFOLIO_REVIEW_SYSTEM, userMsg)
    const review = JSON.parse(rawResponse) as PortfolioAiReview

    if (isDatabaseConfigured()) {
      await db.aiFeedback.create({
        data: {
          userId: user.id,
          type: "PORTFOLIO",
          content: review as unknown as object,
        },
      })
    }

    return NextResponse.json({
      review,
      disclaimer: "Note: Portfolio AI review is a mock fundamental analysis based on Claude's knowledge, NOT real-time financial data.",
    })
  } catch (error) {
    const status = error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 500
    return NextResponse.json({ error: "Failed to generate portfolio review." }, { status })
  }
}
