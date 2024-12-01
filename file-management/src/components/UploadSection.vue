<template>
  <div class="upload-section card">
    <h3>Upload a File</h3>
    <div class="upload-actions">
      <input type="file" @change="selectFile" />
      <button class="btn btn-primary" @click="checkFileExists">Upload</button>
    </div>
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
  data() {
    return {
      selectedFile: null,
    };
  },
  methods: {
    selectFile(event) {
      this.selectedFile = event.target.files[0];
    },
    checkFileExists() {
      if (!this.selectedFile) {
        alert('Please select a file!');
        return;
      }

      const existingFile = this.files.find((file) => file.name === this.selectedFile.name);

      if (existingFile) {
        // Notify the parent of a conflict
        this.$emit('conflict', this.selectedFile);
      } else {
        // Notify the parent to upload the file
        this.$emit('upload', this.selectedFile, false); // false = not overwriting
      }
    },
  },
};
</script>

