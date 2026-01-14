// API client for backend endpoints
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || 'Request failed', data: null }
    }

    return data
  } catch (error) {
    return { success: false, error: error.message || 'Network error', data: null }
  }
}

export const api = {
  get: (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    return apiRequest(url, { method: 'GET' })
  },
  post: (endpoint, body) => {
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },
  patch: (endpoint, body) => {
    return apiRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  },
}
