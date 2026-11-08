import { PrismaClient, CourseCategory, CourseDifficulty, RuleType, TradeDir } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding Market Pulse database...")

  const hashedPassword = await bcrypt.hash("MarketPulse@2026", 10)

  // 1. Create Demo Pro Trader User (Arjun Mehta)
  const demoUser = await prisma.user.upsert({
    where: { email: "arjun@marketpulse.in" },
    update: {},
    create: {
      name: "Arjun Mehta",
      email: "arjun@marketpulse.in",
      password: hashedPassword,
      handle: "arjun_trader",
      leaderboardOpt: true,
      subscription: {
        create: {
          plan: "PRO",
          status: "ACTIVE",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
  })

  // 2. Seed Default Discipline Rules
  const defaultRules = [
    {
      label: "Max 3 Trades Per Session",
      description: "Execution limit to suppress dopamine-driven intraday overtrading.",
      ruleType: RuleType.MAX_TRADES_PER_DAY,
      value: { maxTrades: 3 },
      penaltyPoints: 5,
    },
    {
      label: "Hard Daily Stop Loss: ₹5,000",
      description: "Terminal closes all active brackets and locks login upon trigger.",
      ruleType: RuleType.HARD_STOP_LOSS,
      value: { maxDailyLoss: 5000 },
      penaltyPoints: 8,
    },
    {
      label: "No Trading Midday Chop (11:30–1:15 PM)",
      description: "Sideways theta crush buffer zone during European open transition.",
      ruleType: RuleType.NO_TRADING_WINDOW,
      value: { startTime: "11:30", endTime: "13:15" },
      penaltyPoints: 5,
    },
    {
      label: "Risk-to-Reward Minimum 1:2.0",
      description: "Enforces mathematical edge. Sub-1:2 orders flagged automatically.",
      ruleType: RuleType.MIN_RISK_REWARD,
      value: { minRatio: 2.0 },
      penaltyPoints: 4,
    },
    {
      label: "No Revenge Trades After a Loss",
      description: "Compulsory 30-minute system freeze following any stopped position.",
      ruleType: RuleType.NO_REVENGE_TRADE_WINDOW,
      value: { cooldownMinutes: 30 },
      penaltyPoints: 8,
    },
  ]

  await prisma.disciplineRule.deleteMany({ where: { userId: demoUser.id } })
  for (const rule of defaultRules) {
    await prisma.disciplineRule.create({
      data: { ...rule, userId: demoUser.id },
    })
  }

  // 3. Seed Sample Trades
  await prisma.trade.deleteMany({ where: { userId: demoUser.id } })
  const sampleTrades = [
    {
      symbol: "BANKNIFTY 29AUG 51200 CE",
      exchange: "NSE",
      direction: TradeDir.BUY,
      entryPrice: 245.5,
      exitPrice: 310.0,
      quantity: 300,
      lots: 4,
      strategyTag: "Opening Range Breakout (ORB)",
      disciplineChecks: [
        { label: "Followed pre-defined hard stop loss", checked: true },
        { label: "Confirmed candle close before execution", checked: true },
        { label: "Position sized safely within portfolio limits", checked: true },
        { label: "Did not enter during midday chop (11:30–1:15 PM)", checked: true },
        { label: "Did not revenge-trade after a loss", checked: true },
      ],
      notes: "Clean retest of 51,000 call strike open interest buildup. Exited precisely at R2 target with patience.",
      pnl: 19350,
      isOpen: false,
    },
    {
      symbol: "NIFTY 24800 PE",
      exchange: "NSE",
      direction: TradeDir.BUY,
      entryPrice: 116.0,
      exitPrice: 149.0,
      quantity: 400,
      lots: 8,
      strategyTag: "VWAP Fade",
      disciplineChecks: [
        { label: "Followed pre-defined hard stop loss", checked: true },
        { label: "Confirmed candle close before execution", checked: true },
        { label: "Position sized safely within portfolio limits", checked: true },
      ],
      notes: "Rejection from VWAP band with rising PE OI.",
      pnl: 13200,
      isOpen: false,
    },
    {
      symbol: "TATASTEEL EQ",
      exchange: "NSE",
      direction: TradeDir.BUY,
      entryPrice: 151.0,
      exitPrice: 171.2,
      quantity: 500,
      lots: 1,
      strategyTag: "Swing Pullback",
      disciplineChecks: [
        { label: "Followed pre-defined hard stop loss", checked: true },
        { label: "Confirmed candle close before execution", checked: true },
      ],
      notes: "Metals sector breakout with 2.8x relative volume.",
      pnl: 10100,
      isOpen: false,
    },
    {
      symbol: "NIFTY 24980 CE",
      exchange: "NSE",
      direction: TradeDir.BUY,
      entryPrice: 88.0,
      exitPrice: 74.0,
      quantity: 300,
      lots: 6,
      strategyTag: "Momentum Chasing",
      disciplineChecks: [
        { label: "Followed pre-defined hard stop loss", checked: true },
        { label: "Did not enter during midday chop (11:30–1:15 PM)", checked: false },
      ],
      notes: "Entered at 1:10 PM during midday chop zone; stopped out cleanly.",
      pnl: -4200,
      isOpen: false,
    },
  ]

  for (const t of sampleTrades) {
    await prisma.trade.create({
      data: { ...t, userId: demoUser.id },
    })
  }

  // 4. Seed Sample Holdings
  await prisma.holding.deleteMany({ where: { userId: demoUser.id } })
  const holdings = [
    { symbol: "RELIANCE", exchange: "NSE", buyPrice: 2650, quantity: 50, notes: "Core energy & retail compounder" },
    { symbol: "HDFCBANK", exchange: "NSE", buyPrice: 1580, quantity: 30, notes: "Private banking leader" },
    { symbol: "INFY", exchange: "NSE", buyPrice: 1920, quantity: 40, notes: "IT large-cap allocation" },
    { symbol: "TATASTEEL", exchange: "NSE", buyPrice: 128, quantity: 200, notes: "Cyclical metals momentum" },
    { symbol: "WIPRO", exchange: "NSE", buyPrice: 510, quantity: 60, notes: "IT turnaround watch" },
  ]
  for (const h of holdings) {
    await prisma.holding.create({
      data: { ...h, userId: demoUser.id },
    })
  }

  // 5. Seed Watchlist Items
  await prisma.watchlistItem.deleteMany({ where: { userId: demoUser.id } })
  const watchlistSymbols = ["NIFTY 50", "BANKNIFTY", "RELIANCE", "HDFCBANK", "TATASTEEL", "INFY", "WIPRO", "BHARTIARTL"]
  for (let i = 0; i < watchlistSymbols.length; i++) {
    await prisma.watchlistItem.create({
      data: { userId: demoUser.id, symbol: watchlistSymbols[i], exchange: "NSE", sortOrder: i },
    })
  }

  // 6. Seed Courses (All 6 Tracks from Section 2.7)
  const courses = [
    {
      title: "Market Fundamentals & F&O Basics",
      slug: "market-fundamentals-fo-basics",
      excerpt: "Understand Nifty, options chain, CE/PE, premium decay. No fluff — just what works in Indian markets.",
      category: CourseCategory.BEGINNER,
      difficulty: CourseDifficulty.BEGINNER,
      estimatedMin: 240,
      isPublished: true,
      sortOrder: 1,
      content: `# Market Fundamentals & F&O Basics

## 1. Understanding the Indian Derivatives Ecosystem
The National Stock Exchange (NSE) accounts for the vast majority of index options volume globally. Before placing your first trade in **NIFTY 50**, **BANKNIFTY**, or **FINNIFTY**, you must understand how spot indices, futures contracts, and option strikes interact.

### Key Concepts Covered:
- **Spot vs. Futures Basis**: Why Gift Nifty and NSE Futures trade at a premium or discount to Spot.
- **Call (CE) & Put (PE) Mechanics**: Intrinsic value vs. extrinsic (time) value.
- **Lot Sizes & Margin Rules**: How SEBI peak margin regulations affect intraday option buying vs. writing.
- **Weekly Expiry Dynamics**: Navigating theta decay on Wednesday (BankNifty) and Thursday (Nifty) expiries.`,
    },
    {
      title: "Technical Analysis for Intraday",
      slug: "technical-analysis-for-intraday",
      excerpt: "VWAP, OI analysis, candlestick setups, volume profiling, and how to build a pre-market plan.",
      category: CourseCategory.INTERMEDIATE,
      difficulty: CourseDifficulty.INTERMEDIATE,
      estimatedMin: 360,
      isPublished: true,
      sortOrder: 2,
      content: `# Technical Analysis for Intraday F&O Execution

## Building Your Pre-Market Edge Before 09:15 AM IST
Professional institutional traders do not react to random 1-minute candles—they prepare scenarios using overnight Gift Nifty cues, FII/DII participant-wise Open Interest, and key pivot zones.

### Core Execution Modules:
1. **Anchored VWAP & Standard Deviation Bands**: Identifying institutional accumulation vs. retail chasing.
2. **Open Interest (OI) + Price Action Matrix**: Distinguishing Long Buildup, Short Covering, Short Buildup, and Long Unwinding.
3. **Opening Range Breakout (09:15–09:30 AM)**: Filtering high-probability breakouts from opening liquidity traps.`,
    },
    {
      title: "Options Strategies & Greeks",
      slug: "options-strategies-and-greeks",
      excerpt: "Iron condor, straddle, breakout buying — when to use each strategy and how to manage risk.",
      category: CourseCategory.OPTIONS,
      difficulty: CourseDifficulty.ADVANCED,
      estimatedMin: 480,
      isPublished: true,
      sortOrder: 3,
      content: `# Options Strategies & Real-Time Greeks

## Mastering Delta, Theta, Gamma & Vega
In Indian index options, trading direction alone is never enough. Implied Volatility (India VIX) and Gamma acceleration determine whether your option premium expands or collapses.

### Multi-Leg Playbooks:
- **Low VIX (< 13) Regime**: Directional debit spreads and gamma scalping near key OI walls.
- **High VIX (> 18) Regime**: Iron Condors, Jade Lizards, and ratio spreads with defined tail-risk hedges.
- **Expiry Day Straddle & Strangle Adjustments**: Managing delta neutrality when Nifty tests max pain.`,
    },
    {
      title: "Futures, Leverage & Swing Setups",
      slug: "futures-leverage-swing-setups",
      excerpt: "How to trade NIFTY futures, margin management, and multi-day swing setups with futures positions.",
      category: CourseCategory.FUTURES,
      difficulty: CourseDifficulty.INTERMEDIATE,
      estimatedMin: 300,
      isPublished: true,
      sortOrder: 4,
      content: `# Futures, Leverage & Multi-Day Swing Setups

## Trading Without Theta Decay
When stock or index conviction is high over a 3-to-10 day window, futures contracts combined with protective OTM puts offer linear delta participation without daily time decay.`,
    },
    {
      title: "Trading Psychology & Discipline",
      slug: "trading-psychology-and-discipline",
      excerpt: "The mental game: how to stay disciplined, deal with losses, avoid overtrading, and trade with process.",
      category: CourseCategory.PSYCHOLOGY,
      difficulty: CourseDifficulty.BEGINNER,
      estimatedMin: 180,
      isPublished: true,
      sortOrder: 5,
      content: `# Trading Psychology & Algorithmic Guardrails

## Eliminating the Behavioral Leaks Killing Your P&L
89% of retail F&O traders lose money not because of bad charting software, but because of **revenge trading**, **midday chop boredom**, and **position-size escalation** after a loss.`,
    },
    {
      title: "My Live Setups & Playbooks",
      slug: "live-setups-and-playbooks",
      excerpt: "Real setups I trade: ORB, VWAP fade, expiry straddle. Each with entry rules, SL, target, and examples.",
      category: CourseCategory.STRATEGY,
      difficulty: CourseDifficulty.ADVANCED,
      estimatedMin: 420,
      isPublished: true,
      sortOrder: 6,
      content: `# Proprietary Live Setups & Playbooks

## 20+ Rule-Based Intraday Setups
Complete checklist-driven playbooks including exact strike selection, maximum stop-loss points, position sizing formulas, and post-trade audit criteria.`,
    },
  ]

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: course,
      create: course,
    })
  }

  console.log("Database seed completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
