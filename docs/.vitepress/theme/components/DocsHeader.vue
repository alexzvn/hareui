<template>
  <header
    :data-transparent="transparent"
    id="nd-subnav"
    class="data-[transparent=false]:bg-fd-background/80 layout:[--fd-header-height:--spacing(23)] sticky top-(--fd-docs-row-1) z-10 flex flex-col backdrop-blur-sm transition-colors [grid-area:header] md:layout:[--fd-header-height:--spacing(25)]"
  >
    <div class="flex h-14 gap-2 border-b px-4 md:px-6" data-header-body="">
      <div class="items-center flex flex-1">
        <div class="flex items-center gap-4">
          <a class="inline-flex items-center gap-2.5 font-semibold" href="/docs/getting-started/">
            <HareLogo class="size-6" />
            <span class="font-semibold text-lg">HareUI</span>
          </a>
        </div>
      </div>
      <button
        data-search-full=""
        type="button"
        class="bg-fd-secondary/50 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground inline-flex items-center gap-2 border p-1.5 text-sm transition-colors my-auto w-full max-md:hidden max-w-sm rounded-xl ps-2.5"
        @click="emit('search')"
      >
        <svg
          fill="none"
          height="24"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
          class="size-4"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        Search
        <div class="ms-auto inline-flex gap-0.5">
          <kbd class="bg-fd-background rounded-md border px-1.5">⌘</kbd>
          <kbd class="bg-fd-background rounded-md border px-1.5">K</kbd>
        </div>
      </button>
      <div class="flex flex-1 items-center justify-end md:gap-2">
        <div class="flex items-center gap-6 empty:hidden max-lg:hidden" />
        <div class="me-2 flex items-center gap-3 md:me-0" id="nd-nav-actions">
          <DesignThemeSelector />
        </div>
        <div class="flex items-center md:hidden">
          <button
            data-slot="button"
            data-search=""
            type="button"
            aria-label="Open Search"
            :class="searchIconButton"
            @click="emit('search')"
          >
            <svg
              fill="none"
              height="24"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              class="size-4"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button
            aria-label="Open Sidebar"
            type="button"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring hover:bg-fd-accent hover:text-fd-accent-foreground [&_svg]:size-4.5 -me-1.5 p-2"
            @click="emit('openSidebar')"
          >
            <svg
              fill="none"
              height="24"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect height="18" rx="2" width="18" x="3" y="3" />
              <path d="M9 3v18" />
            </svg>
          </button>
        </div>
        <div class="flex items-center gap-2 max-md:hidden">
          <a
            :href="REPO_URL"
            aria-label="GitHub"
            rel="noopener noreferrer"
            target="_blank"
            :class="searchIconButton"
          >
            <BrandIcon name="github" class="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </div>
    <div
      class="flex flex-row items-end gap-6 h-10 overflow-x-auto border-b px-6"
      data-header-tabs=""
    >
      <a
        v-for="section in sections"
        :key="section.base"
        :class="[
          TAB,
          section === activeSection
            ? 'border-fd-primary text-fd-primary'
            : 'text-fd-muted-foreground border-transparent',
        ]"
        :href="sectionLinks(section)[0]?.link ?? section.base"
      >
        <div :aria-label="section.text" class="flex items-center gap-2">
          <Icon :icon="`gravity-ui:${section.icon}`" />
          <span>{{ section.text }}</span>
        </div>
      </a>
      <div class="ms-auto pb-1.5 hidden md:flex">
        <FrameworkTabs />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import buttonTheme from '../../../../packages/vue/src/components/button/theme'
import { tv } from '../../../../packages/vue/src/utils/tv'
import { sectionLinks, type SidebarSection } from '../../sidebar'
import { REPO_URL } from '../repo'
import BrandIcon from './BrandIcon.vue'
import DesignThemeSelector from './DesignThemeSelector.vue'
import FrameworkTabs from './FrameworkTabs.vue'
import HareLogo from './HareLogo.vue'
import ThemeToggle from './ThemeToggle.vue'

defineProps<{ sections: SidebarSection[]; activeSection?: SidebarSection }>()
const emit = defineEmits<{ search: []; openSidebar: [] }>()

const button = tv(buttonTheme)
const searchIconButton = button({ iconOnly: true, size: 'sm', variant: 'tertiary' }).base({
  class: 'size-[34px] border-none p-2',
})

const transparent = ref(true)
function onScroll() {
  transparent.value = window.scrollY < 10
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const TAB =
  'hover:text-fd-accent-foreground inline-flex items-center gap-2 border-b-2 pb-1.5 text-sm font-medium text-nowrap transition-colors'
</script>
