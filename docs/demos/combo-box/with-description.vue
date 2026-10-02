<script setup lang="ts">
import { ComboBox } from 'herouse'

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
  <ComboBox class="w-[256px]" label="Favorite Animal" placeholder="Search animals..." description="Search and select your favorite animal" :items="animals" />
</template>
