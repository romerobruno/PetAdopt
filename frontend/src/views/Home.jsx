import { useCallback, useEffect, useState } from 'react'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import PetCard from '../components/PetCard.jsx'
import { apiRequest, getApiErrorMessage } from '../services/api.js'

const steps = [
  { number: '1', title: 'Elegí', text: 'Conocé a las mascotas que esperan una familia.' },
  { number: '2', title: 'Contactanos', text: 'Completá tus datos para coordinar una entrevista.' },
  { number: '3', title: 'Adoptá', text: 'Prepará tu hogar para darle la mejor bienvenida.' },
]

function Home() {
  const [pets, setPets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPets = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const data = await apiRequest('/pets/', { auth: true })
      setPets(Array.isArray(data) ? data : data.results || [])
    } catch (petsError) {
      setError(getApiErrorMessage(petsError, 'No se pudieron cargar las mascotas.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPets()
  }, [loadPets])

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1">
        <section className="hero-section py-5" id="inicio">
          <div className="container py-lg-5">
            <div className="row align-items-center gy-5">
              <div className="col-lg-7 text-center text-lg-start">
                <span className="badge rounded-pill text-bg-warning px-3 py-2 mb-4">🐾 Tu nuevo mejor amigo te espera</span>
                <h1 className="hero-title fw-bold mb-4 mx-auto mx-lg-0">
                  Cambiá una vida. <span className="text-success">Adoptá amor.</span>
                </h1>
                <p className="hero-copy lead text-secondary mb-4 mx-auto mx-lg-0">
                  Encontrá a ese compañero especial y regalale la oportunidad de ser parte de tu familia.
                </p>
                <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                  <a className="btn btn-success btn-lg px-4" href="#mascotas">Ver mascotas</a>
                  <a className="btn btn-outline-dark btn-lg px-4" href="#como-adoptar">Cómo adoptar</a>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="hero-visual" aria-label="Ilustración de un perro esperando ser adoptado" role="img">
                  <div className="hero-circle">
                    <span className="hero-pet" aria-hidden="true">🐶</span>
                  </div>
                  <div className="floating-badge rounded-4 p-3 d-flex align-items-center gap-2">
                    <span className="fs-2" aria-hidden="true">🏠</span>
                    <span className="small fw-semibold">Más familias, más finales felices</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5" id="mascotas">
          <div className="container py-lg-4">
            <div className="row align-items-end mb-4 gy-3">
              <div className="col-lg-8">
                <p className="section-eyebrow fw-bold mb-2">Conocelos</p>
                <h2 className="display-6 fw-bold mb-2">Mascotas que buscan hogar</h2>
                <p className="text-secondary mb-0">Cada una tiene una historia única y mucho cariño para dar.</p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <button className="btn btn-outline-success" type="button">Ver todas</button>
              </div>
            </div>

            {isLoading && (
              <div className="text-center py-5" role="status">
                <div className="spinner-border text-success" aria-label="Cargando mascotas" />
                <p className="text-secondary mt-3 mb-0">Cargando mascotas desde la API…</p>
              </div>
            )}

            {!isLoading && error && (
              <div className="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3" role="alert">
                <span>{error}</span>
                <button className="btn btn-outline-danger text-nowrap" onClick={loadPets} type="button">
                  Reintentar
                </button>
              </div>
            )}

            {!isLoading && !error && pets.length === 0 && (
              <div className="alert alert-info mb-0" role="status">
                Todavía no hay mascotas cargadas en el sistema.
              </div>
            )}

            {!isLoading && !error && pets.length > 0 && (
              <div className="row g-4">
                {pets.map((pet, index) => (
                  <div className="col-12 col-md-6 col-lg-4" key={pet.id}>
                    <PetCard pet={pet} color={['green', 'yellow', 'blue'][index % 3]} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="steps-section text-white py-5" id="como-adoptar">
          <div className="container py-lg-4">
            <div className="text-center mb-5">
              <p className="section-eyebrow text-warning fw-bold mb-2">Simple y responsable</p>
              <h2 className="display-6 fw-bold mb-3">Adoptar es más fácil de lo que pensás</h2>
              <p className="text-white-50 mb-0">Te acompañamos durante todo el proceso.</p>
            </div>

            <div className="row g-4">
              {steps.map((step) => (
                <div className="col-12 col-md-4" key={step.number}>
                  <div className="d-flex align-items-start gap-3">
                    <span className="step-number">{step.number}</span>
                    <div>
                      <h3 className="h5 fw-bold">{step.title}</h3>
                      <p className="text-white-50 mb-0">{step.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-5" id="contacto">
              <a className="btn btn-warning btn-lg px-5 fw-semibold" href="mailto:adopciones@petadopt.com">Empezar ahora</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
