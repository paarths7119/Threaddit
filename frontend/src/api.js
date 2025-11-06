import axios from 'axios'

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' 
})

API.interceptors.request.use((config) => {
  // In a real app, you'd get the token from your state management or context
  // For now, keeping localStorage for consistency with other components
  const token = localStorage.getItem('threaddit_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default API