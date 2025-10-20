import type { LoginCredentials, RegisterData, User, UserRole, Permission } from '~/types/auth'

export const useAuth = () => {
  const authStore = useAuthStore()

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      await authStore.login(credentials)

      // Redirect based on user role
      const redirectPath = getRedirectPath(authStore.getUserRole)
      await navigateTo(redirectPath)
    } catch (error) {
      throw error
    }
  }

  // Logout function
  const logout = async () => {
    await authStore.logout()
  }

  // Register function
  const register = async (userData) => {
    try {
      await authStore.register(userData)
      // After successful registration, redirect to login
      await navigateTo('/auth/login')
    } catch (error) {
      throw error
    }
  }

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      await authStore.forgotPassword(email)
    } catch (error) {
      throw error
    }
  }

  // Check if user is authenticated
  const checkAuth = async () => {
    return await authStore.checkAuth()
  }

  // Get redirect path based on user role
  const getRedirectPath = (role) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard'
      case 'lecturer':
        return '/lecturer/dashboard'
      case 'student':
        return '/student/dashboard'
      default:
        return '/auth/login'
    }
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
  const requireRole = (requiredRole) => {
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

  // Check if user has permission
  const hasPermission = (permission) => {
    const role = authStore.getUserRole
    const permissions = getRolePermissions(role)
    return permissions.includes(permission)
  }

  // Get permissions based on role
  const getRolePermissions = (role) => {
    switch (role) {
      case 'admin':
        return ['read', 'write', 'delete', 'manage_users', 'manage_system']
      case 'lecturer':
        return ['read', 'write', 'manage_attendance', 'manage_classes']
      case 'student':
        return ['read', 'view_attendance', 'submit_leave']
      default:
        return []
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
    register,
    forgotPassword,
    checkAuth,
    requireAuth,
    requireRole,
    hasPermission,
    clearError: authStore.clearError
  }
}
