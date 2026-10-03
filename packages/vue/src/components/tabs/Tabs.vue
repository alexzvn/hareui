<script lang="ts">
import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import theme from './theme'

type Tabs = typeof theme

export interface TabsItem {
  /** The tab's label, shown in the trigger unless `#tab` is used. */
  label?: string
  /** The value identifying this tab. Defaults to the item's index (as a string). */
  value?: string | number
  /** Whether this tab is disabled. */
  disabled?: boolean
  /** Name of a dynamic slot to render this item's panel content, taking precedence over `#content`. */
  slot?: string
  /** Fallback panel text, used when no `#content`/`[item.slot]` slot is provided. */
  content?: string
}

export interface TabsProps<T extends TabsItem = TabsItem> {
  /** The tabs to render. */
  items: T[]
  /** The selected tab value. Use `v-model` to control it. */
  modelValue?: string | number
  /**
   * The value of the tab selected by default (uncontrolled).
   * @defaultValue the first enabled item's value
   */
  defaultValue?: string | number
  /**
   * Layout direction of the tab list.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<Tabs>['orientation']
  /**
   * Visual style of the tabs.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<Tabs>['variant']
  /**
   * Alignment of the tab labels.
   * @defaultValue 'center'
   */
  align?: ComponentVariants<Tabs>['align']
  /**
   * Whether to render a panel for every item.
   * @defaultValue true
   */
  content?: boolean
  /**
   * Whether to render a separator between tabs. HeroUI separators are opt-in
   * via `<Tabs.Separator/>`.
   * @defaultValue false
   */
  separator?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Tabs>
}

export interface TabsSlots<T extends TabsItem = TabsItem> {
  /** Replaces a tab's label. */
  tab?: (props: { item: T, index: number, selected: boolean }) => any
  /** Fallback panel content for every item, overridden by `[item.slot]`. */
  content?: (props: { item: T, index: number }) => any
  /** Panel content of the items whose `slot` names it. */
  [slot: string]: ((props: { item: T, index: number, selected: boolean }) => any) | ((props: { item: T, index: number }) => any) | undefined
}
</script>

<script setup lang="ts" generic="T extends TabsItem = TabsItem">
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import ScrollShadow from '../scroll-shadow/ScrollShadow.vue'
import type { ScrollShadowVisibility } from '../scroll-shadow/ScrollShadow.vue'

const props = withDefaults(defineProps<TabsProps<T>>(), {
  orientation: 'horizontal',
  content: true,
  separator: false,
})
const modelValue = defineModel<string | number>()
defineSlots<TabsSlots<T>>()

const ui = useComponentUI('tabs', theme, () => ({
  variant: props.variant,
  align: props.align,
  orientation: props.orientation,
}))

function itemValue(item: TabsItem, index: number): string | number {
  return item.value ?? String(index)
}

// RAC's useTabListState falls back to the first enabled tab, so a disabled first tab is never
// selected (and the roving tab stop never lands on a disabled tab).
const defaultValue = computed(() => {
  if (props.defaultValue !== undefined)
    return props.defaultValue
  const index = props.items.findIndex(item => !item.disabled)
  return index === -1 ? (props.items[0]?.value ?? '0') : itemValue(props.items[index]!, index)
})

const selectedValue = computed(() => modelValue.value ?? defaultValue.value)

// The one tab in the Tab order: the selected tab, or the first enabled one when that is disabled.
const tabStopValue = computed(() => {
  const selected = props.items.findIndex((item, index) => itemValue(item, index) === selectedValue.value)
  const index = selected !== -1 && !props.items[selected]!.disabled ? selected : props.items.findIndex(item => !item.disabled)
  return index === -1 ? undefined : itemValue(props.items[index]!, index)
})

