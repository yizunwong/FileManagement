<template>
  <div class="container">
    <h2 class="panel-title">File Management Panel</h2>
    <UploadSection :files="files" :userId="userId" @upload="upload" @conflict="handleConflict" />
    <FileList
      :files="files"
      :userId="userId"
      @delete="deleteFile"
      @share="openShareModal"
    />
    <ShareModal
      v-if="showShareModal"
      :file="selectedFile"
      :userId="userId"
      :shareType="shareType"
      :sharedUserEmail="sharedUserEmail"
      @update:shareType="shareType = $event"
      @update:sharedUserEmail="sharedUserEmail = $event"
      @close="closeShareModal"
      @refresh="fetchFiles"

    />
    <ConflictModal
      v-if="showConflictModal"
      :file="selectedFile"
      :newFileName="newFileName"
      :userId="userId"
      @update:newFileName="newFileName = $event"
      @overwrite="overwriteFile"
      @rename="addAsNewFile"
      @cancel="cancelConflict"
    />

    <!-- Success Popup -->
    <div v-if="successMessage" class="success-popup">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import { useFileStore } from '../stores/fileStore.js'
import { useAuthStore } from '../stores/authStore.js'
import UploadSection from './UploadSection.vue'
import FileList from './FileList.vue'
import ShareModal from './ShareModal.vue'
import ConflictModal from './ConflictModal.vue'

export default {
  components: {
    UploadSection,
    FileList,
    ShareModal,
    ConflictModal,
  },
  data() {
    return {
      selectedFile: null,
      showShareModal: false,
      shareType: 'specific',
      sharedUserEmail: '',
      showConflictModal: false,
      newFileName: '',
      successMessage: '', 
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
    async fetchFiles() {
      const fileStore = useFileStore()
      try {
        await fileStore.fetchFiles(this.userId)
      } catch (error) {
        console.error('Failed to fetch files:', error)
      }
    },
    async overwriteFile() {
      try {
        await this.upload(this.selectedFile, true) 
        this.showConflictModal = false 
      } catch (error) {
        console.error('Failed to overwrite file:', error)
      }
    },
    async addAsNewFile(newFile) {
      try {
        await this.upload(newFile, false) 
        this.showConflictModal = false 
      } catch (error) {
        console.error('Failed to add file as new:', error)
      }
    },
    async deleteFile(fileId) {
      const fileStore = useFileStore()
      try {
        await fileStore.deleteFile(fileId, this.userId)
        this.successMessage = 'File deleted successfully!'
        this.fetchFiles()
        this.showSuccessPopup()
      } catch (error) {
        alert('Failed to delete file.')
        console.error(error)
      }
    },
    async upload(file, overwrite) {
      const fileStore = useFileStore()
      try {
        await fileStore.uploadFile(file, this.userId, overwrite)
        this.successMessage = overwrite
          ? 'File overwritten successfully!'
          : 'File uploaded successfully!'
        this.fetchFiles() 
        this.showSuccessPopup() 
      } catch (error) {
        console.error('File upload failed:', error)
      }
    },
    showSuccessPopup() {
      setTimeout(() => {
        this.successMessage = '' 
      }, 3000)
    },
    openShareModal(file) {
      this.selectedFile = file
      this.showShareModal = true
    },
    closeShareModal() {
      this.showShareModal = false
      this.selectedFile = null
      this.shareType = 'specific'
      this.sharedUserEmail = ''
    },
    handleConflict(file) {
      this.selectedFile = file
      this.showConflictModal = true
    },
    cancelConflict() {
      this.showConflictModal = false
    },
  },
  async mounted() {
    await this.fetchFiles() 
  },
}
</script>

