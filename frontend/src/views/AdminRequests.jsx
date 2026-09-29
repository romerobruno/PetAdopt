import { useCallback, useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { apiRequest, getApiErrorMessage } from '../services/api.js'

function AdminRequests() {
  const [requests, setRequests] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState('')

  const loadRequests = useCallback(async (status = '') => {
    setIsLoading(true); setError('')
    try {
      const params = status ? `?status=${status}` : ''
      const data = await apiRequest(`/adoptionrequests/${params}`, { auth: true })
      setRequests(Array.isArray(data) ? data : data.results || [])
    } catch (requestError) { setError(getApiErrorMessage(requestError, 'No se pudieron cargar las solicitudes.')) }
    finally { setIsLoading(false) }
  }, [])

  useEffect(() => { loadRequests(statusFilter) }, [loadRequests, statusFilter])

  const updateStatus = async (request, action) => {
    const verb = action === 'approve' ? 'aprobar' : 'rechazar'
    if (!window.confirm(`¿Confirmás que querés ${verb} la solicitud de ${request.user_detail.username} para ${request.pet_detail.name}?`)) return
    setUpdatingId(request.id); setError('')
    try {
      await apiRequest(`/adoptionrequests/${request.id}/${action}/`, { auth: true, method: 'POST' })
      await loadRequests(statusFilter)
    } catch (requestError) { setError(getApiErrorMessage(requestError, 'No se pudo actualizar la solicitud.')) }
    finally { setUpdatingId(null) }
  }

  return (
    <PageLayout>
      <section className="page-header py-5"><div className="container"><p className="section-eyebrow fw-bold mb-2">Administración</p><h1 className="display-5 fw-bold">Solicitudes de adopción</h1></div></section>
      <div className="container py-5">
        <div className="d-flex flex-wrap gap-2 mb-4" aria-label="Filtrar por estado">{[['', 'Todas'], ['PENDING', 'Pendientes'], ['APPROVED', 'Aprobadas'], ['REJECTED', 'Rechazadas']].map(([value, label]) => <button className={`btn ${statusFilter === value ? 'btn-success' : 'btn-outline-success'}`} key={value} onClick={() => setStatusFilter(value)}>{label}</button>)}</div>
        {error && <div className="alert alert-danger">{error}</div>}
        {isLoading && <div className="text-center py-5"><div className="spinner-border text-success" /></div>}
        {!isLoading && requests.length === 0 && <div className="empty-state"><span>📭</span><h2 className="h4 mt-3">No hay solicitudes en este estado</h2></div>}
        {!isLoading && requests.length > 0 && <div className="row g-4">{requests.map((request) => <div className="col-12" key={request.id}><article className="card border-0 shadow-sm rounded-4"><div className="card-body p-4"><div className="d-flex flex-column flex-lg-row justify-content-between gap-3"><div><div className="d-flex align-items-center flex-wrap gap-2 mb-2"><h2 className="h4 mb-0">{request.pet_detail.name}</h2><StatusBadge status={request.status} /></div><p className="mb-1"><strong>Solicitante:</strong> {[request.user_detail.first_name, request.user_detail.last_name].filter(Boolean).join(' ') || request.user_detail.username} ({request.user_detail.email})</p><p className="text-secondary small">{new Date(request.created_at).toLocaleString('es-AR')}</p><p className="mb-0">{request.message || 'Sin mensaje adicional.'}</p></div><div className="d-flex gap-2 align-self-lg-center">{request.status !== 'APPROVED' && <button className="btn btn-success" disabled={updatingId === request.id} onClick={() => updateStatus(request, 'approve')}>Aprobar</button>}{request.status !== 'REJECTED' && <button className="btn btn-outline-danger" disabled={updatingId === request.id} onClick={() => updateStatus(request, 'reject')}>Rechazar</button>}</div></div></div></article></div>)}</div>}
      </div>
    </PageLayout>
  )
}

export default AdminRequests
