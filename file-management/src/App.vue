<template>
  <div class="app-container" v-if="$route.path !== '/login'">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo">
        <h1>File Manager</h1>
      </div>
      <nav>
        <RouterLink
          to="/dashboard"
          class="menu-link"
          :class="{ active: $route.path === '/dashboard' }"
          >Dashboard</RouterLink
        > 
        <RouterLink to="/files" class="menu-link" :class="{ active: $route.path === '/files' }"
          >My Files</RouterLink
        >
        <RouterLink to="/files/public" class="menu-link" :class="{ active: $route.path === '/files/public' }"
          >Public Files</RouterLink
        >

        <RouterLink to="/files/shared-files" class="menu-link" :class="{ active: $route.path === '/files/shared-files' }"
          >Shared Files</RouterLink
        >
        
      </nav>
      <div class="signout-section">
        <button @click="handleLogout" class="signout-button">Sign Out</button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <RouterView />
    </div>
  </div>

  <!-- Login Page Full Screen -->
  <div class="auth-page" v-else>
    <RouterView />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useFileStore } from '@/stores/fileStore'
const fileStore = useFileStore();
const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')

const handleLogout = async () => {
  try {
    await authStore.logout(username.value, password.value);
    fileStore.$reset(); 
    router.replace("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};


</script>


<style scoped>
/* App container styling to ensure full-screen layout */
.app-container {
  display: flex;
  width: 100%; 
  height: 100%; 
  position: fixed; 
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  overflow: hidden; 
}

/* Login page full screen and centered */
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw; 
  height: 100vh; 
  position: fixed; 
  top: 0;
  left: 0;
  background-color: #f4f4f4; 
  margin: 0; 
  padding: 0; 
  z-index: 1000; 
  overflow: hidden; 
}

/* Sidebar styling */
.sidebar {
  width: 250px; 
  background-color: #333; 
  color: #fff; 
  padding: 20px; 
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); 
  height: 100%; 
  position: relative; 
}

.sidebar .logo h1 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

/* Menu link styles */
.sidebar .menu-link {
  display: block;
  color: #fff;
  text-decoration: none;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease; 
  position: relative;
}

/* Hover effect */
.sidebar .menu-link:hover {
  background-color: #444;
  transform: scale(1.05); 
}

/* Active link styles */
.sidebar .menu-link.active {
  background-color: #555; 
  font-weight: bold; 
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2);
}

/* Main content styling */
.main-content {
  flex: 1; 
  background-color: #f4f4f4; 
  padding: 20px;
  overflow-y: auto; 
  height: 100%;
  box-sizing: border-box; 
}

/* Sidebar styles remain the same as previously shared */
.signout-section {
  margin-top: 20px;
  border-top: 1px solid #555;
  padding-top: 10px;
}

.signout-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #d9534f; 
  color: #fff;
  border: none;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.signout-button:hover {
  background-color: #c9302c; 
}
</style>
