<template>
    <div class="file-list-section card">
      <h3>File List</h3>
      <table class="file-table">
        <thead>
          <tr>
            <th>#</th>
            <th>File Name</th>
            <th>File Size</th>
            <th>Uploaded At</th>
            <th v-if="showStatusColumn">Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(file, index) in files" :key="file.id">
            <td>{{ index + 1 }}</td>
            <td>{{ file.name }}</td>
            <td>{{ formatSize(file.size) }}</td>
            <td>{{ formatDate(file.uploadedAt) }}</td>
            <td v-if="isMyFile(file)">
              <!-- Determine and display the sharing status -->
              <span v-if="file.isPublic">Shared to Public</span>
              <span v-else-if="file.sharedWith && file.sharedWith.length">
                Shared with: {{ file.sharedWith.join(', ') }}
              </span>
              <span v-else>Private</span>
            </td>
            <td class="actions">
              <a class="btn btn-primary" :href="file.url" target="_blank">Download</a>
              <!-- Only show Delete and Share buttons for the user's own files -->
              <button v-if="isMyFile(file)" class="btn btn-tertiary" @click="$emit('delete', file.id)">
                Delete
              </button>
              <button v-if="isMyFile(file)" class="btn btn-secondary" @click="$emit('share', file)">
                Share
              </button>
            </td>
          </tr>
          <tr v-if="files.length === 0">
            <td colspan="6" class="empty-state">No files uploaded yet.</td>
          </tr>
        </tbody>
      </table>  
    </div>
  </template>

<script>
export default {
  props: {
    files: {
      type: Array,
      required: true,
    },
    userId: {
      type: String,
      required: true, 
    },
  },
  computed: {
    // Determine if the Status column should be shown
    showStatusColumn() {
      return this.files.some((file) => file.userId === this.userId);
    },
  },
  methods: {
    isMyFile(file) {
      return file.userId === this.userId; 
    },
    formatSize(size) {
      return size < 1024 ? `${size} B` : `${(size / 1024).toFixed(2)} KB`;
    },
    formatDate(timestamp) {
      if (timestamp && timestamp._seconds !== undefined) {
        const date = new Date(timestamp._seconds * 1000);
        return date.toLocaleString();
      }
      return 'Invalid Date';
    },
  },
};
</script>

