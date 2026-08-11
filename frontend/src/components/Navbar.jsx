function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__content">
        <a className="brand" href="#inicio">PetAdopt</a>
        <nav className="navbar__links" aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#mascotas">Mascotas</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
