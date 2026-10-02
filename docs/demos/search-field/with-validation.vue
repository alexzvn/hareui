<script setup lang="ts">
import { SearchField } from 'herouse'
import { computed, ref } from 'vue'

const value = ref('')
const isInvalid = computed(() => value.value.length > 0 && value.value.length < 3)
</script>

<template>
  <div class="flex flex-col gap-4">
    <SearchField
      v-model="value"
      required
      :invalid="isInvalid"
      class="w-[280px]"
      name="search"
      label="Search"
      placeholder="Search..."
      error-message="Search query must be at least 3 characters"
      description="Enter at least 3 characters to search"
    />
  </div>
</template>
