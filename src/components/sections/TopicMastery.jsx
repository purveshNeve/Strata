import { useQuery } from '@tanstack/react-query'
import { fetchTopicMastery } from '../../services/analytics'

const DEMO_USER_ID = 'demo-user-1'

const fallbackTopics = [
  { topic: 'Algebra', mastery: 82 },
  { topic: 'Geometry', mastery: 64 },
  { topic: 'Number theory', mastery: 48 },
  { topic: 'Probability', mastery: 33 },
  { topic: 'Reading', mastery: 76 },
  { topic: 'Grammar', mastery: 71 },
]

function cellColor(mastery) {
  if (mastery <= 20) return 'bg-[#FEE2E2]'
  if (mastery <= 40) return 'bg-[#FED7AA]'
  if (mastery <= 60) return 'bg-[#FEF3C7]'
  if (mastery <= 80) return 'bg-[#D1FAE5]'
  return 'bg-[#A7F3D0]'
}

export function TopicMastery() {
  const query = useQuery({
    queryKey: ['topic-mastery', DEMO_USER_ID],
    queryFn: async () => fetchTopicMastery(DEMO_USER_ID),
  })

  const topics =
    query.data?.success && Array.isArray(query.data.data) && query.data.data.length > 0
      ? query.data.data.map(row => ({
          topic: row.topic,
          mastery: row.mastery_score,
        }))
      : fallbackTopics

  return (
    <div className="space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Topic mastery heatmap</h2>
          <p className="text-xs text-[#78716C]">
            Each cell shows your current mastery estimate per topic.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#78716C]">
          <span className="inline-flex h-4 w-4 rounded bg-[#FEE2E2]" />
          0–20%
          <span className="inline-flex h-4 w-4 rounded bg-[#FED7AA]" />
          21–40%
          <span className="inline-flex h-4 w-4 rounded bg-[#FEF3C7]" />
          41–60%
          <span className="inline-flex h-4 w-4 rounded bg-[#D1FAE5]" />
          61–80%
          <span className="inline-flex h-4 w-4 rounded bg-[#A7F3D0]" />
          81–100%
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {topics.map(topic => (
          <article
            key={topic.topic}
            className={
              'relative rounded-lg p-4 transition-transform hover:-translate-y-1 ' +
              cellColor(topic.mastery)
            }
          >
            <p className="text-xs font-semibold tracking-[0.14em] text-[#57534E] uppercase">
              {topic.topic}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {Math.round(topic.mastery)}
              <span className="text-sm align-top">%</span>
            </p>
            <p className="mt-1 text-xs text-[#57534E]">
              {topic.attempts ? `${topic.attempts} attempts` : 'Estimated mastery'}
            </p>
          </article>
        ))}
      </section>
    </div>
  )
}

