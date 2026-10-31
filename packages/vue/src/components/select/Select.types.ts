import type { VNode } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type {
  ListBoxEntry,
  ListBoxItem,
  ListBoxItemSlotProps,
  ListBoxSection,
  ListBoxValue,
} from '@/components/list-box/ListBox.types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { PortalTarget } from '@/config'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Select = typeof theme

/** The selected value: one option value (`null` when empty), or an array of values in multiple selection mode. */
export type SelectValue = ListBoxValue | ListBoxValue[] | null

/** Props of the `Select` component: a trigger that opens a listbox popover to pick one or more options. */
export type SelectProps<T extends ListBoxItem = ListBoxItem> = {
  /**
   * Renders the listbox popover in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Options, sections (`{ type: 'section', label, items }`) and separators (`{ type: 'separator' }`), as in ListBox. */
  items?: ListBoxEntry<T>[]
  /**
   * Whether one or several options can be selected. In `'multiple'` mode `v-model` is an array.
   * @defaultValue 'single'
   */
  selectionMode?: 'single' | 'multiple'
  /** The initial selection when uncontrolled (no `v-model`). */
  defaultValue?: SelectValue
  /**
   * Text shown in the trigger while nothing is selected.
   * @defaultValue 'Select an item'
   */
  placeholder?: string
  /** Label text rendered above the trigger. */
  label?: string
  /** Helper text rendered below the trigger. Hidden while invalid. */
  description?: string
  /** Error text rendered below the trigger while invalid. Defaults to the validation messages. */
  errorMessage?: string
  /** Id of the trigger button. */
  id?: string
  /** Name of the hidden native `<select>`, submitted with forms. */
  name?: string
  /** `autocomplete` hint of the hidden native `<select>`. */
  autocomplete?: string
  /** Whether the popover is open (`v-model:open`). */
  open?: boolean
  /**
   * Whether the popover starts open when uncontrolled.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /**
   * Whether to render a clear button in the trigger. Backspace / Delete on the trigger also clears.
   * @defaultValue false
   */
  clearable?: boolean
  /**
   * Visual variant. Use `secondary` on surfaces.
   * @defaultValue 'primary'
   */
  variant?: 'primary' | 'secondary'
  /**
   * Whether the select takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Side of the trigger the popover opens on.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * Alignment of the popover against the trigger.
   * @defaultValue 'center'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * Whether the select is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether a selection is required before the form can be submitted.
   * @defaultValue false
   */
  required?: boolean
  /** Controlled invalid state; overrides validation. */
  invalid?: boolean
  /** Custom validation, called with the current selection. Return an error message (or several) when invalid. */
  validate?: ValidateFn<SelectValue>
  /**
   * `native` blocks form submission and shows errors on commit; `aria` shows errors in realtime without blocking.
   * @defaultValue 'native' (or the enclosing Form's)
   */
  validationBehavior?: ValidationBehavior
  /** Async options: shows the `#loading` slot after the last option and emits `load-more` at the end of the list (see ListBox `loading`). */
  loading?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Select>
} & FormFieldProps

/** Props passed to the `#value` slot, for rendering the trigger's value. */
export type SelectValueSlotProps<T extends ListBoxItem = ListBoxItem> = {
  /** The selected options, in collection order. */
  selectedItems: T[]
  /** Whether nothing is selected. */
  isPlaceholder: boolean
  /** The placeholder, or the selected labels joined as a list. */
  text: string
}

/** Slots of the `Select` component. */
export type SelectSlots<T extends ListBoxItem = ListBoxItem> = {
  /** Label content. Replaces `label`. */
  label?: () => VNode[]
  /** Content inside the trigger before the value. */
  leading?: () => VNode[]
  /** Trigger value content. Defaults to the selected label(s) or the placeholder. */
  value?: (props: SelectValueSlotProps<T>) => VNode[]
  /** Trigger indicator content. Defaults to a chevron. */
  indicator?: (props: { open: boolean }) => VNode[]
  /** Clear button content. Defaults to a close icon. */
  clear?: () => VNode[]
  /** Description content. Replaces `description`. */
  description?: () => VNode[]
  /** Error content, rendered while invalid. */
  error?: (props: ValidationResult) => VNode[]
  /** Whole content of each option (forwarded to ListBox `#item`). */
  item?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Content before each option's text (ListBox `#item-leading`). */
  'item-leading'?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Each option's label (ListBox `#item-label`). */
  'item-label'?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Each option's description (ListBox `#item-description`). */
  'item-description'?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Content after each option's text (ListBox `#item-trailing`). */
  'item-trailing'?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Option checkmark content (ListBox `#indicator`). */
  'item-indicator'?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Section heading (ListBox `#section-label`). */
  'section-label'?: (props: { section: ListBoxSection<T> }) => VNode[]
  /** Rendered in the popover when `items` is empty (ListBox `#empty`). */
  empty?: () => VNode[]
  /** Shown after the last option while `loading` is true (ListBox `#loading`). */
  loading?: () => VNode[]
}

/** Events emitted by the `Select` component. */
export type SelectEmits = {
  /** The selection was cleared with the clear button or Backspace / Delete. */
  clear: []
  /** The popover opened or closed (`v-model:open`). */
  'update:open': [value: boolean]
  /** The end of the option list scrolled into view while `loading` is false (ListBox `load-more`). */
  loadMore: []
  /** The selection changed through an option, typeahead or clear; not on `v-model` writes or form reset. */
  change: [event: Event]
  /** Focus entered the field (the trigger or the open list) from outside it. */
  focus: [event: FocusEvent]
  /** Focus left the field; moving between the trigger and the open list doesn't count. Fires a task later. */
  blur: [event: FocusEvent]
}
