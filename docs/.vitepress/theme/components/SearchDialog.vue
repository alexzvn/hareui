<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 backdrop-blur-xs bg-fd-overlay data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out"
      />
      <DialogContent
        :aria-describedby="undefined"
        class="fixed left-1/2 top-4 md:top-[calc(50%-250px)] z-50 w-[calc(100%-1rem)] max-w-screen-sm -translate-x-1/2 rounded-xl text-fd-popover-foreground shadow-2xl shadow-black/50 overflow-hidden data-[state=closed]:animate-fd-dialog-out data-[state=open]:animate-fd-dialog-in *:border-b *:has-[+:last-child[data-empty=true]]:border-b-0 *:data-[empty=true]:border-b-0 *:last:border-b-0 border-none bg-surface"
      >
        <DialogTitle class="hidden">Search</DialogTitle>
        <div class="flex flex-row items-center gap-2 p-3 border-b border-separator">
          <svg
            aria-hidden="true"
            :class="[
              'lucide lucide-search size-5 text-fd-muted-foreground',
              isLoading && 'animate-pulse duration-400',
            ]"
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
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
          <input
            v-model="search"
            autofocus
            class="placeholder:text-fd-muted-foreground w-0 flex-1 bg-transparent text-lg focus-visible:outline-none"
            placeholder="What are you searching for?"
          />
          <Kbd @click="open = false">ESC</Kbd>
        </div>
        <div
          ref="list"
          class="overflow-hidden h-(--fd-animated-height) transition-[height] **:aria-selected:bg-default **:aria-selected:text-foreground"
          :data-empty="items === null"
          :style="
            animatedHeight === undefined
              ? undefined
              : { '--fd-animated-height': `${animatedHeight}px` }
          "
        >
          <div
            :class="['w-full flex flex-col overflow-y-auto max-h-[460px] p-1', !items && 'hidden']"
          >
            <div
              v-if="items?.length === 0"
              class="py-12 text-center text-sm text-fd-muted-foreground"
            >
              No results found
            </div>
            <button
              v-for="item in items ?? []"
              :key="item.id"
              type="button"
              :aria-selected="item.id === active"
              :class="[ITEM_CLASS, item.id === active && 'bg-fd-accent text-fd-accent-foreground']"
              @click="select(item)"
              @pointermove="active = item.id"
            >
              <div v-if="item.type === 'suggestion'" class="inline-flex items-center gap-2">
                <Icon v-if="item.icon" :icon="`gravity-ui:${item.icon}`" />
                <span>{{ item.name }}</span>
              </div>
              <div
                v-else-if="item.type === 'jump'"
                class="text-fd-muted-foreground inline-flex items-center gap-2"
              >
                <svg
                  aria-hidden="true"
                  class="lucide lucide-arrow-right size-4"
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
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
                <p>
                  Jump to <span class="text-fd-foreground font-medium">{{ item.name }}</span>
                </p>
              </div>
              <template v-else>
                <div
                  class="inline-flex items-center text-fd-muted-foreground text-xs empty:hidden"
                />
                <div
                  v-if="item.type !== 'page'"
                  role="none"
                  class="absolute inset-s-3 inset-y-0 w-px bg-fd-border"
                />
                <svg
                  v-if="item.type === 'heading'"
                  aria-hidden="true"
                  class="lucide lucide-hash absolute inset-s-6 top-2.5 size-4 text-fd-muted-foreground"
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
                  <line x1="4" x2="20" y1="9" y2="9" />
                  <line x1="4" x2="20" y1="15" y2="15" />
                  <line x1="10" x2="8" y1="3" y2="21" />
                  <line x1="16" x2="14" y1="3" y2="21" />
                </svg>
                <div
                  :class="[
                    'min-w-0',
                    item.type === 'text' && 'ps-4',
                    item.type === 'heading' && 'ps-8',
                    item.type === 'text' ? 'text-fd-popover-foreground/80' : 'font-medium',
                  ]"
                >
                  <!-- eslint-disable-next-line vue/no-v-html -- built by renderInline from escaped index text -->
                  <p class="min-w-0" v-html="item.html" />
                </div>
              </template>
            </button>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { Kbd } from '@hareui/vue'
