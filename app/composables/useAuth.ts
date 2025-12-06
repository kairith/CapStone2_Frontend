import type { LoginCredentials, RegisterData, User, UserRole, Permission } from '~/types/auth'

export const useAuth = () => {
  const authStore = useAuthStore()

  // Login function with logging
  const login = async (credentials: LoginCredentials) => {
    console.group('🔓 Auth Composable - Login')
    console.log('Email:', credentials.email)
    
    try {
      const apiBase = useRuntimeConfig().public.apiBase
      console.log('🚀 Starting login attempt')
      
      // Call store login which tries admin first, then user endpoint
      const result = await authStore.login(credentials)
      
      // Get user role from stored user data (comes from response)
      const role = authStore.user?.role
      console.log('✅ Login successful')
      console.log('👤 User role from response:', role)
      
      // Get redirect path based on actual role from response
      const redirectPath = getRedirectPath(role)
      
      console.log('🔀 Redirecting to:', redirectPath)
      await navigateTo(redirectPath)
      
      console.log('✅ Login and redirect completed')
    } catch (error) {
      console.error('❌ Login error in composable:', error)
      throw error
    } finally {
      console.groupEnd()
    }
  }

  // Logout function with logging
  const logout = async () => {
    console.group('🚪 Auth Composable - Logout')
    console.log('⏰ Logout initiated at:', new Date().toISOString())
    
    try {
      await authStore.logout()
      console.log('✅ Logout completed')
    } catch (error) {
      console.error('❌ Logout error:', error)
    }
    console.groupEnd()
  }


  // Forgot password function


  // Check authentication
  const checkAuth = async () => {
    console.log('🔍 Checking authentication...')
    const isAuth = await authStore.checkAuth()
    console.log(isAuth ? '✅ User is authenticated' : '❌ User is not authenticated')
    return isAuth
  }

  // Get redirect path
  const getRedirectPath = (role: string | undefined) => {
    console.group('🔀 Redirect Path Selection')
    console.log('User role received:', role)
    
    const redirectMap: Record<string, string> = {
      'admin': '/admin/dashboard',
      'superadmin': '/admin/dashboard',
      'lecturer': '/lecturer/dashboard',
      'student': '/student/dashboard',
    }
    
    const path = role && redirectMap[role] ? redirectMap[role] : '/auth/login'
    console.log('Redirect path:', path)
    console.log('Route mapping:', {
      'admin/superadmin': redirectMap['admin'],
      'lecturer': redirectMap['lecturer'],
      'student': redirectMap['student']
    })
    console.groupEnd()
    
    return path
  }

  // Require authentication (for middleware)
  const requireAuth = async () => {
    const isAuthenticated = await checkAuth()

    if (!isAuthenticated) {
      await navigateTo('/auth/login')
      return false
    }

    return true
  }

  // Require specific role
  const requireRole = (requiredRole: string) => {
    if (!authStore.isAuthenticated) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    if (authStore.getUserRole !== requiredRole) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied'
      })
    }
  }

  return {
    // State
    user: computed(() => authStore.user),
    token: computed(() => authStore.token),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    loading: computed(() => authStore.loading),
    error: computed(() => authStore.error),

    // Getters
    userRole: computed(() => authStore.getUserRole),
    userName: computed(() => authStore.getUserName),
    userEmail: computed(() => authStore.getUserEmail),
    isAdmin: computed(() => authStore.isAdmin),
    isLecturer: computed(() => authStore.isLecturer),
    isStudent: computed(() => authStore.isStudent),

    // Actions
    login,
    logout,
    checkAuth,
    requireAuth,
    requireRole,
    clearError: authStore.clearError
  }
}
