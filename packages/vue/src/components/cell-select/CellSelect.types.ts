import type { VNode } from 'vue'

import type { ListBoxItem } from '@/components/list-box/ListBox.types'
import type {
  SelectEmits,
  SelectProps,
  SelectSlots,
  SelectValue,
} from '@/components/select/Select.types'
import type { ComponentSlots } from '@/types/tv'

import type theme from './theme'

type CellSelect = typeof theme

export type CellSelectProps<T extends ListBoxItem = ListBoxItem> = {
  /** Text shown at the start of the row. Also names the trigger and the listbox. */
  label?: string
  /** The selected value(s). Use with `v-model`. */
  modelValue?: SelectValue
  /**
   * Visual variant. Use `secondary` on surfaces.
   * @defaultValue 'default'
   */
  variant?: 'default' | 'secondary'
  /**
   * Side of the row the popover opens on.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * Alignment of the popover against the row.
   * @defaultValue 'end'
   */
  align?: 'start' | 'center' | 'end'
  /** Per-slot class overrides. */
  ui?: ComponentSlots<CellSelect>
} & Omit<SelectProps<T>, 'variant' | 'label' | 'fullWidth' | 'side' | 'align' | 'ui'>

export type CellSelectSlots<T extends ListBoxItem = ListBoxItem> = {
  /** Row label content. Replaces `label`. */
  label?: () => VNode[]
} & Omit<SelectSlots<T>, 'label' | 'leading'>

export type CellSelectEmits = {
  /** The selection changed (`v-model`). */
  'update:modelValue': [value: SelectValue]
} & SelectEmits
