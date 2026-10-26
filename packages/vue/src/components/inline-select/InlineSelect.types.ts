import type { ListBoxItem } from '@/components/list-box/ListBox.types'
import type {
  SelectEmits,
  SelectProps,
  SelectSlots,
  SelectValue,
} from '@/components/select/Select.types'
import type { ComponentSlots } from '@/types/tv'

import type theme from './theme'

type InlineSelect = typeof theme

/** Props of `InlineSelect`, a `Select` whose trigger reads as part of a sentence or heading. */
export type InlineSelectProps<T extends ListBoxItem = ListBoxItem> = {
  /** The selected value(s). Use with `v-model`. */
  modelValue?: SelectValue
  /**
   * Side of the trigger the popover opens on.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * Alignment of the popover against the trigger.
   * @defaultValue 'end'
   */
  align?: 'start' | 'center' | 'end'
  /** Per-slot class overrides. */
  ui?: ComponentSlots<InlineSelect>
} & Omit<SelectProps<T>, 'variant' | 'fullWidth' | 'clearable' | 'side' | 'align' | 'ui'>

/** Slots of `InlineSelect`: every `Select` slot except `clear`. */
export type InlineSelectSlots<T extends ListBoxItem = ListBoxItem> = Omit<SelectSlots<T>, 'clear'>

/** Events of `InlineSelect`: the `Select` events except `clear`. */
export type InlineSelectEmits = {
  /** The selection changed (`v-model`). */
  'update:modelValue': [value: SelectValue]
} & Omit<SelectEmits, 'clear'>
