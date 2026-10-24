<template>
  <div class="flex flex-col gap-4">
    <ToggleButton v-slot="{ selected: isSelected }" v-model="isLiked">
      <Icon :icon="isSelected ? 'gravity-ui:heart-fill' : 'gravity-ui:heart'" />
      {{ isSelected ? 'Liked' : 'Like' }}
    </ToggleButton>
    <p class="text-sm text-muted">
      Status: <span class="font-medium">{{ isLiked ? 'Selected' : 'Not selected' }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ToggleButton } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const isLiked = ref(false)
</script>
