import { useFilter } from 'reka-ui'
import type { Ref } from 'vue'
import { computed, nextTick, ref, watch } from 'vue'

import type { ListBoxItem, ListBoxValue } from '@/components/list-box/ListBox.types'
import type { CollectionRow } from '@/components/list-box/listBoxCollection'
import { filterEntries, itemText } from '@/components/list-box/listBoxCollection'

import type { AutocompleteProps } from './Autocomplete.types'

/** What `useAutocompleteSearch` reads from the component. */
export type AutocompleteSearchOptions<T extends ListBoxItem> = {
  props: Pick<AutocompleteProps<T>, 'items' | 'search' | 'filter' | 'defaultInputValue'>
  /** `v-model:input-value`. */
  model: Ref<string | undefined>
  /** Whether the parent binds `v-model:input-value`. */
  isControlled: () => boolean
  isOpen: () => boolean
  enabledRows: () => CollectionRow[]
  setFocusKey: (value: ListBoxValue | null) => void
}

/** Search text (`v-model:input-value` wins when bound), the options it filters, and its edits. */
export const useAutocompleteSearch = <T extends ListBoxItem>(
  options: AutocompleteSearchOptions<T>,
) => {
  const { props, model, isControlled, isOpen, enabledRows, setFocusKey } = options

  const uncontrolledInput = ref(props.defaultInputValue ?? '')

  const inputValue = computed<string>({
    get: () => (isControlled() ? (model.value ?? '') : uncontrolledInput.value),
    set: (value) => {
      uncontrolledInput.value = value
      model.value = value
    },
  })

  const { contains } = useFilter({ sensitivity: 'base' })

  const blocks = computed(() => {
    const filter = props.filter
    const text = props.search ? inputValue.value : ''
    const matches =
      filter === false
        ? () => true
        : (item: ListBoxItem) => (filter ?? contains)(itemText(item), text)

    return filterEntries(props.items, matches)
  })

  // The popover unmounts its search field, so uncontrolled search text starts empty on the next open
  watch(isOpen, (isNowOpen) => {
    if (!isNowOpen && !isControlled()) uncontrolledInput.value = props.defaultInputValue ?? ''
  })

  // RAC Autocomplete: typing focuses the first match; an empty search focuses nothing
  const focusFirstMatch = async () => {
    await nextTick()

    const firstRow = inputValue.value ? enabledRows()[0] : undefined
    setFocusKey(firstRow?.item.value ?? null)
  }

  const setSearchText = (text: string) => {
    inputValue.value = text
    focusFirstMatch()
  }

  // RAC SearchField: Escape clears the text first; the next one closes
  const onEscapeKeyDown = (event: KeyboardEvent) => {
    if (!props.search || !inputValue.value) return

    event.preventDefault()
    setSearchText('')
  }

  return { inputValue, blocks, setSearchText, onEscapeKeyDown }
}
