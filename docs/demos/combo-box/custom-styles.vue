<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { ComboBox } from '@hareui/vue'

const itemClass =
  'rounded-lg data-[focused=true]:bg-muted/70 data-[selected=true]:font-medium data-[selected=true]:text-foreground'
const frameworks: ListBoxItem[] = [
  { value: 'react', label: 'React', class: itemClass },
  { value: 'vue', label: 'Vue', class: itemClass },
  { value: 'svelte', label: 'Svelte', class: itemClass },
]
</script>

<template>
  <ComboBox
    class="w-64 gap-1.5"
    label="Framework"
    placeholder="Search..."
    :items="frameworks"
    :ui="{
      label: 'font-medium text-neutral-800 dark:text-neutral-100',
      inputGroup:
        'rounded-xl border border-border/80 bg-surface shadow-sm ring-1 ring-black/5 transition-[box-shadow,border-color] focus-within:ring-2 focus-within:ring-neutral-400/25 dark:ring-white/10 dark:focus-within:ring-neutral-500/30',
      trigger: 'text-muted',
      popover:
        'rounded-xl border border-border/80 bg-surface p-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10',
    }"
  />
</template>
