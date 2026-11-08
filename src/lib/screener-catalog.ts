export const SCREENER_CATALOG = [
  {
    id: "52w-high",
    title: "52-Week High Breakout",
    description: "Stocks breaking above 52-week high with above-average volume confirmation.",
    countLabel: "Sample results",
    isPro: false,
  },
  {
    id: "oi-buildup",
    title: "OI Buildup (Long)",
    description: "F&O stocks where both price and open interest are rising.",
    countLabel: "Sample results",
    isPro: false,
  },
  {
    id: "vwap-reclaim",
    title: "VWAP Reclaim",
    description: "Stocks reclaiming VWAP with a 15-minute volume spike.",
    countLabel: "Sample results",
    isPro: false,
  },
  {
    id: "deepOIPCR",
    title: "Deep OI + PCR Filter",
    description: "ChartInk scan for OI concentration, PCR below 0.7, and price above 20 EMA.",
    countLabel: "Sample results",
    isPro: true,
  },
  {
    id: "sectorRotation",
    title: "Sector Rotation Tracker",
    description: "Relative strength rotation across NSE sectors with momentum and reversal signals.",
    countLabel: "Sample results",
    isPro: true,
  },
  {
    id: "gammaSqueeze",
    title: "Gamma Squeeze Setup",
    description: "Options gamma profile and breakout/volume scan.",
    countLabel: "Sample results",
    isPro: true,
  },
] as const
