// import { useQuery } from '@tanstack/react-query'
// import { fetchTopicMastery } from '../../services/analytics'


// const fallbackTopics = [
//   { topic: 'Algebra', mastery: 82 },
//   { topic: 'Geometry', mastery: 64 },
//   { topic: 'Number theory', mastery: 48 },
//   { topic: 'Probability', mastery: 33 },
//   { topic: 'Reading', mastery: 76 },
//   { topic: 'Grammar', mastery: 71 },
// ]

// function cellColor(mastery) {
//   if (mastery <= 20) return 'bg-[#FEE2E2]'
//   if (mastery <= 40) return 'bg-[#FED7AA]'
//   if (mastery <= 60) return 'bg-[#FEF3C7]'
//   if (mastery <= 80) return 'bg-[#D1FAE5]'
//   return 'bg-[#A7F3D0]'
// }

// export function TopicMastery() {
//   const query = useQuery({
//     queryKey: ['topic-mastery'],
//     queryFn: async () => fetchTopicMastery(),
//   })

//   const topics =
//     query.data?.success && Array.isArray(query.data.data) && query.data.data.length > 0
//       ? query.data.data.map(row => ({
//           topic: row.topic,
//           mastery: row.mastery_score,
//         }))
//       : fallbackTopics

//   return (
//     <div className="space-y-4">
//       <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
//         <div>
//           <h2 className="text-base font-semibold text-[#E17B5F]">Topic mastery heatmap</h2>
//           <p className="text-xs text-[#8D8A86]">
//             Each cell shows your current mastery estimate per topic.
//           </p>
//         </div>
//         <div className="flex items-center gap-2 text-[11px] text-[#8D8A86]">
//           <span className="inline-flex h-4 w-4 rounded bg-[#FEE2E2]" />
//           0–20%
//           <span className="inline-flex h-4 w-4 rounded bg-[#FED7AA]" />
//           21–40%
//           <span className="inline-flex h-4 w-4 rounded bg-[#FEF3C7]" />
//           41–60%
//           <span className="inline-flex h-4 w-4 rounded bg-[#D1FAE5]" />
//           61–80%
//           <span className="inline-flex h-4 w-4 rounded bg-[#A7F3D0]" />
//           81–100%
//         </div>
//       </header>

//       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//         {topics.map(topic => (
//           <article
//             key={topic.topic}
//             className={
//               'relative rounded-lg p-4 transition-transform hover:-translate-y-1 shadow-sm border border-[#F2D5C8] ' +
//               cellColor(topic.mastery)
//             }
//           >
//             <p className="text-xs font-semibold tracking-[0.14em] text-[#4B463F] uppercase">
//               {topic.topic}
//             </p>
//             <p className="mt-2 text-2xl font-semibold tabular-nums">
//               {Math.round(topic.mastery)}
//               <span className="text-sm align-top">%</span>
//             </p>
//             <p className="mt-1 text-xs text-[#57534E]">
//               {topic.attempts ? `${topic.attempts} attempts` : 'Estimated mastery'}
//             </p>
//           </article>
//         ))}
//       </section>
//     </div>
//   )
// }

import { useQuery } from '@tanstack/react-query'
import { fetchTopicMastery } from '../../services/analytics'
import { useState } from 'react'

const fallbackTopics = [
  { topic: 'Algebra', mastery: 82, attempts: 0 },
  { topic: 'Geometry', mastery: 64, attempts: 0 },
  { topic: 'Number theory', mastery: 48, attempts: 0 },
  { topic: 'Probability', mastery: 33, attempts: 0 },
  { topic: 'Reading', mastery: 76, attempts: 0 },
  { topic: 'Grammar', mastery: 71, attempts: 0 },
]

function cellColor(mastery) {
  if (mastery <= 20) return 'bg-[#FEE2E2]'
  if (mastery <= 40) return 'bg-[#FED7AA]'
  if (mastery <= 60) return 'bg-[#FEF3C7]'
  if (mastery <= 80) return 'bg-[#D1FAE5]'
  return 'bg-[#A7F3D0]'
}

function getMasteryCategory(mastery) {
  if (mastery >= 81) return '81-100%'
  if (mastery >= 61) return '61-80%'
  if (mastery >= 41) return '41-60%'
  if (mastery >= 21) return '21-40%'
  return '0-20%'
}

function getRecommendation(topic) {
  const { mastery, confidence_gap, accuracy } = topic
  
  if (confidence_gap === 'high') {
    return `⚠️ You have misconceptions in ${topic.topic}. You're often confident when wrong. Review fundamentals carefully.`
  }
  
  if (mastery < 50) {
    return `Focus on fundamentals in ${topic.topic}. Start with easy questions to build confidence. Current accuracy: ${accuracy}%.`
  } else if (mastery < 70) {
    return `You're making good progress! Keep practicing medium difficulty questions. Your accuracy is ${accuracy}%.`
  } else {
    return `Excellent work! You've mastered ${topic.topic} with ${accuracy}% accuracy. Challenge yourself with harder problems.`
  }
}

