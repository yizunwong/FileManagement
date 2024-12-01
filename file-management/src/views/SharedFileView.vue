<template>
  <div class="container">
    <h2 class="panel-title">Files Shared with You</h2>
    <FileList :files="files" :userId="userId" />
  </div>
</template>

<script>
import { useFileStore } from '../stores/fileStore.js'
import { useAuthStore } from '../stores/authStore.js'
import FileList from '@/components/FileList.vue'

export default {
  components: {
    FileList,
  },
  data() {
    return {
      userEmail: null, 
    }
  },
  computed: {
    files() {
      return useFileStore().files
    },
    userId() {
      const authStore = useAuthStore()
      return authStore.user?.id || null
    },
  },
  methods: {
    async fetchSharedFiles() {
      const fileStore = useFileStore()
      try {
        await fileStore.fetchSharedFiles(this.userEmail)
      } catch (error) {
        console.error('Failed to fetch files:', error)
      }
    },
    async fetchUserEmail() {
      const authStore = useAuthStore()
      try {
        this.userEmail = await authStore.fetchUserEmailById(this.userId) 
      } catch (error) {
        console.error('Failed to fetch user email:', error)
      }
    },
  },
  async mounted() {
    await this.fetchUserEmail() 
    if (this.userEmail) {
      await this.fetchSharedFiles() 
    }
  },
}
</script>

