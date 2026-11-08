// src/app/api/subscriptions/webhook/route.ts
// Section 11.2: Razorpay Webhook Signature Verification & DB Update
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db, isDatabaseConfigured } from "@/lib/db"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("x-razorpay-signature") || ""

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || ""
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex")

  if (signature !== expectedSig) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const event = JSON.parse(body)

  if (isDatabaseConfigured()) {
    if (event.event === "subscription.activated") {
      const sub = event.payload.subscription.entity
      await db.subscription.update({
        where: { razorpaySubId: sub.id },
        data: {
          plan: "PRO",
          status: "ACTIVE",
          currentPeriodEnd: new Date(sub.current_end * 1000),
        },
      })
    }

    if (event.event === "subscription.cancelled") {
      await db.subscription.update({
        where: { razorpaySubId: event.payload.subscription.entity.id },
        data: { status: "CANCELLED" },
      })
    }
  }

  return NextResponse.json({ received: true })
}
