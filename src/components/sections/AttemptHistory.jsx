import { useQuery } from '@tanstack/react-query'
import { fetchAttempts } from '../../services/attempts'

const DEMO_USER_ID = 'demo-user-1'

const fallbackAttempts = [
  {
    id: 'mock-6',
    name: 'Full mock test 6',
    date: 'Jan 12',
    score: '83%',
    time: '2h 52m',
  },
  {
    id: 'mock-5',
    name: 'Full mock test 5',
    date: 'Jan 9',
    score: '80%',
    time: '2h 58m',
  },
]

export function AttemptHistory() {
  const query = useQuery({
    queryKey: ['attempts', DEMO_USER_ID],
    queryFn: async () => fetchAttempts(DEMO_USER_ID, { limit: 50 }),
  })

  const rows =
    query.data?.success && Array.isArray(query.data.data) && query.data.data.length > 0
      ? query.data.data.map(row => ({
          id: row.test_session_id || row.attempt_id,
          name: row.test_name || `Session ${row.test_session_id || row.attempt_id}`,
          date: new Date(row.attempted_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          }),
          score: row.score ? `${Math.round(row.score)}%` : row.correctness ? '✓' : '×',
          time: row.time_taken_seconds
            ? `${Math.round(row.time_taken_seconds / 60)}m`
            : '—',
        }))
      : fallbackAttempts

  return (
    <div className="space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Attempt history</h2>
          <p className="text-xs text-[#78716C]">
            Recent mocks and drills with score and pacing.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Upload CSV
        </button>
      </header>

      <section className="rounded-xl border border-[#E7E5E4] bg-white overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr,1fr,1fr,1fr] bg-[#F5F5F4] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#57534E]">
          <div className="px-4 py-3">Attempt</div>
          <div className="px-4 py-3">Date</div>
          <div className="px-4 py-3">Score</div>
          <div className="px-4 py-3">Time</div>
        </div>
        <div className="divide-y divide-[#E7E5E4]">
          {rows.map(attempt => (
            <article
              key={attempt.id}
              className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,1fr] gap-y-1 md:gap-y-0 bg-white hover:bg-[#F5F5F4] transition-colors"
            >
              <div className="px-4 py-3 flex items-center justify-between md:block">
                <div>
                  <p className="text-sm font-medium">{attempt.name}</p>
                  <p className="mt-0.5 text-xs text-[#78716C]">ID: {attempt.id}</p>
                </div>
                <p className="mt-0.5 text-xs text-[#78716C] md:hidden">
                  {attempt.date} · {attempt.score}
                </p>
              </div>
              <p className="px-4 py-3 text-sm text-[#57534E] hidden md:flex items-center">
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

