<script setup lang="ts">
import { Autocomplete } from 'herouse'
</script>

<template>
  <!-- No options: with `allows-empty-collection` the popover still opens and shows the empty state -->
  <Autocomplete
    allows-empty-collection
    class="w-[256px]"
    label="State"
    placeholder="Select one"
    search-label="Search states"
    search-placeholder="Search states..."
    :items="[]"
  >
    <template #empty>
      No results found
    </template>
  </Autocomplete>
</template>
