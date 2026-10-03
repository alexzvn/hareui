<script setup lang="ts">
// Port of HeroUI docs `themes/components/theme-builder-content.tsx`.
// The preview always shows the components tab, so the "Pro template" link (HeroUI Pro) is parked; its row stays
// (invisible, as on the components tab in HeroUI) to keep the layout identical.
import { ScrollShadow } from '@hareui/vue'
import PreviewContainer from './PreviewContainer.vue'
import ThemeCodePanel from './ThemeCodePanel.vue'
</script>

<template>
  <div class="mx-auto flex h-full min-h-0 w-full max-w-[1400px] flex-col">
    <div class="pointer-events-none flex shrink-0 justify-end px-2 pb-1 opacity-0 transition-opacity duration-300">
      <span aria-hidden="true" class="text-[13px] font-medium text-muted">&nbsp;</span>
    </div>
    <ScrollShadow
      hide-scroll-bar
      visibility="none"
      class="flex min-h-0 w-full flex-1 flex-col overflow-scroll rounded-2xl border border-border/50"
    >
      <div class="relative flex min-h-full w-full items-start">
        <PreviewContainer />
        <ThemeCodePanel />
      </div>
    </ScrollShadow>
  </div>
</template>
