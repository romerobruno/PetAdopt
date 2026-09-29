import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'

function PageLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  )
}

export default PageLayout
