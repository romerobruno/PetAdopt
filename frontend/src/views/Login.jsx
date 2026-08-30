import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'
import { getApiErrorMessage } from '../services/api.js'

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, isLoadingSession, login, sessionMessage } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!isLoadingSession && user) {
    return <Navigate to="/" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await login(formData.username, formData.password)
      const destination = location.state?.from?.pathname || '/'
      navigate(destination, { replace: true })
    } catch (loginError) {
      const message = loginError.status === 401
        ? 'El usuario o la contraseña son incorrectos.'
        : getApiErrorMessage(loginError, 'No se pudo iniciar sesión.')
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Ingresá para conocer a tu próximo compañero."
      footerText="¿Todavía no tenés una cuenta?"
      footerLinkText="Registrate"
      footerLinkTo="/register"
    >
      {location.state?.registered && (
        <div className="alert alert-success" role="status">
          Tu cuenta fue creada. Ya podés iniciar sesión.
        </div>
      )}

      {sessionMessage && !error && (
        <div className="alert alert-warning" role="alert">
          {sessionMessage}
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold" htmlFor="username">Usuario</label>
          <input
            autoComplete="username"
            autoFocus
            className="form-control form-control-lg"
            id="username"
            name="username"
            onChange={handleChange}
            placeholder="Ingresá tu usuario"
            required
            type="text"
            value={formData.username}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold" htmlFor="password">Contraseña</label>
          <input
            autoComplete="current-password"
            className="form-control form-control-lg"
            id="password"
            name="password"
            onChange={handleChange}
            placeholder="Ingresá tu contraseña"
            required
            type="password"
            value={formData.password}
          />
        </div>

        <button className="btn btn-primary btn-lg w-100" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login
