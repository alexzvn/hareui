<template>
  <div class="flex flex-col gap-4">
    <SearchField required class="w-[280px]" name="search" label="Search" placeholder="Search..." />
    <SearchField
      required
      class="w-[280px]"
      name="search-query"
      label="Search query"
      placeholder="Enter search query..."
      description="Minimum 3 characters required"
    />
  </div>
</template>

<script setup lang="ts">
import { SearchField } from '@hareui/vue'
</script>
