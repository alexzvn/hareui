<script setup lang="ts">
// Port of the fumadocs `HomeLayout` navbar as heroui.com renders it (`app/[lang]/(home)/layout.tsx`).
// HeroUI-only entries are left out: Themes, React Native, Blog, Roadmap, Figma, Releases, Ask AI,
// the language toggle and the GitHub link.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { Button } from '@hareui/vue'
import DesignThemeSelector from '../DesignThemeSelector.vue'
import ThemeToggle from '../ThemeToggle.vue'
import HareLogo from '../HareLogo.vue'

const props = defineProps<{ docsHref: string; componentsHref: string }>()
const emit = defineEmits<{ search: [] }>()

// `text` is the navbar label, `menuText` the mobile menu label (as in HeroUI's dictionary).
const links = [
  { text: 'Docs', menuText: 'Getting Started', icon: 'book', url: props.docsHref },
  { text: 'Components', menuText: 'Components', icon: 'circles-4-diamond', url: props.componentsHref },
]

const NAV_LINK = '[&_svg]:size-4 inline-flex items-center gap-1 p-2 text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground data-[active=true]:text-fd-primary'
const MENU_LINK = 'inline-flex items-center gap-2 py-1.5 transition-colors hover:text-fd-popover-foreground/50 data-[active=true]:font-medium data-[active=true]:text-fd-primary [&_svg]:size-4'

const menuOpen = ref(false)
const transparent = ref(true)
function onScroll() {
  transparent.value = window.scrollY < 10
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header id="nd-nav" class="sticky top-0 z-40 h-14" aria-label="Main">
    <div
      :class="[
        'border-b backdrop-blur-lg transition-colors *:mx-auto *:max-w-(--fd-layout-width)',
        (menuOpen || !transparent) && 'bg-fd-background/80',
        menuOpen && 'max-lg:rounded-b-2xl max-lg:shadow-lg',
      ]"
    >
      <div class="relative">
        <nav class="flex h-14 w-full items-center px-4">
          <a class="inline-flex items-center gap-2.5 font-semibold" href="/">
            <HareLogo class="size-6" />
            <span class="text-lg font-semibold">HareUI</span>
          </a>
          <ul class="flex flex-row items-center gap-2 px-6 max-sm:hidden">
            <li v-for="link in links" :key="link.url" class="list-none text-sm">
              <a :class="NAV_LINK" data-active="false" :href="link.url">{{ link.text }}</a>
            </li>
          </ul>
          <div class="flex flex-1 flex-row items-center justify-end gap-1.5 max-lg:hidden">
            <div class="flex items-center gap-1.5">
              <Button aria-label="Open Search" data-search="" icon-only size="sm" variant="tertiary" class="size-[34px] border-none" @click="emit('search')">
                <svg fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </Button>
              <DesignThemeSelector />
            </div>
            <ThemeToggle />
          </div>
          <div class="ms-auto -me-1.5 flex flex-row items-center lg:hidden">
            <div class="flex items-center gap-1.5">
              <Button aria-label="Open Search" data-search="" icon-only size="sm" variant="tertiary" class="size-[34px] border-none" @click="emit('search')">
                <svg fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </Button>
              <DesignThemeSelector />
            </div>
            <div class="list-none">
              <button
                type="button"
                aria-label="Toggle Menu"
                :aria-expanded="menuOpen"
                :data-state="menuOpen ? 'open' : 'closed'"
                class="group inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium transition-colors duration-100 hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-fd-accent/50 [&_svg]:size-5.5"
                @click="menuOpen = !menuOpen"
              >
                <svg aria-hidden="true" class="transition-transform duration-300 group-data-[state=open]:rotate-180" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m6 9 6 6 6-6" /></svg>
              </button>
            </div>
          </div>
        </nav>
      </div>
      <div v-if="menuOpen" class="flex w-full justify-center lg:hidden">
        <div class="flex max-h-[80svh] w-full flex-col overflow-auto p-4 sm:flex-row sm:items-center sm:justify-end">
          <div class="mb-4 flex flex-col sm:hidden">
            <p class="mb-1 text-sm text-fd-muted-foreground">Documentation</p>
            <a v-for="link in links" :key="link.url" :class="MENU_LINK" data-active="false" :href="link.url">
              <Icon :icon="`gravity-ui:${link.icon}`" />{{ link.menuText }}
            </a>
          </div>
          <div class="-ms-1.5 flex flex-row items-center gap-2 max-sm:mt-2">
            <div role="separator" class="flex-1" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
