import { api } from '../lib/apiClient'

export async function fetchRecommendations(userId, { activeOnly = true } = {}) {
  if (!userId) return { success: false, error: 'Missing user id', data: [] }

  return await api.get('/api/recommendations', {
    user_id: userId,
    active_only: activeOnly.toString(),
  })
}

export async function markRecommendationFollowed(id) {
  if (!id) return { success: false, error: 'Missing id', data: null }

  return await api.patch(`/api/recommendations/${id}/follow`)
}

