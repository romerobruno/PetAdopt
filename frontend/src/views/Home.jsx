import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import PetCard from '../components/PetCard.jsx'

const pets = [
  {
    name: 'Luna',
    type: 'Perra mestiza',
    age: '2 años',
    description: 'Dulce, curiosa y fanática de los paseos. Busca una familia con quien compartir aventuras.',
    emoji: '🐕',
    color: 'green',
  },
  {
    name: 'Simón',
    type: 'Gato atigrado',
    age: '1 año',
    description: 'Cariñoso y tranquilo. Su plan favorito es dormir al sol y recibir muchos mimos.',
    emoji: '🐈',
    color: 'yellow',
  },
  {
    name: 'Milo',
    type: 'Cachorro mestizo',
    age: '8 meses',
    description: 'Juguetón, sociable y lleno de energía. Está listo para aprender junto a vos.',
    emoji: '🐶',
    color: 'blue',
  },
]

const steps = [
  { number: '1', title: 'Elegí', text: 'Conocé a las mascotas que esperan una familia.' },
  { number: '2', title: 'Contactanos', text: 'Completá tus datos para coordinar una entrevista.' },
  { number: '3', title: 'Adoptá', text: 'Prepará tu hogar para darle la mejor bienvenida.' },
]

function Home() {
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

            <div className="row g-4">
              {pets.map((pet) => (
                <div className="col-12 col-md-6 col-lg-4" key={pet.name}>
                  <PetCard {...pet} />
                </div>
              ))}
            </div>
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
