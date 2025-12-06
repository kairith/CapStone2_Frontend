import axios from "axios"

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const api = axios.create({
    baseURL: config.public.apiBase || "http://localhost:8000/api/v1",
  })

  // Auto-add token to every request
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth-token") || sessionStorage.getItem("auth-token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('🔐 Token added to request:', token.substring(0, 20) + '...')
    }
    return config
  })

  // Handle response errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn('⚠️ Unauthorized - Token may be expired')
        // Could trigger logout here if needed
      }
      return Promise.reject(error)
    }
  )

  return {
    provide: {
      api,
    },
  }
})