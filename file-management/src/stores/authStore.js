import { defineStore } from 'pinia'
import api from '@/api/api'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null,
    status: '',
    isAuthenticated: false,
  }),

  actions: {
    // Login Action
    async login(username, password) {
      try {
        
        const response = await api.post('/api/login', { username, password })
        // Update state with user data
        this.user = response.data.user
        this.isAuthenticated = true
        this.status = 'Login successful!'
      } catch (error) {
        this.status = 'Login failed. Please check your credentials.'
        throw error
      }
    },
    async fetchAllUsers(userId) {
      try {
        const response = await api.get(`/api/users?userId=${userId}`)
        this.users = response.data.users
        this.status = 'Users fetched successfully!'
      } catch (error) {
        this.status = 'Failed to fetch users.'
        console.error('Error fetching users:', error)
        throw error
      }
    },
    async fetchUserEmailById(userId) {
      try {
        const response = await api.get(`/api/users/${userId}`)
        return response.data.email 
      } catch (error) {
        console.error('Error fetching user email:', error)
        throw new Error('Failed to fetch user email')
      }
    },

    // Logout Action
    async logout() {
      try {
        // Notify server to clear session cookies
        await api.post('/api/logout')

        // Clear state
        this.user = null
        this.isAuthenticated = false
        this.status = 'Logged out successfully.'
      } catch (error) {
        console.error('Failed to log out:', error)
        this.status = 'Logout failed. Please try again.'
      }
    },

    async restoreSession() {
      try {
        const response = await api.get('/api/authenticate') 
        this.user = response.data.user 
        this.isAuthenticated = true
      } catch (error) {
        console.warn('Session restoration failed: User is not authenticated.')
        this.user = null
        this.isAuthenticated = false
      }
    },

    // Register Action
    async register({ username, email, password }) {
      try {
        await api.post('/api/register', { username, email, password })
      } catch (error) {
        this.status = 'Registration failed. Please try again.'
        throw error
      }
    },
  },
})