// React Aria's TabPanel unmounts every panel except the selected one; Reka's TabsContent
// always keeps the wrapper element (toggling `hidden` only), so only render the selected
// panel ourselves to match data-slot presence 1:1.
const visiblePanel = computed(() => {
  if (!props.content)
    return null
  const index = props.items.findIndex((item, i) => itemValue(item, i) === selectedValue.value)
  return index === -1 ? null : { item: props.items[index]!, index }
})

function isSeparatorHidden(index: number): boolean {
  const current = itemValue(props.items[index]!, index)
  if (current === selectedValue.value)
    return true
  if (index === 0)
    return false
  const previous = itemValue(props.items[index - 1]!, index - 1)
  return previous === selectedValue.value
}

// HeroUI renders the SelectionIndicator inside the selected tab, so in document order it sits
// right after that tab. We keep one persistent indicator (so it slides instead of being
// recreated) and move *it* next to the selected tab. Letting Vue's keyed diff reorder an
// interleaved list instead could move the focused tab node, which drops keyboard focus.
const indicatorRef = ref<HTMLElement | null>(null)

// Reka's roving focus maps PageUp/PageDown to the first/last tab; RAC's tab list ignores them.
function onListKeydown(event: KeyboardEvent) {
  if (event.key === 'PageUp' || event.key === 'PageDown')
    event.stopPropagation()
}

function placeIndicator() {
  const indicator = indicatorRef.value
  const activeTab = listRef.value?.$el?.querySelector?.('[data-slot="tabs-tab"][data-state="active"]')
  if (indicator && activeTab && activeTab.nextElementSibling !== indicator)
    activeTab.after(indicator)
}

// Reka's own TabsIndicator measures the active tab via integer offsetWidth/offsetLeft,
// which doesn't line up pixel-for-pixel with HeroUI's indicator (React Aria's
// SelectionIndicator, which uses getBoundingClientRect). We track geometry ourselves —
// from the active trigger's bounding box relative to the list — so the indicator fills
// the exact same box React renders (HeroUI's indicator is `size-full` of its own tab).
const listRef = ref<{ $el: HTMLElement } | null>(null)
const indicatorGeometry = ref<Record<string, string>>({})
// React Aria's SelectionIndicator only transitions when a *previous* instance existed to
// FLIP from; a brand-new indicator (first mount, no prior snapshot) just appears at its
// final geometry. Our indicator starts with no geometry vars (collapsed to 0×0 at the
// list's origin) until the first measurement, so without this guard it would visibly
// animate from that collapsed state into place on mount. Suppress the transition until
// the first real measurement has painted, then let it animate normally on later changes.
const indicatorReady = ref(false)
const indicatorStyle = computed(() => indicatorReady.value ? indicatorGeometry.value : { ...indicatorGeometry.value, transition: 'none' })
let resizeObserver: ResizeObserver | null = null

function measureIndicator() {
  const listEl = listRef.value?.$el
  if (!listEl)
    return
  const activeTab = listEl.querySelector<HTMLElement>('[data-slot="tabs-tab"][data-state="active"]')
  if (!activeTab) {
    indicatorGeometry.value = {}
    return
  }
  const listRect = listEl.getBoundingClientRect()
  const tabRect = activeTab.getBoundingClientRect()
  indicatorGeometry.value = {
    '--tabs-indicator-x': `${tabRect.left - listRect.left}px`,
    '--tabs-indicator-y': `${tabRect.top - listRect.top}px`,
    '--tabs-indicator-width': `${tabRect.width}px`,
    '--tabs-indicator-height': `${tabRect.height}px`,
  }
}

// HeroUI's Tabs.ListContainer wraps the list in a ScrollShadow (size 64, scrollbar hidden) and
// shows prev/next chevrons while there's hidden content on that side.
const scrollerRef = ref<InstanceType<typeof ScrollShadow> | null>(null)
const scrollState = ref({ before: false, after: false })

function onScrollVisibility(visibility: ScrollShadowVisibility) {
  scrollState.value = {
    before: visibility === 'both' || visibility === 'left' || visibility === 'top',
    after: visibility === 'both' || visibility === 'right' || visibility === 'bottom',
  }
}

