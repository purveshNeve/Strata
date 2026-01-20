import { api } from '../lib/apiClient'

export async function fetchAttempts({ limit = 50 } = {}) {
  return await api.get('/api/attempts', { limit })
}

// Fetch attempt history grouped by test session with trends
export async function fetchAttemptHistory() {
  return await api.get('/api/attempt-history')
}

export async function createAttemptsBulk(attempts) {
  if (!Array.isArray(attempts) || attempts.length === 0) {
    return { success: false, error: 'No attempts provided', data: null }
  }

  return await api.post('/api/attempts/bulk', { attempts })
}

