function SearchBar() {
  return (
    <div className="search-bar" role="search">
      <label htmlFor="pet-search" hidden>Buscar mascotas</label>
      <input id="pet-search" type="search" placeholder="Buscar por nombre, especie o ubicación" />
      <button type="button">Buscar</button>
    </div>
  )
}

export default SearchBar
