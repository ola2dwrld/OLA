import { Routes, Route, NavLink } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <>
      <nav style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
        <NavLink to="/" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>Feed</NavLink>
        <NavLink to="/upload" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>Upload</NavLink>
        <NavLink to="/signup" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>Sign Up</NavLink>
        <NavLink to="/login" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>Login</NavLink>
        <NavLink to="/user/demo" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>Profile</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/user/:username" element={<ProfilePage />} />
      </Routes>
    </>
  )
}

function FeedPage() {
  return <div className="page-container">Feed Page (Video Feed)</div>
}
function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleSubmit = e => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password) {
      setError('All fields are required')
      return
    }
    setError('')
    alert('Signup form submitted!')
  }
  return (
    <div className="page-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}
function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleSubmit = e => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Both fields are required')
      return
    }
    setError('')
    alert('Login form submitted!')
  }
  return (
    <div className="page-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
function UploadPage() {
  return <div className="page-container">Upload Page</div>
}
function ProfilePage() {
  return <div className="page-container">Profile Page</div>
}

export default App
