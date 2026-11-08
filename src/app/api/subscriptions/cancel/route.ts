import { NextResponse } from "next/server"
import { db, isDatabaseConfigured } from "@/lib/db"
import { getRazorpayClient } from "@/lib/razorpay"
import { getSessionOrDemoUser } from "@/lib/utils"

export async function POST() {
  try {
    const user = await getSessionOrDemoUser()
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ cancelled: true, message: "Subscription marked for cancellation at period end." })
    }
    const sub = await db.subscription.findUnique({ where: { userId: user.id } })
    if (sub?.razorpaySubId) {
      const razorpay = getRazorpayClient()
      if (razorpay) {
        await razorpay.subscriptions.cancel(sub.razorpaySubId, true)
      }
      await db.subscription.update({
        where: { userId: user.id },
        data: { status: "CANCELLED" },
      })
    }
    return NextResponse.json({ cancelled: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed to cancel subscription", detail: String(err) }, { status: 500 })
  }
}
