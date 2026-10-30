import { computed, ref, watch } from 'vue'

import type { AutocompleteProps } from './Autocomplete.types'

/** Which option gets virtual focus when the popover opens without a selection (RAC `focusStrategy`). */
export type FocusStrategy = 'first' | 'last' | null

/** What `useAutocompleteOpen` reads from the component. */
export type AutocompleteOpenOptions = {
  props: Pick<AutocompleteProps, 'open' | 'defaultOpen' | 'allowsEmptyCollection'>
  hasOptions: () => boolean
  isDisabled: () => boolean
  /** Reports an open state change (`update:open`). */
  onUpdate: (value: boolean) => void
}

/** Popover open state; the `open` prop wins when bound. */
export const useAutocompleteOpen = (options: AutocompleteOpenOptions) => {
  const { props, hasOptions, isDisabled, onUpdate } = options

  const uncontrolledOpen = ref(props.defaultOpen ?? false)
  const isOpen = computed(() => (props.open ?? uncontrolledOpen.value) && !isDisabled())
  let openStrategy: FocusStrategy = null

  const canOpen = () => !isDisabled() && (props.allowsEmptyCollection || hasOptions())

  const setOpen = (value: boolean, strategy: FocusStrategy = null) => {
    if (value && !canOpen()) return
    if (value === isOpen.value) return

    openStrategy = strategy
    uncontrolledOpen.value = value
    onUpdate(value)
  }

  watch(isDisabled, (isNowDisabled) => {
    if (isNowDisabled) setOpen(false)
  })

  return { isOpen, setOpen, getOpenStrategy: () => openStrategy }
}
