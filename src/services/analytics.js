import { api } from '../lib/apiClient'

export async function fetchSummary(userId) {
  if (!userId) return { success: false, error: 'Missing user id', data: null }

  return await api.get('/api/analytics/summary', { user_id: userId })
}

export async function fetchTopicMastery(userId) {
  if (!userId) return { success: false, error: 'Missing user id', data: [] }

  return await api.get('/api/analytics/topic-mastery', { user_id: userId })
}

