<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import type { TocItem } from '../composables/useToc'
import TocItems from './TocItems.vue'

const props = defineProps<{ title: string; items: TocItem[]; active: string[] }>()

const open = ref(false)
const route = useRoute()
watch(() => route.path, () => (open.value = false))

const CIRCUMFERENCE = 2 * Math.PI * 11
const currentIndex = computed(() => props.items.findIndex((item) => item.id === props.active[0]))
const progress = computed(() => (props.items.length ? (currentIndex.value + 1) / props.items.length : 0))
const currentText = computed(() => props.items[currentIndex.value]?.text)
</script>

<template>
  <div
    :data-state="open ? 'open' : 'closed'"
    data-toc-popover=""
    class="max-xl:layout:[--fd-toc-popover-height:--spacing(10)] sticky top-(--fd-docs-row-2) z-10 h-(--fd-toc-popover-height) [grid-area:toc-popover] xl:hidden"
  >
    <header :class="['border-b backdrop-blur-sm transition-colors', open && 'bg-fd-background/90 shadow-lg']">
      <button
        type="button"
        :aria-expanded="open"
        :data-state="open ? 'open' : 'closed'"
        data-toc-popover-trigger=""
        class="text-fd-muted-foreground flex h-10 w-full items-center gap-2.5 px-4 py-2.5 text-start text-sm focus-visible:outline-none md:px-6 [&_svg]:size-4"
        @click="open = !open"
      >
        <svg :aria-valuenow="progress" aria-valuemax="1" aria-valuemin="0" role="progressbar" viewBox="0 0 24 24" class="shrink-0">
          <circle cx="12" cy="12" fill="none" r="11" stroke-width="2" class="stroke-current/25" />
          <circle
            cx="12"
            cy="12"
            fill="none"
            r="11"
            stroke-width="2"
            class="transition-all"
            stroke="currentColor"
            :stroke-dasharray="CIRCUMFERENCE"
            :stroke-dashoffset="(1 - progress) * CIRCUMFERENCE"
            stroke-linecap="round"
            transform="rotate(-90 12 12)"
          />
        </svg>
        <span class="grid flex-1 *:col-start-1 *:row-start-1 *:my-auto">
          <span :class="['truncate transition-all', !open && currentText && 'pointer-events-none -translate-y-full opacity-0']">{{ title }}</span>
          <span :class="['truncate transition-all', (open || !currentText) && 'pointer-events-none translate-y-full opacity-0']">{{ currentText }}</span>
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" :class="['mx-0.5 shrink-0 transition-transform', open && 'rotate-180']">
          <path fill="currentColor" fill-rule="evenodd" d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06" clip-rule="evenodd" />
        </svg>
      </button>
      <div v-show="open" :data-state="open ? 'open' : 'closed'" data-toc-popover-content="" class="flex max-h-[50vh] flex-col px-4 md:px-6">
        <div class="relative min-h-0 text-sm ms-px overflow-auto [scrollbar-width:none] py-3">
          <TocItems :items="items" :active="active" />
        </div>
      </div>
    </header>
  </div>
</template>