// Scrolls 80% of the visible size towards `direction`, clamped to the scroll range (RTL-aware).
function scrollByPage(direction: 1 | -1) {
  const el = scrollerRef.value?.el
  if (!el)
    return
  const vertical = props.orientation === 'vertical'
  const size = vertical ? el.clientHeight : el.clientWidth
  const maxScroll = Math.max(0, (vertical ? el.scrollHeight : el.scrollWidth) - size)
  const rtl = !vertical && getComputedStyle(el).direction === 'rtl'
  const current = vertical ? el.scrollTop : el.scrollLeft
  const next = Math.min(rtl ? 0 : maxScroll, Math.max(rtl ? -maxScroll : 0, current + direction * size * 0.8 * (rtl ? -1 : 1)))
  if (next !== current)
    el.scrollTo({ behavior: 'smooth', [vertical ? 'top' : 'left']: next })
}

function observeGeometry() {
  const listEl = listRef.value?.$el
  resizeObserver?.disconnect()
  if (!listEl)
    return
  resizeObserver = new ResizeObserver(() => measureIndicator())
  resizeObserver.observe(listEl)
  listEl.querySelectorAll('[data-slot="tabs-tab"]').forEach(el => resizeObserver!.observe(el))
}

onMounted(() => {
  placeIndicator()
  observeGeometry()
  measureIndicator()
  requestAnimationFrame(() => { indicatorReady.value = true })
  window.addEventListener('resize', measureIndicator)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', measureIndicator)
})

// RAC's useTabPanel makes the panel a tab stop only while it has no tabbable child; Reka's
// TabsContent hardcodes `tabindex="0"`. Vue never re-patches that static attribute, so it is
// toggled on the element directly and kept in sync with the panel's content.
const PANEL_TABBABLE = 'a[href],area[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),iframe,[contenteditable]:not([contenteditable=false]),[tabindex]:not([tabindex^="-"])'
const panelRef = ref<{ $el: HTMLElement } | null>(null)
let panelObserver: MutationObserver | null = null

function syncPanelTabStop() {
  const panel = panelRef.value?.$el
  if (!(panel instanceof HTMLElement))
    return
  const tabbable = panel.querySelector(PANEL_TABBABLE) !== null
  if (tabbable && panel.hasAttribute('tabindex'))
    panel.removeAttribute('tabindex')
  else if (!tabbable && panel.getAttribute('tabindex') !== '0')
    panel.setAttribute('tabindex', '0')
}

watch(() => panelRef.value?.$el as HTMLElement | undefined, (panel) => {
  panelObserver?.disconnect()
  panelObserver = null
  if (!(panel instanceof HTMLElement))
    return
  syncPanelTabStop()
  if (typeof MutationObserver !== 'undefined') {
    panelObserver = new MutationObserver(syncPanelTabStop)
    panelObserver.observe(panel, { subtree: true, childList: true, attributes: true, attributeFilter: ['tabindex', 'disabled', 'href', 'contenteditable'] })
  }
}, { flush: 'sync' })

onBeforeUnmount(() => panelObserver?.disconnect())

watch([selectedValue, () => props.items, () => props.orientation], async () => {
  await nextTick()
  // Move before measuring: the measurement flushes styles, so the indicator transitions from its old geometry.
  placeIndicator()
  observeGeometry()
  measureIndicator()
}, { deep: true })
</script>

