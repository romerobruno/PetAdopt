import { useState } from 'react'
import AuthContext from './auth-context.js'

const initialUsers = [
  {
    name: 'Usuario Demo',
    username: 'demo',
    password: 'petadopt123',
  },
]

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(initialUsers)
  const [user, setUser] = useState(null)

  const login = (username, password) => {
    const normalizedUsername = username.trim().toLowerCase()
    const foundUser = users.find(
      (candidate) => candidate.username.toLowerCase() === normalizedUsername
        && candidate.password === password,
    )

    if (!foundUser) {
      return {
        success: false,
        message: 'El usuario o la contraseña son incorrectos.',
      }
    }

    setUser({ name: foundUser.name, username: foundUser.username })
    return { success: true }
  }

  const register = ({ name, username, password }) => {
    const cleanName = name.trim()
    const cleanUsername = username.trim()
    const usernameExists = users.some(
      (candidate) => candidate.username.toLowerCase() === cleanUsername.toLowerCase(),
    )

    if (usernameExists) {
      return {
        success: false,
        message: 'Ese nombre de usuario ya está registrado.',
      }
    }

    setUsers((currentUsers) => [
      ...currentUsers,
      { name: cleanName, username: cleanUsername, password },
    ])

    return { success: true }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
