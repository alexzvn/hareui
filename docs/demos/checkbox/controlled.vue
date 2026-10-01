<script setup lang="ts">
import { Checkbox } from 'herouse'
import { ref } from 'vue'

const isSelected = ref(true)
</script>

<template>
  <div class="flex flex-col gap-3">
    <Checkbox id="email-notifications" v-model="isSelected" label="Email notifications" />
    <p class="text-sm text-muted">
      Status: <span class="font-medium">{{ isSelected ? 'Enabled' : 'Disabled' }}</span>
    </p>
  </div>
</template>
