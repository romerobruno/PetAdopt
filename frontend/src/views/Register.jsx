import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'
import { getApiErrorMessage } from '../services/api.js'

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
}

function Register() {
  const [formData, setFormData] = useState(emptyForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, isLoadingSession, register } = useAuth()
  const navigate = useNavigate()

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

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setIsSubmitting(true)

    try {
      await register(formData)
      navigate('/login', { replace: true, state: { registered: true } })
    } catch (registerError) {
      setError(getApiErrorMessage(registerError, 'No se pudo crear la cuenta.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Crear una cuenta"
      subtitle="Registrate y empezá a buscar a tu nuevo amigo."
      footerText="¿Ya tenés una cuenta?"
      footerLinkText="Iniciá sesión"
      footerLinkTo="/login"
    >
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold" htmlFor="firstName">Nombre</label>
          <input
            autoComplete="given-name"
            autoFocus
            className="form-control"
            id="firstName"
            name="firstName"
            onChange={handleChange}
            placeholder="Tu nombre"
            required
            type="text"
            value={formData.firstName}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold" htmlFor="lastName">Apellido</label>
          <input
            autoComplete="family-name"
            className="form-control"
            id="lastName"
            name="lastName"
            onChange={handleChange}
            placeholder="Tu apellido"
            required
            type="text"
            value={formData.lastName}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold" htmlFor="email">Email</label>
          <input
            autoComplete="email"
            className="form-control"
            id="email"
            name="email"
            onChange={handleChange}
            placeholder="nombre@ejemplo.com"
            required
            type="email"
            value={formData.email}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold" htmlFor="register-username">Usuario</label>
          <input
            autoComplete="username"
            className="form-control"
            id="register-username"
            minLength="3"
            name="username"
            onChange={handleChange}
            placeholder="Elegí un usuario"
            required
            type="text"
            value={formData.username}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold" htmlFor="register-password">Contraseña</label>
          <input
            autoComplete="new-password"
            className="form-control"
            id="register-password"
            minLength="8"
            name="password"
            onChange={handleChange}
            placeholder="Mínimo 8 caracteres"
            required
            type="password"
            value={formData.password}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold" htmlFor="confirm-password">Confirmar contraseña</label>
          <input
            autoComplete="new-password"
            className="form-control"
            id="confirm-password"
            minLength="8"
            name="confirmPassword"
            onChange={handleChange}
            placeholder="Repetí tu contraseña"
            required
            type="password"
            value={formData.confirmPassword}
          />
        </div>

        <button className="btn btn-primary btn-lg w-100" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Creando cuenta…' : 'Registrarme'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Register
