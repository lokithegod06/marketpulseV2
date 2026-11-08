// src/lib/razorpay.ts
import Razorpay from "razorpay"

export const isRazorpayConfigured = (): boolean => {
  const id = process.env.RAZORPAY_KEY_ID
  const secret = process.env.RAZORPAY_KEY_SECRET
  return Boolean(id && secret && !id.includes("xxx") && secret !== "xxx")
}

export function getRazorpayClient(): Razorpay | null {
  if (!isRazorpayConfigured()) return null
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })
}
