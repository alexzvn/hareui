<template>
  <TabsRoot
    v-model="modelValue"
    :default-value="defaultValue"
    :orientation="orientation"
    activation-mode="automatic"
    data-slot="tabs"
    :class="ui.base()"
  >
    <div :class="ui.tabListContainer()" data-slot="tabs-list-container">
      <ScrollShadow
        ref="scrollerRef"
        hide-scroll-bar
        :class="ui.scroller()"
        :orientation="orientation"
        :size="64"
        @visibility-change="onScrollVisibility"
      >
        <!-- `as-child` on the list and the tabs so our attributes win over Reka's. RAC's tablist is not
             focusable itself (Reka's roving root has `tabindex="0"`, and clicking a disabled tab would
             focus it), and RAC keeps the selected tab as the single tab stop, where Reka's roving group
             leaves every tab at -1 until one has been focused. -->
        <TabsList ref="listRef" as-child>
          <div
            :class="ui.tabList()"
            :tabindex="undefined"
            data-slot="tabs-list"
            @keydown.capture="onListKeydown"
          >
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
                :class="ui.tab()"
                data-slot="tabs-tab"
              >
                <span
                  v-if="separator"
                  aria-hidden="true"
                  :data-orientation="orientation"
                  :class="
                    ui.separator({ override: isSeparatorHidden(index) ? 'opacity-0' : undefined })
                  "
                  data-slot="tabs-separator"
                />
                <IconRenderer
                  v-if="item.icon"
                  :icon="item.icon"
                  :class="ui.tabIcon()"
                  data-slot="tabs-tab-icon"
                />
                <slot
                  name="tab"
                  :item="item"
                  :index="index"
                  :selected="itemValue(item, index) === selectedValue"
                >
                  {{ item.label }}
                </slot>
              </button>
            </TabsTrigger>
            <div
              v-if="items.some((item, index) => itemValue(item, index) === selectedValue)"
              ref="indicatorRef"
              aria-hidden="true"
              :style="indicatorStyle"
              :class="ui.tabIndicator()"
              data-slot="tabs-indicator"
            />
          </div>
        </TabsList>
      </ScrollShadow>
      <button
        :aria-label="orientation === 'vertical' ? t('tabs.scrollUp') : t('tabs.scrollLeft')"
        :class="ui.scrollPrev({ override: scrollState.before ? 'inline-flex' : undefined })"
        tabindex="-1"
        type="button"
        @click="scrollByPage(-1)"
      >
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
            v-if="orientation === 'vertical'"
            clip-rule="evenodd"
            d="M13.03 10.53a.75.75 0 0 1-1.06 0L8 6.56l-3.97 3.97a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06"
            fill="currentColor"
            fill-rule="evenodd"
          />
          <path
            v-else
            clip-rule="evenodd"
            d="M10.53 2.97a.75.75 0 0 1 0 1.06L6.56 8l3.97 3.97a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0"
            fill="currentColor"
            fill-rule="evenodd"
          />
        </svg>
      </button>
      <button
        :aria-label="orientation === 'vertical' ? t('tabs.scrollDown') : t('tabs.scrollRight')"
        :class="ui.scrollNext({ override: scrollState.after ? 'inline-flex' : undefined })"
        tabindex="-1"
        type="button"
        @click="scrollByPage(1)"
      >
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
            v-if="orientation === 'vertical'"
            clip-rule="evenodd"
            d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06"
            fill="currentColor"
            fill-rule="evenodd"
          />
          <path
            v-else
            clip-rule="evenodd"
            d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z"
            fill="currentColor"
            fill-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    <TabsContent
      v-if="visiblePanel"
      ref="panelRef"
      :key="itemValue(visiblePanel.item, visiblePanel.index)"
      :value="itemValue(visiblePanel.item, visiblePanel.index)"
      :class="ui.tabPanel()"
      data-slot="tabs-panel"
    >
      <slot
        :name="(visiblePanel.item.slot || 'content') as 'content'"
        :item="visiblePanel.item"
        :index="visiblePanel.index"
      >
        {{ visiblePanel.item.content }}
      </slot>
    </TabsContent>
  </TabsRoot>
</template>

<script setup lang="ts" generic="T extends TabsItem = TabsItem">
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'

import type { ScrollShadowVisibility } from '@/components/scroll-shadow/ScrollShadow.types'
import ScrollShadow from '@/components/scroll-shadow/ScrollShadow.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'
import { IconRenderer } from '@/utils/icon'

import type { TabsItem, TabsProps, TabsSlots } from './Tabs.types'
import theme from './theme'

const { t } = useLocale()

const props = withDefaults(defineProps<TabsProps<T>>(), {
  orientation: 'horizontal',
  content: true,
  separator: false,
})

