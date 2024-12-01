import { useAuthStore } from '@/stores/authStore'

export default async function authMiddleware(to, from, next) {
  const authStore = useAuthStore()

  try {
    // Attempt to restore session if not already authenticated
    if (!authStore.isAuthenticated) {
      await authStore.restoreSession() // Calls the server to validate the token
    }

    // Check if the user is authenticated
    if (authStore.isAuthenticated) {
      // Prevent navigation to login/register pages for authenticated users
      if (to.name === 'Login' || to.name === 'Register') {
        next('/dashboard') 
      } else {
        next() 
      }
    } else {
      // If the route requires authentication, redirect to login
      if (to.meta.requiresAuth) {
        next('/login')  
      } else {
        next()
      }
    }
  } catch (error) {
    console.error('Authentication failed:', error)
    // Redirect to login on error
    next('/login')
  }
}
