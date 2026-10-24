<template>
  <Surface class="flex w-full max-w-sm flex-col gap-4 rounded-3xl p-6">
    <SearchField
      name="search"
      variant="secondary"
      label="Search"
      placeholder="Search..."
      description="Enter keywords to search"
      :ui="{ input: 'w-full' }"
    />
    <SearchField
      name="search-2"
      variant="secondary"
      label="Advanced search"
      placeholder="Advanced search..."
      description="Use filters to refine your search"
      :ui="{ input: 'w-full' }"
    />
  </Surface>
</template>

<script setup lang="ts">
import { SearchField, Surface } from '@hareui/vue'
</script>
