function getPetEmoji(species) {
  const normalizedSpecies = species.toLowerCase()

  if (normalizedSpecies.includes('gat')) return '🐈'
  if (normalizedSpecies.includes('cone')) return '🐇'
  if (normalizedSpecies.includes('ave') || normalizedSpecies.includes('páj')) return '🦜'
  return '🐕'
}

function PetCard({ pet, color }) {
  const type = [pet.species, pet.breed].filter(Boolean).join(' · ')
  const age = `${pet.age} ${pet.age === 1 ? 'año' : 'años'}`
  const emoji = getPetEmoji(pet.species)

  return (
    <article className="card pet-card h-100 border-0 shadow-sm rounded-4">
      <div className={`pet-card-visual pet-card-visual--${color}`} role="img" aria-label={`${pet.name}, ${type}`}>
        {pet.image
          ? <img className="pet-card-image" src={pet.image} alt="" />
          : <span aria-hidden="true">{emoji}</span>}
      </div>
      <div className="card-body p-4">
        <div className="d-flex align-items-start justify-content-between gap-3 mb-2">
          <div>
            <h3 className="h4 card-title fw-bold mb-1">{pet.name}</h3>
            <p className="text-secondary small mb-0">{type} · {age}</p>
          </div>
          <span className="badge rounded-pill text-bg-success">En adopción</span>
        </div>
        <p className="card-text text-secondary mt-3">
          {pet.description || 'Esta mascota está esperando una familia que le dé mucho amor.'}
        </p>
        <a className="btn btn-outline-success w-100 mt-2" href="#contacto" aria-label={`Conocer más sobre ${pet.name}`}>
          Conocer más
        </a>
      </div>
    </article>
  )
}

export default PetCard
