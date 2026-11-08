export type PlanType = "FREE" | "PRO"
export type TradeDirection = "BUY" | "SELL"

export interface DisciplineCheckItem {
  label: string
  checked: boolean
}

export interface TradeRecord {
  id: string
  userId?: string
  date: string
  time?: string
  symbol: string
  exchange: string
  direction: TradeDirection
  entryPrice: number
  exitPrice?: number | null
  quantity: number
  lots?: number | null
  strategyTag?: string | null
  disciplineChecks: DisciplineCheckItem[]
  notes?: string | null
  postTradeNotes?: string | null
  pnl?: number | null
  isOpen: boolean
}

export interface PreMarketData {
  giftNiftyPrice: number
  giftNiftyChange: number
  giftNiftyChangePts: number
  giftNiftyHigh: number
  giftNiftyLow: number
  giftNiftyOiNet: string
  giftNiftyClose: number
  dowPrice: number
  dowChange: number
  dowChangePts: number
  dowStatus: "Live" | "Closed"
  sp500Price: number
  sp500Change: number
  sp500ChangePts: number
  sp500Status: "Live" | "Closed"
  nikkeiPrice: number
  nikkeiChange: number
  nikkeiChangePts: number
  nikkeiStatus: "Live" | "Closed"
  vix: number
  vixChange: number
  vixChangePts: number
  vixPercentile: number
  vixLabel: "Low" | "Medium" | "High"
  fiiCash: number
  fiiFutures: number
  diiCash: number
  diiFutures: number
  netCashInflow: number
  movers: PreMarketMover[]
  sources?: {
    nifty: "NSE India" | "Sample"
    vix: "NSE India" | "Sample"
    dow: "Yahoo Finance" | "Sample"
    sp500: "Yahoo Finance" | "Sample"
    nikkei: "Yahoo Finance" | "Sample"
    institutionalFlows: "Sample"
    movers: "Sample"
  }
}

export interface PreMarketMover {
  symbol: string
  sector: string
  price: number
  gapPct: number
  volumeMultiple: string
  catalyst: string
}

export interface BiasPivots {
  r1: number
  r2: number
  s1: number
  s2: number
}

export interface BiasResult {
  bias: "BULLISH" | "BEARISH" | "NEUTRAL"
  bullPercent: number
  reasoning: string
  pivots: BiasPivots
}

export interface NewsItem {
  id: string
  source: string
  title: string
  link: string
  publishedAt: string
  score: number
  catalyst: string | null
}

export interface JournalAiFeedback {
  positivePattern: {
    title: string
    detail: string
    impactPoints: number
  }
  leakDetected: {
    title: string
    detail: string
    estimatedLoss: number
    flag: "OVERTRADING" | "MIDDAY_CHOP" | "REVENGE_TRADE" | "POOR_SIZING" | "EARLY_EXIT"
  }
  recommendation: {
    title: string
    detail: string
    priority: "HIGH" | "MEDIUM" | "LOW"
    ruleLabel: string
  }
}

export interface PortfolioAiReview {
  strongPositions: {
    title: string
    detail: string
  }
  underperformers: {
    title: string
    detail: string
  }
  concentrationRisk: {
    title: string
    detail: string
  }
  topAction: string
}

export interface ChartinkResult {
  nsecode: string
  bsecode?: string
  company_name: string
  close: number
  per_chg?: number
  volume: number
}
