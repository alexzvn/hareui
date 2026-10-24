<script setup lang="ts">
import { SearchField } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <SearchField
      class="w-[280px]"
      name="primary-search"
      variant="primary"
      label="Primary variant"
      placeholder="Search..."
    />
    <SearchField
      class="w-[280px]"
      name="secondary-search"
      variant="secondary"
      label="Secondary variant"
      placeholder="Search..."
    />
  </div>
</template>
