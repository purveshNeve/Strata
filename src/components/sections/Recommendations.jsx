import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchRecommendations,
  markRecommendationFollowed,
} from '../../services/recommendations'

const DEMO_USER_ID = 'demo-user-1'

export function Recommendations() {
  const queryClient = useQueryClient()

  const recsQuery = useQuery({
    queryKey: ['recommendations', DEMO_USER_ID],
    queryFn: async () => fetchRecommendations(DEMO_USER_ID, { activeOnly: true }),
  })

  const followMutation = useMutation({
    mutationFn: markRecommendationFollowed,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['recommendations', DEMO_USER_ID] })
    },
  })

  const items =
    recsQuery.data?.success && Array.isArray(recsQuery.data.data)
      ? recsQuery.data.data
      : []

  return (
    <div className="space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Recommendations</h2>
          <p className="text-xs text-[#78716C]">
            Generated from your mock performance trends.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-lg border border-[#E7E5E4] px-3 py-1.5 text-xs font-medium text-[#57534E] hover:bg-[#F5F5F4]"
        >
          Refresh insights
        </button>
      </header>

      {recsQuery.isLoading && (
        <p className="text-xs text-[#78716C]">Loading recommendations…</p>
      )}

      <section className="space-y-3">
        {items.map(item => {
          const itemId = item.id || item.recommendation_id
          const focusArea = item.focusArea || item.focus_area
          const priority = item.priority?.toLowerCase() || 'medium'
          const confidenceScore = item.confidenceScore || item.confidence_score || 0
          const dataPointCount = item.dataPointCount || item.data_point_count || 0
          const actionSteps = item.actionSteps || item.action_steps || []
          const generatedAt = item.generatedAt || item.generated_at

          return (
            <article
              key={itemId}
              className="rounded-xl border border-[#E7E5E4] bg-white p-5 space-y-4 hover:-translate-y-1 hover:border-blue-600 transition-transform"
            >
              <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white ' +
                      (priority === 'high'
                        ? 'bg-red-600'
                        : priority === 'medium'
                        ? 'bg-amber-600'
                        : 'bg-blue-600')
                    }
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)} priority
                  </span>
                  <h3 className="text-sm font-semibold">{focusArea}</h3>
                </div>
                <p className="text-[11px] text-[#78716C]">
                  {Math.round(confidenceScore)}% confidence · {dataPointCount} data points
                </p>
              </header>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-[#78716C] uppercase">
                    Why this matters
                  </p>
                  <p className="mt-1 text-[#57534E]">{item.reasoning}</p>
                </div>

                {actionSteps.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-[#78716C] uppercase">
                      Action steps
                    </p>
                    <ol className="mt-1 list-decimal list-inside space-y-1 text-[#57534E]">
                      {actionSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              <footer className="flex items-center justify-between pt-2 border-t border-[#E7E5E4]">
                <p className="text-[11px] text-[#A8A29E]">
                  Generated {generatedAt ? new Date(generatedAt).toLocaleDateString() : 'Recently'}
                </p>
                <button
                  type="button"
                  onClick={() => followMutation.mutate(itemId)}
                  className="inline-flex items-center rounded-lg border border-[#E7E5E4] px-3 py-1.5 text-xs font-medium text-[#57534E] hover:bg-[#F5F5F4]"
                >
                  Mark as followed
                </button>
              </footer>
            </article>
          )
        })}

        {!recsQuery.isLoading && items.length === 0 && (
          <article className="rounded-xl border border-dashed border-[#D6D3D1] bg-[#F5F5F4] p-8 text-center space-y-2">
            <p className="text-sm font-semibold">No live recommendations yet</p>
            <p className="text-xs text-[#78716C]">
              Upload a mock test or add question attempts to unlock personalized guidance.
            </p>
          </article>
        )}
      </section>
    </div>
  )
}

