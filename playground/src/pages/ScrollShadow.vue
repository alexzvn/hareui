<script setup lang="ts">
import type { ScrollShadowVisibility } from 'herouse'
import { ScrollShadow } from 'herouse'
import { ref } from 'vue'

const state = ref<ScrollShadowVisibility>('none')
</script>

<template>
  <div class="flex flex-col gap-10 p-8">
    <h1 class="text-2xl font-semibold">ScrollShadow</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">vertical (auto) — state: <span class="font-mono">{{ state }}</span></h2>
      <ScrollShadow class="max-h-[200px] max-w-sm p-4" @visibility-change="state = $event">
        <p v-for="i in 10" :key="i" class="mb-4">Line {{ i }}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </ScrollShadow>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">horizontal, size 80, hide-scroll-bar</h2>
      <ScrollShadow orientation="horizontal" :size="80" hide-scroll-bar class="max-w-sm p-4">
        <div class="flex gap-4">
          <div v-for="i in 10" :key="i" class="h-16 min-w-[120px] rounded-xl bg-default p-2">Box {{ i }}</div>
        </div>
      </ScrollShadow>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">visibility="both" / "none"</h2>
      <div class="flex gap-4">
        <ScrollShadow visibility="both" class="max-h-[160px] max-w-[240px] p-4">
          <p v-for="i in 6" :key="i" class="mb-4">Line {{ i }}</p>
        </ScrollShadow>
        <ScrollShadow visibility="none" class="max-h-[160px] max-w-[240px] p-4">
          <p v-for="i in 6" :key="i" class="mb-4">Line {{ i }}</p>
        </ScrollShadow>
      </div>
    </section>
  </div>
</template>
