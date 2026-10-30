<template>
  <div class="flex flex-col gap-4">
    <SearchField
      disabled
      class="w-[280px]"
      name="search"
      model-value="Disabled search"
      label="Search"
      description="This search field is disabled"
    />
    <SearchField
      disabled
      class="w-[280px]"
      name="search-empty"
      label="Search"
      description="This search field is disabled"
    />
  </div>
</template>

<script setup lang="ts">
import { SearchField } from '@hareui/vue'
</script>
