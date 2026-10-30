<template>
  <div class="w-[400px] space-y-4">
    <Select full-width label="Favorite Animal" placeholder="Select one" :items="animals" />
  </div>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Select } from '@hareui/vue'

const animals: ListBoxItem[] = [
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'bird', label: 'Bird' },
]
</script>
