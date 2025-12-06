import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  role: string
  firstName: string
  lastName: string
  name: string
  globalId: string
  tokenType: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    refreshToken: null as string | null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    getUserRole: (state) => {
      const role = state.user?.role || null
      console.log('📋 Getting user role:', role)
      return role
    },
    getUserName: (state) => state.user?.name || '',
    getUserEmail: (state) => state.user?.email || '',
    isAdmin: (state) => {
      const isAdmin = state.user?.role === 'admin' || state.user?.role === 'superadmin'
      console.log('🔍 Checking if admin:', isAdmin)
      return isAdmin
    },
    isLecturer: (state) => {
      const isLecturer = state.user?.role === 'lecturer'
      console.log('🔍 Checking if lecturer:', isLecturer)
      return isLecturer
    },
    isStudent: (state) => {
      const isStudent = state.user?.role === 'student'
      console.log('🔍 Checking if student:', isStudent)
      return isStudent
    }
  },

  actions: {
    async login(credentials: { email: string; password: string; loginType?: string; rememberMe?: boolean }) {
      this.loading = true
      this.error = null

      const config = useRuntimeConfig()
      const apiBase = config.public.apiBase
      const explicitType = credentials.loginType // "admin" | "user" | undefined
      const sequence = explicitType ? [explicitType] : ['admin', 'user']

      console.group('🔐 Login Attempt')
      console.log('Email:', credentials.email)
      console.log('Preferred:', explicitType ?? 'auto (admin → user)')

      let lastError: any = null

      for (const loginType of sequence) {
        const endpoint = `${apiBase}/${loginType}/login`
        console.log(`➡️ Trying ${loginType} endpoint:`, endpoint)
        try {
          const response = await $fetch<{ status: string; message?: string; data: any }>(endpoint, {
            method: 'POST',
            body: { email: credentials.email, password: credentials.password }
          })
          console.log('Login response:', response)

          if (response.status !== 'success') {
            throw new Error(response.message || 'Login failed')
          }

          const data = response.data
          const token = data.token
          const expiresAt = data.expires
          const refreshToken = data.refresh_token
          // Get role from response
          const role = data.role || (loginType === 'admin' ? 'admin' : 'student')

          console.log('🎫 Token received:', token?.substring(0, 20) + '...')
          console.log('👤 Role from response:', role)
          if (refreshToken) console.log('🔄 Refresh token received')

          this.token = token
          this.refreshToken = refreshToken || null
          this.user = {
            id: data.user_id,
            email: data.email,
            role, // Store the role from response
            firstName: data.first_name,
            lastName: data.last_name,
            name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
            globalId: data.global_id,
            tokenType: data.token_type
          }
          this.isAuthenticated = true

          if (credentials.rememberMe) {
            localStorage.setItem('auth-token', token)
            localStorage.setItem('auth-expiry', expiresAt?.toString() ?? '')
            localStorage.setItem('auth-user', JSON.stringify(this.user))
            if (refreshToken) localStorage.setItem('auth-refresh-token', refreshToken)
          } else {
            sessionStorage.setItem('auth-token', token)
            sessionStorage.setItem('auth-expiry', expiresAt?.toString() ?? '')
            sessionStorage.setItem('auth-user', JSON.stringify(this.user))
            if (refreshToken) sessionStorage.setItem('auth-refresh-token', refreshToken)
          }

          console.log('✅ Login successful via', loginType, 'with role:', role)
          console.groupEnd()
          return { token, refreshToken, user: this.user, expiresAt }
        } catch (error: any) {
          lastError = error
          const status = error?.statusCode || error?.status
          console.warn(`❌ ${loginType} login failed`, status ? `(status ${status})` : '', error?.message || error)
          // Only fall back if we are in auto mode and this was the first (admin) attempt
          if (explicitType || loginType === 'user') break
        }
      }

      this.error = lastError?.data?.message || lastError?.message || 'Login failed'
      console.groupEnd()
      throw lastError
    },

    async logout() {
      try {
        console.group('🚪 Logout Process')
        console.log('⏰ Logout time:', new Date().toISOString())
        
        // Clear authentication data
        this.user = null
        this.token = null
        this.isAuthenticated = false
        
        // Clear both storage options
        console.log('🗑️ Clearing localStorage...')
        localStorage.removeItem('auth-token')
        localStorage.removeItem('auth-expiry')
        localStorage.removeItem('auth-user')
        localStorage.removeItem('auth-refresh-token')
        
        console.log('🗑️ Clearing sessionStorage...')
        sessionStorage.removeItem('auth-token')
        sessionStorage.removeItem('auth-expiry')
        sessionStorage.removeItem('auth-user')
        sessionStorage.removeItem('auth-refresh-token')

        console.log('✅ Logout successful')
        console.groupEnd()

        // Redirect to login
        await navigateTo('/auth/login')
      } catch (error) {
        console.error('❌ Logout error:', error)
      } finally {
        console.groupEnd()
      }
    },

    async checkAuth() {
      const config = useRuntimeConfig()
      const apiBase = config.public.apiBase
      
      console.group('🔍 Auth Check')
      console.log('⏰ Check time:', new Date().toISOString())

      // Try localStorage first (Remember Me), then sessionStorage
      let tokenCookie = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token')
      let userCookie = localStorage.getItem('auth-user') || sessionStorage.getItem('auth-user')
      
      if (!tokenCookie) {
        console.log('❌ No token found')
        console.groupEnd()
        return false
      }

      console.log('🎫 Token found:', tokenCookie.substring(0, 20) + '...')

      try {
        // TODO: Uncomment when backend endpoint is ready
        // const response = await $fetch(`${apiBase}/auth/me`, {
        //   headers: {
        //     Authorization: `Bearer ${tokenCookie}`
        //   }
        // })
        // this.user = response.user
        
        // For now, restore from stored data
        if (userCookie) {
          this.user = JSON.parse(userCookie)
          console.log('👤 User restored:', this.user?.name)
        }
        
        this.token = tokenCookie
        this.isAuthenticated = true

        console.log('✅ Auth check passed')
        console.groupEnd()
        return true
      } catch (error) {
        console.error('❌ Auth check failed:', error)
        console.groupEnd()
        this.logout()
        return false
      }
    },
    
    clearError() {
      console.log('🧹 Clearing error state')
      this.error = null
    }
  }
})