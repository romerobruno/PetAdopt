import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function ProtectedRoute({ children }) {
  const { user, isLoadingSession } = useAuth()
  const location = useLocation()

  if (isLoadingSession) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100" role="status">
        <div className="spinner-border text-success" aria-label="Verificando sesión" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
