export function AppHeader() {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium tracking-[0.16em] text-[#78716C] uppercase">
        overview
      </p>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Exam performance analytics
        </h1>
        <p className="text-xs text-[#78716C]">
           Mock data seeding recommended
        </p>
      </div>
    </div>
  )
}

