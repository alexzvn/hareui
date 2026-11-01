<template>
  <FormField
    v-slot="{ id, name, describedBy, invalid }"
    label="Accent color"
    name="accent"
    description="Used for buttons and links."
    class="w-80"
  >
    <div class="flex items-center gap-3">
      <input
        :id="id"
        v-model="color"
        :name="name"
        type="color"
        :aria-describedby="describedBy"
        :aria-invalid="invalid || undefined"
        class="h-9 w-16 cursor-pointer overflow-hidden rounded-field border border-border bg-field p-0 [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
      />
      <span class="font-mono text-sm text-muted uppercase">{{ color }}</span>
    </div>
  </FormField>
</template>

<script setup lang="ts">
import { FormField } from '@hareui/vue'
import { ref } from 'vue'

const color = ref('#3b82f6')
</script>
