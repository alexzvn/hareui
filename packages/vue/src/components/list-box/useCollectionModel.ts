// Internal: the selection model of a ListBox-backed field (Select, ComboBox, Autocomplete): which options are
// selected, in which order, and the text the field shows for them.
import type { ComputedRef, Ref, WritableComputedRef } from 'vue'
import { computed, ref } from 'vue'

import type { ListBoxEntry, ListBoxItem, ListBoxValue } from './ListBox.vue'
import { flattenEntries, itemText } from './listBoxCollection'

/** A field's selection: a value (or `null`) in single mode, an array in multiple mode. */
export type CollectionValue = ListBoxValue | ListBoxValue[] | null

/**
 * The order of `selectedItems` (and so of `valueText`) in multiple mode.
 * - `selection`: the order the values appear in the selection, as RAC (`[...selectedKeys]`).
 * - `collection`: the order the options appear in `items`. Select keeps this rule; it is not RAC's.
 */
export type CollectionOrder = 'selection' | 'collection'

export type CollectionModelOptions<T extends ListBoxItem> = {
  /** Options, sections and separators, as in ListBox. */
  items: () => ListBoxEntry<T>[] | undefined
  /** The component's `defineModel()` ref; `undefined` while uncontrolled. */
  model: Ref<CollectionValue | undefined>
  /** Seeds the uncontrolled selection (read once) and is what `reset` restores. */
  defaultValue: () => CollectionValue | undefined
  isMultiple: () => boolean
  /** `valueText` while nothing is selected. */
  placeholder: () => string | undefined
  /** @defaultValue 'selection' */
  order?: CollectionOrder
}

export type CollectionModel<T extends ListBoxItem> = {
  /** Every option, sections flattened, in collection order. */
  options: ComputedRef<T[]>
  /** Option by value; with duplicate values the last one wins. */
  itemByValue: ComputedRef<Map<ListBoxValue, T>>
  /** `v-model` when bound, else local. Writing `null` / `undefined` stores the empty selection of the mode. */
  selection: WritableComputedRef<CollectionValue, CollectionValue | undefined>
  /** The selection as an array (empty when nothing is selected). */
  selectedValues: ComputedRef<ListBoxValue[]>
  /** The selected value in single mode, `null` in multiple mode or when nothing is selected. */
  selectedKey: ComputedRef<ListBoxValue | null>
  /** Options of the selected values, ordered per `order`; values without an option are skipped. */
  selectedItems: ComputedRef<T[]>
  /** The selected option's text (single) or the selected texts as a list (multiple); else the placeholder. */
  valueText: ComputedRef<string>
  /** Whether no selected value has an option. */
  isPlaceholder: ComputedRef<boolean>
  isSelected: (value: ListBoxValue) => boolean
  /** Text of the option with `value`; `''` for `null` or a value without an option. */
  resolveItemText: (value: ListBoxValue | null) => string
  /** Stores the empty selection of the mode. */
  clear: () => void
  /** Restores `defaultValue` (or the empty selection) and returns it: a bound `v-model` only reflects it later. */
  reset: () => CollectionValue
}

// Lazy and shared: the runtime locale doesn't change, and most fields never format a list
let listFormat: Intl.ListFormat | undefined
const formatList = (texts: string[]) =>
  (listFormat ??= new Intl.ListFormat(undefined, { type: 'conjunction' })).format(texts)

export const useCollectionModel = <T extends ListBoxItem>(
  options: CollectionModelOptions<T>,
): CollectionModel<T> => {
  const { items, model, defaultValue, isMultiple, placeholder, order = 'selection' } = options
  const emptyValue = (): CollectionValue => (isMultiple() ? [] : null)

  const local = ref<CollectionValue>(defaultValue() ?? emptyValue())
  const selection = computed<CollectionValue, CollectionValue | undefined>({
    get: () => (model.value !== undefined ? model.value : local.value),
    set: (value) => {
      const next = value ?? emptyValue()
      local.value = next
      model.value = next
    },
  })
  const selectedValues = computed<ListBoxValue[]>(() => {
    const value = selection.value
    if (value == null) return []
    return Array.isArray(value) ? value : [value]
  })
  const selectedSet = computed(() => new Set(selectedValues.value))
  const selectedKey = computed(() => (isMultiple() ? null : (selectedValues.value[0] ?? null)))

  const allOptions = computed(() => flattenEntries(items()) as T[])
  const itemByValue = computed(() => new Map(allOptions.value.map((item) => [item.value, item])))
  const isSelected = (value: ListBoxValue) => selectedSet.value.has(value)

  const selectedItems = computed<T[]>(() => {
    if (order === 'collection') return allOptions.value.filter((item) => isSelected(item.value))
    return selectedValues.value
      .map((value) => itemByValue.value.get(value))
      .filter((item): item is T => !!item)
  })
  const isPlaceholder = computed(() => selectedItems.value.length === 0)
  const valueText = computed(() => {
    const [first] = selectedItems.value
    if (!first) return placeholder() ?? ''
    return isMultiple() ? formatList(selectedItems.value.map(itemText)) : itemText(first)
  })

  const resolveItemText = (value: ListBoxValue | null) => {
    const item = value == null ? undefined : itemByValue.value.get(value)
    return item ? itemText(item) : ''
  }
  const clear = () => {
    selection.value = null
  }
  const reset = () => {
    const value = defaultValue() ?? emptyValue()
    selection.value = value
    return value
  }

  return {
    options: allOptions,
    itemByValue,
    selection,
    selectedValues,
    selectedKey,
    selectedItems,
    valueText,
    isPlaceholder,
    isSelected,
    resolveItemText,
    clear,
    reset,
  }
}
