<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { ComboBox } from '@hareui/vue'
import { ref } from 'vue'

const animals: ListBoxItem[] = [
  { value: 'aardvark', label: 'Aardvark' },
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'kangaroo', label: 'Kangaroo' },
  { value: 'panda', label: 'Panda' },
  { value: 'snake', label: 'Snake' },
]

const inputValue = ref('')
</script>

<template>
  <div class="space-y-2">
    <ComboBox v-model:input-value="inputValue" class="w-[256px]" label="Search (controlled input)" placeholder="Type to search..." :items="animals" />
    <p class="text-sm text-muted">
      Input value: {{ inputValue || '(empty)' }}
    </p>
  </div>
</template>
