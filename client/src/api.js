import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export function setToken(token) {
  if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete axios.defaults.headers.common['Authorization']
}

export async function register(email, password) {
  const { data } = await axios.post(`${API_BASE}/auth/register`, { email, password })
    console.log(data)
  return data
}

export async function login(email, password) {
  const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password })
  return data
}

export async function listTodos({ page = 1, limit = 10, completed, search, sortBy, sortOrder } = {}) {
  const params = { page, limit }
  if (completed !== undefined) params.completed = String(completed)
  if (search) params.search = search
  if (sortBy) params.sortBy = sortBy
  if (sortOrder) params.sortOrder = sortOrder
  const { data } = await axios.get(`${API_BASE}/todos`, { params })
  return data
}

export async function createTodo(payload) {
  const { data } = await axios.post(`${API_BASE}/todos`, payload)
  return data
}

export async function updateTodo(id, payload) {
  const { data } = await axios.put(`${API_BASE}/todos/${id}`, payload)
  return data
}

export async function deleteTodo(id) {
  const { data } = await axios.delete(`${API_BASE}/todos/${id}`)
  return data
}


