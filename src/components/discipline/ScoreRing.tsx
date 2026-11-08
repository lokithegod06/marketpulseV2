export function ScoreRing({ score = 88 }: { score?: number }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#252c3d" strokeWidth="8" />
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke="#34d399"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-[22px] font-bold font-mono text-text-primary">{score}</div>
        <div className="text-[10px] text-text-muted">/ 100</div>
      </div>
    </div>
  )
}
