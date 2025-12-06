// stores/auth.ts
import { defineStore } from 'pinia'

interface User {
  id?: number | string
  email?: string
  role?: string
  firstName?: string
  lastName?: string
  name?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    parseJwt(token: string) {
      try {
        return JSON.parse(atob(token.split('.')[1]))
      } catch {
        return null
      }
    },

    async login(credentials: { email: string; password: string }) {
      const config = useRuntimeConfig()
      const apiBase = config.public.apiBase

      this.loading = true
      this.error = null

      // Try admin first then user
      const endpoints = [
        `${apiBase.replace(/\/$/, '')}/admin/login`,
        `${apiBase.replace(/\/$/, '')}/user/login`,
      ]

      for (const endpoint of endpoints) {
        try {
          const response = await $fetch<any>(endpoint, {
            method: 'POST',
            body: credentials,
            // don't throw on non-2xx so we can inspect response (Nuxt $fetch throws by default; keep try/catch)
          })

          // Normalize token extraction (backend may return in different shapes)
          const token = response?.data?.token || response?.token || response?.access_token
          if (!token) {
            // If backend returned 200 but no token, treat as failure and try next endpoint
            this.error = response?.message || 'Login failed: no token returned'
            continue
          }

          const payload = this.parseJwt(token) || {}

          const user = {
            id: payload.user_id ?? payload.sub ?? response?.data?.user?.id ?? null,
            email: payload.email ?? response?.data?.user?.email ?? null,
            role: payload.role ?? response?.data?.role ?? response?.role ?? null,
            firstName: payload.first_name ?? response?.data?.user?.first_name ?? null,
            lastName: payload.last_name ?? response?.data?.user?.last_name ?? null,
            name: `${payload.first_name ?? response?.data?.user?.first_name ?? ''} ${payload.last_name ?? response?.data?.user?.last_name ?? ''}`.trim(),
          }

          // Persist
          this.token = token
          this.user = user
          this.isAuthenticated = true

          try {
            localStorage.setItem('auth-token', token)
            localStorage.setItem('auth-user', JSON.stringify(user))
          } catch (e) {
            // ignore storage errors
          }

          this.loading = false
          return { success: true, role: user.role }
        } catch (err: any) {
          // If the request failed (401, network, etc.), capture message and try next endpoint
          const status = err?.status || err?.response?.status
          const backendMsg = err?.data?.message || err?.response?.data?.message || err?.message
          // For 401 on admin, try user; but record last error to surface if both fail
          this.error = backendMsg || `Login failed (${status || 'error'})`
          // continue to next endpoint
        }
      }

      // If we reach here both endpoints failed
      this.loading = false
      return { success: false }
    },

    async checkAuth() {
      const token = localStorage.getItem('auth-token')
      const userData = localStorage.getItem('auth-user')
      if (!token || !userData) return false

      this.token = token
      this.user = JSON.parse(userData)
      this.isAuthenticated = true
      return true
    },

    logout() {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
      navigateTo('/auth/login')
    },

    getAuthHeaders() {
      if (!this.token) return {}
      return { Authorization: `Bearer ${this.token}` }
    },
  },
})
