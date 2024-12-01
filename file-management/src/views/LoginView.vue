<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" v-model="username" type="text" placeholder="Enter your username" />
          <p v-if="validationErrors.username" class="error-message">
            {{ validationErrors.username }}
          </p>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
          />
          <p v-if="validationErrors.password" class="error-message">
            {{ validationErrors.password }}
          </p>
        </div>
        <button class="btn btn-primary login-btn" type="submit">Login</button>
      </form>
      <div class="auth-link">
        <p>
          Don't have an account?
          <router-link to="/register">Register here</router-link>
        </p>
      </div>
    </div>

    <!-- Awesome Error Dialog -->
    <div v-if="errorMessage" class="awesome-dialog">
      <div class="dialog-content">
        <div class="dialog-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <div class="dialog-body">
          <p>{{ errorMessage }}</p>
        </div>
        <div class="dialog-footer">
          <button class="dialog-button" @click="closeErrorModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Setup references
const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const validationErrors = ref({ username: '', password: '' })
const errorMessage = ref('') // Tracks the error message for the dialog

// Close the error dialog
const closeErrorModal = () => {
  errorMessage.value = '' // Clear the error message
}

// Handle login action with validation
const handleLogin = async () => {
  validationErrors.value = { username: '', password: '' }

  // Validate fields
  if (!username.value) validationErrors.value.username = 'Username is required.'
  if (!password.value) validationErrors.value.password = 'Password is required.'

  // If there are validation errors, do not proceed
  if (validationErrors.value.username || validationErrors.value.password) {
    return
  }

  try {
    await authStore.login(username.value, password.value)
    if (authStore.user?.id) {
      router.replace('/dashboard')
    } else {
      console.error('User ID is not set. Please try again.')
    }
  } catch (error) {
    console.error('Login error:', error)
    // Extract error message from the response and show it in the dialog
    errorMessage.value = error.response?.data?.message || 'Login failed. Please try again.'
  }
}
</script>

<style scoped>
.login-btn {
  width: 400px; 
}
</style>