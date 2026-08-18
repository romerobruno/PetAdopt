import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/useAuth.js'

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

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
    const result = login(formData.username, formData.password)

    if (!result.success) {
      setError(result.message)
      return
    }

    const destination = location.state?.from?.pathname || '/'
    navigate(destination, { replace: true })
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

        <button className="btn btn-primary btn-lg w-100" type="submit">
          Ingresar
        </button>
      </form>

      <div className="demo-credentials rounded-3 p-3 mt-4">
        <p className="small fw-semibold mb-1">Cuenta de prueba</p>
        <p className="small text-secondary mb-0">
          Usuario: <strong>demo</strong> · Contraseña: <strong>petadopt123</strong>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login
