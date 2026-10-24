import type { injectComboboxRootContext, injectListboxRootContext } from 'reka-ui'
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

type ComboBox = typeof theme

/** The `v-model` value: a value (or `null`) in single mode, an array in multiple mode. */
export type ComboBoxValue = ListBoxValue | ListBoxValue[] | null

/** The value passed to `validate` (RAC `ComboBoxValidationValue`). */
export type ComboBoxValidationValue = {
  /** The text in the input. */
  inputValue: string
  /** The selection: a value (or `null`) in single mode, an array in multiple mode. */
  value: ComboBoxValue
  /** The selected value in single mode, `null` otherwise. */
  selectedKey: ListBoxValue | null
}

/** Props of `ComboBox`. */
export type ComboBoxProps<T extends ListBoxItem = ListBoxItem> = {
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
  defaultValue?: ComboBoxValue
  /** The initial input text when uncontrolled (no `v-model:input-value`). Defaults to the selected option's text. */
  defaultInputValue?: string
  /** Temporary text shown in the empty input. */
  placeholder?: string
  /** Text of the selected-value element (rendered in multiple mode) while nothing is selected. */
  valuePlaceholder?: string
  /** Label text rendered above the input. */
  label?: string
  /** Helper text rendered below the input. Hidden while invalid. */
  description?: string
  /** Error text rendered below the input while invalid. Defaults to the validation messages. */
  errorMessage?: string
  /** Id of the input. */
  id?: string
  /** The name used when submitting an HTML form. */
  name?: string
  /**
   * Whether the selected option's value or its text is submitted with forms. With `allowsCustomValue` the text is always submitted.
   * @defaultValue 'key'
   */
  formValue?: 'key' | 'text'
  /** Whether the popover is open (`v-model:open`). */
  open?: boolean
  /**
   * Whether the popover starts open when uncontrolled.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /**
   * The interaction that opens the popover: focusing the input, typing in it, or only the trigger button and arrow keys.
   * @defaultValue 'focus'
   */
  menuTrigger?: 'focus' | 'input' | 'manual'
  /**
   * Filters options against the input text. Defaults to a case- and accent-insensitive "contains" match on each option's
   * `textValue ?? label`. Pass `false` to show every item (e.g. when the server already filtered `items`).
   */
  filter?: ((text: string, inputValue: string) => boolean) | false
  /**
   * Whether text that matches no option is kept as the value (the selection is cleared) instead of being reverted.
   * @defaultValue false
   */
  allowsCustomValue?: boolean
  /**
   * Whether the popover stays open when no option matches (shows the `#empty` slot).
   * @defaultValue false
   */
  allowsEmptyCollection?: boolean
  /** Async options: shows the `#loading` slot after the last option and emits `load-more` at the end of the list (see ListBox `loading`). */
  loading?: boolean
  /**
   * Visual variant. Use `secondary` on surfaces.
   * @defaultValue 'primary'
   */
  variant?: 'primary' | 'secondary'
  /**
   * Whether the combo box takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether the combo box is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the input can be focused but not changed.
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether a value is required before the form can be submitted.
   * @defaultValue false
   */
  required?: boolean
  /** Controlled invalid state; overrides validation. */
  invalid?: boolean
  /** Custom validation. Return an error message (or several) when invalid, `true` / `null` when valid. */
  validate?: ValidateFn<ComboBoxValidationValue>
  /**
   * `native` blocks form submission and shows errors on commit; `aria` shows errors in realtime without blocking.
   * @defaultValue 'native' (or the enclosing Form's)
   */
  validationBehavior?: ValidationBehavior
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ComboBox>
} & FormFieldProps

/** Props of the `#value` slot. */
export type ComboBoxValueSlotProps<T extends ListBoxItem = ListBoxItem> = {
  /** The selected options, in selection order. */
  selectedItems: T[]
  /** Whether nothing is selected. */
  isPlaceholder: boolean
  /** The selected labels joined as a list, or `valuePlaceholder`. */
  text: string
}

/** Slots of `ComboBox`. */
export type ComboBoxSlots<T extends ListBoxItem = ListBoxItem> = {
  /** Label content. Replaces `label`. */
  label?: () => VNode[]
  /** Content of the selected-value element below the input (rendered in multiple mode, or whenever this slot is used). */
  value?: (props: ComboBoxValueSlotProps<T>) => VNode[]
  /** Trigger button content. Defaults to a chevron. */
  indicator?: (props: { open: boolean }) => VNode[]
  /** Description content. Replaces `description`. */
  description?: () => VNode[]
  /** Error content, rendered while invalid. */
  error?: (props: ValidationResult) => VNode[]
  /** Whole content of each option (as ListBox `#item`). */
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
  /** Rendered in the popover when no option matches and `allowsEmptyCollection` is set. */
  empty?: () => VNode[]
  /** Shown after the last option while `loading` is true. */
  loading?: () => VNode[]
}

/** Events of `ComboBox`. */
export type ComboBoxEmits = {
  /** The popover opened or closed (`v-model:open`). */
  'update:open': [value: boolean]
  /** The input text changed (`v-model:input-value`). */
  'update:inputValue': [value: string]
  /** The end of the option list scrolled into view while `loading` is false. */
  loadMore: []
}

/** Which option gets the virtual focus when the popover opens with nothing selected (RAC `FocusStrategy`). */
export type FocusStrategy = 'first' | 'last' | null

/** Reka's listbox root context, handed to ComboBox by `RekaBridge`. */
// oxlint-disable-next-line typescript/consistent-type-definitions -- an interface is emitted by name in .d.ts; the alias would inline Reka's context and reference @vueuse/shared, which consumers can't resolve
export interface ListboxContext extends NonNullable<ReturnType<typeof injectListboxRootContext>> {}

/** Reka's combobox root context, handed to ComboBox by `RekaBridge`. */
// oxlint-disable-next-line typescript/consistent-type-definitions -- an interface is emitted by name in .d.ts; the alias would inline Reka's context and reference @vueuse/shared, which consumers can't resolve
export interface ComboboxContext extends NonNullable<
  ReturnType<typeof injectComboboxRootContext>
> {}
