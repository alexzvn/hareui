<script setup lang="ts">
import { ComboBox } from 'herouse'

const animals = [
  { value: 'aardvark', label: 'Aardvark' },
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
]
</script>

<template>
  <div class="w-[400px] space-y-4">
    <ComboBox full-width label="Favorite Animal" placeholder="Search animals..." :items="animals" />
  </div>
</template>
