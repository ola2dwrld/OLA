import { Routes, Route, NavLink, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { signup, login as loginApi } from './api'
import { useAuth } from './contexts/AuthContext'
import axios from 'axios'

function App() {
  const { user, logout } = useAuth()
  return (
    <>
      <nav style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 24, alignItems: 'center' }}>
        <NavLink to="/" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>Feed</NavLink>
        <NavLink to="/upload" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>Upload</NavLink>
        {user ? (
          <>
            <NavLink to={`/user/${user.username}`} style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>Profile</NavLink>
            <span style={{ marginLeft: 8 }}>Hi, {user.username}!</span>
            <button onClick={logout} style={{ marginLeft: 8 }}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/signup" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>Sign Up</NavLink>
            <NavLink to="/login" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>Login</NavLink>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
        <Route path="/user/:username" element={<ProfilePage />} />
      </Routes>
    </>
  )
}

function PrivateRoute({ children }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  if (!user) {
    // Redirect to login
    useEffect(() => { navigate('/login') }, [navigate])
    return null
  }
  return children
}

function FeedPage() {
  const [videos, setVideos] = useState([])
  useEffect(() => {
    axios.get('/api/videos').then(res => setVideos(res.data)).catch(() => setVideos([]))
  }, [])
  return (
    <div className="page-container">
      <h2>Feed</h2>
      {videos.length === 0 ? <div>No videos yet.</div> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {videos.map(v => (
            <li key={v._id} style={{ marginBottom: 24 }}>
              <video src={v.videoUrl} controls style={{ width: '100%' }} />
              <div>{v.caption}</div>
              <div>By <NavLink to={`/user/${v.userId.username || v.userId}`}>{v.userId.username || v.userId}</NavLink></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password) {
      setError('All fields are required')
      return
    }
    setError('')
    setLoading(true)
    setSuccess(false)
    try {
      await signup(form)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1000)
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="page-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>Signup successful! You can now log in.</div>}
        <button type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
      </form>
    </div>
  )
}
function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Both fields are required')
      return
    }
    setError('')
    setLoading(true)
    setSuccess(false)
    try {
      await login(form)
      setSuccess(true)
      setTimeout(() => navigate('/'), 1000)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="page-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>Login successful!</div>}
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  )
}
function UploadPage() {
  const { token } = useAuth()
  const [file, setFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleSubmit = async e => {
    e.preventDefault()
    if (!file) {
      setError('Please select a video file')
      return
    }
    setError('')
    setLoading(true)
    setSuccess(false)
    const formData = new FormData()
    formData.append('video', file)
    formData.append('caption', caption)
    try {
      await axios.post('/api/upload', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setSuccess(true)
      setFile(null)
      setCaption('')
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="page-container">
      <h2>Upload Video</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} />
        <input placeholder="Caption" value={caption} onChange={e => setCaption(e.target.value)} />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>Upload successful!</div>}
        <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
      </form>
    </div>
  )
}
function ProfilePage() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [videos, setVideos] = useState([])
  useEffect(() => {
    axios.get(`/api/user/${username}`).then(res => setProfile(res.data)).catch(() => setProfile(null))
    axios.get(`/api/videos?user=${username}`).then(res => setVideos(res.data)).catch(() => setVideos([]))
  }, [username])
  if (!profile) return <div className="page-container">Loading profile...</div>
  return (
    <div className="page-container">
      <h2>{profile.username}'s Profile</h2>
      <div>Bio: {profile.bio}</div>
      <div>Followers: {profile.followers?.length || 0}</div>
      <div>Following: {profile.following?.length || 0}</div>
      <h3>Videos</h3>
      {videos.length === 0 ? <div>No videos yet.</div> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {videos.map(v => (
            <li key={v._id} style={{ marginBottom: 24 }}>
              <video src={v.videoUrl} controls style={{ width: '100%' }} />
              <div>{v.caption}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
