<script setup lang="ts">
import { SearchField } from '@hareui/vue'
</script>

<template>
  <SearchField
    class="w-full max-w-64"
    name="docs"
    variant="secondary"
    label="Search docs"
    placeholder="Components, guides..."
    :ui="{
      group: 'rounded-xl bg-default',
      searchIcon: 'text-muted',
      input: 'placeholder:text-muted',
      clearButton: 'text-muted',
    }"
  />
</template>
