<script lang="ts">
import type { ComponentSlots } from '../types/tv'
import theme from '../theme/listBox'

type ListBox = typeof theme

export type ListBoxValue = string | number

export interface ListBoxItem {
  /** Unique value; bound to `v-model` when selected and passed to `action`. */
  value: ListBoxValue
  /** The item label. */
  label?: string
  /** Help text rendered below the label. */
  description?: string
  /** Text used for type-ahead. Defaults to `label`. */
  textValue?: string
  /** Whether the item is disabled. */
  disabled?: boolean
  /**
   * Visual variant of the item.
   * @defaultValue 'default'
   */
  variant?: 'default' | 'danger'
  /** Additional classes merged into the item element. */
  class?: any
}

export interface ListBoxSection {
  type: 'section'
  /** Section heading, rendered as a `<header>`. */
  label?: string
  items: ListBoxItem[]
}

export interface ListBoxSeparator {
  type: 'separator'
}

export type ListBoxEntry = ListBoxItem | ListBoxSection | ListBoxSeparator

export interface ListBoxProps {
  /** Items, sections (`{ type: 'section', label, items }`) and separators (`{ type: 'separator' }`). */
  items?: ListBoxEntry[]
  /**
   * How many items can be selected. With `'none'` items only emit `action`.
   * @defaultValue 'single'
   */
  selectionMode?: 'none' | 'single' | 'multiple'
  /** The initial selection when uncontrolled (no `v-model`). */
  defaultValue?: ListBoxValue | ListBoxValue[] | null
  /**
   * Whether to render the checkmark indicator in selectable items.
   * @defaultValue true
   */
  indicator?: boolean
  /**
   * Whether the whole list is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Render only the visible rows (Reka `ListboxVirtualizer`). Needs a scrolling root (e.g. `class="h-[400px] overflow-y-auto"`)
   * and flat `items` (sections and separators are skipped). Pass `{ estimateSize, overscan }` to tune.
   * @defaultValue false
   */
  virtualize?: boolean | { estimateSize?: number, overscan?: number }
  /**
   * Async collections (RAC `ListBoxLoadMoreItem`): when set, a sentinel after the last item emits `load-more`
   * whenever it scrolls into view while `loading` is false; while `loading` is true the `#loading` slot is shown there.
   */
  loading?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ListBox>
}

export interface ListBoxItemSlotProps {
  item: ListBoxItem
  index: number
  selected: boolean
  disabled: boolean
}

export interface ListBoxSlots {
  /** Whole content of each item. Replaces leading, label, description, trailing and indicator. */
  'item'?: (props: ListBoxItemSlotProps) => any
  /** Content before the item text (avatar, icon). */
  'item-leading'?: (props: ListBoxItemSlotProps) => any
  /** The label of each item. Replaces `item.label`. */
  'item-label'?: (props: ListBoxItemSlotProps) => any
  /** The description of each item. Replaces `item.description`. */
  'item-description'?: (props: ListBoxItemSlotProps) => any
  /** Content after the item text (shortcut, badge). */
  'item-trailing'?: (props: ListBoxItemSlotProps) => any
  /** Indicator content. Defaults to an animated checkmark. */
  'indicator'?: (props: ListBoxItemSlotProps) => any
  /** Section heading. Replaces `section.label`. */
  'section-label'?: (props: { section: ListBoxSection }) => any
  /** Rendered when `items` is empty. */
  'empty'?: () => any
  /** Shown after the last item while `loading` is true (e.g. a Spinner). */
  'loading'?: () => any
}

export interface ListBoxEmits {
  /** An item was activated (click, Enter or Space) while `selectionMode` is `'none'`. */
  action: [value: ListBoxValue]
  /** The end of the list scrolled into view while `loading` is false. Fetch the next page. */
  loadMore: []
}
</script>

<script setup lang="ts">
import { ListboxContent, ListboxGroup, ListboxGroupLabel, ListboxRoot, ListboxVirtualizer } from 'reka-ui'
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'
import ListBoxOption from './ListBoxOption.vue'

// `loading: undefined` keeps an absent boolean prop from becoming `false`, so the sentinel only renders for async lists
const props = withDefaults(defineProps<ListBoxProps>(), { selectionMode: 'single', indicator: true, defaultValue: undefined, loading: undefined })
const emit = defineEmits<ListBoxEmits>()
const slots = defineSlots<ListBoxSlots>()
const modelValue = defineModel<ListBoxValue | ListBoxValue[] | null>()

const ui = useComponentUI('listBox', theme, () => ({}))

// Load-more sentinel: observed against the nearest scroll container (IntersectionObserver clips by ancestors)
const sentinel = useTemplateRef<HTMLElement>('sentinel')
const sentinelVisible = ref(false)
let observer: IntersectionObserver | undefined
watch(sentinel, (el) => {
  observer?.disconnect()
  if (!el)
    return
  observer = new IntersectionObserver(([entry]) => {
    sentinelVisible.value = !!entry?.isIntersecting
  })
  observer.observe(el)
})
onBeforeUnmount(() => observer?.disconnect())
// Re-check after each page arrives: the sentinel may still be in view
watch([sentinelVisible, () => props.loading, () => props.items?.length], () => {
  if (sentinelVisible.value && props.loading === false)
    emit('loadMore')
})

// Flat running indices so item slots get a stable `index` across sections
interface Row { kind: 'item', item: ListBoxItem, index: number }
type Block = Row | { kind: 'section', section: ListBoxSection, rows: Row[], key: number } | { kind: 'separator', key: number }
const blocks = computed<Block[]>(() => {
  let index = 0
  return (props.items ?? []).map((entry, key): Block => {
    if ('type' in entry && entry.type === 'section')
      return { kind: 'section', section: entry, rows: entry.items.map(item => ({ kind: 'item', item, index: index++ })), key }
    if ('type' in entry && entry.type === 'separator')
      return { kind: 'separator', key }
    return { kind: 'item', item: entry as ListBoxItem, index: index++ }
  })
})

