import PetCard from './PetCard'

const samplePets = [
  { name: 'Luna', type: 'Perra', age: '2 años' },
  { name: 'Milo', type: 'Gato', age: '1 año' },
  { name: 'Simón', type: 'Perro', age: '4 años' },
]

function PetList() {
  return (
    <section className="pet-list container" id="mascotas">
      <h2>Mascotas destacadas</h2>
      <div className="pet-grid">
        {samplePets.map((pet) => <PetCard key={pet.name} {...pet} />)}
      </div>
    </section>
  )
}

export default PetList
