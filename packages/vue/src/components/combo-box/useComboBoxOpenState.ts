import type { ComputedRef, Ref } from 'vue'
import { computed, onMounted, ref, shallowRef, watch } from 'vue'

import type { CollectionBlock } from '@/components/list-box/listBoxCollection'
import { countRows } from '@/components/list-box/listBoxCollection'

import type { ComboBoxProps, FocusStrategy } from './ComboBox.types'

type OpenTrigger = 'focus' | 'input' | 'manual'

type ComboBoxOpenStateOptions = {
  props: Pick<
    ComboBoxProps,
    'open' | 'defaultOpen' | 'readonly' | 'menuTrigger' | 'allowsEmptyCollection'
  >
  isDisabled: Ref<boolean>
  /** Emits `update:open`. */
  onUpdateOpen: (value: boolean) => void
  /** Every option, unfiltered. */
  optionCount: () => number
  filteredCount: ComputedRef<number>
  liveBlocks: ComputedRef<CollectionBlock[]>
  isShowingAll: Ref<boolean>
  highlightOnOpen: (strategy: FocusStrategy) => void
}

// The popover's open state: the `open` prop wins when bound, else a local value
export const useComboBoxOpenState = (options: ComboBoxOpenStateOptions) => {
  const { props, isDisabled, onUpdateOpen, optionCount, filteredCount, liveBlocks, isShowingAll } =
    options

  const uncontrolledOpen = ref(props.defaultOpen ?? false)
  const isOpen = computed(() => (props.open ?? uncontrolledOpen.value) && !isDisabled.value)

  // What the popover renders: the live collection while open; RAC keeps the last one while the popover animates out
  // (committing rewrites the text to the selected label, which would collapse the list mid-exit)
  const blocks = shallowRef(liveBlocks.value)
  const visibleCount = computed(() => countRows(blocks.value))

  watch([liveBlocks, isOpen], ([live, open]) => {
    if (open) blocks.value = live
  })

  const setOpenState = (value: boolean) => {
    if (value === isOpen.value) return

    uncontrolledOpen.value = value
    onUpdateOpen(value)
  }

  let isOpeningFromInput = false

  // RAC `state.open(focusStrategy, trigger)`
  const open = (strategy: FocusStrategy, trigger: OpenTrigger) => {
    if (isDisabled.value || props.readonly) return

    const shouldShowAll =
      trigger === 'manual' || (trigger === 'focus' && props.menuTrigger === 'focus')

    const hasOptionsToShow =
      props.allowsEmptyCollection || filteredCount.value > 0 || (shouldShowAll && optionCount() > 0)

    if (!hasOptionsToShow) return

    if (shouldShowAll && !isOpen.value) isShowingAll.value = true

    isOpeningFromInput = trigger === 'input'
    setOpenState(true)
    isOpeningFromInput = false

    options.highlightOnOpen(strategy)
  }

  const close = () => {
    setOpenState(false)
  }

  onMounted(() => {
    if (isOpen.value) options.highlightOnOpen(null)
  })

  // Opened from outside (`v-model:open`): show every option, like RAC's manual open
  watch(
    isOpen,
    (value) => {
      if (value && !isOpeningFromInput) isShowingAll.value = true
    },
    { flush: 'sync' },
  )

  watch(isDisabled, (disabled) => {
    if (disabled) close()
  })

  return { isOpen, blocks, visibleCount, open, close }
}