// Virtualized mode renders flat item rows by value
const flatRows = computed(() => blocks.value.filter((b): b is Row => b.kind === 'item'))
const rowByValue = computed(() => new Map(flatRows.value.map(row => [row.item.value, row])))
const virtualOptions = computed(() => typeof props.virtualize === 'object' ? props.virtualize : {})

const selectable = computed(() => props.selectionMode !== 'none')
const multiple = computed(() => props.selectionMode === 'multiple')
// `v-model` wins when bound; otherwise the selection lives here, seeded from `defaultValue`
type Selection = ListBoxValue | ListBoxValue[] | undefined
const uncontrolled = ref<Selection>(props.defaultValue ?? (multiple.value ? [] : undefined))
const selection = computed<Selection>({
  get: () => (modelValue.value !== undefined ? modelValue.value : uncontrolled.value) ?? undefined,
  set: (value) => {
    uncontrolled.value = value
    modelValue.value = value ?? null
  },
})
function isSelected(item: ListBoxItem) {
  const current = selection.value
  if (!selectable.value || current == null)
    return false
  return Array.isArray(current) ? current.includes(item.value) : current === item.value
}

// Item-level slots are forwarded to ListBoxOption
const itemSlots = ['item', 'item-leading', 'item-label', 'item-description', 'item-trailing', 'indicator'] as const
const forwarded = computed(() => itemSlots.filter(name => slots[name]))

function optionProps(row: Row) {
  return {
    item: row.item,
    index: row.index,
    selected: isSelected(row.item),
    selectable: selectable.value,
    selectionMode: props.selectionMode,
    indicator: props.indicator,
    listDisabled: props.disabled,
    classes: ui.value,
    ui: props.ui,
  }
}

// Reka highlights the first option on focus entry; RAC focuses the first selected key instead (Select opens this way)
const listboxRoot = useTemplateRef<{ highlightSelected: () => Promise<void> }>('listboxRoot')
defineExpose({
  /** Highlight and focus the first selected option, or the first option when nothing is selected. */
  highlightSelected: () => listboxRoot.value?.highlightSelected(),
})
</script>

<template>
  <ListboxRoot
    ref="listboxRoot"
    v-model="selection"
    as-child
    :multiple="multiple"
    :disabled="disabled"
  >
    <ListboxContent
      data-slot="list-box"
      data-layout="stack"
      data-orientation="vertical"
      :data-empty="blocks.length ? undefined : 'true'"
      :aria-multiselectable="multiple ? 'true' : undefined"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
    >
      <ListboxVirtualizer
        v-if="virtualize"
        v-slot="{ option }"
        :options="flatRows.map(row => row.item.value)"
        :estimate-size="virtualOptions.estimateSize"
        :overscan="virtualOptions.overscan"
        :text-content="(value: ListBoxValue) => { const item = rowByValue.get(value)?.item; return (item?.textValue ?? item?.label ?? String(value)).toLowerCase() }"
      >
        <ListBoxOption
          v-bind="optionProps(rowByValue.get(option as ListBoxValue)!)"
          class="w-full"
          @action="emit('action', option as ListBoxValue)"
        >
          <template v-for="name in forwarded" #[name]="state">
            <slot :name="name" v-bind="state" />
          </template>
        </ListBoxOption>
      </ListboxVirtualizer>
      <template v-for="block in (virtualize ? [] : blocks)" :key="block.kind === 'item' ? `i${block.index}` : `b${block.key}`">
        <hr
          v-if="block.kind === 'separator'"
          data-slot="separator"
          data-orientation="horizontal"
          :class="ui.separator({ class: props.ui?.separator })"
        >
        <ListboxGroup
          v-else-if="block.kind === 'section'"
          as="section"
          :class="ui.section({ class: props.ui?.section })"
        >
          <ListboxGroupLabel
            v-if="block.section.label || slots['section-label']"
            as="header"
            data-slot="header"
            :class="ui.header({ class: props.ui?.header })"
          >
            <slot name="section-label" :section="block.section">
              {{ block.section.label }}
            </slot>
          </ListboxGroupLabel>
          <ListBoxOption
            v-for="row in block.rows"
            :key="`i${row.index}`"
            v-bind="optionProps(row)"
            @action="emit('action', row.item.value)"
          >
            <template v-for="name in forwarded" #[name]="state">
              <slot :name="name" v-bind="state" />
            </template>
          </ListBoxOption>
        </ListboxGroup>
        <ListBoxOption
          v-else
          v-bind="optionProps(block)"
          @action="emit('action', block.item.value)"
        >
          <template v-for="name in forwarded" #[name]="state">
            <slot :name="name" v-bind="state" />
          </template>
        </ListBoxOption>
      </template>
      <div v-if="!blocks.length && slots.empty" data-slot="empty-state" :class="ui.emptyState({ class: props.ui?.emptyState })">
        <slot name="empty" />
      </div>
      <!-- RAC ListBoxLoadMoreItem: loading row (not an option) + 1px sentinel -->
      <div v-if="loading && slots.loading" role="presentation" data-slot="list-box-loading">
        <slot name="loading" />
      </div>
      <div v-if="loading !== undefined" ref="sentinel" aria-hidden="true" data-slot="list-box-load-more" style="position: relative; height: 1px; width: 1px;" />
    </ListboxContent>
  </ListboxRoot>
</template>
