<template>
  <div class="flex flex-col items-center gap-3">
    <Rating v-model="pain" :length="10" size="sm" color="danger" label="Pain level" />
    <p class="text-sm text-muted">{{ pain }} / 10</p>
  </div>
</template>

<script setup lang="ts">
import { Rating } from '@hareui/vue'
import { ref } from 'vue'

const pain = ref(3)
</script>
