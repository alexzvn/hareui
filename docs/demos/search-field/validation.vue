<template>
  <div class="flex flex-col gap-4">
    <SearchField
      invalid
      required
      class="w-[280px]"
      name="search"
      model-value="ab"
      label="Search"
      error-message="Search query must be at least 3 characters"
    />
    <SearchField
      invalid
      class="w-[280px]"
      name="search-invalid"
      model-value="invalid@query"
      label="Search"
      placeholder="Search..."
      error-message="Invalid characters in search query"
    />
  </div>
</template>

<script setup lang="ts">
import { SearchField } from '@hareui/vue'
</script>
