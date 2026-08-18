import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'

const emptyForm = {
  name: '',
  username: '',
  password: '',
  confirmPassword: '',
}

function Register() {
  const [formData, setFormData] = useState(emptyForm)
  const [error, setError] = useState('')
  const { user, register } = useAuth()
  const navigate = useNavigate()

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    const result = register(formData)

    if (!result.success) {
      setError(result.message)
      return
    }

    navigate('/login', { replace: true, state: { registered: true } })
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
          <label className="form-label fw-semibold" htmlFor="name">Nombre</label>
          <input
            autoComplete="name"
            autoFocus
            className="form-control"
            id="name"
            name="name"
            onChange={handleChange}
            placeholder="Tu nombre"
            required
            type="text"
            value={formData.name}
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
            minLength="6"
            name="password"
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
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
            minLength="6"
            name="confirmPassword"
            onChange={handleChange}
            placeholder="Repetí tu contraseña"
            required
            type="password"
            value={formData.confirmPassword}
          />
        </div>

        <button className="btn btn-primary btn-lg w-100" type="submit">
          Registrarme
        </button>
      </form>
    </AuthLayout>
  )
}

export default Register