import { Icon } from '@iconify/vue'
// Port of heroui.com's search dialog (`apps/docs/src/components/search-dialog.tsx`), which composes
// fumadocs-ui's `components/dialog/search`. Results come from VitePress's local search index.
// Left out as HeroUI-only: the Web / Native tag group, the "Ask AI" row and HeroUI Pro results.
import localSearchIndex from '@localSearchIndex'
import MiniSearch from 'minisearch'
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'
import { useData, useRouter } from 'vitepress'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'

import { normalizePath, sectionLinks, type SidebarLink, type ThemeConfig } from '../../sidebar'

const open = defineModel<boolean>('open', { required: true })

/** Pages listed while the query is empty (HeroUI's `DEFAULT_SUGGESTIONS.web`). */
const SUGGESTED_PAGES = ['', 'quick-start', 'design-principles', 'colors', 'theming'].map(
  (page) => `/docs/getting-started/${page}`,
)

/** Sections searched per query; each page's hits are grouped under it like fumadocs' results. */
const MAX_SECTIONS = 16

/** Matched paragraphs listed per section. */
const MAX_TEXTS_PER_SECTION = 3

type Item =
  | { id: string; type: 'suggestion'; url: string; name: string; icon?: string }
  | { id: string; type: 'jump'; url: string; name: string }
  | { id: string; type: 'page'; url: string; html: string }
  | { id: string; type: 'heading'; url: string; html: string }
  | { id: string; type: 'text'; url: string; html: string }

type Section = {
  id: string
  title: string
  titles: string[]
  text: string
}

const { theme, localeIndex } = useData<ThemeConfig>()
const router = useRouter()

const pages = computed(() => theme.value.sidebar.flatMap(sectionLinks))
const pageByPath = computed(
  () => new Map(pages.value.map((page) => [normalizePath(page.link), page])),
)

/* Index: loaded on first open, as VPLocalSearchBox does. */
const index = shallowRef<MiniSearch<Section>>()
const isLoading = ref(false)
watch(
  open,
  async (isOpen) => {
    if (!isOpen || index.value || isLoading.value) return
    isLoading.value = true

    try {
      const json = (await localSearchIndex[localeIndex.value]?.())?.default
      if (json) {
        index.value = MiniSearch.loadJSON<Section>(json, {
          fields: ['title', 'titles', 'text'],
          storeFields: ['title', 'titles', 'text'],
          searchOptions: { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } },
        })
      }
    } finally {
      isLoading.value = false
    }
  },
  { immediate: true },
)

const search = ref('')
watch(open, (isOpen) => {
  if (!isOpen) search.value = ''
})

/* Inline markdown (`code`, **strong**) kept in the index by `searchRender`, rendered like fumadocs. */
const CODE_CLASS = 'border rounded-md px-px bg-fd-secondary text-fd-secondary-foreground'

const decodeEntities = (text: string): string => {
  const el = document.createElement('textarea')
  el.innerHTML = text

  return el.value
}

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const escapeRegExp = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const terms = computed(() => search.value.trim().toLowerCase().split(/\s+/).filter(Boolean))
const termPattern = computed(() =>
  terms.value.length
    ? new RegExp(`(?<![\\w&])(${terms.value.map(escapeRegExp).join('|')})`, 'gi')
    : undefined,
)

const highlight = (escaped: string): string => {
  return termPattern.value
    ? escaped.replace(termPattern.value, '<span class="text-fd-primary underline">$1</span>')
    : escaped
}

