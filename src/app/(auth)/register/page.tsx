"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, handle, email, password }),
      })
      router.push("/dashboard")
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
          <span className="text-[10px] font-mono text-accent-blue bg-accent-blue/10 border border-accent-blue/20 px-2 py-0.5 rounded-full">
            14-Day Pro Trial
          </span>
        </div>

        <h1 className="text-lg font-bold text-text-primary mb-1">Create your trader account</h1>
        <p className="text-xs text-text-secondary mb-6">
          Zero credit card required to start your 14-day trial.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] text-text-secondary mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="Arjun Mehta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-base border border-border rounded-lg px-3.5 py-2.5 text-xs text-text-primary"
            />
          </div>
          <div>
            <label className="block text-[11px] text-text-secondary mb-1">Leaderboard Handle (@username)</label>
            <input
              type="text"
              placeholder="arjun_trader"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-surface-base border border-border rounded-lg px-3.5 py-2.5 text-xs font-mono text-text-primary"
            />
          </div>
          <div>
            <label className="block text-[11px] text-text-secondary mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="trader@domain.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-base border border-border rounded-lg px-3.5 py-2.5 text-xs text-text-primary"
            />
          </div>
          <div>
            <label className="block text-[11px] text-text-secondary mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-base border border-border rounded-lg px-3.5 py-2.5 text-xs text-text-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-accent-blue text-[#001e2f] font-semibold text-xs hover:bg-[#bae6fd] transition-colors"
          >
            {loading ? "Creating Account…" : "Create Account & Open Terminal"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-text-secondary">
          Already registered?{" "}
          <Link href="/login" className="text-accent-blue hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
