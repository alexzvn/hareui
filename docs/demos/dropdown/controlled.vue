<script setup lang="ts">
import type { DropdownEntry, DropdownValue } from 'herouse'
import { Button, Dropdown } from 'herouse'
import { ref } from 'vue'

const selected = ref<DropdownValue[]>(['bold'])

const items: DropdownEntry[] = [
  { value: 'bold', label: 'Bold' },
  { value: 'italic', label: 'Italic' },
  { value: 'underline', label: 'Underline' },
]
</script>

<template>
  <div class="flex min-w-sm flex-col items-center justify-center gap-4">
    <p class="text-sm text-muted">
      Selected: {{ selected.length > 0 ? selected.join(', ') : 'None' }}
    </p>
    <Dropdown v-model="selected" :items="items" selection-mode="multiple">
      <Button aria-label="Menu" variant="secondary">
        Actions
      </Button>
    </Dropdown>
  </div>
</template>
