<template>
  <nav
    aria-label="pagination"
    data-slot="pagination"
    role="navigation"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <div
      v-if="$slots.summary"
      data-slot="pagination-summary"
      dir="auto"
      :class="ui.summary({ class: props.ui?.summary })"
    >
      <slot name="summary" :page="current" :total="total" />
    </div>
    <ul data-slot="pagination-content" :class="ui.content({ class: props.ui?.content })">
      <li data-slot="pagination-item" :class="ui.item({ class: props.ui?.item })">
        <button
          type="button"
          data-slot="pagination-previous"
          :aria-label="prevLabel ? undefined : 'Previous page'"
          :disabled="isPrevDisabled || undefined"
          :data-disabled="isPrevDisabled ? 'true' : undefined"
          :class="navClass"
          @click="go(current - 1)"
        >
          <span
            aria-hidden="true"
            data-slot="pagination-previous-icon"
            :class="ui.icon({ class: props.ui?.icon })"
          >
            <slot name="prevIcon">
              <svg
                aria-hidden="true"
                fill="none"
                height="16"
                role="presentation"
                viewBox="0 0 16 16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M10.53 2.97a.75.75 0 0 1 0 1.06L6.56 8l3.97 3.97a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0"
                  fill="currentColor"
                  fill-rule="evenodd"
                />
              </svg>
            </slot>
          </span>
          <span v-if="prevLabel">{{ prevLabel }}</span>
        </button>
      </li>
      <template v-if="!hidePages">
        <li
          v-for="(entry, index) in entries"
          :key="entry === 'ellipsis' ? `ellipsis-${index}` : entry"
          data-slot="pagination-item"
          :class="ui.item({ class: props.ui?.item })"
        >
          <span
            v-if="entry === 'ellipsis'"
            aria-hidden="true"
            data-slot="pagination-ellipsis"
            :class="ui.ellipsis({ class: props.ui?.ellipsis })"
            >&hellip;</span
          >
          <button
            v-else
            type="button"
            data-slot="pagination-link"
            :aria-current="entry === current ? 'page' : undefined"
            :data-active="entry === current ? 'true' : undefined"
            :disabled="disabled || undefined"
            :class="linkClass"
            @click="go(entry)"
          >
            <slot name="link" :page="entry" :active="entry === current">
              {{ entry }}
            </slot>
          </button>
        </li>
      </template>
      <li data-slot="pagination-item" :class="ui.item({ class: props.ui?.item })">
        <button
          type="button"
          data-slot="pagination-next"
          :aria-label="nextLabel ? undefined : 'Next page'"
          :disabled="isNextDisabled || undefined"
          :data-disabled="isNextDisabled ? 'true' : undefined"
          :class="navClass"
          @click="go(current + 1)"
        >
          <span v-if="nextLabel">{{ nextLabel }}</span>
          <span
            aria-hidden="true"
            data-slot="pagination-next-icon"
            :class="ui.icon({ class: props.ui?.icon })"
          >
            <slot name="nextIcon">
              <svg
                aria-hidden="true"
                fill="none"
                height="16"
                role="presentation"
                viewBox="0 0 16 16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                />
              </svg>
            </slot>
          </span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import type { ComponentSlots, ComponentVariants } from '@/types/tv'

import theme from './theme'

type Pagination = typeof theme

export type PaginationEntry = number | 'ellipsis'

export interface PaginationProps {
  /** The current page (1-based). Use `v-model:page` to control it. */
  page?: number
  /**
   * The page shown on first render (uncontrolled).
   * @defaultValue 1
   */
  defaultPage?: number
  /** The total number of pages. */
  total: number
  /**
   * Collapse distant pages into ellipses: the first and last page, the current page and its
   * neighbours (HeroUI's demo pattern). Ignored when `pages` is set.
   * @defaultValue false
   */
  ellipsis?: boolean
  /** The exact page entries to render, overriding the built-in list. */
  pages?: PaginationEntry[]
  /**
   * Render only the previous / next buttons, without page links.
   * @defaultValue false
   */
  hidePages?: boolean
  /**
   * The previous button's label. An empty string renders only the icon.
   * @defaultValue 'Previous'
   */
  prevLabel?: string
  /**
   * The next button's label. An empty string renders only the icon.
   * @defaultValue 'Next'
   */
  nextLabel?: string
  /** Disable the previous button. Defaults to being on the first page. */
  prevDisabled?: boolean
  /** Disable the next button. Defaults to being on the last page. */
  nextDisabled?: boolean
  /**
   * Disable every button.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * The size of the pagination items.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Pagination>['size']
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. `link` applies to page links and previous / next buttons. */
  ui?: ComponentSlots<Pagination>
}

export interface PaginationSlots {
  /** Info shown before the links (HeroUI's `Pagination.Summary`). */
  summary?: (props: { page: number; total: number }) => any
  /** Replaces a page link's number. */
  link?: (props: { page: number; active: boolean }) => any
  /** Replaces the previous icon (HeroUI's `Pagination.PreviousIcon` children). */
  prevIcon?: () => any
  /** Replaces the next icon (HeroUI's `Pagination.NextIcon` children). */
  nextIcon?: () => any
}

export interface PaginationEmits {
  /** Emitted when the page changes. */
  'update:page': [page: number]
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

// `page`/`prevDisabled`/`nextDisabled: undefined` keep the derived defaults when unbound.
const props = withDefaults(defineProps<PaginationProps>(), {
  page: undefined,
  defaultPage: 1,
  prevLabel: 'Previous',
  nextLabel: 'Next',
  prevDisabled: undefined,
  nextDisabled: undefined,
})
const emit = defineEmits<PaginationEmits>()
defineSlots<PaginationSlots>()

const ui = useComponentUI('pagination', theme, () => ({ size: props.size }))

const uncontrolled = ref(props.defaultPage)
const current = computed(() => props.page ?? uncontrolled.value)
function go(page: number) {
  if (props.disabled || page < 1 || page > props.total || page === current.value) return
  uncontrolled.value = page
  emit('update:page', page)
}

const entries = computed<PaginationEntry[]>(() => {
  if (props.pages) return props.pages
  const all = Array.from({ length: props.total }, (_, i) => i + 1)
  if (!props.ellipsis || props.total <= 1) return all
  const page = current.value
  const list: PaginationEntry[] = [1]
  if (page > 3) list.push('ellipsis')
  for (let i = Math.max(2, page - 1); i <= Math.min(props.total - 1, page + 1); i++) list.push(i)
  if (page < props.total - 2) list.push('ellipsis')
  list.push(props.total)
  return list
})

const isPrevDisabled = computed(() => props.disabled || (props.prevDisabled ?? current.value <= 1))
const isNextDisabled = computed(
  () => props.disabled || (props.nextDisabled ?? current.value >= props.total),
)

const linkClass = computed(() => ui.value.link({ class: props.ui?.link }))
const navClass = computed(() =>
  ui.value.link({ class: [ui.value.nav(), props.ui?.link, props.ui?.nav] }),
)
</script>
