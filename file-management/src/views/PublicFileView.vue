<template>
  <div class="container">
    <h2 class="panel-title">Public File List</h2>
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
    async fetchPublicFiles() {
      const fileStore = useFileStore()
      try {
        await fileStore.fetchPublicFiles()
      } catch (error) {
        console.error('Failed to fetch files:', error)
      }
    },
  },
  async mounted() {
    await this.fetchPublicFiles() 
  },
}
</script>


