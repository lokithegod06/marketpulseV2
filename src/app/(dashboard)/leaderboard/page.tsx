import { PageHeader } from "@/components/shared/PageHeader"
import { LeaderboardTable } from "@/components/discipline/Leaderboard"

export default function LeaderboardPage() {
  return (
    <div className="pb-10">
      <PageHeader
        title="Trader Discipline Leaderboard"
        subtitle="Sample trader profiles; live rankings will be added when the platform launches"
      />
      <div className="p-6 max-w-[1500px] mx-auto">
        <LeaderboardTable />
      </div>
    </div>
  )
}
