import SearchBar from './SearchBar'

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="container">
        <h1>Encontrá a tu nuevo mejor amigo</h1>
        <p>Conectamos mascotas que buscan un hogar con personas listas para adoptar.</p>
        <SearchBar />
      </div>
    </section>
  )
}

export default Hero
