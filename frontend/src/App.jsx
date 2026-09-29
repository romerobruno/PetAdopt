import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RoleRoute from './components/RoleRoute.jsx'
import AdminPets from './views/AdminPets.jsx'
import AdminRequests from './views/AdminRequests.jsx'
import Catalog from './views/Catalog.jsx'
import Home from './views/Home.jsx'
import Login from './views/Login.jsx'
import MyRequests from './views/MyRequests.jsx'
import NotFound from './views/NotFound.jsx'
import PetDetail from './views/PetDetail.jsx'
import PetForm from './views/PetForm.jsx'
import Profile from './views/Profile.jsx'
import Register from './views/Register.jsx'
import Unauthorized from './views/Unauthorized.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mascotas" element={<Catalog />} />
          <Route path="/mascotas/:id" element={<PetDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mis-solicitudes" element={<RoleRoute roles={['CLIENTE']}><MyRequests /></RoleRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin/mascotas" element={<RoleRoute roles={['ADMIN', 'VENDEDOR']}><AdminPets /></RoleRoute>} />
          <Route path="/admin/mascotas/nueva" element={<RoleRoute roles={['ADMIN', 'VENDEDOR']}><PetForm /></RoleRoute>} />
          <Route path="/admin/mascotas/:id/editar" element={<RoleRoute roles={['ADMIN', 'VENDEDOR']}><PetForm /></RoleRoute>} />
          <Route path="/admin/solicitudes" element={<RoleRoute roles={['ADMIN', 'VENDEDOR']}><AdminRequests /></RoleRoute>} />
          <Route path="/no-autorizado" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
