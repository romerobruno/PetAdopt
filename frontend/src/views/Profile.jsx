import { useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout.jsx'
import { useAuth } from '../context/useAuth.js'
import { apiRequest, getApiErrorMessage } from '../services/api.js'

function Profile() {
  const { user, setCurrentUser } = useAuth()
  const [formData, setFormData] = useState({ first_name: '', last_name: '', telefono: '', direccion: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setFormData({ first_name: user.first_name || '', last_name: user.last_name || '', telefono: user.telefono || '', direccion: user.direccion || '' })
  }, [user])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const profile = await apiRequest('/users/profile/', { auth: true, method: 'PATCH', body: JSON.stringify(formData) })
      setCurrentUser(profile)
      setSuccess('Tu perfil se actualizó correctamente.')
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'No se pudo actualizar el perfil.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))

  return (
    <PageLayout>
      <section className="page-header py-5"><div className="container"><p className="section-eyebrow fw-bold mb-2">Tu cuenta</p><h1 className="display-5 fw-bold">Mi perfil</h1></div></section>
      <div className="container py-5"><div className="row justify-content-center"><div className="col-lg-8">
        <form className="card border-0 shadow-sm rounded-4" onSubmit={handleSubmit}><div className="card-body p-4 p-md-5">
          {success && <div className="alert alert-success">{success}</div>}{error && <div className="alert alert-danger">{error}</div>}
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label fw-semibold" htmlFor="profile-username">Usuario</label><input className="form-control" disabled id="profile-username" value={user.username} /></div>
            <div className="col-md-6"><label className="form-label fw-semibold" htmlFor="profile-email">Email</label><input className="form-control" disabled id="profile-email" value={user.email} /></div>
            <div className="col-md-6"><label className="form-label fw-semibold" htmlFor="first_name">Nombre</label><input className="form-control" id="first_name" name="first_name" onChange={handleChange} value={formData.first_name} /></div>
            <div className="col-md-6"><label className="form-label fw-semibold" htmlFor="last_name">Apellido</label><input className="form-control" id="last_name" name="last_name" onChange={handleChange} value={formData.last_name} /></div>
            <div className="col-md-6"><label className="form-label fw-semibold" htmlFor="telefono">Teléfono</label><input className="form-control" id="telefono" maxLength="20" name="telefono" onChange={handleChange} value={formData.telefono} /></div>
            <div className="col-md-6"><label className="form-label fw-semibold" htmlFor="role">Rol</label><input className="form-control" disabled id="role" value={user.role} /></div>
            <div className="col-12"><label className="form-label fw-semibold" htmlFor="direccion">Dirección</label><input className="form-control" id="direccion" maxLength="255" name="direccion" onChange={handleChange} value={formData.direccion} /></div>
          </div>
          <button className="btn btn-success mt-4" disabled={isSubmitting} type="submit">{isSubmitting ? 'Guardando…' : 'Guardar cambios'}</button>
        </div></form>
      </div></div></div>
    </PageLayout>
  )
}

export default Profile
