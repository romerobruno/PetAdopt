function PetCard({ name, type, age }) {
  return (
    <article className="pet-card">
      <div className="pet-card__placeholder" aria-hidden="true">🐾</div>
      <h3>{name}</h3>
      <p>{type} · {age}</p>
    </article>
  )
}

export default PetCard
