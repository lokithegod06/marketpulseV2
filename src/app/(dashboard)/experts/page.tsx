import Link from "next/link"
import { ArrowRight, CalendarCheck, LockKeyhole, UsersRound } from "lucide-react"
import { BookingForm } from "@/components/experts/BookingForm"
import { PageHeader } from "@/components/shared/PageHeader"
import { auth } from "@/lib/auth"

export default async function ExpertsPage() {
  const session = await auth()
  const plan = (session?.user as { plan?: string } | undefined)?.plan
  const isPro = plan === "PRO"

  return (
    <div className="pb-10">
      <PageHeader
        title="Experts"
        subtitle="One-to-one trade analysis with real traders"
        actions={
          <span className="text-[11px] font-mono text-accent-blue bg-accent-blue/10 border border-accent-blue/20 px-3 py-1 rounded-full">
            PRO
          </span>
        }
      />

      <div className="p-6 max-w-5xl mx-auto">
        {isPro ? (
          <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
            <section className="rounded-2xl border border-border bg-surface-low p-6 sm:p-8">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-accent-blue/20 bg-accent-blue/10 text-accent-blue">
                <UsersRound className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Trade with more clarity.</h2>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                Talk through your trading process with a real trader. Bring your journal,
                strategy rules, or recent trades for a focused analysis session.
              </p>
              <div className="mt-6 space-y-3 text-xs text-text-secondary">
                <div className="flex items-start gap-2.5">
                  <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
                  <span>Share your preferred date and time; we will confirm availability by email.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
                  <span>Sessions focus on analysis and education, not trade signals or guaranteed returns.</span>
                </div>
              </div>
            </section>
            <BookingForm />
          </div>
        ) : (
          <section className="mx-auto max-w-2xl rounded-2xl border border-accent-blue/25 bg-surface-low p-7 text-center sm:p-10">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-accent-blue/20 bg-accent-blue/10 text-accent-blue">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div className="text-[10px] font-mono font-semibold uppercase tracking-widest text-accent-blue">
              Pro member benefit
            </div>
            <h2 className="mt-3 text-2xl font-bold text-text-primary">Connect with real traders.</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-text-secondary">
              Upgrade to Pro to request a one-to-one trade analysis session and book a
              preferred time with an experienced trader.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-lg bg-accent-blue px-5 py-3 text-xs font-semibold text-[#051321] transition-colors hover:bg-[#bae6fd]"
              >
                Explore Pro
                <ArrowRight className="h-4 w-4" />
              </Link>
              {!session?.user && (
                <Link
                  href="/login"
                  className="rounded-lg border border-border px-5 py-3 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary"
                >
                  Sign in
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
