import Link from "next/link"
import { PageHeader } from "@/components/shared/PageHeader"
import { DEFAULT_COURSES } from "@/lib/courses"

const CATEGORY_COLORS: Record<string, string> = {
  BEGINNER: "text-accent-green",
  INTERMEDIATE: "text-accent-blue",
  OPTIONS: "text-accent-red",
  FUTURES: "text-accent-yellow",
  PSYCHOLOGY: "text-text-secondary",
  STRATEGY: "text-accent-blue",
}

export default function CoursesPage() {
  return (
    <div className="pb-10">
      <PageHeader
        title="Courses & Strategy Library"
        subtitle="Pro subscribers only · 3+ years of live market experience"
        actions={
          <span className="text-[11px] font-mono text-accent-blue bg-accent-blue/10 border border-accent-blue/20 px-3 py-1 rounded-full">
            PRO Access
          </span>
        }
      />

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-2 lg:grid-cols-3">
        {DEFAULT_COURSES.map((c) => (
          <div
            key={c.id}
            className="bg-surface-low border border-border rounded-xl p-5 flex flex-col justify-between hover:border-accent-blue/30 transition-colors"
          >
            <div>
              <div
                className={`text-[10px] font-bold tracking-wider uppercase mb-2 ${
                  CATEGORY_COLORS[c.category] || "text-accent-blue"
                }`}
              >
                {c.category}
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1.5">{c.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">{c.excerpt}</p>
              <div className="text-[11px] text-text-muted mb-4">{c.modulesCount}</div>
            </div>
            <Link
              href={`/courses/${c.slug}`}
              className="block w-full py-2 rounded-lg bg-accent-blue text-[#001e2f] font-semibold text-xs text-center hover:bg-[#bae6fd] transition-colors"
            >
              {c.category === "STRATEGY" ? "View Library" : "Start Course"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
