import { defineStore } from 'pinia'
import api from '@/api/api'

export const useFileStore = defineStore('fileStore', {
  state: () => ({
    files: [],
    status: '',
  }),

  actions: {
    $reset() {
      this.files = []
      this.status = ''
    },
    async fetchAllFiles() {
      try {
        const response = await api.get(`/api/files/all`)
        this.files = response.data  
      } catch (error) {
        this.status = 'Failed to fetch files.'
      } finally {
        this.status = 'Files fetched successfully!'
      }
    },
    async fetchFiles(userId = null) {
      try {
        const response = await api.get(`/api/files?userId=${userId}`)
        this.files = response.data
      } catch (error) {
        this.status = 'Failed to fetch files.'
      } finally {
        this.status = 'Files fetched successfully!'
      }
    },

    async fetchPublicFiles() {
      try {
        const response = await api.get('/api/files/public')
        this.files = response.data
      } catch (error) {
        this.status = 'Failed to fetch files.'
      } finally {
        this.status = 'Files fetched successfully!'
      }
    },

    async fetchSharedFiles(userEmail = null) {
      try {
        const response = await api.get(`/api/files/shared-with-user?userEmail=${userEmail}`)
        this.files = response.data
      } catch (error) {
        this.status = 'Failed to fetch files.'
      } finally {
        this.status = 'Files fetched successfully!'
      }
    },

    async uploadFile(file, userId, overwrite) {
      const reader = new FileReader()

      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const fileBase64 = reader.result.split(',')[1]
            const metadata = {
              name: file.name,
              type: file.type,
              size: file.size,
            }

            const response = await api.post('/api/upload', {
              userId: userId,
              fileName: file.name,
              overwrite: overwrite,
              fileBase64,
              metadata,
            })

            this.status = 'File uploaded successfully!'
            resolve(response.data)
          } catch (error) {
            this.status = 'File upload failed.'
            reject(error)
          }
        }

        reader.onerror = (error) => {
          this.status = 'File reading failed.'
          reject(error)
        }

        reader.readAsDataURL(file)
      })
    },

    async deleteFile(fileId, userId) {
      try {
        const response = await api.delete(`/api/files/${fileId}/${userId}`)
        this.status = 'File deleted successfully!'
        this.files = this.files.filter((file) => file.id !== fileId) 
        return response.data
      } catch (error) {
        this.status = 'Failed to delete the file.'
        throw error
      }
    },
    async shareFile(fileId, shareType, userEmail = null) {
      try {
        const payload = {
          shareType,
          userEmail,
        }
        await api.post(`/api/files/${fileId}/share`, payload)
        this.status = 'File shared successfully!'
      } catch (error) {
        console.error('Error sharing file:', error)
        this.status = 'Failed to share file.'
        throw error
      }
    },
  },
})
