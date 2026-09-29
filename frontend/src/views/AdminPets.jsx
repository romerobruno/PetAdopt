import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import { apiRequest, getApiErrorMessage } from '../services/api.js'

function AdminPets() {
  const [pets, setPets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPets = useCallback(async () => {
    setIsLoading(true); setError('')
    try { const data = await apiRequest('/pets/'); setPets(Array.isArray(data) ? data : data.results || []) }
    catch (requestError) { setError(getApiErrorMessage(requestError, 'No se pudieron cargar las mascotas.')) }
    finally { setIsLoading(false) }
  }, [])

  useEffect(() => { loadPets() }, [loadPets])

  const removePet = async (pet) => {
    if (!window.confirm(`¿Eliminar definitivamente a ${pet.name}? Esta acción también elimina sus solicitudes.`)) return
    setError('')
    try { await apiRequest(`/pets/${pet.id}/`, { auth: true, method: 'DELETE' }); setPets((current) => current.filter((item) => item.id !== pet.id)) }
    catch (requestError) { setError(getApiErrorMessage(requestError, 'No se pudo eliminar la mascota.')) }
  }

  return (
    <PageLayout>
      <section className="page-header py-5"><div className="container d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"><div><p className="section-eyebrow fw-bold mb-2">Administración</p><h1 className="display-5 fw-bold mb-0">Gestión de mascotas</h1></div><Link className="btn btn-success btn-lg" to="/admin/mascotas/nueva">Nueva mascota</Link></div></section>
      <div className="container py-5">
        {error && <div className="alert alert-danger">{error}</div>}
        {isLoading && <div className="text-center py-5"><div className="spinner-border text-success" /></div>}
        {!isLoading && pets.length === 0 && <div className="empty-state"><span>🐾</span><h2 className="h4 mt-3">No hay mascotas cargadas</h2><Link className="btn btn-success" to="/admin/mascotas/nueva">Crear la primera</Link></div>}
        {!isLoading && pets.length > 0 && <div className="table-responsive card border-0 shadow-sm rounded-4"><table className="table table-hover align-middle mb-0"><thead><tr><th>Nombre</th><th>Especie</th><th>Edad</th><th>Estado</th><th className="text-end">Acciones</th></tr></thead><tbody>{pets.map((pet) => <tr key={pet.id}><td className="fw-semibold">{pet.name}</td><td>{pet.species}{pet.breed ? ` · ${pet.breed}` : ''}</td><td>{pet.age} {pet.age === 1 ? 'año' : 'años'}</td><td><span className={`badge ${pet.is_available ? 'text-bg-success' : 'text-bg-secondary'}`}>{pet.is_available ? 'Disponible' : 'Adoptada'}</span></td><td className="text-end text-nowrap"><Link className="btn btn-sm btn-outline-primary me-2" to={`/admin/mascotas/${pet.id}/editar`}>Editar</Link><button className="btn btn-sm btn-outline-danger" onClick={() => removePet(pet)}>Eliminar</button></td></tr>)}</tbody></table></div>}
      </div>
    </PageLayout>
  )
}

export default AdminPets
