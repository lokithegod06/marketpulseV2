import {
  BiasResult,
  ChartinkResult,
  JournalAiFeedback,
  NewsItem,
  PortfolioAiReview,
  PreMarketData,
  TradeRecord,
} from "./index"

export interface ApiErrorResponse {
  error: string
  code?: "UNAUTHORIZED" | "UPGRADE_REQUIRED" | "RATE_LIMITED" | "VALIDATION_ERROR"
}

export interface PreMarketApiResponse {
  data: PreMarketData
  bias: BiasResult
  cachedAt: string
}

export interface NewsApiResponse {
  items: NewsItem[]
  isPro: boolean
}

export interface JournalListResponse {
  trades: TradeRecord[]
  summary: {
    netPnl: number
    winRate: number
    winCount: number
    lossCount: number
    maxDrawdown: number
  }
}

export interface ScreenerRunResponse {
  screenerId: string
  title: string
  isPro: boolean
  results: ChartinkResult[]
  cachedAt: string
}

export interface AiJournalResponse {
  feedback: JournalAiFeedback
}

export interface AiPortfolioResponse {
  review: PortfolioAiReview
}
