import axios from 'axios'

const API_BASE = '/api'

export async function signup({ username, email, password }) {
  const res = await axios.post(`${API_BASE}/signup`, { username, email, password })
  return res.data
}

export async function login({ email, password }) {
  const res = await axios.post(`${API_BASE}/login`, { email, password })
  return res.data
}