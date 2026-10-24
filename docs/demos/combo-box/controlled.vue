<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { ComboBox } from '@hareui/vue'
import { computed, ref } from 'vue'

const animals: ListBoxItem[] = [
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'bird', label: 'Bird' },
  { value: 'fish', label: 'Fish' },
  { value: 'hamster', label: 'Hamster' },
]

const selectedKey = ref<string | null>('cat')
const selectedAnimal = computed(() => animals.find((a) => a.value === selectedKey.value))
</script>

<template>
  <div class="space-y-2">
    <ComboBox
      v-model="selectedKey"
      class="w-[256px]"
      label="Animal (controlled)"
      placeholder="Search animals..."
      :items="animals"
    />
    <p class="text-sm text-muted">Selected: {{ selectedAnimal?.label || 'None' }}</p>
  </div>
</template>
