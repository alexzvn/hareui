<template>
  <div class="flex min-w-sm flex-col items-center justify-center gap-4">
    <p class="text-sm text-muted">
      Dropdown is: <strong>{{ open ? 'open' : 'closed' }}</strong>
    </p>
    <Dropdown v-model:open="open" :items="items">
      <Button variant="secondary"> Actions </Button>
    </Dropdown>
  </div>
</template>

<script setup lang="ts">
import type { DropdownEntry } from '@hareui/vue'
import { Button, Dropdown } from '@hareui/vue'
import { ref } from 'vue'

const open = ref(false)

const items: DropdownEntry[] = [
  { value: 'new-file', label: 'New file' },
  { value: 'open-file', label: 'Open file' },
  { value: 'save-file', label: 'Save file' },
  { value: 'delete-file', label: 'Delete file', variant: 'danger' },
]
</script>
