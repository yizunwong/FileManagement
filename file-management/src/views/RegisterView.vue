<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>Register</h1>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" v-model="username" type="text" placeholder="Enter your username" />
          <p v-if="validationErrors.username" class="error-message">
            {{ validationErrors.username }}
          </p>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="Enter your email" />
          <p v-if="validationErrors.email" class="error-message">{{ validationErrors.email }}</p>
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
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
          />
          <p v-if="validationErrors.confirmPassword" class="error-message">
            {{ validationErrors.confirmPassword }}
          </p>
        </div>
        <button class="btn btn-primary register-btn" type="register">Register</button>
      </form>
      <div class="auth-link">
        <p>
          Already have an account?
          <router-link to="/login">Log in here</router-link>
        </p>
      </div>
    </div>

    <!-- Combined Dialog -->
    <div v-if="dialogVisible" class="awesome-dialog">
      <div class="dialog-content">
        <div class="dialog-icon" :class="dialogType">
          <i :class="dialogIcon"></i>
        </div>
        <div class="dialog-body">
          <p>{{ dialogMessage }}</p>
        </div>
        <div class="dialog-footer">
          <button class="dialog-button" @click="closeDialog">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const validationErrors = ref({}) // Object to track validation errors

// Dialog states
const dialogVisible = ref(false)
const dialogType = ref('') // 'success' or 'error'
const dialogMessage = ref('')
const dialogIcon = ref('') // Icon class based on message type

const closeDialog = () => {
  dialogVisible.value = false
  if (dialogType.value === 'success') {
    router.push('/login') // Redirect to login if successful
  }
}

const handleRegister = async () => {
  validationErrors.value = {} // Reset validation errors

  // Validate fields
  if (!username.value) validationErrors.value.username = 'Username is required.'
  if (!email.value) validationErrors.value.email = 'Email is required.'
  if (!password.value) validationErrors.value.password = 'Password is required.'
  if (!confirmPassword.value) {
    validationErrors.value.confirmPassword = 'Please confirm your password.'
  } else if (password.value !== confirmPassword.value) {
    validationErrors.value.confirmPassword = 'Passwords do not match.'
  }

  // If there are validation errors, stop the form submission
  if (Object.keys(validationErrors.value).length > 0) {
    return
  }

  try {
    await authStore.register({
      username: username.value,
      email: email.value,
      password: password.value,
    })

    // Show success dialog
    dialogType.value = 'success'
    dialogMessage.value = 'Registration successful! You can now log in.'
    dialogIcon.value = 'fas fa-check-circle'
    dialogVisible.value = true
  } catch (error) {
    // Show error dialog
    dialogType.value = 'error'
    dialogMessage.value = error.response?.data?.message || 'Failed to register. Please try again.'
    dialogIcon.value = 'fas fa-exclamation-circle'
    dialogVisible.value = true
  }
}
</script>

<style scoped>
.register-btn {
  width: 400px; 
}
</style>