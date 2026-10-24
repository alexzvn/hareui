<template>
  <ListboxRoot
    ref="listboxRoot"
    v-model="selection"
    as-child
    :multiple="isMultiple"
    :disabled="disabled"
  >
    <ListboxContent
      data-slot="list-box"
      data-layout="stack"
      data-orientation="vertical"
      :data-empty="blocks.length ? undefined : 'true'"
      :aria-multiselectable="isMultiple ? 'true' : undefined"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
      @keydown.capture="onKeydownCapture"
    >
      <RekaContext />
      <ListboxVirtualizer
        v-if="virtualize"
        v-slot="{ option }"
        :options="optionValues"
        :estimate-size="virtualOptions.estimateSize"
        :overscan="virtualOptions.overscan"
        :text-content="getOptionText"
      >
        <ListBoxOption
          v-if="!forwardedSlots.length"
          v-bind="optionProps(getRow(option))"
          class="w-full"
          @action="emit('action', option as ListBoxValue)"
          @select="onOptionSelect(getRow(option).item, $event)"
        />
        <ListBoxOption
          v-else
          v-bind="optionProps(getRow(option))"
          class="w-full"
          @action="emit('action', option as ListBoxValue)"
          @select="onOptionSelect(getRow(option).item, $event)"
        >
          <template v-for="name in forwardedSlots" #[name]="state">
            <slot :name="name" v-bind="state as ListBoxItemSlotProps<T>" />
          </template>
        </ListBoxOption>
      </ListboxVirtualizer>
      <template
        v-for="block in virtualize ? [] : blocks"
        :key="block.kind === 'item' ? `i${block.index}` : `b${block.key}`"
      >
        <hr
          v-if="block.kind === 'separator'"
          role="presentation"
          data-slot="separator"
          data-orientation="horizontal"
          :class="ui.separator({ class: props.ui?.separator })"
        />
        <!-- Reka's group always references its label's id; an unlabelled section stays an unnamed group, as in RAC -->
        <component
          :is="isSectionLabelled(block.section) ? ListboxGroup : 'section'"
          v-else-if="block.kind === 'section'"
          v-bind="isSectionLabelled(block.section) ? { as: 'section' } : { role: 'group' }"
          :class="ui.section({ class: props.ui?.section })"
        >
          <ListboxGroupLabel
            v-if="isSectionLabelled(block.section)"
            as="header"
            role="presentation"
            data-slot="header"
            :class="ui.header({ class: props.ui?.header })"
          >
            <slot name="section-label" :section="block.section">
              {{ block.section.label }}
            </slot>
          </ListboxGroupLabel>
          <template v-if="!forwardedSlots.length">
            <ListBoxOption
              v-for="row in block.rows"
              :key="`i${row.index}`"
              v-bind="optionProps(row)"
              @action="emit('action', row.item.value)"
              @select="onOptionSelect(row.item, $event)"
            />
          </template>
          <template v-else>
            <ListBoxOption
              v-for="row in block.rows"
              :key="`i${row.index}`"
              v-bind="optionProps(row)"
              @action="emit('action', row.item.value)"
              @select="onOptionSelect(row.item, $event)"
            >
              <template v-for="name in forwardedSlots" #[name]="state">
                <slot :name="name" v-bind="state as ListBoxItemSlotProps<T>" />
              </template>
            </ListBoxOption>
          </template>
        </component>
        <ListBoxOption
          v-else-if="!forwardedSlots.length"
          v-bind="optionProps(block)"
          @action="emit('action', block.item.value)"
          @select="onOptionSelect(block.item, $event)"
        />
        <ListBoxOption
          v-else
          v-bind="optionProps(block)"
          @action="emit('action', block.item.value)"
          @select="onOptionSelect(block.item, $event)"
        >
          <template v-for="name in forwardedSlots" #[name]="state">
            <slot :name="name" v-bind="state as ListBoxItemSlotProps<T>" />
          </template>
        </ListBoxOption>
      </template>
      <!-- RAC wraps the empty state in an option (a listbox owns only options and groups) -->
      <div v-if="!blocks.length && slots.empty" role="option" style="display: contents">
        <div data-slot="empty-state" :class="ui.emptyState({ class: props.ui?.emptyState })">
          <slot name="empty" />
        </div>
      </div>
      <!-- RAC ListBoxLoadMoreItem: loading row (an unselectable option) + 1px sentinel -->
      <div v-if="loading && slots.loading" role="option" data-slot="list-box-loading">
        <slot name="loading" />
      </div>
      <div
        v-if="loading !== undefined"
        ref="sentinel"
        aria-hidden="true"
        data-slot="list-box-load-more"
        style="position: relative; height: 1px; width: 1px"
      />
    </ListboxContent>
  </ListboxRoot>
