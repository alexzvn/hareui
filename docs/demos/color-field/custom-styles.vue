<template>
  <ColorField
    v-model="color"
    class="w-full max-w-xs gap-1.5"
    name="accent-color"
    label="Accent color"
    description="Applied to buttons, links, and focus rings."
    :ui="{
      base: '[&_[data-slot=label]]:font-medium [&_[data-slot=label]]:text-foreground',
      group: 'rounded-xl bg-default shadow-none focus-within:ring-2 focus-within:ring-accent/15',
      input: 'font-mono text-sm text-foreground placeholder:text-muted',
    }"
    variant="secondary"
  >
    <template #prefix>
      <ColorSwatch class="rounded-md" :color="color" size="xs" />
    </template>
  </ColorField>
</template>

<script setup lang="ts">
import { ColorField, ColorSwatch, parseColor } from '@hareui/vue'
import { ref } from 'vue'

const color = ref(parseColor('#6366F1'))
</script>
