import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const isStaff = ['ADMIN', 'VENDEDOR'].includes(user?.role)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      navigate('/', { replace: true })
      setIsLoggingOut(false)
    }
  }

  const linkClass = ({ isActive }) => `nav-link${isActive ? ' active fw-semibold' : ''}`

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top" aria-label="Navegación principal">
      <div className="container py-2">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
          <span className="navbar-brand-mark" aria-hidden="true">♥</span>PetAdopt
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavigation" aria-controls="mainNavigation" aria-expanded="false" aria-label="Abrir menú">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNavigation">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1 py-3 py-lg-0">
            <li className="nav-item"><NavLink className={linkClass} end to="/">Inicio</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/mascotas">Mascotas</NavLink></li>
            {user?.role === 'CLIENTE' && <li className="nav-item"><NavLink className={linkClass} to="/mis-solicitudes">Mis solicitudes</NavLink></li>}
            {isStaff && (
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown" type="button">Administración</button>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/admin/mascotas">Mascotas</Link></li>
                  <li><Link className="dropdown-item" to="/admin/solicitudes">Solicitudes</Link></li>
                </ul>
              </li>
            )}
            {user ? <>
              <li className="nav-item ms-lg-2"><Link className="btn btn-outline-success" to="/perfil">{user.first_name || user.username}</Link></li>
              <li className="nav-item"><button className="btn btn-outline-danger" disabled={isLoggingOut} onClick={handleLogout} type="button">{isLoggingOut ? 'Cerrando…' : 'Salir'}</button></li>
            </> : <>
              <li className="nav-item ms-lg-2"><Link className="btn btn-outline-success" to="/login">Ingresar</Link></li>
              <li className="nav-item"><Link className="btn btn-success" to="/register">Crear cuenta</Link></li>
            </>}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
