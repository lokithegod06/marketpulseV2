import { NextRequest, NextResponse } from "next/server"
import { getRazorpayClient } from "@/lib/razorpay"
import { db, isDatabaseConfigured } from "@/lib/db"
import { getSessionOrDemoUser } from "@/lib/utils"

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionOrDemoUser()
    const body = await req.json().catch(() => ({}))
    const cycle = body.billingCycle === "annual" ? "annual" : "monthly"

    const planId =
      cycle === "annual"
        ? process.env.RAZORPAY_PLAN_ANNUAL
        : process.env.RAZORPAY_PLAN_MONTHLY

    const razorpay = getRazorpayClient()
    if (!razorpay || !planId || planId.includes("xxx")) {
      return NextResponse.json({
        subscriptionId: `sub_demo_${Date.now()}`,
        shortUrl: "/pricing?checkout=demo-success",
        mode: "DEMO",
        message: "Configure RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and RAZORPAY_PLAN_MONTHLY in .env.local for live INR checkout.",
      })
    }

    const sub = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: cycle === "annual" ? 5 : 60,
      customer_notify: 1,
    })

    if (isDatabaseConfigured()) {
      await db.subscription.upsert({
        where: { userId: user.id },
        update: { razorpaySubId: sub.id },
        create: {
          userId: user.id,
          plan: "FREE",
          status: "TRIALING",
          razorpaySubId: sub.id,
        },
      })
    }

    return NextResponse.json({
      subscriptionId: sub.id,
      shortUrl: sub.short_url,
      mode: "LIVE",
    })
  } catch (err) {
    return NextResponse.json({ error: "Failed to initialize Razorpay subscription", detail: String(err) }, { status: 500 })
  }
}
