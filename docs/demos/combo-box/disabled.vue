<script setup lang="ts">
import { ComboBox } from '@hareui/vue'

const animals = [
  { value: 'aardvark', label: 'Aardvark' },
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'kangaroo', label: 'Kangaroo' },
  { value: 'panda', label: 'Panda' },
  { value: 'snake', label: 'Snake' },
]
</script>

<template>
  <ComboBox disabled class="w-[256px]" label="Favorite Animal" placeholder="Search animals..." default-value="cat" :items="animals" />
</template>
