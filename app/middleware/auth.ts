import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  // Restore session on client
  if (process.client && !auth.isAuthenticated) {
    await auth.checkAuth()
  }

  const role = auth.user?.role?.toLowerCase()

  // Prevent logged-in users from accessing /auth/*
  if (to.path.startsWith('/auth/') && auth.isAuthenticated) {
    const map: Record<string, string> = {
      admin: '/admin/dashboard',
      superadmin: '/admin/dashboard',
      lecturer: '/lecturer/dashboard',
      student: '/student/dashboard',
    }
    return navigateTo(map[role || 'student'])
  }

  // Redirect unauthenticated users to login
  if (!auth.isAuthenticated && !to.path.startsWith('/auth/')) {
    return navigateTo('/auth/login')
  }

  // Role-based route protection
  const allowed: Record<string, string[]> = {
    admin: ['/admin'],
    superadmin: ['/admin'],
    lecturer: ['/lecturer'],
    student: ['/student'],
  }

  const allowedPaths = allowed[role || ''] || []
  const hasAccess = allowedPaths.some(p => to.path.startsWith(p))

  if (!hasAccess && !to.path.startsWith('/auth/')) {
    return navigateTo('/auth/login')
  }
})