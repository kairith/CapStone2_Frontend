export default defineNuxtRouteMiddleware((to) => {
  // For now, allow all authenticated users to access lecturer routes
  // In production, you would check the user's role from the auth store
  // const { user } = useAuthStore()
  // 
  // if (!user || user.role !== 'lecturer') {
  //   throw createError({
  //     statusCode: 403,
  //     statusMessage: 'Access denied. Lecturer role required.'
  //   })
  // }
})