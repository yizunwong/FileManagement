<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">Share File: {{ file.name }}</h3>
      <div class="form-group">
        <label for="shareType" class="form-label">Share Type</label>
        <select
          id="shareType"
          class="form-select"
          :value="shareType"
          @change="$emit('update:shareType', $event.target.value)"
        >
          <option value="specific">Specific User</option>
          <option value="public">Open to Public</option>
          <option value="private">Switch to Private</option>
        </select>
      </div>
      <div v-if="shareType === 'specific'" class="form-group">
        <label for="user" class="form-label">Select User</label>
        <select
          id="user"
          class="form-select"
          :value="sharedUserEmail"
          @change="$emit('update:sharedUserEmail', $event.target.value)"
        >
          <option v-for="user in registeredUsers" :key="user.id" :value="user.email">
            {{ user.username }} ({{ user.email }})
          </option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" @click="shareFile">Share</button>
        <button class="btn btn-cancel" @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>


<script>
import { useFileStore } from '../stores/fileStore.js';
import { useAuthStore } from '../stores/authStore.js'; 

export default {
  props: {
    file: {
      type: Object,
      required: true,
    },
    shareType: {
      type: String,
      required: true,
    },
    sharedUserEmail: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: true, 
    },
  },
  data() {
    return {
      registeredUsers: [], 
    };
  },
  methods: {
    async fetchRegisteredUsers() {
      const authStore = useAuthStore();
      try {
        await authStore.fetchAllUsers(this.userId); 
        this.registeredUsers = authStore.users; 
      } catch (error) {
        console.error('Error fetching registered users:', error);
        alert('Failed to fetch registered users.');
      }
    },
    async shareFile() {
      if (this.shareType === 'specific' && !this.sharedUserEmail.trim()) {
        alert('Please select a user.');
        return;
      }

      const fileStore = useFileStore();
      try {
        await fileStore.shareFile(this.file.id, this.shareType, this.sharedUserEmail);
        this.$emit('refresh');
        this.$emit('close');
      } catch (error) {
        alert(error.message);
      }
    },
  },
  async mounted() {
    await this.fetchRegisteredUsers(); 
  },
};
</script>

