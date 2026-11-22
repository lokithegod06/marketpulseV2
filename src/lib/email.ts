import { Resend } from "resend"

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function sendOnboardingEmail({
  name,
  email,
}: {
  name: string
  email: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured")
  }

  const resend = new Resend(apiKey)
  const from = process.env.EMAIL_FROM || "Market Pulse <onboarding@resend.dev>"
  const safeName = escapeHtml(name)
  const dashboardUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: "Welcome to Market Pulse",
    html: `
      <div style="background:#080b13;padding:32px;font-family:Arial,sans-serif;color:#e2e8f0">
        <div style="max-width:560px;margin:auto;background:#101624;border:1px solid #252c3d;border-radius:12px;padding:32px">
          <h1 style="margin:0 0 16px;font-size:24px;color:#ffffff">Welcome to Market Pulse, ${safeName}.</h1>
          <p style="line-height:1.6;color:#94a3b8">
            Your trader account is ready. You can now open the terminal, log trades,
            track discipline, and build consistent market habits.
          </p>
          <a
            href="${dashboardUrl}/dashboard"
            style="display:inline-block;margin-top:16px;padding:12px 18px;border-radius:8px;background:#7dd3fc;color:#051321;text-decoration:none;font-weight:bold"
          >
            Open your terminal
          </a>
          <p style="margin-top:28px;font-size:12px;color:#64748b">
            Market Pulse — Institutional pre-market intelligence for disciplined traders.
          </p>
        </div>
      </div>
    `,
  })

  if (error) {
    throw new Error(error.message)
  }
}
