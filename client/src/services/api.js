// client/src/services/api.js

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
})

// Interceptor para adicionar o tenant ID em todas as requisições
api.interceptors.request.use(config => {
  // Pega o tenant do localStorage ou de onde estiver armazenado
  const tenant = localStorage.getItem('tenant') || 'conceicaodotocantins'

  config.headers['x-tenant-id'] = tenant
  return config
})

export default api
