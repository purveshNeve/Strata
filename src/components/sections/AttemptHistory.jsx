import { useQuery } from '@tanstack/react-query'
import { fetchAttemptHistory } from '../../services/attempts'


const fallbackAttempts = [
  {
    id: 'mock-12',
    name: 'JEE Main Mock Test 12',
    date: 'Jan 15',
    score: '87%',
    time: '3h 5m',
  },
  {
    id: 'mock-11',
    name: 'JEE Main Mock Test 11',
    date: 'Jan 12',
    score: '83%',
    time: '2h 52m',
  },
  {
    id: 'mock-10',
    name: 'JEE Main Mock Test 10',
    date: 'Jan 9',
    score: '80%',
    time: '2h 58m',
  },
  {
    id: 'mock-9',
    name: 'JEE Main Mock Test 9',
    date: 'Jan 6',
    score: '78%',
    time: '2h 45m',
  },
  {
    id: 'mock-8',
    name: 'JEE Main Mock Test 8',
    date: 'Jan 3',
    score: '75%',
    time: '2h 50m',
  },
  {
    id: 'drill-15',
    name: 'Probability Drill Set 15',
    date: 'Jan 14',
    score: '72%',
    time: '45m',
  },
  {
    id: 'drill-14',
    name: 'Algebra Drill Set 14',
    date: 'Jan 11',
    score: '85%',
    time: '38m',
  },
]

export function AttemptHistory() {
  const query = useQuery({
    queryKey: ['attempt-history'],
    queryFn: async () => fetchAttemptHistory(),
  })

  const rows =
    query.data?.success && Array.isArray(query.data.data) && query.data.data.length > 0
      ? query.data.data.map(row => ({
          id: row.test ?? row.testDate ?? Math.random().toString(36).slice(2, 8),
          name: row.test || 'Test session',
          date: row.testDate
            ? new Date(row.testDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            : '—',
          score: typeof row.overallScore === 'number' ? `${Math.round(row.overallScore)}%` : '—',
          time: typeof row.avg_time === 'number' ? `${Math.round(row.avg_time)}s` : '—',
        }))
      : fallbackAttempts

  return (
    <div className="space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#E17B5F]">Attempt history</h2>
          <p className="text-xs text-[#8D8A86]">
            Recent mocks and drills with score and pacing.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-lg bg-[#E17B5F] px-3 py-2 text-xs font-medium text-white hover:bg-[#D06A4E] transition-colors shadow-sm"
        >
          Upload CSV
        </button>
      </header>

      <section className="rounded-xl border border-[#F2D5C8] bg-white overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-[2fr,1fr,1fr,1fr] bg-[#FFF5F0] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A7068]">
          <div className="px-4 py-3">Attempt</div>
          <div className="px-4 py-3">Date</div>
          <div className="px-4 py-3">Score</div>
          <div className="px-4 py-3">Time</div>
        </div>
        <div className="divide-y divide-[#E7E5E4]">
          {rows.map(attempt => (
            <article
              key={attempt.id}
              className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,1fr] gap-y-1 md:gap-y-0 bg-white hover:bg-[#FFF5F0] transition-colors"
            >
              <div className="px-4 py-3 flex items-center justify-between md:block">
                <div>
                  <p className="text-sm font-medium">{attempt.name}</p>
                  <p className="mt-0.5 text-xs text-[#8D8A86]">ID: {attempt.id}</p>
                </div>
                <p className="mt-0.5 text-xs text-[#78716C] md:hidden">
                  {attempt.date} · {attempt.score}
                </p>
              </div>
              <p className="px-4 py-3 text-sm text-[#7A7068] hidden md:flex items-center">
                {attempt.date}
              </p>
              <p className="px-4 py-3 text-sm font-medium hidden md:flex items-center">
                {attempt.score}
              </p>
              <p className="px-4 py-3 text-sm text-[#57534E] flex items-center justify-between">
                <span>{attempt.time}</span>
                <button
                  type="button"
                  className="ml-3 inline-flex items-center rounded-full border border-[#E7E5E4] px-3 py-1 text-[11px] font-medium text-[#57534E] hover:bg-[#F5F5F4]"
                >
                  View breakdown
                </button>
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