const modelValue = defineModel<string | number>()
defineSlots<TabsSlots<T>>()

const ui = useComponentUI('tabs', {
  theme,
  variantProps: () => ({
    variant: props.variant,
    align: props.align,
    orientation: props.orientation,
  }),
  props,
})

const itemValue = (item: TabsItem, index: number): string | number => {
  return item.value ?? String(index)
}

// RAC's useTabListState falls back to the first enabled tab, so a disabled first tab is never
// selected (and the roving tab stop never lands on a disabled tab).
const defaultValue = computed(() => {
  if (props.defaultValue !== undefined) return props.defaultValue

  const index = props.items.findIndex((item) => !item.disabled)

  return index === -1 ? (props.items[0]?.value ?? '0') : itemValue(props.items[index]!, index)
})

const selectedValue = computed(() => modelValue.value ?? defaultValue.value)

// The one tab in the Tab order: the selected tab, or the first enabled one when that is disabled.
const tabStopValue = computed(() => {
  const selected = props.items.findIndex(
    (item, index) => itemValue(item, index) === selectedValue.value,
  )

  const isSelectedEnabled = selected !== -1 && !props.items[selected]!.disabled
  const index = isSelectedEnabled ? selected : props.items.findIndex((item) => !item.disabled)

  return index === -1 ? undefined : itemValue(props.items[index]!, index)
})

// React Aria's TabPanel unmounts every panel except the selected one; Reka's TabsContent
// always keeps the wrapper element (toggling `hidden` only), so only render the selected
// panel ourselves to match data-slot presence 1:1.
const visiblePanel = computed(() => {
  if (!props.content) return null

  const index = props.items.findIndex((item, i) => itemValue(item, i) === selectedValue.value)

  return index === -1 ? null : { item: props.items[index]!, index }
})

const isSeparatorHidden = (index: number): boolean => {
  const current = itemValue(props.items[index]!, index)
  if (current === selectedValue.value) return true
  if (index === 0) return false

  const previous = itemValue(props.items[index - 1]!, index - 1)

  return previous === selectedValue.value
}

// HeroUI renders the SelectionIndicator inside the selected tab, so in document order it sits
// right after that tab. We keep one persistent indicator (so it slides instead of being
// recreated) and move *it* next to the selected tab. Letting Vue's keyed diff reorder an
// interleaved list instead could move the focused tab node, which drops keyboard focus.
const indicatorRef = useTemplateRef<HTMLElement>('indicatorRef')

// Reka's roving focus maps PageUp/PageDown to the first/last tab; RAC's tab list ignores them.
// RAC's TabsKeyboardDelegate also moves with ArrowLeft/ArrowRight (flipped in RTL) in a vertical
// list, where Reka only reacts to ArrowUp/ArrowDown; focusing the tab selects it (automatic activation).
const onListKeydown = (event: KeyboardEvent) => {
  if (event.key === 'PageUp' || event.key === 'PageDown') {
    event.stopPropagation()
    return
  }

  const isSideArrow = event.key === 'ArrowLeft' || event.key === 'ArrowRight'
  if (props.orientation !== 'vertical' || !isSideArrow) return

  const list = event.currentTarget as HTMLElement
  const tabs = [...list.querySelectorAll<HTMLElement>('[data-slot="tabs-tab"]:not([disabled])')]
  const index = tabs.indexOf(document.activeElement as HTMLElement)
  if (index === -1) return

  event.preventDefault()
  event.stopPropagation()

  const isRtl = list.closest('[dir]')?.getAttribute('dir') === 'rtl'
  const step = (event.key === 'ArrowRight') !== isRtl ? 1 : -1
  const nextIndex = (index + step + tabs.length) % tabs.length
  tabs[nextIndex]!.focus()
}

const placeIndicator = () => {
  const indicator = indicatorRef.value

  const activeTab = listRef.value?.$el?.querySelector?.(
    '[data-slot="tabs-tab"][data-state="active"]',
  )

  if (indicator && activeTab && activeTab.nextElementSibling !== indicator)
    activeTab.after(indicator)
}

// Reka's own TabsIndicator measures the active tab via integer offsetWidth/offsetLeft,
// which doesn't line up pixel-for-pixel with HeroUI's indicator (React Aria's
// SelectionIndicator, which uses getBoundingClientRect). We track geometry ourselves —
// from the active trigger's bounding box relative to the list — so the indicator fills
// the exact same box React renders (HeroUI's indicator is `size-full` of its own tab).
const listRef = useTemplateRef<{ $el: HTMLElement }>('listRef')
const indicatorGeometry = ref<Record<string, string>>({})

