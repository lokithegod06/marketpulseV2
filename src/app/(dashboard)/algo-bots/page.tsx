import Link from "next/link"
import { ArrowRight, Bot, Code2, Rocket, ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { CONTACT_EMAIL } from "@/lib/contact"

export default function AlgoBotsPage() {
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Algo Bot Development Inquiry")}`

  return (
    <div className="pb-10">
      <PageHeader
        title="Algo Bots"
        subtitle="Turn your rule-based trading strategy into an automated workflow"
        actions={
          <span className="text-[11px] font-mono text-accent-green bg-accent-green/10 border border-accent-green/20 px-3 py-1 rounded-full">
            Custom Development
          </span>
        }
      />

      <div className="p-6 max-w-5xl mx-auto">
        <section className="relative overflow-hidden rounded-2xl border border-border bg-surface-low p-7 sm:p-10">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent-blue/10 blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-blue/20 bg-accent-blue/10 px-3 py-1.5 text-[11px] text-accent-blue">
              <Bot className="h-3.5 w-3.5" />
              Your strategy. Built around your rules.
            </div>
            <h2 className="text-3xl font-bold leading-tight text-text-primary sm:text-4xl">
              Have a strategy, but not the time or discipline to execute it?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-text-secondary">
              We can help translate your clearly defined trading rules into an algo bot,
              review the requirements with you, and help deploy it on a compatible setup.
              Development starts at <strong className="text-text-primary">₹5,000</strong>;
              the final quote depends on the strategy and platform.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={mailto}
                className="inline-flex items-center gap-2 rounded-lg bg-accent-blue px-5 py-3 text-xs font-semibold text-[#051321] transition-colors hover:bg-[#bae6fd]"
              >
                Discuss your bot
                <ArrowRight className="h-4 w-4" />
              </a>
              <span className="text-[11px] text-text-muted">No strategy? Start by telling us your rules.</span>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Code2,
              title: "Strategy requirements",
              text: "Define your entry, exit, position sizing, and risk rules before development begins.",
            },
            {
              icon: ShieldCheck,
              title: "Testing & risk controls",
              text: "Review the implementation and agree on safeguards and limitations for your setup.",
            },
            {
              icon: Rocket,
              title: "Deployment support",
              text: "Get help deploying the bot on an agreed, compatible platform.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-xl border border-border bg-surface-low p-5">
              <Icon className="mb-4 h-5 w-5 text-accent-blue" />
              <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-text-secondary">{text}</p>
            </article>
          ))}
        </div>

        <p className="mt-5 text-[11px] leading-5 text-text-muted">
          Algo bots execute rules, not guarantees. Trading involves risk; we do not promise
          profits or provide investment recommendations. You remain responsible for
          reviewing and approving the strategy and its live use.
        </p>
        <Link href="/experts" className="mt-6 inline-flex items-center gap-1.5 text-xs text-accent-blue hover:text-text-primary">
          Pro member? Book a trade analysis with an expert
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
