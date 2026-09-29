import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'

function Unauthorized() {
  return <PageLayout><div className="container py-5"><div className="empty-state"><span>🔒</span><h1 className="h2 mt-3">No autorizado</h1><p className="text-secondary">Tu cuenta no tiene permisos para acceder a esta sección.</p><Link className="btn btn-success" to="/">Volver al inicio</Link></div></div></PageLayout>
}

export default Unauthorized
