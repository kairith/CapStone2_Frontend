export default defineNuxtRouteMiddleware(async (to, from) => {
  // ====================================
  // 🔴 AUTH DISABLED FOR TESTING
  // ====================================
  return; // Skip all auth checks for testing

  // const { checkAuth } = useAuth()

  // // Skip auth check for auth pages
  // if (to.path.startsWith('/auth/')) {
  //   return
  // }

  // // Check if user is authenticated
  // const isAuthenticated = await checkAuth()

  // if (!isAuthenticated) {
  //   return navigateTo('/auth/login')
  // }
});
