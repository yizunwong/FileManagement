<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">File Conflict</h3>
      <p class="modal-message">
        A file with the name "<strong>{{ file.name }}</strong
        >" already exists. Choose an action:
      </p>
      <input
        type="text"
        class="modal-input"
        :value="newFileName"
        @input="$emit('update:newFileName', $event.target.value)"
        placeholder="Rename file (optional)"
      />
      <div class="modal-actions">
        <button class="btn btn-primary" @click="$emit('overwrite')">Overwrite</button>
        <button class="btn btn-secondary" @click="emitAddAsNewFile">Add as New</button>
        <button class="btn btn-tertiary" @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    file: {
      type: Object,
      required: true,
    },
    newFileName: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  methods: {
    emitAddAsNewFile() {
      const extension = this.file.name.substring(this.file.name.lastIndexOf('.'))
      const finalFileName = this.newFileName.trim()
        ? `${this.newFileName.trim()}${extension}`
        : this.file.name
      const newFile = new File([this.file], finalFileName, { type: this.file.type })

      this.$emit('rename', newFile) 
    },
  },
}
</script>

