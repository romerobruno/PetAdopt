import { Link } from 'react-router-dom'

function AuthLayout({ title, subtitle, children, footerText, footerLinkText, footerLinkTo }) {
  return (
    <main className="auth-page d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="text-center mb-4">
              <Link className="auth-brand d-inline-flex align-items-center gap-2 text-decoration-none" to="/">
                <span className="navbar-brand-mark" aria-hidden="true">♥</span>
                <span className="fs-4 fw-bold text-dark">PetAdopt</span>
              </Link>
            </div>

            <section className="card auth-card border-0 rounded-4 shadow-sm">
              <div className="card-body p-4 p-sm-5">
                <h1 className="h2 fw-bold text-center mb-2">{title}</h1>
                <p className="text-secondary text-center mb-4">{subtitle}</p>
                {children}
              </div>
            </section>

            <p className="text-center text-secondary mt-4 mb-0">
              {footerText}{' '}
              <Link className="link-success fw-semibold" to={footerLinkTo}>
                {footerLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AuthLayout