const renderInline = (markdown: string): string => {
  return decodeEntities(markdown)
    .split(/(`[^`]+`)/)
    .map((part) => {
      if (part.length > 2 && part.startsWith('`') && part.endsWith('`'))
        return `<code class="${CODE_CLASS}">${escapeHtml(part.slice(1, -1))}</code>`

      return highlight(escapeHtml(part)).replace(
        /\*\*([\s\S]+?)\*\*/g,
        '<strong class="text-fd-accent-foreground font-medium">$1</strong>',
      )
    })
    .join('')
}

const matches = (text: string): boolean => {
  const lower = decodeEntities(text).toLowerCase()
  return terms.value.some((term) => lower.includes(term))
}

/* Items */
const suggestions = computed<Item[]>(() =>
  SUGGESTED_PAGES.flatMap((path) => {
    const page = pageByPath.value.get(normalizePath(path))
    return page
      ? [
          {
            id: `suggestion-${path}`,
            type: 'suggestion' as const,
            url: page.link,
            name: page.text,
            icon: page.icon,
          },
        ]
      : []
  }),
)

/** HeroUI's "Jump to" row: the first sidebar page whose name starts with the query. */
const jump = computed<Item | undefined>(() => {
  const query = search.value.toLowerCase()
  const page = pages.value.find((link: SidebarLink) => link.text.toLowerCase().startsWith(query))

  return page && { id: 'quick-action', type: 'jump', url: page.link, name: page.text }
})

const results = computed<Item[] | null>(() => {
  if (!index.value) return null
  const groups = new Map<string, Item[]>()
  for (const hit of index.value.search(search.value).slice(0, MAX_SECTIONS)) {
    const section = hit as unknown as Section & { id: string }
    const [path, anchor = ''] = section.id.split('#')
    const pagePath = normalizePath(path)
    let group = groups.get(pagePath)
    if (!group) {
      const name = pageByPath.value.get(pagePath)?.text ?? section.titles[0] ?? section.title
      group = [{ id: `page-${pagePath}`, type: 'page', url: path, html: renderInline(name) }]
      groups.set(pagePath, group)
    }

    const url = anchor ? `${path}#${anchor}` : path
    if (anchor && matches(section.title))
      group.push({
        id: `heading-${section.id}`,
        type: 'heading',
        url,
        html: renderInline(section.title),
      })

    // `text` is stored by the docs config (`storeFields`); an index without it shows no excerpts.
    const lines = (section.text ?? '').split('\n')
    lines
      .map((line) => line.trim())
      .filter((line) => line && matches(line))
      .slice(0, MAX_TEXTS_PER_SECTION)
      .forEach((line, i) =>
        group.push({ id: `text-${section.id}-${i}`, type: 'text', url, html: renderInline(line) }),
      )
  }

  return [...groups.values()].flat()
})

const items = computed<Item[] | null>(() => {
  if (!search.value) return suggestions.value
  if (!results.value) return null

  return jump.value ? [jump.value, ...results.value] : results.value
})

/* Active item and keyboard navigation (fumadocs' SearchDialogList) */
const active = ref<string | null>(null)
watch(
  items,
  (list) => {
    active.value = list?.[0]?.id ?? null
  },
  { immediate: true },
)

const select = (item: Item) => {
  open.value = false
  router.go(item.url)
}

const onKeydown = (e: KeyboardEvent) => {
  const list = items.value
  if (!open.value || !list || e.isComposing) return

  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    const current = list.findIndex((item) => item.id === active.value)
    const step = e.key === 'ArrowDown' ? 1 : -1
    const idx = current === -1 ? 0 : current + step

    active.value = list.at(idx % list.length)?.id ?? null
    e.preventDefault()

    nextTick(() =>
      listEl.value?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }),
    )
  }

  if (e.key === 'Enter') {
    const selected = list.find((item) => item.id === active.value)
    if (selected) select(selected)
    e.preventDefault()
  }
}

// The window listener is client-only: the watch is not immediate (it would run during SSR),
// and onMounted covers a dialog that mounts already open.
const listenKeys = (isOpen: boolean) => {
  if (!isOpen) {
    window.removeEventListener('keydown', onKeydown)
    return
  }

  window.addEventListener('keydown', onKeydown)
}

watch(open, listenKeys)
onMounted(() => listenKeys(open.value))

/* The list animates its height to the content's (fumadocs' --fd-animated-height). */
const listEl = useTemplateRef<HTMLElement>('list')
const animatedHeight = ref<number>()
let resizeObserver: ResizeObserver | undefined
watch(listEl, (el) => {
  resizeObserver?.disconnect()
  const viewport = el?.firstElementChild
  if (!viewport) return
  resizeObserver = new ResizeObserver(() => (animatedHeight.value = viewport.clientHeight))
  resizeObserver.observe(viewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  resizeObserver?.disconnect()
})

const ITEM_CLASS =
  'relative select-none shrink-0 px-2.5 py-2 text-start text-sm overflow-hidden rounded-lg'
</script>
