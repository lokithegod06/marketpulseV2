# Market Pulse — Institutional Pre-Market Intelligence & Trading Terminal (v3.4.1)

Market Pulse is a full-stack Next.js 14 (App Router) SaaS platform built for Indian equity and F&O traders (NSE/BSE, Nifty, BankNifty, FinNifty). It consolidates pre-market intelligence, automated trade journaling, rule-based discipline scoring (0–100), portfolio tracking, custom ChartInk screeners, watchlists, courses, and a verified trader leaderboard into one high-frequency terminal.

## What Is Included in This Package

1. **Pixel-Accurate First Page (`src/app/page.tsx`)**:
   - Built end-to-end from the reference landing page design (`screen.png`), featuring the sticky navigation bar, live NSE/BSE telemetry ticker, Hero section (*"Every pulse of the market. One high-frequency terminal."*), 3-panel Console preview (*Nifty 28 Mar Straddle*, *Discipline Score 94/100*, *FII/DII Activity*), 6-card *System Architecture* grid, *Eliminate the psychological leaks killing your P&L* guardrail showcase, *Transparent Pricing* (*Free Trader ₹0* vs *Pro Terminal ₹1,499/mo*), and SEBI regulatory footer.
2. **All 8 Core Terminal Modules (`src/app/(dashboard)/*`)**:
   - **Module 1 — Pre-Market Dashboard (`/dashboard`)**: Gift Nifty card with sparkline, Global Markets row (Dow Jones, S&P 500, Nikkei 225), deterministic rule-based Market Pulse Bias + intraday Nifty Spot pivots, India VIX percentile gauge, FII/DII cash & futures flows, Pre-Market Movers table, and AI-scored Institutional Wire.
   - **Module 2 — Trade Journal (`/journal`)**: Real-time P&L and delta calculator, lot-size quick selectors, customizable 5-point discipline checklist, CSV export, and post-session AI coaching powered by Anthropic Claude (`claude-sonnet-4-6`).
   - **Module 3 — Discipline Score (`/discipline`)**: Persistent 0–100 daily scoring engine, behavioral diagnostics bars, automated hard guardrail adherence tracking, and public leaderboard integration.
   - **Module 4 — Portfolio Tracker (`/portfolio`)**: Holdings CRUD, live NSE price synchronization, P&L summary cards, and on-demand Claude AI Portfolio Review (Strong Positions, Underperformers, Concentration Risk).
   - **Module 5 — Screeners (`/screeners`)**: 3 built-in free screeners (*52-Week High Breakout*, *OI Buildup Long*, *VWAP Reclaim*) + 3 Pro custom ChartInk deep-filter screeners (*Deep OI + PCR Filter*, *Sector Rotation Tracker*, *Gamma Squeeze Setup*).
   - **Module 6 — Watchlist (`/watchlist`)**: Live auto-refreshed quotes (10 stocks Free / 20 stocks Pro) with 1-click jump to log a trade in the Journal.
   - **Module 7 — Courses & Strategy Library (`/courses`)**: 6 structured tracks (*Beginner*, *Intermediate*, *Options Trading*, *Futures Trading*, *Psychology*, *Strategy Library*) gated behind Pro subscription.
   - **Module 8 — Trader Leaderboard (`/leaderboard`)**: Composite ranking (`60% Discipline Score + 40% 30-Day P&L Percentile`) with segment filters (*All India*, *F&O Only*, *Equity*, *Weekly*).
3. **Complete Backend API Layer (`src/app/api/*`) & Database Schema (`prisma/schema.prisma`)**:
   - REST API route handlers with NextAuth v5 session checks, Zod validation, Prisma ORM queries, Upstash Redis caching/rate-limiting, shared sample market scans, and per-account saved trading data. Personal records require a working PostgreSQL connection.

## Quick Start (Local Development)

### 1. Install Dependencies

