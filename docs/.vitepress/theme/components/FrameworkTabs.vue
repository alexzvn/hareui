<script setup lang="ts">
import BrandIcon from './BrandIcon.vue'
</script>

<template>
  <div data-slot="tabs" class="flex flex-col gap-2" data-orientation="horizontal">
    <div class="relative rounded-[calc(var(--radius)*2.5)] bg-default" data-slot="tabs-list-container">
      <div
        data-slot="tabs-list"
        aria-label="Documentation framework"
        role="tablist"
        aria-orientation="horizontal"
        data-orientation="horizontal"
        class="inline-flex w-max min-w-full flex-row p-1"
      >
        <div
          data-slot="tabs-tab"
          role="tab"
          aria-selected="true"
          data-selected="true"
          tabindex="0"
          class="relative z-1 flex h-8 w-full cursor-(--cursor-interactive) items-center justify-center gap-1.5 rounded-3xl px-4 text-center text-sm font-medium whitespace-nowrap text-segment-foreground outline-none sm:h-6"
        >
          <BrandIcon name="vue" />
          Vue
          <div data-slot="tabs-indicator" class="absolute start-0 top-0 -z-1 size-full rounded-3xl bg-segment shadow-surface" />
        </div>
      </div>
    </div>
  </div>
</template>
