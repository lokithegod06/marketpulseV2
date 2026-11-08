import Link from "next/link"
import {
  Play,
  ArrowRight,
  Search,
  BookOpen,
  Gauge,
  LineChart,
  Radar,
  BrainCircuit,
  CheckCircle2,
  Check,
  X,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080b13] text-[#e2e8f0] flex flex-col selection:bg-[#7dd3fc]/20 selection:text-[#7dd3fc]">
      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 h-16 bg-[#080b13]/90 backdrop-blur-md border-b border-[#1c2333]">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5">
              <svg width="28" height="20" viewBox="0 0 100 40" fill="none">
                <path
                  d="M4 20H24L38 6L52 34L66 14H78"
                  stroke="#7dd3fc"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="56" cy="11" r="5.5" fill="#34d399" />
              </svg>
              <span className="text-[15px] font-bold tracking-tight text-white">
                Market<span className="text-[#7dd3fc]">Pulse</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-7 text-xs text-[#94a3b8]">
              <a href="#architecture" className="hover:text-white transition-colors">
                Features
              </a>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Pre-Market
              </Link>
              <Link href="/journal" className="hover:text-white transition-colors">
                Trade Journal
              </Link>
              <Link href="/discipline" className="hover:text-white transition-colors">
                Discipline Score
              </Link>
              <a href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111827] border border-[#252c3d] text-[#7dd3fc] font-medium hover:border-[#7dd3fc]/40 transition-colors"
              >
                <span>Terminal</span>
                <span className="text-[9px] font-mono uppercase px-1 py-0.2 bg-[#34d399]/15 text-[#34d399] rounded">
                  LIVE
                </span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-xs font-medium text-[#94a3b8] hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 bg-[#7dd3fc] hover:bg-[#bae6fd] text-[#051321] font-semibold text-xs px-4 py-2 rounded-full transition-colors"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* LIVE NSE / BSE TELEMETRY TICKER STRIP */}
      <div className="bg-[#060911] border-b border-[#1c2333] py-2 px-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 text-[11px] font-mono whitespace-nowrap">
          <div className="flex items-center gap-2 text-[#94a3b8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
            <span className="uppercase tracking-wider text-[10px] font-sans font-semibold text-[#64748b]">
              LIVE NSE / BSE TELEMETRY
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#64748b]">NIFTY 50</span>
            <span className="text-white font-semibold">24,852.15</span>
            <span className="text-[#34d399]">+0.62% ▾</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#64748b]">BANK NIFTY</span>
            <span className="text-white font-semibold">51,340.80</span>
            <span className="text-[#34d399]">+0.84% ▾</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#64748b]">GIFT NIFTY</span>
            <span className="text-white font-semibold">24,910.50</span>
            <span className="text-[#34d399]">+0.71% ▾</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#64748b]">INDIA VIX</span>
            <span className="text-white font-semibold">12.45</span>
            <span className="text-[#fca5a5]">-4.20% ▾</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#64748b]">USD/INR</span>
            <span className="text-white font-semibold">83.85</span>
            <span className="text-[#fca5a5]">-0.04% ▾</span>
          </div>
          <div className="text-[#475569] text-[10px]">FEED LATENCY: 12ms</div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          {/* Release Pill */}
          <div className="inline-flex items-center gap-3 px-3.5 py-1 rounded-full bg-[#111726] border border-[#252c3d] text-[11px] mb-8">
            <span className="flex items-center gap-1.5 text-[#34d399] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
              Live for NSE &amp; BSE F&amp;O Traders
            </span>
            <span className="text-[#252c3d]">|</span>
            <span className="text-[#94a3b8] font-mono">v3.4 Release</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
            Every pulse of the market.
            <br />
            <span className="text-[#7dd3fc]">One high-frequency</span>
            <br />
            <span className="text-[#7dd3fc]">terminal.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl mx-auto text-sm sm:text-base text-[#94a3b8] leading-relaxed">
            Institutional pre-market intelligence, discipline-scoring analytics, and
            automated trade journaling built specifically for disciplined Indian
            equity &amp; options traders.
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-[#7dd3fc] hover:bg-[#bae6fd] text-[#051321] font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-lg transition-colors shadow-[0_0_25px_rgba(125,211,252,0.25)]"
            >
              Start Free Trial (No Card Required)
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[#131826] hover:bg-[#182033] text-white border border-[#252c3d] font-medium text-xs sm:text-sm px-6 py-3.5 rounded-lg transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-[#7dd3fc] fill-[#7dd3fc]" />
              <span>Interactive Terminal Demo</span>
            </Link>
          </div>
        </div>

        {/* HERO INTERACTIVE CONSOLE MOCKUP */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="rounded-2xl bg-[#0c101b] border border-[#252c3d] shadow-[0_25px_80px_rgba(0,0,0,0.65)] overflow-hidden">
            {/* Console Top Bar */}
            <div className="px-4 py-3 bg-[#101624] border-b border-[#252c3d] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fca5a5]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]/80" />
                </div>
                <span className="text-[#64748b] uppercase tracking-wider">
                  CONSOLE // NIFTY 24800 CE / PE DEPTH &amp; JOURNAL
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#94a3b8]">
                  Delta: <strong className="text-white">0.48</strong>
                </span>
                <span className="text-[#94a3b8]">
                  Theta: <strong className="text-[#fca5a5]">-14.2</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#34d399]/10 border border-[#34d399]/30 text-[#34d399] font-semibold">
                  Net P&amp;L: +₹42,850.00
                </span>
              </div>
            </div>

            {/* Console 3-Column Telemetry Grid */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: NIFTY 28 MAR STRADDLE */}
              <div className="bg-[#111726] border border-[#252c3d] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7dd3fc]">
                      NIFTY 28 MAR STRADDLE
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#182033] text-[#94a3b8] border border-[#252c3d]">
                      ATM 24800
                    </span>
                  </div>
                  <div className="space-y-2 text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#94a3b8] font-sans">CE Premium (LTP)</span>
                      <span className="text-[#34d399]">₹142.30 (+18.4%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94a3b8] font-sans">PE Premium (LTP)</span>
                      <span className="text-[#fca5a5]">₹98.15 (-12.1%)</span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-[#252c3d]/60">
                      <span className="text-[#94a3b8] font-sans">Combined Premium</span>
                      <span className="text-white font-semibold">₹240.45</span>
                    </div>
                  </div>
                </div>
                <svg className="w-full h-11 mt-4" viewBox="0 0 180 40">
                  <polyline
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2"
                    points="0,34 30,30 60,28 90,31 120,22 150,15 180,8"
                  />
                </svg>
              </div>

              {/* Card 2: DISCIPLINE SCORE */}
              <div className="bg-[#111726] border border-[#252c3d] rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                    DISCIPLINE SCORE
                  </span>
                  <span className="text-xs font-mono font-bold text-[#34d399]">94 / 100</span>
                </div>
                <div className="space-y-3 text-[11px]">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#94a3b8]">Stop-Loss Execution</span>
                      <span className="font-mono text-white">100% (4/4)</span>
                    </div>
                    <div className="h-1.5 bg-[#1e2638] rounded-full overflow-hidden">
                      <div className="h-full bg-[#34d399] w-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#94a3b8]">Position Sizing Compliance</span>
                      <span className="font-mono text-white">92%</span>
                    </div>
                    <div className="h-1.5 bg-[#1e2638] rounded-full overflow-hidden">
                      <div className="h-full bg-[#7dd3fc] w-[92%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#94a3b8]">Over-Trading Guardrail</span>
                      <span className="font-mono text-[#34d399]">Optimal (3/5)</span>
                    </div>
                    <div className="h-1.5 bg-[#1e2638] rounded-full overflow-hidden">
                      <div className="h-full bg-[#34d399] w-[60%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: FII / DII ACTIVITY */}
              <div className="bg-[#111726] border border-[#252c3d] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                      FII / DII ACTIVITY
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#182033] text-[#94a3b8] border border-[#252c3d]">
                      T-0 Live
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 my-2">
                    <div className="bg-[#0b0f19] border border-[#252c3d] rounded-lg p-2.5">
                      <div className="text-[10px] text-[#64748b]">FII Net Cash</div>
                      <div className="text-sm font-mono font-bold text-[#34d399] mt-0.5">
                        +₹1,420 Cr
                      </div>
                      <div className="text-[9px] text-[#34d399]/80 mt-0.5">Aggressive Buyer</div>
                    </div>
                    <div className="bg-[#0b0f19] border border-[#252c3d] rounded-lg p-2.5">
                      <div className="text-[10px] text-[#64748b]">DII Net Cash</div>
                      <div className="text-sm font-mono font-bold text-[#34d399] mt-0.5">
                        +₹890 Cr
                      </div>
                      <div className="text-[9px] text-[#34d399]/80 mt-0.5">Support Net</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#252c3d]/60 text-[11px]">
                  <span className="text-[#64748b]">FII Long/Short Ratio:</span>
                  <span className="font-mono font-semibold text-white">68.4% (Bullish)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SYSTEM ARCHITECTURE — ENGINEERED FOR QUANTITATIVE PRECISION */}
      <section id="architecture" className="py-20 px-6 border-t border-[#141b29]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#7dd3fc] mb-2">
                SYSTEM ARCHITECTURE
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Engineered for Quantitative Precision
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#94a3b8] max-w-md leading-relaxed">
              Zero fluff. Tailored modules replacing fragmented spreadsheets,
              disparate broker portals, and delayed web scrapers.
            </p>
          </div>

          {/* 6-Card Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Module 1 */}
            <div className="bg-[#0e1320] border border-[#1f2738] hover:border-[#7dd3fc]/30 rounded-2xl p-6 flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 rounded-lg bg-[#141c2e] border border-[#252c3d] flex items-center justify-center text-[#7dd3fc]">
                    <Search className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#141c2e] border border-[#252c3d] text-[#7dd3fc]">
                    09:08 AM IST
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">Pre-Market Intelligence</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Synthesize Gift Nifty gaps, overnight global indices, crude yields,
                  and FII/DII Net Flow before the opening bell rings.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-[#1c2436] flex items-center justify-between text-xs">
                <span className="text-[#64748b]">Gift Nifty Expected Opening:</span>
                <span className="font-mono font-semibold text-[#34d399]">+84.50 Pts</span>
              </div>
            </div>

            {/* Module 2 */}
            <div className="bg-[#0e1320] border border-[#1f2738] hover:border-[#7dd3fc]/30 rounded-2xl p-6 flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 rounded-lg bg-[#141c2e] border border-[#252c3d] flex items-center justify-center text-[#34d399]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#34d399]/10 border border-[#34d399]/25 text-[#34d399]">
                    AUTO-SYNC
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">Trade Journal &amp; Analytics</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Direct API broker import for Zerodha, Groww, AngelOne &amp; Dhan.
                  Auto-calculates slippages, brokerages, and exact R:R outcomes.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-[#1c2436] flex items-center justify-between text-xs">
                <span className="text-[#64748b]">Avg Risk:Reward This Month:</span>
                <span className="font-mono font-semibold text-white">1 : 2.45</span>
              </div>
            </div>

            {/* Module 3 */}
            <div className="bg-[#0e1320] border border-[#1f2738] hover:border-[#7dd3fc]/30 rounded-2xl p-6 flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 rounded-lg bg-[#141c2e] border border-[#252c3d] flex items-center justify-center text-[#7dd3fc]">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#141c2e] border border-[#252c3d] text-[#7dd3fc]">
                    PROPRIETARY
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">Discipline Score (0-100)</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Mathematically detect revenge trades, lot-size spikes after losses,
                  early exits, and violations of daily drawdown rules.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-[#1c2436] flex items-center justify-between text-xs">
                <span className="text-[#64748b]">Revenge Trade Probability:</span>
                <span className="font-mono font-semibold text-[#34d399]">0.0% (Clean)</span>
              </div>
            </div>

            {/* Module 4 */}
            <div className="bg-[#0e1320] border border-[#1f2738] hover:border-[#7dd3fc]/30 rounded-2xl p-6 flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 rounded-lg bg-[#141c2e] border border-[#252c3d] flex items-center justify-center text-[#fca5a5]">
                    <LineChart className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#fca5a5]/10 border border-[#fca5a5]/25 text-[#fca5a5]">
                    Δ Θ Γ V LIVE
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">Real-time Portfolio &amp; Greeks</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Unified portfolio Greeks. See aggregate delta bias, theta decay per
                  hour, and multi-leg risk curves in ultra low latency.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-[#1c2436] flex items-center justify-between text-xs">
                <span className="text-[#64748b]">Net Portfolio Theta Decay:</span>
                <span className="font-mono font-semibold text-[#34d399]">+₹4,280 / hr</span>
              </div>
            </div>

            {/* Module 5 */}
            <div className="bg-[#0e1320] border border-[#1f2738] hover:border-[#7dd3fc]/30 rounded-2xl p-6 flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 rounded-lg bg-[#141c2e] border border-[#252c3d] flex items-center justify-center text-[#7dd3fc]">
                    <Radar className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#141c2e] border border-[#252c3d] text-[#94a3b8]">
                    NSE FO SCAN
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">Institutional Screeners</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Real-time Open Interest (OI) spurts, volume shockers, VWAP
                  deviations, and Long Buildup / Short Covering scanners.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-[#1c2436] flex items-center justify-between text-xs">
                <span className="text-[#64748b]">Active Sector Inflow:</span>
                <span className="font-mono font-semibold text-[#34d399]">NIFTY IT (+2.1%)</span>
              </div>
            </div>

            {/* Module 6 */}
            <div className="bg-[#0e1320] border border-[#1f2738] hover:border-[#7dd3fc]/30 rounded-2xl p-6 flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 rounded-lg bg-[#141c2e] border border-[#252c3d] flex items-center justify-center text-[#34d399]">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#34d399]/10 border border-[#34d399]/25 text-[#34d399]">
                    POST-MARKET
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">AI Post-Session Feedback</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Personalized algorithmic feedback summarizing your daily behavioral
                  execution, edge retention, and emotional choke points.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-[#1c2436] flex items-center justify-between text-xs">
                <span className="text-[#64748b]">Auditor Diagnosis:</span>
                <span className="font-mono font-semibold text-[#7dd3fc]">A+ Disciplined Day</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: REAL-TIME EDGE — ELIMINATE THE PSYCHOLOGICAL LEAKS */}
      <section className="py-20 px-6 bg-[#0a0e18] border-t border-[#141b29]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#34d399] mb-2">
              REAL-TIME EDGE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              Eliminate the psychological leaks killing your P&amp;L.
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              89% of retail options traders lose money in Indian markets not due to
              bad charts, but because of revenge trading, inconsistent lot scaling,
              and lacking pre-market preparation.
            </p>

            <div className="mt-7 space-y-3">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#101625] border border-[#1f2738]">
                <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
                <span className="text-xs font-medium text-white">
                  Auto-lock terminal upon reaching max daily loss limits
                </span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#101625] border border-[#1f2738]">
                <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
                <span className="text-xs font-medium text-white">
                  Pre-market checklist validation before taking the first trade
                </span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#101625] border border-[#1f2738]">
                <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
                <span className="text-xs font-medium text-white">
                  Direct SEBI-compliant analytics without storing broker credentials
                </span>
              </div>
            </div>
          </div>

          {/* Right Multi-Monitor Trader Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#0e1422] border border-[#252c3d] p-4 shadow-2xl">
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#0d1f2d] via-[#0b1320] to-[#080b13] border border-[#1e293b] h-[300px] flex flex-col justify-between p-6">
                {/* Simulated Multi-Screen Trading Setup Visual */}
                <div className="grid grid-cols-3 gap-3 opacity-80">
                  <div className="bg-[#09131c]/90 border border-[#34d399]/30 rounded-lg p-3">
                    <div className="text-[9px] font-mono text-[#34d399]">NIFTY OI WALL</div>
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 bg-[#34d399]/60 rounded w-4/5" />
                      <div className="h-1.5 bg-[#34d399]/40 rounded w-3/5" />
                      <div className="h-1.5 bg-[#fca5a5]/50 rounded w-full" />
                    </div>
                  </div>
                  <div className="bg-[#09131c]/90 border border-[#7dd3fc]/30 rounded-lg p-3">
                    <div className="text-[9px] font-mono text-[#7dd3fc]">BANKNIFTY VWAP</div>
                    <svg className="w-full h-10 mt-1" viewBox="0 0 100 30">
                      <polyline
                        fill="none"
                        stroke="#7dd3fc"
                        strokeWidth="2"
                        points="0,25 20,18 40,21 60,10 80,12 100,4"
                      />
                    </svg>
                  </div>
                  <div className="bg-[#09131c]/90 border border-[#34d399]/30 rounded-lg p-3">
                    <div className="text-[9px] font-mono text-[#34d399]">GREEKS TELEMETRY</div>
                    <div className="text-xs font-mono text-white mt-2">Δ +0.48 · Θ -14.2</div>
                  </div>
                </div>

                {/* Bottom Overlay Bar matching screen.png */}
                <div className="bg-[#0b101b]/95 backdrop-blur-md border border-[#252c3d] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8]">
                      SESSION SUMMARY: 28 MAR EXPIRY
                    </div>
                    <div className="text-xs font-mono text-[#34d399] font-semibold mt-0.5">
                      +₹68,400 Total Net Realized <span className="text-[#64748b]">|</span>{" "}
                      <span className="text-white">4 Trades</span>{" "}
                      <span className="text-[#64748b]">|</span>{" "}
                      <span className="text-[#7dd3fc]">100% Win Rate</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-md bg-[#34d399] text-[#04130e] font-mono font-bold text-[10px]">
                    DISCIPLINE 98/100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TRANSPARENT PRICING */}
      <section id="pricing" className="py-24 px-6 border-t border-[#141b29]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#7dd3fc] mb-2">
              TRANSPARENT PRICING
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Simple, High-ROI Plans for Serious Traders
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#94a3b8]">
              One disciplined trade saved will pay for an entire year of Market Pulse Pro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 items-stretch">
            {/* Free Trader Card */}
            <div className="bg-[#0e1320] border border-[#1f2738] rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">Free Trader</h3>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-[#182033] text-[#94a3b8] border border-[#252c3d]">
                    BASIC
                  </span>
                </div>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-4xl font-extrabold font-mono text-white">₹0</span>
                  <span className="text-xs text-[#64748b]">/ month</span>
                </div>
                <p className="text-xs text-[#94a3b8] leading-relaxed mb-6">
                  Essential journaling and daily pre-market snapshot for beginners
                  stepping into the market.
                </p>

                <ul className="space-y-3 text-xs">
                  <li className="flex items-center gap-2.5 text-white">
                    <Check className="w-4 h-4 text-[#34d399]" />
                    <span>
                      <strong>Up to 10 logged trades per month</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5 text-white">
                    <Check className="w-4 h-4 text-[#34d399]" />
                    <span>Pre-market snapshot (Delayed 5 mins)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-white">
                    <Check className="w-4 h-4 text-[#34d399]" />
                    <span>1 Custom Watchlist (NSE Cash only)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#64748b]">
                    <X className="w-4 h-4 text-[#475569]" />
                    <span>Discipline Scoring Engine</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#64748b]">
                    <X className="w-4 h-4 text-[#475569]" />
                    <span>Live Greeks &amp; Options Multi-Leg Tracker</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="mt-8 w-full py-3 rounded-lg bg-[#161e31] hover:bg-[#1e2942] text-white font-semibold text-xs text-center border border-[#252c3d] transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Terminal Card */}
            <div className="relative bg-[#0f172a] border-2 border-[#7dd3fc]/60 rounded-2xl p-7 flex flex-col justify-between shadow-[0_0_50px_rgba(125,211,252,0.1)]">
              <div className="absolute -top-3 right-6 bg-[#7dd3fc] text-[#04121f] font-mono font-bold text-[10px] uppercase px-3 py-0.5 rounded-full">
                MOST POPULAR
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-[#7dd3fc]">Pro Terminal</h3>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-[#7dd3fc]/10 text-[#7dd3fc] border border-[#7dd3fc]/30">
                    FULL TERMINAL ACCESS
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-extrabold font-mono text-white">₹1,499</span>
                  <span className="text-xs text-[#94a3b8]">/ month</span>
                </div>
                <div className="text-[11px] font-mono text-[#34d399] mt-1 mb-4">
                  or ₹14,999 billed annually (Save 17%)
                </div>
                <p className="text-xs text-[#94a3b8] leading-relaxed mb-6">
                  Complete high-frequency toolkit, discipline guardrails, and
                  real-time F&amp;O telemetry.
                </p>

                <ul className="space-y-3 text-xs text-white">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#34d399] shrink-0" />
                    <span>
                      <strong>Unlimited</strong> automated trade journaling (All Brokers)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#34d399] shrink-0" />
                    <span>Zero-delay Gift Nifty &amp; pre-market intelligence</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#34d399] shrink-0" />
                    <span>
                      Algorithmic <strong>Discipline Score (0-100)</strong> &amp; Guardrails
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#34d399] shrink-0" />
                    <span>Real-time Options Portfolio Greeks (Δ, Θ, Γ, V)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#34d399] shrink-0" />
                    <span>FII / DII deep-dive flows &amp; institutional screeners</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#34d399] shrink-0" />
                    <span>AI Post-Session Behavioral Feedback &amp; Drawdown Auditor</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/pricing"
                className="mt-8 w-full py-3 rounded-lg bg-[#7dd3fc] hover:bg-[#bae6fd] text-[#051321] font-semibold text-xs text-center transition-colors"
              >
                Start 14-Day Free Pro Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER & REGULATORY DISCLAIMER */}
      <footer className="mt-auto border-t border-[#141b29] bg-[#060911] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-[#141b29]">
            <div className="flex items-center gap-2.5">
              <svg width="24" height="18" viewBox="0 0 100 40" fill="none">
                <path
                  d="M4 20H24L38 6L52 34L66 14H78"
                  stroke="#7dd3fc"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="56" cy="11" r="5.5" fill="#34d399" />
              </svg>
              <span className="text-sm font-bold text-white">Market Pulse</span>
              <span className="text-[10px] font-mono text-[#64748b]">v3.4.1</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#94a3b8]">
              <Link href="/pricing" className="hover:text-white">
                Terms of Service
              </Link>
              <Link href="/pricing" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/pricing" className="hover:text-white">
                Security &amp; Data
              </Link>
              <span className="inline-flex items-center gap-1.5 text-[#34d399]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                API Status: Operational
              </span>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                Twitter / X @MarketPulseHQ
              </a>
            </div>
          </div>

          <div className="my-6 p-4 rounded-xl bg-[#0b0f19] border border-[#1a2234] text-[11px] text-[#64748b] leading-relaxed">
            <strong className="text-[#94a3b8] block mb-1">
              Regulatory Notice &amp; Disclaimer:
            </strong>
            Market Pulse is an analytical terminal, trading journal, and performance
            management software. Market Pulse is not a SEBI-registered investment
            advisor or research analyst. All analytics, scores, and data points
            provided are strictly for educational and personal record-keeping
            purposes. Equities, Futures &amp; Options (F&amp;O) trading involves
            substantial risk of capital loss.
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#475569]">
            <span>© 2026 Market Pulse Technologies Pvt Ltd. All rights reserved.</span>
            <span className="font-mono tracking-wider uppercase">
              MUMBAI · BENGALURU · GIFT CITY
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