```bash
cd market-pulse
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Prisma CLI commands also need `DATABASE_URL` in a root-level `.env` file (Prisma does not load `.env.local` by default). Keep the URL private and do not commit it.

> You can start the app without optional market-data and AI integrations, but personal journal, portfolio, watchlist, and saved screener data require a working PostgreSQL `DATABASE_URL`. Market screener results and leaderboard profiles are sample/shared data; personal records are never populated with another trader's demo data.

### 3. Initialize Database (Once PostgreSQL Is Connected)

```bash
npx prisma generate
npx prisma migrate dev
npm run db:seed
```

### 4. Start the Development Server

```bash
npm run dev
```

Open `http://localhost:3000` to view the landing page. Sign in with Google or with credentials for an account registered in the connected database.

## Step-by-Step Guide to Connecting All APIs

### 1. Database — Neon Serverless PostgreSQL + Prisma (`src/lib/db.ts`)

1. Create a free account at [https://neon.tech](https://neon.tech) and create a new project named `market_pulse` (PostgreSQL 15+).
2. Copy your pooled connection string from the Neon Dashboard and paste it into `.env.local`:
   ```env
   DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-xyz.ap-southeast-1.aws.neon.tech/market_pulse?sslmode=require"
   ```
3. Run migrations and seed initial courses, sample trades, discipline rules, and holdings:
   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```
   Apply any new Prisma migrations after schema updates before starting the app.

### 2. Authentication — NextAuth.js v5 & Google OAuth (`src/lib/auth.ts`)

1. Generate your `NEXTAUTH_SECRET`:
   **PowerShell (Windows):**
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   **macOS/Linux (with OpenSSL):**
   ```bash
   openssl rand -base64 32
   ```
2. Set `NEXTAUTH_URL` and `NEXTAUTH_SECRET` in `.env.local`:
   ```env
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your_generated_base64_secret"
   ```
3. To enable **Sign in with Google**:
   - Open [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → **Create Credentials** → **OAuth client ID** (Web application).
   - Add Authorized JavaScript Origin: `http://localhost:3000` (and `https://yourdomain.com` in production).
   - Add Authorized Redirect URI: `http://localhost:3000/api/auth/callback/google` (and `https://yourdomain.com/api/auth/callback/google`).
   - Copy the Client ID and Client Secret into `.env.local`:
     ```env
     GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
     GOOGLE_CLIENT_SECRET="GOCSPX-xxx"
     ```
4. To enforce strict login redirects across all `/dashboard` routes in production, set `ENFORCE_AUTH="true"` in `.env.local`.

### 3. AI Integration — Anthropic Claude API (`src/lib/claude.ts` & `src/lib/prompts.ts`)

Market Pulse uses Anthropic's `claude-sonnet-4-6` model for three specific features (Market Pulse Bias is strictly deterministic and rule-based in `src/lib/bias.ts`, never AI-generated):
- **Trade Journal Coaching (`POST /api/journal/ai-feedback`)**: Analyzes the trader's last 30 trades and outputs JSON with `positivePattern`, `leakDetected`, and `recommendation`.
- **Portfolio Fundamental Review (`POST /api/portfolio/ai-review`)**: Analyzes equity holdings and outputs `strongPositions`, `underperformers`, `concentrationRisk`, and `topAction`.
- **News Relevance Scoring (`src/lib/rss.ts`)**: Scores RSS headlines from 0–10 and tags catalysts (`RBI`, `FII_FLOW`, `EARNINGS`, `CRUDE`, `GLOBAL`).

**How to connect:**
1. Create an API key at [https://console.anthropic.com/](https://console.anthropic.com/).
2. Add it to `.env.local`:
   ```env
   ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"
   ```
3. All system prompts are centralized in `src/lib/prompts.ts`.

### 4. Live Indian & Global Market Data — Yahoo Finance & NSE India API (`src/lib/prices.ts` & `src/lib/nse.ts`)

No paid API key is required for Phase 1 market data:
1. **Yahoo Finance (`src/lib/prices.ts`)**:
   - Automatically appends `.NS` for NSE equities (e.g., `RELIANCE.NS`, `HDFCBANK.NS`) and queries `https://query1.finance.yahoo.com/v8/finance/chart/{symbol}` for live LTP, 52-week high/low, and volume, as well as `^NSEI` (Nifty 50), `^NSEBANK` (BankNifty), `^DJI` (Dow Jones), `^GSPC` (S&P 500), and `^N225` (Nikkei 225).
2. **NSE India Session Cookie Handshake (`src/lib/nse.ts`)**:
   - NSE India's official JSON endpoints (`/api/allIndices`, `/api/reports?archives=[{"name":"FII_DII"}]`, `/api/option-chain-equities?symbol=NIFTY`, `/api/live-analysis-pre-open?key=NIFTY_50`) return `403 Forbidden` if called without a valid browser session cookie.
   - `fetchNSE(path)` in `src/lib/nse.ts` first sends a request to `https://www.nseindia.com` with realistic browser `User-Agent` and `Accept` headers, caches the `set-cookie` header in Redis under `"nse:cookie"` for 30 minutes, and attaches `Cookie` and `Referer: https://www.nseindia.com/` on subsequent API calls.

### 5. Custom ChartInk Screeners (`src/lib/chartink.ts`)

ChartInk does not provide an official public API, so `runChartinkScan()` in `src/lib/chartink.ts` performs a 2-step server-side request:
1. Fetches `https://chartink.com/screener/` to extract the `<meta>` / `<input name="_token">` CSRF token and session cookie.
2. Sends a `POST` request (`application/x-www-form-urlencoded`, `X-Requested-With: XMLHttpRequest`) to `https://chartink.com/screener/process` with `_token` and `scan_clause`.
3. Results are cached in Redis for 15 minutes (`screener:{scannerId}`).
4. **Adding Your Own Custom Screeners**: Open `src/lib/chartink.ts` and add or edit scan clauses in the `SCREENERS` object:
   ```ts
   export const SCREENERS: Record<string, string> = {
     deepOIPCR: `{57960} ( latest open > latest sma ( latest open , 20 ) and latest volume > latest sma ( latest volume , 20 ) * 1.5 )`,
     sectorRotation: `{57960} ( latest rate of change ( 10 ) > 0 and latest rate of change ( 20 ) > 0 )`,
     gammaSqueeze: `{57960} ( latest open = latest 5 days high and latest volume > latest sma ( latest volume , 10 ) * 2 )`,
   }
   ```

### 6. Caching & Rate Limiting — Upstash Redis (`src/lib/redis.ts`)

1. Create a free serverless Redis database at [https://upstash.com/](https://upstash.com/).
2. Copy the **REST URL** and **REST Token** into `.env.local`:
   ```env
   UPSTASH_REDIS_REST_URL="https://your-db.upstash.io"
   UPSTASH_REDIS_REST_TOKEN="AYxxx..."
   ```
3. Redis automatically handles:
   - `pre-market:{date}` (60s TTL)
   - `prices:{symbol}` (60s TTL)
   - `news:feed` (15m TTL)
   - `screener:{scannerId}` (15m TTL)
   - `nse:cookie` (30m TTL)
   - Sliding-window rate limiting (`@upstash/ratelimit`) capping AI Journal & Portfolio reviews at 3 requests/day per user.

### 7. Subscriptions & INR Payments — Razorpay (`src/lib/razorpay.ts` & `/api/subscriptions/*`)

1. Sign in to your [Razorpay Dashboard](https://dashboard.razorpay.com/) and navigate to **Subscriptions** → **Plans**.
2. Create two plans:
   - **Pro Monthly** (e.g., ₹999 or ₹1,499/month) → copy the Plan ID (`plan_xxx`) to `RAZORPAY_PLAN_MONTHLY`.
   - **Pro Annual** (e.g., ₹8,999 or ₹14,999/year) → copy the Plan ID (`plan_xxx`) to `RAZORPAY_PLAN_ANNUAL`.
3. Generate API keys under **Settings** → **API Keys** and add them to `.env.local`:
   ```env
   RAZORPAY_KEY_ID="rzp_live_xxx"
   RAZORPAY_KEY_SECRET="your_key_secret"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxx"
   RAZORPAY_PLAN_MONTHLY="plan_monthly_id"
   RAZORPAY_PLAN_ANNUAL="plan_annual_id"
   ```
4. Configure the **Webhook** under **Settings** → **Webhooks**:
   - **Webhook URL**: `https://yourdomain.com/api/subscriptions/webhook`
   - **Secret**: Set a strong secret and copy it to `RAZORPAY_WEBHOOK_SECRET` in `.env.local`.
   - **Active Events**: Enable `subscription.activated` and `subscription.cancelled`.
   - `src/app/api/subscriptions/webhook/route.ts` verifies the `x-razorpay-signature` HMAC-SHA256 digest and upgrades/downgrades the user's `Subscription` record in PostgreSQL.

### 8. Email (Resend), Media (Cloudinary) & Vercel Cron Jobs (`vercel.json`)

- **Resend**: Create an API key at [https://resend.com](https://resend.com) and set `RESEND_API_KEY` and `EMAIL_FROM="noreply@marketpulse.in"`.
- **Cloudinary**: Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` for course cover images and avatars.
- **Vercel Cron Jobs**: `vercel.json` defines 4 automated cron jobs (`/api/cron/refresh-news` every 15m, `/api/cron/end-of-day` at 3:00 PM IST weekdays, `/api/cron/fii-dii` at 6:30 PM IST weekdays, and `/api/cron/expire-subscriptions` at midnight daily). Protect them by setting `CRON_SECRET` in `.env.local`.

## API Routes Summary

| Route | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/[...nextauth]` | `ALL` | Public | NextAuth v5 handler (Credentials + Google OAuth) |
| `/api/auth/register` | `POST` | Public | Create new trader account & initialize trial |
| `/api/dashboard/pre-market` | `GET` | Required | Gift Nifty, global indices, India VIX, movers + Market Pulse Bias |
| `/api/dashboard/bias` | `GET` | Pro | Deterministic rule-based Market Pulse Bias + Nifty pivots |
| `/api/dashboard/news` | `GET` | Required | RSS dispatches scored by Claude (3 Free / Full Pro) |
| `/api/dashboard/fii-dii` | `GET` | Pro | FII & DII cash and futures participant flows |
| `/api/journal` | `GET / POST` | Required | List trades or log a new trade (computes P&L + updates Discipline Score) |
| `/api/journal/[id]` | `GET / PUT / DELETE` | Required | Fetch, update post-trade exit/notes, or delete a trade |
| `/api/journal/ai-feedback` | `POST` | Pro | Claude `claude-sonnet-4-6` behavioral audit on last 30 trades |
| `/api/discipline` | `GET` | Required | Current discipline matrix & behavioral diagnostics |
| `/api/discipline/rules` | `GET / POST` | Required | List or create custom discipline rules |
| `/api/discipline/rules/[id]` | `PUT` | Required | Toggle or update a discipline rule |
| `/api/discipline/score` | `GET` | Required | 30-day rolling discipline score history |
| `/api/discipline/leaderboard` | `GET` | Public | Top 50 traders ranked by composite Discipline + P&L percentile |
| `/api/portfolio` | `GET / POST` | Required | Fetch your holdings with live NSE prices or add a position |
| `/api/portfolio/[id]` | `PUT / DELETE` | Required | Update or remove your portfolio holding |
| `/api/portfolio/ai-review` | `POST` | Pro | Claude portfolio analysis (Strong, Underperformers, Concentration Risk) |
| `/api/screeners` | `GET` | Required | List all built-in and Pro ChartInk screeners |
| `/api/screeners/run` | `POST` | Required | Execute a screener by `screenerId` |
| `/api/screeners/chartink` | `GET` | Pro | Proxy & 15m Redis cache for custom ChartInk scan clauses |
| `/api/watchlist` | `GET / POST / DELETE` | Required | Manage watchlist items (enforces 10 Free / 20 Pro limit) |
| `/api/prices/batch` | `POST` | Required | Batch live price lookup via Yahoo Finance `.NS` |
| `/api/subscriptions` | `POST` | Required | Create Razorpay subscription & return checkout `shortUrl` |
| `/api/subscriptions/webhook` | `POST` | Public | Verify Razorpay HMAC signature & activate/cancel Pro status |
| `/api/subscriptions/cancel` | `POST` | Required | Cancel recurring subscription at period end |
| `/api/courses` | `GET` | Public | List all published courses (content gated for Pro) |
| `/api/courses/[slug]` | `GET` | Pro | Full course markdown content reader |
