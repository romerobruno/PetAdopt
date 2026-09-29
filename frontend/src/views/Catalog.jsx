import { useCallback, useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout.jsx'
import PetCard from '../components/PetCard.jsx'
import { apiRequest, getApiErrorMessage } from '../services/api.js'

function Catalog() {
  const [pets, setPets] = useState([])
  const [search, setSearch] = useState('')
  const [species, setSpecies] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPets = useCallback(async (filters = {}) => {
    setIsLoading(true)
    setError('')
    const params = new URLSearchParams({ available: 'true' })
    if (filters.search?.trim()) params.set('search', filters.search.trim())
    if (filters.species) params.set('species', filters.species)

    try {
      const data = await apiRequest(`/pets/?${params}`)
      setPets(Array.isArray(data) ? data : data.results || [])
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'No se pudo cargar el catálogo.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadPets() }, [loadPets])

  const handleSubmit = (event) => {
    event.preventDefault()
    loadPets({ search, species })
  }

  const clearFilters = () => {
    setSearch('')
    setSpecies('')
    loadPets()
  }

  return (
    <PageLayout>
      <section className="page-header py-5">
        <div className="container">
          <p className="section-eyebrow fw-bold mb-2">Encontrá a tu compañero</p>
          <h1 className="display-5 fw-bold mb-2">Mascotas en adopción</h1>
          <p className="text-secondary mb-0">Todos los datos de este catálogo se obtienen de la API.</p>
        </div>
      </section>

      <section className="container py-5">
        <form className="card border-0 shadow-sm rounded-4 p-3 p-md-4 mb-5" onSubmit={handleSubmit}>
          <div className="row g-3 align-items-end">
            <div className="col-md-6">
              <label className="form-label fw-semibold" htmlFor="pet-search">Buscar</label>
              <input className="form-control" id="pet-search" onChange={(e) => setSearch(e.target.value)} placeholder="Nombre, especie o raza" value={search} />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold" htmlFor="species-filter">Especie</label>
              <input className="form-control" id="species-filter" onChange={(e) => setSpecies(e.target.value)} placeholder="Ej.: Perro" value={species} />
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button className="btn btn-success flex-grow-1" disabled={isLoading} type="submit">Filtrar</button>
              <button className="btn btn-outline-secondary" onClick={clearFilters} type="button">Limpiar</button>
            </div>
          </div>
        </form>

        {isLoading && <div className="text-center py-5" role="status"><div className="spinner-border text-success" /><p className="text-secondary mt-3">Cargando mascotas…</p></div>}
        {!isLoading && error && <div className="alert alert-danger d-flex justify-content-between align-items-center"><span>{error}</span><button className="btn btn-outline-danger" onClick={() => loadPets({ search, species })}>Reintentar</button></div>}
        {!isLoading && !error && pets.length === 0 && <div className="empty-state"><span aria-hidden="true">🐾</span><h2 className="h4 mt-3">No encontramos mascotas</h2><p className="text-secondary">Probá cambiando los filtros o volvé más tarde.</p></div>}
        {!isLoading && !error && pets.length > 0 && <div className="row g-4">{pets.map((pet, index) => <div className="col-12 col-md-6 col-lg-4" key={pet.id}><PetCard color={['green', 'yellow', 'blue'][index % 3]} pet={pet} /></div>)}</div>}
      </section>
    </PageLayout>
  )
}

export default Catalog
