<template>
  <div class="relative h-[28rem] w-full overflow-hidden rounded-xl border border-border p-2">
    <article class="h-full overflow-y-auto py-8 ps-8 pe-16">
      <section v-for="link in links" :key="link.id" class="mb-10">
        <h2 :id="link.id" class="scroll-mt-8 text-lg font-semibold">{{ link.text }}</h2>
        <p class="mt-2 text-sm text-muted">
          Release notes for {{ link.text }}: fixes, small improvements and one or two new settings.
        </p>
      </section>
    </article>

    <Toc variant="floating" :links="links" class="absolute end-3 top-1/2 -translate-y-1/2" />
  </div>
</template>

<script setup lang="ts">
import type { TocLink } from '@hareui/vue'
import { Toc } from '@hareui/vue'

// Thirty entries: the panel stops at 400px (or 60% of the viewport) and scrolls the active link into view.
const links: TocLink[] = Array.from({ length: 30 }, (_, index) => {
  const version = `2.${30 - index}.0`

  return { id: `long-v${30 - index}`, text: `Version ${version}`, depth: 2 }
})
</script>
