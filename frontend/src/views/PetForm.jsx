import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import { apiRequest, getApiErrorMessage } from '../services/api.js'

const emptyPet = { name: '', species: '', breed: '', age: '', description: '', is_available: true }

function PetForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const [formData, setFormData] = useState(emptyPet)
  const [image, setImage] = useState(null)
  const [currentImage, setCurrentImage] = useState('')
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditing) return
    let active = true
    apiRequest(`/pets/${id}/`)
      .then((pet) => {
        if (!active) return
        setFormData({ name: pet.name, species: pet.species, breed: pet.breed || '', age: pet.age, description: pet.description || '', is_available: pet.is_available })
        setCurrentImage(pet.image || '')
      })
      .catch((requestError) => active && setError(getApiErrorMessage(requestError, 'No se pudo cargar la mascota.')))
      .finally(() => active && setIsLoading(false))
    return () => { active = false }
  }, [id, isEditing])

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target
    setFormData((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true); setError('')
    const body = new FormData()
    Object.entries(formData).forEach(([key, value]) => body.append(key, value))
    if (image) body.append('image', image)
    try {
      await apiRequest(isEditing ? `/pets/${id}/` : '/pets/', { auth: true, method: isEditing ? 'PATCH' : 'POST', body })
      navigate('/admin/mascotas', { replace: true })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'No se pudo guardar la mascota.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageLayout>
      <section className="page-header py-5"><div className="container"><p className="section-eyebrow fw-bold mb-2">Administración</p><h1 className="display-5 fw-bold">{isEditing ? 'Editar mascota' : 'Nueva mascota'}</h1></div></section>
      <div className="container py-5"><div className="row justify-content-center"><div className="col-lg-8">
        {isLoading ? <div className="text-center py-5"><div className="spinner-border text-success" /></div> : (
          <form className="card border-0 shadow-sm rounded-4" onSubmit={handleSubmit}><div className="card-body p-4 p-md-5">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row g-3">
              <div className="col-md-6"><label className="form-label fw-semibold" htmlFor="name">Nombre</label><input className="form-control" id="name" maxLength="50" name="name" onChange={handleChange} required value={formData.name} /></div>
              <div className="col-md-6"><label className="form-label fw-semibold" htmlFor="species">Especie</label><input className="form-control" id="species" maxLength="30" name="species" onChange={handleChange} placeholder="Perro, Gato…" required value={formData.species} /></div>
              <div className="col-md-6"><label className="form-label fw-semibold" htmlFor="breed">Raza</label><input className="form-control" id="breed" maxLength="50" name="breed" onChange={handleChange} value={formData.breed} /></div>
              <div className="col-md-6"><label className="form-label fw-semibold" htmlFor="age">Edad en años</label><input className="form-control" id="age" min="0" name="age" onChange={handleChange} required type="number" value={formData.age} /></div>
              <div className="col-12"><label className="form-label fw-semibold" htmlFor="description">Descripción</label><textarea className="form-control" id="description" name="description" onChange={handleChange} rows="5" value={formData.description} /></div>
              <div className="col-12"><label className="form-label fw-semibold" htmlFor="image">Imagen</label><input accept="image/*" className="form-control" id="image" onChange={(event) => setImage(event.target.files[0] || null)} type="file" />{currentImage && <p className="form-text">Ya existe una imagen. Elegí otro archivo solamente si querés reemplazarla.</p>}</div>
              <div className="col-12"><div className="form-check form-switch"><input checked={formData.is_available} className="form-check-input" id="is_available" name="is_available" onChange={handleChange} type="checkbox" /><label className="form-check-label" htmlFor="is_available">Disponible para adopción</label></div></div>
            </div>
            <div className="d-flex gap-2 mt-4"><button className="btn btn-success" disabled={isSubmitting} type="submit">{isSubmitting ? 'Guardando…' : 'Guardar mascota'}</button><Link className="btn btn-outline-secondary" to="/admin/mascotas">Cancelar</Link></div>
          </div></form>
        )}
      </div></div></div>
    </PageLayout>
  )
}

export default PetForm
