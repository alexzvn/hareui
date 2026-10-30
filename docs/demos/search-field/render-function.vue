<template>
  <!-- Attributes other than aria-label/aria-labelledby fall through to the root element -->
  <SearchField
    class="w-[280px]"
    data-custom="foo"
    name="search"
    label="Search"
    placeholder="Search..."
  />
</template>

<script setup lang="ts">
import { SearchField } from '@hareui/vue'
</script>
