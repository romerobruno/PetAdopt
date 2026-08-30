const ACCESS_TOKEN_KEY = 'petadopt_access_token'
const REFRESH_TOKEN_KEY = 'petadopt_refresh_token'

export const SESSION_EXPIRED_EVENT = 'petadopt:session-expired'

function getApiUrl() {
  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

  if (!apiUrl) {
    throw new Error('Falta configurar VITE_API_URL en el archivo .env del frontend.')
  }

  return apiUrl
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function saveTokens({ access, refresh }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access)
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text ? { detail: text } : null
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function refreshAccessToken() {
  const refresh = getRefreshToken()

  if (!refresh) {
    return null
  }

  const response = await fetch(`${getApiUrl()}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })

  if (!response.ok) {
    return null
  }

  const tokens = await response.json()
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access)

  if (tokens.refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh)
  }

  return tokens.access
}

function expireSession() {
  clearTokens()
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
}

export async function apiRequest(endpoint, options = {}) {
  const {
    auth = false,
    retry = true,
    headers: customHeaders = {},
    ...fetchOptions
  } = options
  const headers = { ...customHeaders }
  const access = getAccessToken()

  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (auth && access) {
    headers.Authorization = `Bearer ${access}`
  }

  let response

  try {
    response = await fetch(`${getApiUrl()}${endpoint}`, { ...fetchOptions, headers })
  } catch {
    throw new ApiError('No se pudo conectar con la API. Verificá que el backend esté funcionando.', 0, null)
  }

  if (response.status === 401 && auth && retry) {
    let newAccess = null

    try {
      newAccess = await refreshAccessToken()
    } catch {
      newAccess = null
    }

    if (newAccess) {
      return apiRequest(endpoint, { ...options, retry: false })
    }

    expireSession()
  }

  const data = await parseResponse(response)

  if (!response.ok) {
    const message = data?.detail || `La API respondió con el estado ${response.status}.`
    throw new ApiError(message, response.status, data)
  }

  return data
}

export function getApiErrorMessage(error, fallbackMessage) {
  const data = error?.data

  if (!data || typeof data !== 'object') {
    return error?.message || fallbackMessage
  }

  const fieldMessages = Object.entries(data).flatMap(([field, messages]) => {
    const values = Array.isArray(messages) ? messages : [messages]
    const label = field === 'non_field_errors' ? '' : `${field}: `
    return values.map((message) => `${label}${message}`)
  })

  return fieldMessages.join(' ') || error.message || fallbackMessage
}