<template>
  <TabsRoot
    v-model="modelValue"
    :default-value="defaultValue"
    :orientation="orientation"
    activation-mode="automatic"
    data-slot="tabs"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <div :class="ui.tabListContainer({ class: props.ui?.tabListContainer })" data-slot="tabs-list-container">
      <ScrollShadow
        ref="scrollerRef"
        hide-scroll-bar
        :class="ui.scroller({ class: props.ui?.scroller })"
        :orientation="orientation"
        :size="64"
        @visibility-change="onScrollVisibility"
      >
        <!-- `as-child` on the list and the tabs so our attributes win over Reka's. RAC's tablist is not
             focusable itself (Reka's roving root has `tabindex="0"`, and clicking a disabled tab would
             focus it), and RAC keeps the selected tab as the single tab stop, where Reka's roving group
             leaves every tab at -1 until one has been focused. -->
        <TabsList ref="listRef" as-child>
          <div :class="ui.tabList({ class: props.ui?.tabList })" :tabindex="undefined" data-slot="tabs-list" @keydown.capture="onListKeydown">
            <TabsTrigger
              v-for="(item, index) in items"
              :key="itemValue(item, index)"
              :value="itemValue(item, index)"
              :disabled="item.disabled"
              as-child
            >
              <button
                type="button"
                :tabindex="itemValue(item, index) === tabStopValue ? 0 : -1"
                :class="ui.tab({ class: props.ui?.tab })"
                data-slot="tabs-tab"
              >
                <span
                  v-if="separator"
                  aria-hidden="true"
                  :data-orientation="orientation"
                  :class="ui.separator({ class: [props.ui?.separator, isSeparatorHidden(index) ? 'opacity-0' : undefined] })"
                  data-slot="tabs-separator"
                />
                <slot name="tab" :item="item" :index="index" :selected="itemValue(item, index) === selectedValue">
                  {{ item.label }}
                </slot>
              </button>
            </TabsTrigger>
            <div
              v-if="items.some((item, index) => itemValue(item, index) === selectedValue)"
              ref="indicatorRef"
              aria-hidden="true"
              :style="indicatorStyle"
              :class="ui.tabIndicator({ class: props.ui?.tabIndicator })"
              data-slot="tabs-indicator"
            />
          </div>
        </TabsList>
      </ScrollShadow>
      <button
        :aria-label="orientation === 'vertical' ? 'Scroll tabs up' : 'Scroll tabs left'"
        :class="ui.scrollPrev({ class: [props.ui?.scrollPrev, scrollState.before ? 'inline-flex' : undefined] })"
        tabindex="-1"
        type="button"
        @click="scrollByPage(-1)"
      >
        <svg aria-hidden="true" fill="none" height="16" role="presentation" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
          <path v-if="orientation === 'vertical'" clip-rule="evenodd" d="M13.03 10.53a.75.75 0 0 1-1.06 0L8 6.56l-3.97 3.97a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06" fill="currentColor" fill-rule="evenodd" />
          <path v-else clip-rule="evenodd" d="M10.53 2.97a.75.75 0 0 1 0 1.06L6.56 8l3.97 3.97a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0" fill="currentColor" fill-rule="evenodd" />
        </svg>
      </button>
      <button
        :aria-label="orientation === 'vertical' ? 'Scroll tabs down' : 'Scroll tabs right'"
        :class="ui.scrollNext({ class: [props.ui?.scrollNext, scrollState.after ? 'inline-flex' : undefined] })"
        tabindex="-1"
        type="button"
        @click="scrollByPage(1)"
      >
        <svg aria-hidden="true" fill="none" height="16" role="presentation" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
          <path v-if="orientation === 'vertical'" clip-rule="evenodd" d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06" fill="currentColor" fill-rule="evenodd" />
          <path v-else clip-rule="evenodd" d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z" fill="currentColor" fill-rule="evenodd" />
        </svg>
      </button>
    </div>
    <TabsContent
      v-if="visiblePanel"
      ref="panelRef"
      :key="itemValue(visiblePanel.item, visiblePanel.index)"
      :value="itemValue(visiblePanel.item, visiblePanel.index)"
      :class="ui.tabPanel({ class: props.ui?.tabPanel })"
      data-slot="tabs-panel"
    >
      <slot :name="(visiblePanel.item.slot || 'content') as 'content'" :item="visiblePanel.item" :index="visiblePanel.index">
        {{ visiblePanel.item.content }}
      </slot>
    </TabsContent>
  </TabsRoot>
</template>
