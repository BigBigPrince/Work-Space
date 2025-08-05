<template>
  <div class="training-container">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TrainingLayout',
  setup() {
    return {}
  }
})
</script>

<style scoped>
.training-container {
  padding: 20px;
}
</style>
