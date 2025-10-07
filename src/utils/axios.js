import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'https://backend.mytestbuddies.shop/api',
})

api.interceptors.request.use((config) => {
  const t = localStorage.getItem('token')
  if (t) config.headers.Authorization = 'Bearer ' + t
  return config
})

export default api
