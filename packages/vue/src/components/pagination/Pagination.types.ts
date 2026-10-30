import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Pagination = typeof theme

/** One entry of the pagination list: a page number, or `'ellipsis'` for a gap of skipped pages. */
export type PaginationEntry = number | 'ellipsis'

/** Options of the previous or next button. */
export type PaginationNavButton = {
  /** The button's label (`'Previous'` / `'Next'` by default). An empty string renders only the icon. */
  label?: string
  /** Disable the button. Defaults to being on the first page (previous) or the last page (next). */
  disabled?: boolean
}

/** Props of the `Pagination` component. */
export type PaginationProps = {
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
   * neighbours. Ignored when `pages` is set.
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
   * The previous button.
   * @defaultValue { label: 'Previous' }
   */
  prev?: PaginationNavButton
  /**
   * The next button.
   * @defaultValue { label: 'Next' }
   */
  next?: PaginationNavButton
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
  class?: ClassValue
  /** Per-slot class overrides. `link` applies to page links and previous / next buttons. */
  ui?: ComponentSlots<Pagination>
}

/** Slots of the `Pagination` component. */
export type PaginationSlots = {
  /** Info shown before the links. */
  summary?: (props: { page: number; total: number }) => VNode[]
  /** Replaces a page link's number. */
  link?: (props: { page: number; active: boolean }) => VNode[]
  /** Replaces the previous icon. */
  prevIcon?: () => VNode[]
  /** Replaces the next icon. */
  nextIcon?: () => VNode[]
}

/** Events emitted by the `Pagination` component. */
export type PaginationEmits = {
  /** Emitted when the page changes. */
  'update:page': [page: number]
}
