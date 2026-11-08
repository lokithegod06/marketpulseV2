import { NextRequest, NextResponse } from "next/server"

const LEADERBOARD_DATA = [
  {
    rank: 1,
    name: "Vikram Singhania",
    handle: "@vikram_scalper",
    segment: "F&O Only",
    profileTag: "Nifty Scalper · MIS Mode",
    disciplineScore: 96,
    adherencePct: 98.4,
    netPnl30d: 482400,
    streak: "18 Green Days",
    isCurrentUser: false,
  },
  {
    rank: 2,
    name: "Pooja Iyer",
    handle: "@pooja_gamma",
    segment: "F&O Only",
    profileTag: "BankNifty Gamma Trader",
    disciplineScore: 94,
    adherencePct: 97.2,
    netPnl30d: 368900,
    streak: "16 Green Days",
    isCurrentUser: false,
  },
  {
    rank: 3,
    name: "Devansh Joshi",
    handle: "@devansh_ic",
    segment: "F&O Only",
    profileTag: "Options Seller · Iron Condor",
    disciplineScore: 91,
    adherencePct: 95.0,
    netPnl30d: 315000,
    streak: "12 Green Days",
    isCurrentUser: false,
  },
  {
    rank: 4,
    name: "Ananya Nair",
    handle: "@ananya_finnifty",
    segment: "F&O Only",
    profileTag: "FinNIFTY Expiry",
    disciplineScore: 89,
    adherencePct: 93.1,
    netPnl30d: 265400,
    streak: "11 Green Days",
    isCurrentUser: false,
  },
  {
    rank: 14,
    name: "Arjun Mehta",
    handle: "@arjun_trader",
    segment: "F&O Only",
    profileTag: "Intraday Index",
    disciplineScore: 88,
    adherencePct: 96.0,
    netPnl30d: 214560,
    streak: "14 Green Days",
    isCurrentUser: false,
  },
  {
    rank: 5,
    name: "Rohit Kulkarni",
    handle: "@rohit_cash",
    segment: "Equity",
    profileTag: "Equity Breakout · Cash",
    disciplineScore: 85,
    adherencePct: 92.8,
    netPnl30d: 195000,
    streak: "9 Green Days",
    isCurrentUser: false,
  },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const filter = searchParams.get("segment") || "All India"
  const filtered =
    filter === "All India" || filter === "Weekly" || filter === "Weekly Series"
      ? LEADERBOARD_DATA
      : LEADERBOARD_DATA.filter((item) => item.segment === filter)
  return NextResponse.json({ leaderboard: filtered, totalTraders: 1420 })
}
