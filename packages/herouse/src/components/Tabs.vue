<script lang="ts">
import type { ComponentSlots, ComponentVariants } from '../types/tv'
import theme from '../theme/tabs'

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

export interface TabsProps {
  /** The tabs to render. */
  items: TabsItem[]
  /** The selected tab value. Use `v-model` to control it. */
  modelValue?: string | number
  /**
   * The value of the tab selected by default (uncontrolled).
   * @defaultValue items[0]?.value ?? '0'
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
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Tabs>
}

export interface TabsSlots {
  /** Replaces a tab's label. */
  tab?: (props: { item: TabsItem, index: number, selected: boolean }) => any
  /** Fallback panel content for every item, overridden by `[item.slot]`. */
  content?: (props: { item: TabsItem, index: number }) => any
}
</script>

<script setup lang="ts">
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { computed } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'

const props = withDefaults(defineProps<TabsProps>(), {
  orientation: 'horizontal',
  content: true,
})
const modelValue = defineModel<string | number>()
defineSlots<TabsSlots>()

const ui = useComponentUI('tabs', theme, () => ({
  variant: props.variant,
  align: props.align,
  orientation: props.orientation,
}))

const defaultValue = computed(() => props.defaultValue ?? props.items[0]?.value ?? '0')

function itemValue(item: TabsItem, index: number): string | number {
  return item.value ?? String(index)
}

const selectedValue = computed(() => modelValue.value ?? defaultValue.value)

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

// Flattens tabs + a single interleaved indicator entry, positioned right after the
// selected tab so the document order matches HeroUI's per-tab SelectionIndicator while
// keeping one persistent Reka TabsIndicator instance (stable `key`) so it slides between
// positions instead of being destroyed/recreated.
type TabsEntry = { type: 'tab', key: string | number, item: TabsItem, index: number } | { type: 'indicator', key: 'indicator' }

const flatEntries = computed<TabsEntry[]>(() => {
  const entries: TabsEntry[] = []
  props.items.forEach((item, index) => {
    const value = itemValue(item, index)
    entries.push({ type: 'tab', key: value, item, index })
    if (value === selectedValue.value)
      entries.push({ type: 'indicator', key: 'indicator' })
  })
  return entries
})
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
      <TabsList :class="ui.tabList({ class: props.ui?.tabList })" data-slot="tabs-list">
        <template v-for="entry in flatEntries" :key="entry.key">
          <TabsIndicator
            v-if="entry.type === 'indicator'"
            :data-orientation="orientation"
            :class="ui.tabIndicator({ class: props.ui?.tabIndicator })"
            data-slot="tabs-indicator"
          />
          <TabsTrigger
            v-else
            :value="itemValue(entry.item, entry.index)"
            :disabled="entry.item.disabled"
            :class="ui.tab({ class: props.ui?.tab })"
            data-slot="tabs-tab"
          >
            <span
              aria-hidden="true"
              :data-orientation="orientation"
              :class="ui.separator({ class: [props.ui?.separator, isSeparatorHidden(entry.index) ? 'opacity-0' : undefined] })"
              data-slot="tabs-separator"
            />
            <slot name="tab" :item="entry.item" :index="entry.index" :selected="itemValue(entry.item, entry.index) === selectedValue">
              {{ entry.item.label }}
            </slot>
          </TabsTrigger>
        </template>
      </TabsList>
    </div>
    <TabsContent
      v-if="visiblePanel"
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
