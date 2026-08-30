import { useEffect, useState } from 'react'
import AuthContext from './auth-context.js'
import {
  apiRequest,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
  SESSION_EXPIRED_EVENT,
} from '../services/api.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [sessionMessage, setSessionMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const restoreSession = async () => {
      if (!getAccessToken()) {
        setIsLoadingSession(false)
        return
      }

      try {
        const profile = await apiRequest('/users/profile/', { auth: true })
        if (isMounted) {
          setUser(profile)
        }
      } catch (error) {
        if (isMounted) {
          const message = error.status === 0
            ? 'No se pudo validar tu sesión porque la API no está disponible.'
            : 'Tu sesión venció. Iniciá sesión nuevamente.'
          setSessionMessage(message)
        }
      } finally {
        if (isMounted) {
          setIsLoadingSession(false)
        }
      }
    }

    const handleSessionExpired = () => {
      setUser(null)
      setSessionMessage('Tu sesión venció. Iniciá sesión nuevamente.')
    }

    restoreSession()
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)

    return () => {
      isMounted = false
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    }
  }, [])

  const login = async (username, password) => {
    const tokens = await apiRequest('/token/', {
      method: 'POST',
      body: JSON.stringify({ username: username.trim(), password }),
    })

    saveTokens(tokens)

    try {
      const profile = await apiRequest('/users/profile/', { auth: true })
      setUser(profile)
      setSessionMessage('')
      return profile
    } catch (error) {
      clearTokens()
      throw error
    }
  }

  const register = async (formData) => {
    return apiRequest('/users/register/', {
      method: 'POST',
      body: JSON.stringify({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
      }),
    })
  }

  const logout = async () => {
    const refresh = getRefreshToken()

    try {
      if (refresh && getAccessToken()) {
        await apiRequest('/users/logout/', {
          method: 'POST',
          auth: true,
          body: JSON.stringify({ refresh }),
        })
      }
    } finally {
      clearTokens()
      setUser(null)
      setSessionMessage('')
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoadingSession,
      sessionMessage,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
