import Link from "next/link"
import { PageHeader } from "@/components/shared/PageHeader"
import { DEFAULT_COURSES } from "@/lib/courses"

export default function CourseReaderPage({ params }: { params: { slug: string } }) {
  const course = DEFAULT_COURSES.find((c) => c.slug === params.slug) || DEFAULT_COURSES[0]

  return (
    <div className="pb-10">
      <PageHeader
        title={course.title}
        subtitle={`${course.category} · ${course.modulesCount}`}
        actions={
          <Link
            href="/courses"
            className="px-3.5 py-1.5 rounded-lg bg-surface-low border border-border text-xs text-text-primary"
          >
            ← All Courses
          </Link>
        }
      />
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <article className="bg-surface-low border border-border rounded-xl p-8 space-y-4">
          <div className="text-xs font-mono text-accent-blue uppercase">{course.category} TRACK</div>
          <h2 className="text-xl font-bold text-text-primary">{course.title}</h2>
          <p className="text-sm text-text-secondary leading-relaxed">{course.excerpt}</p>
          <div className="pt-4 border-t border-border text-xs text-text-secondary space-y-3 leading-relaxed">
            <p>
              1. <strong>Pre-Market Preparation (08:45–09:10 AM IST)</strong>: Audit Gift Nifty basis, overnight US close, India VIX percentile rank, and participant-wise FII/DII index futures OI before defining your directional bias.
            </p>
            <p>
              2. <strong>Opening Range Execution (09:15–09:45 AM IST)</strong>: Wait for a 5-minute candle close and anchored VWAP confirmation. Never chase gap-ups exceeding 1.2% without a pullback.
            </p>
            <p>
              3. <strong>Hard Stop-Loss &amp; Midday Chop Lockout</strong>: Respect your pre-configured ₹5,000 daily drawdown ceiling and avoid entering fresh option buying setups during the 11:30 AM – 1:15 PM IST theta-decay window.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
