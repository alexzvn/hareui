<template>
  <PreviewPage v-if="frontmatter.layout === 'preview'" />
  <div v-else class="flex min-h-screen flex-col font-sans">
    <Home v-if="frontmatter.layout === 'home'" :sections="sections" @search="searchOpen = true" />
    <ThemesPage v-else-if="frontmatter.layout === 'themes'" />
    <div
      v-else
      id="nd-notebook-layout"
      class="grid min-h-(--fd-docs-height) auto-cols-auto auto-rows-auto overflow-x-clip transition-[grid-template-columns] [--fd-docs-height:100dvh] [--fd-header-height:0px] [--fd-sidebar-width:0px] [--fd-toc-popover-height:0px] [--fd-toc-width:0px]"
      :style="GRID_STYLE"
    >
      <div
        data-sidebar-placeholder=""
        class="md:layout:[--fd-sidebar-width:268px] pointer-events-none sticky z-20 [grid-area:sidebar] *:pointer-events-auto max-md:hidden top-(--fd-docs-row-2) h-[calc(var(--fd-docs-height)-var(--fd-docs-row-2))]"
      >
        <aside
          data-collapsed="false"
          data-hovered="false"
          id="nd-sidebar"
          class="absolute inset-y-0 start-0 flex w-full flex-col items-end text-sm duration-250 *:w-(--fd-sidebar-width)"
        >
          <div
            data-docs-sidebar-viewport=""
            class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 mask-[linear-gradient(to_bottom,transparent,white_12px,white_calc(100%-12px),transparent)]"
          >
            <SidebarItems v-if="activeSection" :items="activeSection.items" :active-path="path" />
          </div>
        </aside>
      </div>

      <DocsHeader
        :sections="sections"
        :active-section="activeSection"
        @search="searchOpen = true"
        @open-sidebar="mobileSidebarOpen = true"
      />

      <TocPopover v-if="!page.isNotFound" :title="title" :items="tocItems" :active="tocActive" />

      <article
        data-full="false"
        id="nd-page"
        class="flex flex-col gap-4 px-4 py-6 [grid-area:main] *:max-w-[900px] md:px-6 md:pt-8 xl:px-8 xl:pt-14"
      >
        <template v-if="page.isNotFound">
          <PageHeader title="Not Found" description="This page could not be found." />
          <a class="text-fd-primary underline" href="/docs/getting-started/"
            >Back to Introduction</a
          >
        </template>
        <template v-else>
          <PageHeader :title="title" :description="frontmatter.description" :links="links" />
          <Content class="prose flex-1 prose-sm" />
          <PageFooter :section="activeSection" :path="path" />
        </template>
      </article>

      <div
        v-if="!page.isNotFound"
        id="nd-toc"
        class="xl:layout:[--fd-toc-width:268px] sticky top-(--fd-docs-row-3) flex h-[calc(var(--fd-docs-height)-var(--fd-docs-row-3))] w-(--fd-toc-width) flex-col pe-4 pt-12 pb-2 [grid-area:toc] max-xl:hidden"
      >
        <h3
          class="text-fd-muted-foreground inline-flex items-center gap-1.5 text-sm"
          id="toc-title"
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
            <path d="M15 18H3" />
            <path d="M17 6H3" />
            <path d="M21 12H3" />
          </svg>
          On this page
        </h3>
        <div
          class="relative min-h-0 text-sm ms-px overflow-auto [scrollbar-width:none] mask-[linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] py-3"
        >
          <TocItems :items="tocItems" :active="tocActive" />
        </div>
      </div>
    </div>

    <template v-if="mobileSidebarOpen">
      <div
        data-state="open"
        class="data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out fixed inset-0 z-40 backdrop-blur-xs"
        @click="mobileSidebarOpen = false"
      />
      <aside
        id="nd-sidebar-mobile"
        data-state="open"
        class="bg-fd-background data-[state=open]:animate-fd-sidebar-in data-[state=closed]:animate-fd-sidebar-out fixed inset-y-0 end-0 z-40 flex w-[85%] max-w-[380px] flex-col text-[0.9375rem] shadow-lg"
      >
        <div class="flex flex-col items-start justify-center gap-4 px-4 pt-4 sm:hidden">
          <div class="flex w-full items-center justify-between gap-4 ps-1">
            <span class="font-semibold text-lg">HareUI</span>
            <ThemeToggle />
          </div>
          <!-- HeroUI <Separator />: HareUI has no Separator component; classes from styles/components/separator.css -->
          <hr
            data-orientation="horizontal"
            data-slot="separator"
            role="separator"
            class="h-px w-full shrink-0 rounded-sm border-t-0 border-b-0 bg-separator"
          />
        </div>
        <div
          data-docs-sidebar-viewport=""
          class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 mask-[linear-gradient(to_bottom,transparent,white_12px,white_calc(100%-12px),transparent)]"
        >
          <SidebarItems v-if="activeSection" :items="activeSection.items" :active-path="path" />
        </div>
        <div class="px-4 pb-4 sm:hidden">
          <div class="ms-auto pb-1.5">
            <FrameworkTabs />
          </div>
        </div>
      </aside>
    </template>

    <SearchDialog v-if="searchEverOpened" v-model:open="searchOpen" />

    <!-- Shared default-queue provider: several toast/* demos call the global `toast()`
         function directly (matching HeroUI's own docs, which mount one Toast.Provider
         at the app shell) rather than creating their own queue + provider per demo.
         It takes the theme of a preview pinned to the other theme (ComponentPreview). -->
    <ToastProvider
      :class="toastTheme && [toastTheme, 'text-foreground']"
      v-bind="toastTheme ? design : {}"
    />
  </div>
</template>

<script setup lang="ts">
import { ToastProvider } from '@hareui/vue'
import { useData, useRoute } from 'vitepress'
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { normalizePath, type ThemeConfig } from '../sidebar'
import DocsHeader from './components/DocsHeader.vue'
import FrameworkTabs from './components/FrameworkTabs.vue'
import PageFooter from './components/PageFooter.vue'
import PageHeader, { type PageLinks } from './components/PageHeader.vue'
import PreviewPage from './components/PreviewPage.vue'
import SidebarItems from './components/SidebarItems.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import TocItems from './components/TocItems.vue'
import TocPopover from './components/TocPopover.vue'
import { useDocInteractions } from './composables/useDocInteractions'
import { useDocTheme } from './composables/useDocTheme'
import { useToc } from './composables/useToc'
import { previewOverlayTheme } from './demos'
import Home from './Home.vue'
import ThemesPage from './themes/ThemesPage.vue'

const SearchDialog = defineAsyncComponent(() => import('./components/SearchDialog.vue'))

const { page, frontmatter, theme } = useData<ThemeConfig>()
const route = useRoute()

const path = computed(() => normalizePath(route.path))
const sections = computed(() => theme.value.sidebar)
const activeSection = computed(
  () => sections.value.find((section) => path.value.startsWith(section.base)) ?? sections.value[0],
)

const { items: tocItems, active: tocActive } = useToc()
useDocInteractions()

// Toasts fired from a preview pinned to the other theme take that preview's scope (ComponentPreview); a docs theme
// change unpins every preview, so the scope only applies while it differs from the docs theme.
const { dark: docDark, design } = useDocTheme()
const toastTheme = computed(() =>
  previewOverlayTheme.value && previewOverlayTheme.value !== (docDark.value ? 'dark' : 'light')
    ? previewOverlayTheme.value
    : undefined,
)

const searchOpen = ref(false)

// SearchDialog (and its minisearch chunk) loads on first open, then stays mounted so it can animate out.
const searchEverOpened = ref(false)
watch(searchOpen, (isOpen) => isOpen && (searchEverOpened.value = true))
const mobileSidebarOpen = ref(false)
watch(path, () => (mobileSidebarOpen.value = false))

const onKeydown = (event: KeyboardEvent) => {
  if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    searchOpen.value = true
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

const GRID_STYLE = [
  '--fd-docs-row-1:var(--fd-banner-height, 0px)',
  '--fd-docs-row-2:calc(var(--fd-docs-row-1) + var(--fd-header-height))',
  '--fd-docs-row-3:calc(var(--fd-docs-row-2) + var(--fd-toc-popover-height))',
  '--fd-sidebar-col:var(--fd-sidebar-width)',
  `grid-template:". header header header ." "sidebar sidebar toc-popover toc-popover ." "sidebar sidebar main toc ." 1fr / minmax(min-content, 1fr) var(--fd-sidebar-col) minmax(0, calc(var(--fd-layout-width,97rem) - var(--fd-sidebar-col) - var(--fd-toc-width))) var(--fd-toc-width) minmax(min-content, 1fr)`,
].join(';')

const title = computed(() => String(frontmatter.value.title ?? page.value.title ?? ''))
const links = computed(() => frontmatter.value.links as PageLinks | undefined)
</script>
