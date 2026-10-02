<script setup lang="ts">
// Internal: the rows of a filtered ListBox (options, sections, separators, empty state, load-more sentinel), rendered
// inside an existing Reka listbox root. Used by ComboBox and Autocomplete. Not exported.
import type { Component } from 'vue'
import type { ListBoxItemSlotProps, ListBoxSection, ListBoxValue } from './ListBox.vue'
import type { CollectionBlock, CollectionRow } from './listBoxCollection'
import { ListboxGroup, ListboxGroupLabel } from 'reka-ui'
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

function optionProps(row: CollectionRow) {
  return {
    item: row.item,
    index: row.index,
    selected: props.selectedValues.includes(row.item.value),
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
  <template v-for="block in blocks" :key="block.kind === 'item' ? `i${block.index}` : `b${block.key}`">
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
      <ListBoxOption v-for="row in block.rows" :key="`i${row.index}`" v-bind="optionProps(row) as any">
        <template v-for="name in forwarded" #[name]="state">
          <slot :name="name" v-bind="state" />
        </template>
      </ListBoxOption>
    </ListboxGroup>
    <ListBoxOption v-else v-bind="optionProps(block) as any">
      <template v-for="name in forwarded" #[name]="state">
        <slot :name="name" v-bind="state" />
      </template>
    </ListBoxOption>
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
