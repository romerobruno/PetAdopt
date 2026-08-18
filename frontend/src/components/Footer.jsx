function Footer() {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row align-items-center gy-3">
          <div className="col-md-6 text-center text-md-start">
            <a className="d-inline-flex align-items-center gap-2 text-white text-decoration-none fw-bold" href="#inicio">
              <span className="footer-brand-mark" aria-hidden="true">♥</span>
              PetAdopt
            </a>
            <p className="text-white-50 small mb-0 mt-2">Conectando mascotas con familias para toda la vida.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="text-white-50 small mb-0">© 2026 PetAdopt · Hecho con amor por los animales.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
