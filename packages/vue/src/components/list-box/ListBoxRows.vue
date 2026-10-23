<script setup lang="ts">
// Internal: the rows of a filtered ListBox (options, sections, separators, empty state, load-more sentinel), rendered
// inside an existing Reka listbox root. Used by ComboBox and Autocomplete. Not exported.
import type { Component } from 'vue'
import type { ListBoxItemSlotProps, ListBoxSection, ListBoxValue } from './ListBox.vue'
import type { CollectionBlock, CollectionRow } from './listBoxCollection'
import { ListboxGroup, ListboxGroupLabel, ListboxVirtualizer } from 'reka-ui'
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { countRows } from './listBoxCollection'
import ListBoxOption from './ListBoxOption.vue'

const props = defineProps<{
  blocks: CollectionBlock[]
  selectedValues: ListBoxValue[]
  selectionMode: 'single' | 'multiple'
  disabled?: boolean
  /** Slot class functions of the listBox theme. */
  classes: Record<'item' | 'indicator' | 'section' | 'header' | 'separator' | 'emptyState', (options?: { variant?: string, class?: any }) => string>
  /** Reka item primitive (ComboBox: `ComboboxItem`). */
  component?: Component
  virtualFocus?: { keyboard: boolean }
  /** Extra attributes / listeners per option. */
  optionAttrs?: (row: CollectionRow) => Record<string, any>
  /** Text of the empty state when there's no `#empty` slot; nothing renders when both are absent. */
  emptyText?: string
  loading?: boolean
  /** Render only the visible rows (Reka `ListboxVirtualizer`); sections and separators are skipped, as in ListBox. */
  virtualize?: boolean | { estimateSize?: number, overscan?: number }
}>()
const emit = defineEmits<{ loadMore: [] }>()
const slots = defineSlots<{
  'item'?: (props: ListBoxItemSlotProps) => any
  'item-leading'?: (props: ListBoxItemSlotProps) => any
  'item-label'?: (props: ListBoxItemSlotProps) => any
  'item-description'?: (props: ListBoxItemSlotProps) => any
  'item-trailing'?: (props: ListBoxItemSlotProps) => any
  'indicator'?: (props: ListBoxItemSlotProps) => any
  'section-label'?: (props: { section: ListBoxSection }) => any
  'empty'?: () => any
  'loading'?: () => any
}>()

const itemSlots = ['item', 'item-leading', 'item-label', 'item-description', 'item-trailing', 'indicator'] as const
const forwarded = computed(() => itemSlots.filter(name => slots[name]))
const empty = computed(() => countRows(props.blocks) === 0)

// Virtualized: flat option rows, looked up by value
const flatRows = computed(() => props.blocks.flatMap(b => b.kind === 'item' ? [b] : b.kind === 'section' ? b.rows : []))
const virtualOptions = computed(() => typeof props.virtualize === 'object' ? props.virtualize : {})
type Virtualizer = { scrollToIndex: (index: number, options?: { align?: 'start' | 'center' | 'end' | 'auto' }) => void }
let virtualizer: Virtualizer | undefined
// The tanstack virtualizer is only reachable through the slot; keep it for `scrollToIndex` (renders nothing)
function captureVirtualizer(v: Virtualizer) {
  virtualizer = v
  return undefined
}
defineExpose({
  /** Virtualized: scroll the row at `index` (of the flat, filtered rows) into view. */
  scrollToIndex: (index: number, align: 'start' | 'center' | 'end' | 'auto' = 'auto') => virtualizer?.scrollToIndex(index, { align }),
  /** The flat, filtered option rows. */
  rows: () => flatRows.value,
})

const selectedSet = computed(() => new Set(props.selectedValues))
function optionProps(row: CollectionRow) {
  return {
    item: row.item,
    index: row.index,
    selected: selectedSet.value.has(row.item.value),
    selectable: true,
    selectionMode: props.selectionMode,
    indicator: true,
    listDisabled: !!props.disabled,
    classes: props.classes,
    component: props.component,
    virtualFocus: props.virtualFocus,
    ...props.optionAttrs?.(row),
  }
}

// Load-more sentinel, as in ListBox
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
watch([sentinelVisible, () => props.loading, () => countRows(props.blocks)], () => {
  if (sentinelVisible.value && props.loading === false)
    emit('loadMore')
})
</script>

<template>
  <!--
    RAC Virtualizer: each row sits in an absolutely positioned presentational wrapper. `options` are the row objects,
    not the values: Reka scrolls the selected option to the top on mount, RAC doesn't (the owner scrolls instead).
  -->
  <ListboxVirtualizer
    v-if="virtualize"
    v-slot="{ option, virtualizer: v }"
    :options="flatRows as any[]"
    :estimate-size="virtualOptions.estimateSize ?? 50"
    :overscan="virtualOptions.overscan ?? 3"
  >
    <div role="presentation" class="w-full" :data-virtualizer="captureVirtualizer(v as any)">
      <!-- Slot-less branch: forwarded (dynamic) slots force-update every option on each render -->
      <ListBoxOption v-if="forwarded.length" v-bind="optionProps(option as unknown as CollectionRow) as any">
        <template v-for="name in forwarded" #[name]="state">
          <slot :name="name" v-bind="state" />
        </template>
      </ListBoxOption>
      <ListBoxOption v-else v-bind="optionProps(option as unknown as CollectionRow) as any" />
    </div>
  </ListboxVirtualizer>
  <template v-for="block in (virtualize ? [] : blocks)" :key="block.kind === 'item' ? `i${block.index}` : `b${block.key}`">
    <hr
      v-if="block.kind === 'separator'"
      data-slot="separator"
      data-orientation="horizontal"
      :class="classes.separator()"
    >
    <ListboxGroup v-else-if="block.kind === 'section'" as="section" :class="classes.section()">
      <ListboxGroupLabel
        v-if="block.section.label || slots['section-label']"
        as="header"
        data-slot="header"
        :class="classes.header()"
      >
        <slot name="section-label" :section="block.section">
          {{ block.section.label }}
        </slot>
      </ListboxGroupLabel>
      <template v-if="forwarded.length">
        <ListBoxOption v-for="row in block.rows" :key="`i${row.index}`" v-bind="optionProps(row) as any">
          <template v-for="name in forwarded" #[name]="state">
            <slot :name="name" v-bind="state" />
          </template>
        </ListBoxOption>
      </template>
      <template v-else>
        <ListBoxOption v-for="row in block.rows" :key="`i${row.index}`" v-bind="optionProps(row) as any" />
      </template>
    </ListboxGroup>
    <ListBoxOption v-else-if="forwarded.length" v-bind="optionProps(block) as any">
      <template v-for="name in forwarded" #[name]="state">
        <slot :name="name" v-bind="state" />
      </template>
    </ListBoxOption>
    <ListBoxOption v-else v-bind="optionProps(block) as any" />
  </template>
  <!-- RAC renders the empty state inside a presentational row -->
  <div v-if="empty && (slots.empty || emptyText)" role="presentation" style="display: contents;">
    <div data-slot="empty-state" :class="classes.emptyState()">
      <slot name="empty">
        {{ emptyText }}
      </slot>
    </div>
  </div>
  <div v-if="loading && slots.loading" role="presentation" data-slot="list-box-loading">
    <slot name="loading" />
  </div>
  <div v-if="loading !== undefined" ref="sentinel" aria-hidden="true" data-slot="list-box-load-more" style="position: relative; height: 1px; width: 1px;" />
</template>
