import { createContext, useContext, useState, useEffect } from 'react'
import { signup as apiSignup, login as apiLogin } from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  const signup = async (form) => {
    const data = await apiSignup(form)
    // Optionally auto-login after signup
    // setUser(data.user)
    // setToken(data.token)
    return data
  }

  const login = async (form) => {
    const data = await apiLogin(form)
    setUser(data.user)
    setToken(data.token)
    return data
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}