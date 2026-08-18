import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar navbar-expand-md bg-white border-bottom sticky-top" aria-label="Navegación principal">
      <div className="container py-2">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
          <span className="navbar-brand-mark" aria-hidden="true">♥</span>
          PetAdopt
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavigation"
          aria-controls="mainNavigation"
          aria-expanded="false"
          aria-label="Abrir menú de navegación"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavigation">
          <ul className="navbar-nav ms-auto align-items-md-center gap-md-2 py-3 py-md-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#inicio">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#mascotas">Mascotas</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#como-adoptar">Cómo adoptar</a>
            </li>
            <li className="nav-item ms-md-2">
              <a className="btn btn-success px-4" href="#mascotas">Quiero adoptar</a>
            </li>
            <li className="nav-item ms-md-2 d-flex align-items-center gap-2">
              <span className="small text-secondary text-nowrap" title={`Usuario: ${user.username}`}>
                Hola, {user.name}
              </span>
              <button className="btn btn-outline-danger text-nowrap" onClick={handleLogout} type="button">
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
