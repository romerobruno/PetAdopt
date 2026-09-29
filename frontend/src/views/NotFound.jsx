import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'

function NotFound() {
  return <PageLayout><div className="container py-5"><div className="empty-state"><span>🐾</span><h1 className="h2 mt-3">Página no encontrada</h1><p className="text-secondary">La dirección que buscás no existe.</p><Link className="btn btn-success" to="/">Volver al inicio</Link></div></div></PageLayout>
}

export default NotFound
