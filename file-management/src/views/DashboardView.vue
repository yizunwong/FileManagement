<template>
  <div class="container">
    <h1>Dashboard</h1>
    <p>Welcome to your file management system dashboard!</p>
    <div class="sections">
      <div class="section-card">
        <h2>Total Files</h2>
        <p>{{ totalFiles }}</p>
      </div>
      <div class="section-card">
        <h2>Storage Used</h2>
        <p>{{ storageUsed }}</p>
      </div>
      <div class="section-card">
        <h2>Files Shared with You</h2>
        <p>{{ sharedFiles }}</p>
      </div>
      <div class="section-card">
        <h2>Public Files</h2>
        <p>{{ publicFiles }}</p>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue'
import { useFileStore } from '../stores/fileStore.js'
import { useAuthStore } from '../stores/authStore.js'

export default {
  setup() {
    const fileStore = useFileStore()
    const authStore = useAuthStore()

    const totalFiles = ref(0)
    const storageUsed = ref('0 B')
    const sharedFiles = ref(0)
    const publicFiles = ref(0)

    const fetchDashboardData = async () => {
      try {
        // Fetch user's own files
        await fileStore.fetchFiles(authStore.user?.id)
        const files = fileStore.files

        // Total files count
        totalFiles.value = files.length

        // Total storage used
        const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0)
        storageUsed.value =
          totalSize < 1024
            ? `${totalSize} B`
            : totalSize < 1024 * 1024
              ? `${(totalSize / 1024).toFixed(2)} KB`
              : `${(totalSize / (1024 * 1024)).toFixed(2)} MB`

        const userEmail = await authStore.fetchUserEmailById(authStore.user?.id)

        await fileStore.fetchSharedFiles(userEmail)
        const shared = fileStore.files
        sharedFiles.value = shared.length

        // Fetch public files
        await fileStore.fetchPublicFiles()
        const publicFilesData = fileStore.files

        publicFiles.value = publicFilesData.length
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      }
    }

    onMounted(fetchDashboardData)

    return {
      totalFiles,
      storageUsed,
      sharedFiles,
      publicFiles,
    }
  },
}
</script>