</template>

<script setup lang="ts" generic="T extends ListBoxItem = ListBoxItem">
import {
  ListboxContent,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxRoot,
  ListboxVirtualizer,
} from 'reka-ui'
import { computed, inject, provide, useTemplateRef } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { keyboardModalityKey, useKeyboardModality } from '@/composables/useKeyboardModality'

import type {
  ListBoxEmits,
  ListBoxItem,
  ListBoxItemSlotProps,
  ListBoxProps,
  ListBoxRekaRoot,
  ListBoxRow,
  ListBoxSection,
  ListBoxSlots,
  ListBoxValue,
} from './ListBox.types'
import ListBoxOption from './ListBoxOption.vue'
import theme from './theme'
import { useListBoxCollection } from './useListBoxCollection'
import { useListBoxKeyboard } from './useListBoxKeyboard'
import { useListBoxLoadMore } from './useListBoxLoadMore'
import { useListBoxSelection } from './useListBoxSelection'

// `loading: undefined` keeps an absent boolean prop from becoming `false`, so the sentinel only renders for async lists
const props = withDefaults(defineProps<ListBoxProps<T>>(), {
  selectionMode: 'single',
  indicator: true,
  defaultValue: undefined,
  loading: undefined,
  escapeKeyBehavior: 'clearSelection',
})

const emit = defineEmits<ListBoxEmits>()
const slots = defineSlots<ListBoxSlots<T>>()
const modelValue = defineModel<ListBoxValue | ListBoxValue[] | null>()

const listboxRoot = useTemplateRef<ListBoxRekaRoot>('listboxRoot')
const sentinel = useTemplateRef<HTMLElement>('sentinel')

const ui = useComponentUI('listBox', { theme: theme, variantProps: () => ({}) })

// Options read the interaction modality; a standalone ListBox tracks its own (Select provides one from before the open)
if (!inject(keyboardModalityKey, null)) provide(keyboardModalityKey, useKeyboardModality())

useListBoxLoadMore({
  sentinel,
  loading: () => props.loading,
  itemCount: () => props.items?.length,
  onLoadMore: () => emit('loadMore'),
})

const { blocks, optionValues, getRow, getItem, getOptionText } = useListBoxCollection(
  () => props.items,
)

const virtualOptions = computed(() =>
  typeof props.virtualize === 'object' ? props.virtualize : {},
)

const listSelection = useListBoxSelection({
  model: modelValue,
  mode: () => props.selectionMode,
  defaultValue: props.defaultValue,
})

const { selection, isSelectable, isMultiple, isSelected } = listSelection

const { RekaContext, onKeydownCapture, onOptionSelect } = useListBoxKeyboard({
  props,
  selection: listSelection,
  listboxRoot,
  getValues: () => optionValues.value,
  getItem,
})

// Item-level slots are forwarded to ListBoxOption. Forwarding makes every option re-render with the list,
// so options render slot-less when there is nothing to forward.
const itemSlots = [
  'item',
  'item-leading',
  'item-label',
  'item-description',
  'item-trailing',
  'indicator',
] as const

const forwardedSlots = computed(() => itemSlots.filter((name) => slots[name]))

const isSectionLabelled = (section: ListBoxSection<T>) => {
  return !!(section.label || slots['section-label'])
}

const optionProps = (row: ListBoxRow<T>) => {
  return {
    item: row.item,
    index: row.index,
    selected: isSelected(row.item),
    selectable: isSelectable.value,
    selectionMode: props.selectionMode,
    indicator: props.indicator,
    listDisabled: props.disabled,
    focusOnHover: props.highlightOnHover,
    classes: ui.value,
    ui: props.ui,
  }
}

// Reka highlights the first option on focus entry; RAC focuses the first selected key instead (Select opens this way)
defineExpose({
  /** Highlight and focus the first selected option, or the first option when nothing is selected. */
  highlightSelected: () => listboxRoot.value?.highlightSelected(),
})
</script>
