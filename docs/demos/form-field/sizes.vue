<template>
  <div class="flex w-80 flex-col gap-6">
    <FormField
      v-for="size in sizes"
      :key="size"
      :size="size"
      :label="`Size ${size}`"
      hint="Optional"
      description="Label and helper text scale together."
    >
      <Input placeholder="Type here" full-width />
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { FormField, Input } from '@hareui/vue'

const sizes = ['sm', 'md', 'lg'] as const
</script>