// React Aria's SelectionIndicator only transitions when a *previous* instance existed to
// FLIP from; a brand-new indicator (first mount, no prior snapshot) just appears at its
// final geometry. Our indicator starts with no geometry vars (collapsed to 0×0 at the
// list's origin) until the first measurement, so without this guard it would visibly
// animate from that collapsed state into place on mount. Suppress the transition until
// the first real measurement has painted, then let it animate normally on later changes.
const isIndicatorReady = ref(false)
const indicatorStyle = computed(() =>
  isIndicatorReady.value
    ? indicatorGeometry.value
    : { ...indicatorGeometry.value, transition: 'none' },
)

let resizeObserver: ResizeObserver | null = null

const measureIndicator = () => {
  const listEl = listRef.value?.$el
  if (!listEl) return

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
const scrollerRef = useTemplateRef<InstanceType<typeof ScrollShadow>>('scrollerRef')
const scrollState = ref({ before: false, after: false })

const onScrollVisibility = (visibility: ScrollShadowVisibility) => {
  scrollState.value = {
    before: visibility === 'both' || visibility === 'left' || visibility === 'top',
    after: visibility === 'both' || visibility === 'right' || visibility === 'bottom',
  }
}

// Scrolls 80% of the visible size towards `direction`, clamped to the scroll range (RTL-aware).
const scrollByPage = (direction: 1 | -1) => {
  const el = scrollerRef.value?.el
  if (!el) return

  const isVertical = props.orientation === 'vertical'
  const size = isVertical ? el.clientHeight : el.clientWidth
  const scrollSize = isVertical ? el.scrollHeight : el.scrollWidth
  const maxScroll = Math.max(0, scrollSize - size)
  const current = isVertical ? el.scrollTop : el.scrollLeft

  // An RTL scroll offset runs from 0 (start) down to -maxScroll, so the step is flipped too
  const isRtl = !isVertical && getComputedStyle(el).direction === 'rtl'
  const min = isRtl ? -maxScroll : 0
  const max = isRtl ? 0 : maxScroll
  const step = direction * size * 0.8 * (isRtl ? -1 : 1)
  const next = Math.min(max, Math.max(min, current + step))

  if (next !== current) el.scrollTo({ behavior: 'smooth', [isVertical ? 'top' : 'left']: next })
}

const observeGeometry = () => {
  const listEl = listRef.value?.$el
  resizeObserver?.disconnect()
  if (!listEl) return

  const observer = new ResizeObserver(() => measureIndicator())
  resizeObserver = observer
  observer.observe(listEl)
  listEl.querySelectorAll('[data-slot="tabs-tab"]').forEach((el) => observer.observe(el))
}

onMounted(() => {
  placeIndicator()
  observeGeometry()
  measureIndicator()

  requestAnimationFrame(() => {
    isIndicatorReady.value = true
  })

  window.addEventListener('resize', measureIndicator)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', measureIndicator)
})

// RAC's useTabPanel makes the panel a tab stop only while it has no tabbable child; Reka's
// TabsContent hardcodes `tabindex="0"`. Vue never re-patches that static attribute, so it is
// toggled on the element directly and kept in sync with the panel's content.
const PANEL_TABBABLE =
  'a[href],area[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),iframe,[contenteditable]:not([contenteditable=false]),[tabindex]:not([tabindex^="-"])'

const panelRef = useTemplateRef<{ $el: HTMLElement }>('panelRef')
let panelObserver: MutationObserver | null = null

const syncPanelTabStop = () => {
  const panel = panelRef.value?.$el
  if (!(panel instanceof HTMLElement)) return

  const hasTabbableChild = panel.querySelector(PANEL_TABBABLE) !== null
  if (hasTabbableChild) {
    if (panel.hasAttribute('tabindex')) panel.removeAttribute('tabindex')
    return
  }

  if (panel.getAttribute('tabindex') !== '0') panel.setAttribute('tabindex', '0')
}

watch(
  () => panelRef.value?.$el as HTMLElement | undefined,
  (panel) => {
    panelObserver?.disconnect()
    panelObserver = null
    if (!(panel instanceof HTMLElement)) return

    syncPanelTabStop()
    if (typeof MutationObserver === 'undefined') return

    panelObserver = new MutationObserver(syncPanelTabStop)

    panelObserver.observe(panel, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['tabindex', 'disabled', 'href', 'contenteditable'],
    })
  },
  { flush: 'sync' },
)

onBeforeUnmount(() => panelObserver?.disconnect())

watch(
  [selectedValue, () => props.items, () => props.orientation],
  async () => {
    await nextTick()

    // Move before measuring: the measurement flushes styles, so the indicator transitions from its old geometry.
    placeIndicator()
    observeGeometry()
    measureIndicator()
  },
  { deep: true },
)
</script>
