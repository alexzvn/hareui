<template>
  <div class="w-[400px] space-y-4">
    <ComboBox full-width label="Favorite Animal" placeholder="Search animals..." :items="animals" />
  </div>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { ComboBox } from '@hareui/vue'

const animals: ListBoxItem[] = [
  { value: 'aardvark', label: 'Aardvark' },
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
]
</script>
