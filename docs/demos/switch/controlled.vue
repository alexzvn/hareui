<script setup lang="ts">
import { Switch } from 'herouse'
import { ref } from 'vue'

const isSelected = ref(false)
</script>

<template>
  <div class="flex flex-col gap-4">
    <Switch v-model="isSelected" label="Enable notifications" />
    <p class="text-sm text-muted">
      Switch is {{ isSelected ? 'on' : 'off' }}
    </p>
  </div>
</template>
