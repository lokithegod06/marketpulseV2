"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      if (!res || res.error) {
        setError("Sign-in failed. Check your credentials or continue with Google.")
      } else {
        router.push("/dashboard")
      }
    } catch {
      setError("Unable to sign in. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-low border border-border rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2">
            <svg width="28" height="20" viewBox="0 0 100 40" fill="none">
              <path d="M4 20H24L38 6L52 34L66 14H78" stroke="#7dd3fc" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="56" cy="11" r="5.5" fill="#34d399" />
            </svg>
            <span className="text-sm font-bold text-text-primary">MarketPulse</span>
          </Link>
          <span className="text-[10px] font-mono text-accent-green bg-accent-green/10 border border-accent-green/20 px-2 py-0.5 rounded-full">
            Terminal Auth
          </span>
        </div>

        <h1 className="text-lg font-bold text-text-primary mb-1">Sign in to your terminal</h1>
        <p className="text-xs text-text-secondary mb-6">
          Sign in with your account to access your personal trading data.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-accent-red/10 border border-accent-red/30 text-xs text-accent-red">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] text-text-secondary mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-base border border-border rounded-lg px-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent-blue"
            />
          </div>
          <div>
            <label className="block text-[11px] text-text-secondary mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-base border border-border rounded-lg px-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent-blue"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-accent-blue text-[#001e2f] font-semibold text-xs hover:bg-[#bae6fd] transition-colors"
          >
            {loading ? "Authenticating…" : "Launch Terminal"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] text-text-muted uppercase">Or continue with</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full py-2.5 rounded-lg bg-surface-mid border border-border text-xs font-medium text-text-primary hover:border-accent-blue/40 transition-colors"
        >
          Continue with Google OAuth
        </button>

        <p className="mt-6 text-center text-xs text-text-secondary">
          New to Market Pulse?{" "}
          <Link href="/register" className="text-accent-blue hover:underline">
            Start 14-Day Free Trial
          </Link>
        </p>
      </div>
    </div>
  )
}
