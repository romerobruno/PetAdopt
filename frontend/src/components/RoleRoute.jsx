import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import ProtectedRoute from './ProtectedRoute.jsx'

function RoleGuard({ children, roles }) {
  const { user } = useAuth()

  if (!roles.includes(user.role)) {
    return <Navigate to="/no-autorizado" replace />
  }

  return children
}

function RoleRoute({ children, roles }) {
  return (
    <ProtectedRoute>
      <RoleGuard roles={roles}>{children}</RoleGuard>
    </ProtectedRoute>
  )
}

export default RoleRoute
