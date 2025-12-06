export default defineNuxtRouteMiddleware(async (to, from) => {
  const { checkAuth } = useAuth()
  const authStore = useAuthStore()

  console.group('🔐 Auth Middleware')
  console.log('Route:', to.path)
  console.log('Authenticated:', authStore.isAuthenticated)

  // Skip auth check for auth pages and home page
  if (to.path.startsWith('/auth/') || to.path === '/') {
    console.log('✅ Public page - skip middleware')
    console.groupEnd()
    return
  }

  // Check if user is authenticated
  const isAuthenticated = authStore.isAuthenticated || (await checkAuth())

  if (!isAuthenticated) {
    console.warn('❌ Not authenticated - redirecting to login')
    console.groupEnd()
    return navigateTo('/auth/login')
  }

  const userRole = authStore.user?.role ?? ''
  console.log('👤 User role:', userRole)
  console.log('📍 User endpoint source:', authStore.user?.tokenType === 'access' ? 'Detected from token' : 'Stored from response')

  // Role-based route protection
  const roleRouteMap: Record<string, string[]> = {
    'admin': ['/admin'],
    'superadmin': ['/admin'],
    'lecturer': ['/lecturer'],
    'student': ['/student'],
  }

  // Get allowed routes for current role
  const allowedRoutes = roleRouteMap[userRole] || []

  // Check if user has access to this route
  const hasAccess = allowedRoutes.some(route => to.path.startsWith(route))

  if (!hasAccess) {
    console.warn(`❌ Access denied. Role "${userRole}" cannot access "${to.path}"`)
    console.warn(`   Allowed routes for ${userRole}:`, allowedRoutes)
    console.groupEnd()

    // Redirect to appropriate dashboard based on role
    const redirectMap: Record<string, string> = {
      'admin': '/admin/dashboard',
      'superadmin': '/admin/dashboard',
      'lecturer': '/lecturer/dashboard',
      'student': '/student/dashboard',
    }

    const redirectPath = redirectMap[userRole] || '/auth/login'
    console.log('🔀 Redirecting to:', redirectPath)

    return navigateTo(redirectPath)
  }

  console.log('✅ Access granted for', userRole, 'to', to.path)
  console.groupEnd()
})