export function TopicMastery() {
  const [selectedTopic, setSelectedTopic] = useState(null)

  const query = useQuery({
    queryKey: ['topic-mastery'],
    queryFn: async () => fetchTopicMastery(),
    retry: 1,
  })

  // Map backend data to component format
  const topics =
    query.data?.success && Array.isArray(query.data.data) && query.data.data.length > 0
      ? query.data.data.map(row => ({
          topic: row.topic,
          mastery: Math.round(row.mastery || 0),
          attempts: row.attempts || 0,
          accuracy: Math.round(row.accuracy || 0),
          avg_time: row.avg_time || 0,
          confidence_gap: row.confidence_gap || 'low',
        }))
      : fallbackTopics

  const isUsingFallback = !query.data?.success || query.data.data.length === 0

  return (
    <div className="space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#E17B5F]">Topic mastery heatmap</h2>
          <p className="text-xs text-[#8D8A86]">
            Each cell shows your current mastery estimate per topic.
            {isUsingFallback && ' (Using demo data - login to see your real data)'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#8D8A86]">
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

      {/* Loading State */}
      {query.isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E17B5F] border-t-transparent" />
            <p className="text-sm text-[#8D8A86]">Loading your mastery data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {query.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">Failed to load mastery data</p>
          <p className="mt-1 text-xs text-red-600">
            {query.error?.message || 'Please try again or contact support.'}
          </p>
          <button
            onClick={() => query.refetch()}
            className="mt-3 rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Topics Grid */}
      {!query.isLoading && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topics.map(topic => (
            <article
              key={topic.topic}
              onClick={() => setSelectedTopic(topic)}
              className={
                'relative rounded-lg p-4 transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer shadow-sm border border-[#F2D5C8] ' +
                cellColor(topic.mastery)
              }
            >
              <p className="text-xs font-semibold tracking-[0.14em] text-[#4B463F] uppercase">
                {topic.topic}
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-[#2C2925]">
                {topic.mastery}
                <span className="text-sm align-top">%</span>
              </p>
              <p className="mt-1 text-xs text-[#57534E]">
                {topic.attempts > 0 ? `${topic.attempts} attempts` : 'Estimated mastery'}
              </p>
              {topic.accuracy !== undefined && topic.attempts > 0 && (
                <p className="mt-0.5 text-xs text-[#57534E]">
                  Accuracy: {topic.accuracy}%
                </p>
              )}
              {topic.confidence_gap === 'high' && (
                <div className="mt-2 inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">
                  ⚠️ Confidence gap
                </div>
              )}
            </article>
          ))}
        </section>
      )}

      {/* Detailed Modal */}
      {selectedTopic && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedTopic(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-[#2C2925]">{selectedTopic.topic}</h3>
                <p className="text-sm text-[#8D8A86]">
                  Category: {getMasteryCategory(selectedTopic.mastery)}
                </p>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="text-2xl text-[#8D8A86] hover:text-[#2C2925]"
              >
                ×
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="text-3xl font-bold text-[#2C2925]">{selectedTopic.mastery}%</div>
                <div className="mt-1 text-xs text-[#8D8A86]">Current Mastery</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="text-3xl font-bold text-[#2C2925]">{selectedTopic.attempts}</div>
                <div className="mt-1 text-xs text-[#8D8A86]">Questions Attempted</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="text-3xl font-bold text-[#2C2925]">{selectedTopic.accuracy}%</div>
                <div className="mt-1 text-xs text-[#8D8A86]">Raw Accuracy</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <h4 className="mb-2 text-lg font-semibold text-[#2C2925]">Mastery Progress</h4>
              <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${selectedTopic.mastery}%`,
                    backgroundColor: cellColor(selectedTopic.mastery).replace('bg-', '#'),
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-[#8D8A86]">
                <span>Current: {selectedTopic.mastery}%</span>
                <span>Target: 80%+</span>
              </div>
            </div>

            {/* Additional Metrics */}
            {selectedTopic.avg_time > 0 && (
              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <h4 className="mb-3 font-semibold text-[#2C2925]">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8D8A86]">Average Time:</span>
                    <span className="font-medium text-[#2C2925]">{selectedTopic.avg_time}s per question</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8D8A86]">Confidence Gap:</span>
                    <span className={`font-medium ${selectedTopic.confidence_gap === 'high' ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedTopic.confidence_gap === 'high' ? '⚠️ High' : '✓ Low'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 className="mb-2 font-semibold text-blue-900">💡 Personalized Recommendation</h4>
              <p className="text-sm text-blue-800">
                {getRecommendation(selectedTopic)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
