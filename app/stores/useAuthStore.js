import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    getUserRole: (state) => state.user?.role || null,
    getUserName: (state) => state.user?.name || '',
    getUserEmail: (state) => state.user?.email || '',
    isAdmin: (state) => state.user?.role === 'admin',
    isLecturer: (state) => state.user?.role === 'lecturer',
    isStudent: (state) => state.user?.role === 'student'
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with your actual API endpoint
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials
        })

        // Store authentication data
        this.token = response.token
        this.user = response.user
        this.isAuthenticated = true

        // Store token in cookie for persistence
        const token = useCookie('auth-token', {
          maxAge: credentials.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days or 1 day
        })
        token.value = response.token

        return response
      } catch (error) {
        this.error = error.data?.message || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        // TODO: Call logout API if needed
        // await $fetch('/api/auth/logout', { method: 'POST' })
        
        // Clear authentication data
        this.user = null
        this.token = null
        this.isAuthenticated = false
        
        // Clear cookie
        const token = useCookie('auth-token')
        token.value = null

        // Redirect to login
        await navigateTo('/auth/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },

    async checkAuth() {
      const token = useCookie('auth-token')
      
      if (!token.value) {
        return false
      }

      try {
        // TODO: Verify token with API
        const response = await $fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        })

        this.token = token.value
        this.user = response.user
        this.isAuthenticated = true

        return true
      } catch (error) {
        // Token is invalid, clear it
        this.logout()
        return false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with your actual API endpoint
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: userData
        })

        return response
      } catch (error) {
        this.error = error.data?.message || 'Registration failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async forgotPassword(email) {
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with your actual API endpoint
        const response = await $fetch('/api/auth/forgot-password', {
          method: 'POST',
          body: { email }
        })

        return response
      } catch (error) {
        this.error = error.data?.message || 'Failed to send reset email'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})