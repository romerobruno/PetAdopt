import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { apiRequest, getApiErrorMessage } from '../services/api.js'

function MyRequests() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadRequests = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await apiRequest('/adoptionrequests/', { auth: true })
      setRequests(Array.isArray(data) ? data : data.results || [])
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'No se pudo cargar tu historial.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadRequests() }, [loadRequests])

  return (
    <PageLayout>
      <section className="page-header py-5"><div className="container"><p className="section-eyebrow fw-bold mb-2">Seguimiento</p><h1 className="display-5 fw-bold">Mis solicitudes</h1></div></section>
      <div className="container py-5">
        {isLoading && <div className="text-center py-5" role="status"><div className="spinner-border text-success" /></div>}
        {!isLoading && error && <div className="alert alert-danger d-flex justify-content-between"><span>{error}</span><button className="btn btn-outline-danger" onClick={loadRequests}>Reintentar</button></div>}
        {!isLoading && !error && requests.length === 0 && <div className="empty-state"><span aria-hidden="true">📋</span><h2 className="h4 mt-3">Todavía no enviaste solicitudes</h2><p className="text-secondary">Cuando encuentres una mascota, podrás iniciar el proceso desde su detalle.</p><Link className="btn btn-success" to="/mascotas">Ver mascotas</Link></div>}
        {!isLoading && !error && requests.length > 0 && <div className="row g-4">{requests.map((request) => (
          <div className="col-12" key={request.id}>
            <article className="card border-0 shadow-sm rounded-4"><div className="card-body p-4 d-flex flex-column flex-md-row justify-content-between gap-3">
              <div><div className="d-flex align-items-center gap-2 mb-2"><h2 className="h4 mb-0">{request.pet_detail.name}</h2><StatusBadge status={request.status} /></div><p className="text-secondary mb-2">Enviada el {new Date(request.created_at).toLocaleDateString('es-AR')}</p><p className="mb-0">{request.message || 'Sin mensaje adicional.'}</p></div>
              <div className="align-self-md-center"><Link className="btn btn-outline-success" to={`/mascotas/${request.pet}`}>Ver mascota</Link></div>
            </div></article>
          </div>
        ))}</div>}
      </div>
    </PageLayout>
  )
}

export default MyRequests
