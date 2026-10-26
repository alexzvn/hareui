<template>
  <div class="flex gap-4">
    <Checkbox default-value name="heart" label="Heart">
      <template #indicator="{ state }">
        <svg v-if="state === 'checked'" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
            fill="currentColor"
          />
        </svg>
      </template>
    </Checkbox>
    <Checkbox default-value name="plus" label="Plus">
      <template #indicator="{ state }">
        <svg v-if="state === 'checked'" fill="none" viewBox="0 0 24 24">
          <path
            d="M6 12H18"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
          />
          <path
            d="M12 18V6"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
          />
        </svg>
      </template>
    </Checkbox>
    <Checkbox default-value="indeterminate" name="indeterminate" label="Indeterminate">
      <template #indicator="{ state }">
        <svg
          v-if="state === 'indeterminate'"
          stroke="currentColor"
          stroke-width="3"
          viewBox="0 0 24 24"
        >
          <line x1="21" x2="3" y1="12" y2="12" />
        </svg>
      </template>
    </Checkbox>
  </div>
</template>

<script setup lang="ts">
import { Checkbox } from '@hareui/vue'
</script>
