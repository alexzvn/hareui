<script setup lang="ts">
import { NativeSelect } from '@hareui/vue'

const items = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Best rated' },
]
</script>

<template>
  <div class="w-[220px]">
    <NativeSelect class="w-full" aria-label="Sort products" placeholder="Sort by" :items="items" />
  </div>
</template>
