<script setup lang="ts">
import { ScrollShadow } from 'herouse'

const entries = [
  'Reviewed quarterly goals with the design team.',
  'Shipped dark mode tokens to production.',
  'Merged accessibility fixes for form fields.',
  'Published updated component documentation.',
  'Scheduled performance audit for next sprint.',
  'Added scroll shadow demos to the docs site.',
]
</script>

<template>
  <div class="w-full sm:max-w-sm">
    <ScrollShadow
      hide-scroll-bar
      class="max-h-48 rounded-xl border border-border/80 bg-linear-to-b from-neutral-50/90 to-white p-4 ring-1 ring-black/5 dark:from-neutral-900/80 dark:to-neutral-900 dark:ring-white/10"
      :size="48"
      variant="fade"
    >
      <div class="space-y-3">
        <p
          v-for="entry in entries"
          :key="entry"
          class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
        >
          {{ entry }}
        </p>
      </div>
    </ScrollShadow>
  </div>
</template>
