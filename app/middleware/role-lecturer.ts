// ====================================
// 🔴 ROLE CHECK DISABLED FOR TESTING
// ====================================
export default defineNuxtRouteMiddleware(async (to, from) => {
  return; // Skip all role checks for testing

  // const { user } = useAuth()

  // if (!user || user.role !== 'lecturer') {
  //   return navigateTo('/auth/login')
  // }
});
