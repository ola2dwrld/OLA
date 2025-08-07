import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<FeedPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/user/:username" element={<ProfilePage />} />
    </Routes>
  )
}

function FeedPage() {
  return <div className="page-container">Feed Page (Video Feed)</div>
}
function SignupPage() {
  return <div className="page-container">Signup Page</div>
}
function LoginPage() {
  return <div className="page-container">Login Page</div>
}
function UploadPage() {
  return <div className="page-container">Upload Page</div>
}
function ProfilePage() {
  return <div className="page-container">Profile Page</div>
}

export default App
