function PetCard({ name, type, age, description, emoji, color }) {
  return (
    <article className="card pet-card h-100 border-0 shadow-sm rounded-4">
      <div className={`pet-card-visual pet-card-visual--${color}`} role="img" aria-label={`${name}, ${type}`}>
        <span aria-hidden="true">{emoji}</span>
      </div>
      <div className="card-body p-4">
        <div className="d-flex align-items-start justify-content-between gap-3 mb-2">
          <div>
            <h3 className="h4 card-title fw-bold mb-1">{name}</h3>
            <p className="text-secondary small mb-0">{type} · {age}</p>
          </div>
          <span className="badge rounded-pill text-bg-success">En adopción</span>
        </div>
        <p className="card-text text-secondary mt-3">{description}</p>
        <a className="btn btn-outline-success w-100 mt-2" href="#contacto" aria-label={`Conocer más sobre ${name}`}>
          Conocer más
        </a>
      </div>
    </article>
  )
}

export default PetCard
