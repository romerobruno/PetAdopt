import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import { useAuth } from '../context/useAuth.js'
import { apiRequest, getApiErrorMessage } from '../services/api.js'

function PetDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true
    apiRequest(`/pets/${id}/`)
      .then((data) => active && setPet(data))
      .catch((requestError) => active && setError(getApiErrorMessage(requestError, 'No se pudo cargar la mascota.')))
      .finally(() => active && setIsLoading(false))
    return () => { active = false }
  }, [id])

  const submitRequest = async (event) => {
    event.preventDefault()
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }
    if (user.role !== 'CLIENTE') {
      setError('Solo los usuarios con rol CLIENTE pueden enviar solicitudes de adopción.')
      return
    }
    if (!window.confirm(`¿Confirmás que querés solicitar la adopción de ${pet.name}?`)) return

    setIsSubmitting(true)
    setError('')
    try {
      await apiRequest('/adoptionrequests/', { auth: true, method: 'POST', body: JSON.stringify({ pet: pet.id, message }) })
      setSuccess('Tu solicitud fue enviada correctamente. Podés seguirla desde “Mis solicitudes”.')
      setMessage('')
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'No se pudo enviar la solicitud.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageLayout>
      <div className="container py-5">
        <Link className="link-success text-decoration-none" to="/mascotas">← Volver al catálogo</Link>
        {isLoading && <div className="text-center py-5" role="status"><div className="spinner-border text-success" /></div>}
        {!isLoading && error && !pet && <div className="alert alert-danger mt-4">{error}</div>}
        {!isLoading && pet && (
          <div className="row g-5 mt-1">
            <div className="col-lg-6">
              <div className="detail-image rounded-4 shadow-sm">
                {pet.image ? <img alt={pet.name} src={pet.image} /> : <span aria-hidden="true">🐾</span>}
              </div>
            </div>
            <div className="col-lg-6">
              <span className={`badge ${pet.is_available ? 'text-bg-success' : 'text-bg-secondary'} mb-3`}>{pet.is_available ? 'Disponible' : 'Adoptada'}</span>
              <h1 className="display-4 fw-bold">{pet.name}</h1>
              <p className="lead text-secondary">{[pet.species, pet.breed].filter(Boolean).join(' · ')} · {pet.age} {pet.age === 1 ? 'año' : 'años'}</p>
              <p className="fs-5">{pet.description || 'No hay una descripción disponible.'}</p>

              {success && <div className="alert alert-success">{success} <Link to="/mis-solicitudes">Ver historial</Link></div>}
              {error && pet && <div className="alert alert-danger">{error}</div>}

              {pet.is_available && !success && (
                <form className="card border-0 bg-light rounded-4 p-4 mt-4" onSubmit={submitRequest}>
                  <h2 className="h4 fw-bold">Quiero adoptar a {pet.name}</h2>
                  <label className="form-label" htmlFor="adoption-message">Contanos por qué querés adoptarlo</label>
                  <textarea className="form-control mb-3" id="adoption-message" maxLength="1000" onChange={(e) => setMessage(e.target.value)} placeholder="Mensaje opcional para el equipo de adopciones" rows="4" value={message} />
                  <button className="btn btn-success btn-lg" disabled={isSubmitting} type="submit">{isSubmitting ? 'Enviando…' : user ? 'Enviar solicitud' : 'Ingresar para solicitar'}</button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default PetDetail
