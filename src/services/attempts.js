import { api } from '../lib/apiClient'

export async function fetchAttempts(userId, { limit = 50 } = {}) {
  if (!userId) return { success: false, error: 'Missing user id', data: [] }

  return await api.get('/api/attempts', { user_id: userId, limit })
}

export async function createAttemptsBulk(userId, attempts) {
  if (!userId) return { success: false, error: 'Missing user id', data: null }
  if (!Array.isArray(attempts) || attempts.length === 0) {
    return { success: false, error: 'No attempts provided', data: null }
  }

  return await api.post('/api/attempts/bulk', { user_id: userId, attempts })
}

