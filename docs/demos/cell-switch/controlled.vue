<template>
  <div class="w-[272px] rounded-2xl border border-separator p-2">
    <CellSwitch v-model="isOfflineMapsOn" label="Offline maps" />
    <footer
      class="mt-2 flex items-center gap-2 border-t border-separator px-2 pt-2 text-xs text-muted"
    >
      <span class="size-2 rounded-full" :class="isOfflineMapsOn ? 'bg-success' : 'bg-default'" />
      {{ isOfflineMapsOn ? 'Saved on this device' : 'Loads when you are online' }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import { CellSwitch } from '@hareui/vue'
import { ref } from 'vue'

const isOfflineMapsOn = ref(false)
</script>
