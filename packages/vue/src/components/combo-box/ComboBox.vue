<script lang="ts">
import type { ValidateFn, ValidationResult } from '../../composables/useFieldValidation'
import type { PortalTarget } from '../../config'
import type { ComponentSlots } from '../../types/tv'
import type { ValidationBehavior } from '../form/context'
import type { FormFieldProps } from '../form/types'
import type { ListBoxEntry, ListBoxItem, ListBoxItemSlotProps, ListBoxSection, ListBoxValue } from '../list-box/ListBox.vue'
import type { CollectionRow } from '../list-box/listBoxCollection'
import { injectComboboxRootContext, injectListboxRootContext } from 'reka-ui'
import { defineComponent } from 'vue'
import theme from './theme'

type ComboBox = typeof theme

export type ComboBoxValue = ListBoxValue | ListBoxValue[] | null

/** The value passed to `validate` (RAC `ComboBoxValidationValue`). */
export interface ComboBoxValidationValue {
  /** The text in the input. */
  inputValue: string
  /** The selection: a value (or `null`) in single mode, an array in multiple mode. */
  value: ComboBoxValue
  /** The selected value in single mode, `null` otherwise. */
  selectedKey: ListBoxValue | null
}

export interface ComboBoxProps<T extends ListBoxItem = ListBoxItem> extends FormFieldProps {
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
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ComboBox>
}

export interface ComboBoxValueSlotProps<T extends ListBoxItem = ListBoxItem> {
  /** The selected options, in selection order. */
  selectedItems: T[]
  /** Whether nothing is selected. */
  isPlaceholder: boolean
  /** The selected labels joined as a list, or `valuePlaceholder`. */
  text: string
}

export interface ComboBoxSlots<T extends ListBoxItem = ListBoxItem> {
  /** Label content. Replaces `label`. */
  'label'?: () => any
  /** Content of the selected-value element below the input (rendered in multiple mode, or whenever this slot is used). */
  'value'?: (props: ComboBoxValueSlotProps<T>) => any
  /** Trigger button content. Defaults to a chevron. */
  'indicator'?: (props: { open: boolean }) => any
  /** Description content. Replaces `description`. */
  'description'?: () => any
  /** Error content, rendered while invalid. */
  'error'?: (props: ValidationResult) => any
  /** Whole content of each option (as ListBox `#item`). */
  'item'?: (props: ListBoxItemSlotProps<T>) => any
  /** Content before each option's text (ListBox `#item-leading`). */
  'item-leading'?: (props: ListBoxItemSlotProps<T>) => any
  /** Each option's label (ListBox `#item-label`). */
  'item-label'?: (props: ListBoxItemSlotProps<T>) => any
  /** Each option's description (ListBox `#item-description`). */
  'item-description'?: (props: ListBoxItemSlotProps<T>) => any
  /** Content after each option's text (ListBox `#item-trailing`). */
  'item-trailing'?: (props: ListBoxItemSlotProps<T>) => any
  /** Option checkmark content (ListBox `#indicator`). */
  'item-indicator'?: (props: ListBoxItemSlotProps<T>) => any
  /** Section heading (ListBox `#section-label`). */
  'section-label'?: (props: { section: ListBoxSection<T> }) => any
  /** Rendered in the popover when no option matches and `allowsEmptyCollection` is set. */
  'empty'?: () => any
  /** Shown after the last option while `loading` is true. */
  'loading'?: () => any
}

export interface ComboBoxEmits {
  /** The popover opened or closed (`v-model:open`). */
  'update:open': [value: boolean]
  /** The input text changed (`v-model:input-value`). */
  'update:inputValue': [value: string]
  /** The end of the option list scrolled into view while `loading` is false. */
  'loadMore': []
}

type ListboxContext = NonNullable<ReturnType<typeof injectListboxRootContext>>
type ComboboxContext = NonNullable<ReturnType<typeof injectComboboxRootContext>>

// Internal: hands Reka's listbox / combobox contexts to ComboBox, which drives highlight and focus itself
const RekaBridge = defineComponent({
  emits: { ready: (_listbox: ListboxContext, _combobox: ComboboxContext) => true },
  setup(_, { emit }) {
    emit('ready', injectListboxRootContext()!, injectComboboxRootContext()!)
    return () => null
  },
})
</script>

<script setup lang="ts" generic="T extends ListBoxItem = ListBoxItem">
import { ComboboxAnchor, ComboboxContent, ComboboxItem, ComboboxPortal, ComboboxRoot, useFilter } from 'reka-ui'
import { computed, getCurrentInstance, nextTick, onMounted, reactive, ref, shallowRef, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import { useFieldChrome } from '../../composables/useFieldChrome'
import { useFieldValidation } from '../../composables/useFieldValidation'
import { useKeyboardModality } from '../../composables/useKeyboardModality'
import { usePortal } from '../../composables/usePortal'
import { useFieldsetDisabled } from '../fieldset/context'
import inputTheme from '../input/theme'
import listBoxTheme from '../list-box/theme'
import { countRows, filterEntries, itemText } from '../list-box/listBoxCollection'
import ListBoxRows from '../list-box/ListBoxRows.vue'
import { useCollectionModel } from '../list-box/useCollectionModel'
import { usePressRelease } from '../select/pressRelease'

defineOptions({ inheritAttrs: false })

// Absent booleans stay `undefined`: `open` → uncontrolled, `invalid` → validation decides, `loading` → no sentinel
const props = withDefaults(defineProps<ComboBoxProps<T>>(), {
  portal: undefined,
  selectionMode: 'single',
  defaultValue: undefined,
  formValue: 'key',
  menuTrigger: 'focus',
  filter: undefined,
  open: undefined,
  invalid: undefined,
  loading: undefined,
})
const portalTarget = usePortal(() => props.portal)
const disabled = useFieldsetDisabled(() => props.disabled)
const emit = defineEmits<ComboBoxEmits>()
const slots = defineSlots<ComboBoxSlots<T>>()
const modelValue = defineModel<ComboBoxValue>()
const inputModel = defineModel<string>('inputValue')
// Whether the parent binds `v-model:input-value` (defineModel keeps a local value when it doesn't)
const vnodeProps = getCurrentInstance()?.vnode.props ?? {}
const inputControlled = () => ['inputValue', 'input-value'].some(key => key in vnodeProps)

const multiple = computed(() => props.selectionMode === 'multiple')

// ---- Collection and selection (`v-model` wins when bound) -------------------------------------------------------
// Selected items keep selection order, as RAC (`[...selectedKeys]`)
const {
  options,
  selection,
  selectedValues,
  selectedKey,
  selectedItems,
  valueText,
  isPlaceholder,
  resolveItemText,
  reset,
} = useCollectionModel<T>({
  items: () => props.items,
  model: modelValue,
  defaultValue: () => props.defaultValue,
  isMultiple: () => multiple.value,
  placeholder: () => props.valuePlaceholder,
})
const selectedText = computed(() => resolveItemText(selectedKey.value))

// ---- Input text (`v-model:input-value` wins when bound) ---------------------------------------------------------
const uncontrolledInput = ref(props.defaultInputValue ?? selectedText.value)
const inputValue = computed<string>({
  get: () => inputControlled() ? inputModel.value ?? '' : uncontrolledInput.value,
  set: (value) => {
    uncontrolledInput.value = value
    inputModel.value = value
  },
})
// Takes the key explicitly after a write: a bound `v-model` only reflects it once the parent re-renders
const resetInputValue = (key = selectedKey.value) => {
  inputValue.value = multiple.value ? '' : resolveItemText(key)
}

// ---- Filtering (RAC `useComboBoxState` + `useFilter({ sensitivity: 'base' })`) ----------------------------------
const { contains } = useFilter({ sensitivity: 'base' })
// Shows every option when the popover was opened by focus / trigger / arrow keys, until the text changes
const showAll = ref(!!(props.open ?? props.defaultOpen))
let openingFromInput = false
const matches = computed(() => {
  const text = inputValue.value
  const filter = props.filter
  if (filter === false || showAll.value)
    return (_item: ListBoxItem) => true
  return (item: ListBoxItem) => (filter ?? contains)(itemText(item), text)
})
const liveBlocks = computed(() => filterEntries(props.items, matches.value))
// What the popover renders: the live collection while open; RAC keeps the last one while the popover animates out
// (committing rewrites the text to the selected label, which would collapse the list mid-exit)
const blocks = shallowRef(liveBlocks.value)
const visibleCount = computed(() => countRows(blocks.value))
// What the open checks see: the filtered list of the current text (RAC `filteredCollection`)
const filteredCount = computed(() => {
  const filter = props.filter
  if (filter === false)
    return options.value.length
  return options.value.filter(item => (filter ?? contains)(itemText(item), inputValue.value)).length
})

// ---- Open state (the `open` prop wins when bound) ---------------------------------------------------------------
const uncontrolledOpen = ref(props.defaultOpen ?? false)
const isOpen = computed(() => (props.open ?? uncontrolledOpen.value) && !disabled.value)
watch([liveBlocks, isOpen], ([live, open]) => {
  if (open)
    blocks.value = live
})
function setOpenState(value: boolean) {
  if (value === isOpen.value)
    return
  uncontrolledOpen.value = value
  emit('update:open', value)
}

type FocusStrategy = 'first' | 'last' | null
type OpenTrigger = 'focus' | 'input' | 'manual'
// RAC `state.open(focusStrategy, trigger)`
function open(strategy: FocusStrategy, trigger: OpenTrigger) {
  if (disabled.value || props.readonly)
    return
  const displayAll = trigger === 'manual' || (trigger === 'focus' && props.menuTrigger === 'focus')
  if (props.allowsEmptyCollection || filteredCount.value > 0 || (displayAll && options.value.length > 0)) {
    if (displayAll && !isOpen.value)
      showAll.value = true
    openingFromInput = trigger === 'input'
    setOpenState(true)
    openingFromInput = false
    highlightOnOpen(strategy)
  }
}
function close() {
  setOpenState(false)
}

// RAC `commitSelection` / `commitCustomValue` / `commitValue` / `revert`
function commitSelection() {
  resetInputValue()
  close()
}
// RAC sets `lastValueRef` first so clearing the selection doesn't reset the custom text
let keepText = false
function commitCustomValue() {
  if (!multiple.value) {
    keepText = true
    selection.value = null
    nextTick(() => {
      keepText = false
    })
  }
  close()
}
function commitValue() {
  if (props.allowsCustomValue) {
    if (inputValue.value === selectedText.value)
      commitSelection()
    else
      commitCustomValue()
  }
  else {
    commitSelection()
  }
}
function revert() {
  if (props.allowsCustomValue && selectedKey.value == null)
    commitCustomValue()
  else
    commitSelection()
}

// ---- Reka bridge: highlight (RAC virtual focus) -----------------------------------------------------------------
// Reactive: the bridge mounts after ComboBox's first render, which already reads `highlighted`
const listboxRef = shallowRef<ListboxContext>()
let combobox: ComboboxContext | undefined
function onReady(listboxContext: ListboxContext, comboboxContext: ComboboxContext) {
  // DOM focus stays in the input; Reka highlights options without focusing them
  listboxContext.focusable.value = false
  listboxRef.value = listboxContext
  combobox = comboboxContext
}
const highlighted = computed(() => listboxRef.value?.highlightedElement.value ?? null)
// RAC interaction modality: the highlight is focus-visible after keyboard interaction
const keyboardModality = useKeyboardModality()
onMounted(() => {
  if (input.value)
    combobox?.onInputElementChange(input.value)
  if (isOpen.value)
    highlightOnOpen(null)
})

const content = useTemplateRef<{ $el: HTMLElement }>('content')
function enabledOptions(): HTMLElement[] {
  const el = content.value?.$el as HTMLElement | undefined
  return el ? [...el.querySelectorAll<HTMLElement>('[role=option]:not([data-disabled])')] : []
}
function setHighlight(el: HTMLElement | null | undefined) {
  const listbox = listboxRef.value
  if (!listbox)
    return
  if (el)
    listbox.changeHighlight(el, true, false)
  else
    listbox.highlightedElement.value = null
}
// RAC `useSelectableCollection` autoFocus: the first selected option, else first / last per strategy, else none
// Reka's own `highlightSelected` (which falls back to the first option) runs a few ticks after a model change
async function afterRekaHighlight() {
  await nextTick()
  await nextTick()
  await nextTick()
}
async function highlightOnOpen(strategy: FocusStrategy) {
  await afterRekaHighlight()
  const list = enabledOptions()
  const selected = list.find(el => el.getAttribute('data-state') === 'checked')
  setHighlight(selected ?? (strategy === 'first' ? list[0] : strategy === 'last' ? list.at(-1) : null))
}
function navigate(key: 'ArrowDown' | 'ArrowUp' | 'Home' | 'End' | 'PageUp' | 'PageDown') {
  const list = enabledOptions()
  if (!list.length)
    return
  const current = highlighted.value ? list.indexOf(highlighted.value) : -1
  let next: HTMLElement | undefined
  if (key === 'Home' || key === 'PageUp')
    next = list[0]
  else if (key === 'End' || key === 'PageDown')
    next = list.at(-1)
  else if (current === -1)
    next = key === 'ArrowDown' ? list[0] : list.at(-1)
  // RAC doesn't wrap (`shouldFocusWrap` defaults to false)
  else
    next = list[Math.min(Math.max(current + (key === 'ArrowDown' ? 1 : -1), 0), list.length - 1)]
  setHighlight(next)
}

// ---- Input events -----------------------------------------------------------------------------------------------
const input = useTemplateRef<HTMLInputElement>('input')
// ComboboxRoot renders a fragment (PopperRoot), so its `$el` isn't the element; find it from the input
const rootEl = () => input.value?.closest<HTMLElement>('[data-slot=combo-box]') ?? undefined
const focused = ref(false)
const focusVisible = ref(false)
let valueOnFocus: [string, string] = ['', '']
const snapshot = (): [string, string] => [inputValue.value, JSON.stringify(selection.value)]

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  if (props.readonly)
    return
  inputValue.value = value
  onInputTextChange()
}
// RAC `useComboBoxState` effect when the text changes
function onInputTextChange() {
  setHighlight(null)
  showAll.value = false
  if (!multiple.value && inputValue.value === '') {
    const hadSelection = selection.value != null
    selection.value = null
    // Reka re-highlights its first option when the model changes; RAC keeps no focused option, so Tab / Enter
    // commit the cleared value
    if (hadSelection)
      afterRekaHighlight().then(() => setHighlight(null))
  }
  if (focused.value && (filteredCount.value > 0 || props.allowsEmptyCollection) && !isOpen.value && props.menuTrigger !== 'manual')
    open(null, 'input')
  else if (isOpen.value && !props.allowsEmptyCollection && filteredCount.value === 0)
    close()
}

function onFocus(event: FocusEvent) {
  focusVisible.value = event.target instanceof Element && event.target.matches(':focus-visible')
  if (focused.value)
    return
  focused.value = true
  valueOnFocus = snapshot()
  if (props.menuTrigger === 'focus' && !suppressFocusOpen)
    open(null, 'focus')
}
function onBlur(event: FocusEvent) {
  focusVisible.value = false
  const next = event.relatedTarget as Node | null
  // Focus moving to the trigger or into the popover isn't a blur of the field
  if (next && (rootEl()?.contains(next) || content.value?.$el?.contains?.(next)))
    return
  focused.value = false
  commitValue()
  const now = snapshot()
  if (now[0] !== valueOnFocus[0] || now[1] !== valueOnFocus[1])
    commitValidation()
}

function selectHighlighted() {
  const el = highlighted.value
  if (el?.isConnected)
    el.click()
}
function onKeydown(event: KeyboardEvent) {
  if (event.isComposing || props.readonly)
    return
  switch (event.key) {
    case 'Enter': {
      if (isOpen.value)
        event.preventDefault()
      if (isOpen.value && highlighted.value) {
        const value = itemValueOf(highlighted.value)
        // Re-picking the selected option just commits
        if (!multiple.value && value !== undefined && value === selectedKey.value)
          commitSelection()
        else
          selectHighlighted()
      }
      else {
        commitValue()
      }
      break
    }
    case 'Tab':
      if (isOpen.value) {
        if (highlighted.value)
          selectHighlighted()
        else
          commitValue()
      }
      break
    case 'Escape':
      if (isOpen.value || inputValue.value !== selectedText.value)
        event.preventDefault()
      revert()
      break
    case 'ArrowDown':
    case 'ArrowUp':
      event.preventDefault()
      if (!isOpen.value)
        open(event.key === 'ArrowDown' ? 'first' : 'last', 'manual')
      else
        navigate(event.key)
      break
    case 'Home':
    case 'End':
    case 'PageUp':
    case 'PageDown':
      if (isOpen.value) {
        event.preventDefault()
        navigate(event.key)
      }
      break
    case 'ArrowLeft':
    case 'ArrowRight':
      setHighlight(null)
      break
  }
}
const valueAttr = 'data-combo-box-value'
function itemValueOf(el: HTMLElement): ListBoxValue | undefined {
  const raw = el.getAttribute(valueAttr)
  if (raw == null)
    return undefined
  return options.value.find(item => String(item.value) === raw)?.value
}

// ---- Trigger button (RAC: press start toggles, focus stays in the input) ----------------------------------------
let suppressFocusOpen = false
const triggerHovered = ref(false)
function pressTrigger(strategy: FocusStrategy) {
  if (disabled.value || props.readonly)
    return
  const wasOpen = isOpen.value
  suppressFocusOpen = true
  input.value?.focus()
  suppressFocusOpen = false
  if (wasOpen)
    close()
  else
    open(strategy, 'manual')
}
function onTriggerPointerdown(event: PointerEvent) {
  if (event.button !== 0)
    return
  event.preventDefault()
  pressTrigger(null)
}
function onTriggerClick(event: MouseEvent) {
  // Keyboard / programmatic clicks (pointer presses are handled on pointerdown)
  if (event.detail === 0)
    pressTrigger('first')
}

// ---- Selection from the list (Reka ComboboxItem / ListboxRoot) --------------------------------------------------
const pressRelease = usePressRelease()
const rekaValue = computed(() => multiple.value ? selectedValues.value : (selectedKey.value ?? undefined))
function onRekaValue(value: unknown) {
  if (multiple.value) {
    selection.value = Array.isArray(value) ? value as ListBoxValue[] : []
    // RAC resets the text and keeps the popover open. Reka keeps the picked option highlighted; RAC drops the
    // virtual focus after a pointer pick and keeps it after a keyboard one
    inputValue.value = ''
    showAll.value = false
    if (!keyboardModality.value)
      afterRekaHighlight().then(() => setHighlight(null))
  }
  else {
    const key = (value as ListBoxValue | undefined) ?? null
    selection.value = key
    resetInputValue(key)
  }
  commitValidation()
}
function onRekaOpen(value: boolean) {
  // Reka closes on single selection and on dismiss (outside press, Escape, focus outside)
  if (!value) {
    if (focused.value && document.activeElement === input.value)
      close()
    else
      commitValue()
  }
}

// When the selection changes from outside (v-model), mirror the text like RAC
watch(selectedText, () => {
  if (!multiple.value && !focused.value && !keepText && !inputControlled())
    uncontrolledInput.value = selectedText.value
})
// Opened from outside (`v-model:open`): show every option, like RAC's manual open
watch(isOpen, (value) => {
  if (value && !openingFromInput)
    showAll.value = true
}, { flush: 'sync' })
watch(disabled, (disabled) => {
  if (disabled)
    close()
})

// ---- Validation ---------------------------------------------------------------------------------------------------
const { validation, commitValidation } = useFieldValidation<ComboBoxValidationValue>({
  formField: props,
  value: () => multiple.value && selectedValues.value.length === 0
    ? null
    : { inputValue: inputValue.value, value: selection.value, selectedKey: selectedKey.value },
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => rootEl(),
  onReset: () => {
    const value = reset()
    inputValue.value = props.defaultInputValue ?? (multiple.value ? '' : resolveItemText(value as ListBoxValue | null))
  },
})
const invalid = computed(() => validation.value.isInvalid)
const nativeRequired = computed(() => !!props.required && (props.validationBehavior ?? 'native') === 'native'
  && (!multiple.value || selectedValues.value.length === 0))

// ---- Ids / ARIA ---------------------------------------------------------------------------------------------------
const attrs = useAttrs()
const autoId = useId()
const id = computed(() => props.id ?? `${autoId}-input`)
const triggerId = `${autoId}-trigger`
const listboxId = `${autoId}-listbox`
const valueId = `${autoId}-value`
const showValue = computed(() => multiple.value || !!slots.value)
// Chrome ids derive from `autoId` even with an `id` prop (that one names the input)
const { labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } = useFieldChrome({
  props,
  baseId: autoId,
  slots,
  invalid,
  validation,
  disabled,
  required: () => props.required,
  hideDescriptionWhenInvalid: true,
  ariaDescribedBy: () => attrs['aria-describedby'] as string | undefined,
  describedByIds: () => [showValue.value && valueId],
})
const inputLabelledBy = computed(() => (attrs['aria-labelledby'] as string | undefined) ?? (hasLabel.value ? labelId.value : undefined))
const rootAttrs = computed(() => {
  const { 'aria-label': _label, 'aria-labelledby': _labelledby, 'aria-describedby': _describedby, ...rest } = attrs
  return rest
})
const submitText = computed(() => props.allowsCustomValue || props.formValue === 'text')
const hiddenValues = computed(() => selectedValues.value.length ? selectedValues.value : [''])

// ---- Classes ------------------------------------------------------------------------------------------------------
const ui = useComponentUI('comboBox', theme, () => ({ fullWidth: props.fullWidth }))
const inputUi = useComponentUI('input', inputTheme, () => ({ variant: props.variant, fullWidth: false }))
const listBoxUi = useComponentUI('listBox', listBoxTheme, () => ({}))
const rowSlots = ['item', 'item-leading', 'item-label', 'item-description', 'item-trailing', 'section-label', 'empty', 'loading'] as const
const forwarded = computed(() => rowSlots.filter(name => slots[name]))
// One stable object (reactive unwraps the ref): a fresh object per change would re-render every option
const virtualFocus = reactive({ keyboard: keyboardModality })
// RAC `shouldFocusOnHover`: hover moves the virtual focus unless the last interaction was a keyboard one
function onOptionPointermove(event: PointerEvent) {
  const el = event.currentTarget as HTMLElement
  if (!keyboardModality.value && highlighted.value !== el && !el.hasAttribute('data-disabled'))
    setHighlight(el)
}
// No closures per row: options re-render only when their own props change
function optionAttrs(row: CollectionRow) {
  return { [valueAttr]: String(row.item.value), onPointermove: onOptionPointermove }
}
</script>

<template>
  <ComboboxRoot
    v-bind="rootAttrs"
    as="div"
    data-slot="combo-box"
    :model-value="rekaValue as any"
    :multiple="multiple"
    :disabled="disabled"
    :open="isOpen"
    ignore-filter
    :highlight-on-hover="false"
    :reset-search-term-on-blur="false"
    :reset-search-term-on-select="false"
    :data-focused="focused ? 'true' : undefined"
    :data-open="isOpen ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:model-value="onRekaValue"
    @update:open="onRekaOpen"
  >
    <RekaBridge @ready="onReady" />
    <FieldLabel :id="labelId" :for="id" :class="ui.label({ class: props.ui?.label })" />
    <ComboboxAnchor
      as="div"
      role="group"
      data-slot="combo-box-input-group"
      :data-disabled="disabled ? 'true' : undefined"
      :data-invalid="invalid ? 'true' : undefined"
      :data-focus-within="focused ? 'true' : undefined"
      :data-focus-visible="focusVisible ? 'true' : undefined"
      :class="ui.inputGroup({ class: props.ui?.inputGroup })"
    >
      <input
        :id="id"
        ref="input"
        type="text"
        role="combobox"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        aria-autocomplete="list"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="isOpen ? listboxId : undefined"
        :aria-activedescendant="isOpen && highlighted ? highlighted.id : undefined"
        :aria-label="attrs['aria-label'] as string | undefined"
        :aria-labelledby="inputLabelledBy"
        :aria-describedby="describedBy"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-required="required && !nativeRequired ? 'true' : undefined"
        :value="inputValue"
        :placeholder="placeholder"
        :name="submitText ? name : undefined"
        :disabled="disabled || undefined"
        :readonly="readonly || undefined"
        :required="nativeRequired || undefined"
        data-slot="input"
        :data-invalid="invalid ? 'true' : undefined"
        :data-disabled="disabled ? 'true' : undefined"
        :data-focused="focused ? 'true' : undefined"
        :data-focus-visible="focusVisible ? 'true' : undefined"
        :class="inputUi.base({ class: props.ui?.input })"
        @input="onInput"
        @keydown="onKeydown"
        @focus="onFocus"
        @blur="onBlur"
      >
      <button
        :id="triggerId"
        type="button"
        tabindex="-1"
        data-slot="combo-box-trigger"
        aria-label="Show suggestions"
        :aria-labelledby="hasLabel ? `${triggerId} ${labelId}` : undefined"
        aria-haspopup="listbox"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="isOpen ? listboxId : undefined"
        :disabled="disabled || readonly || undefined"
        :data-disabled="disabled || readonly ? 'true' : undefined"
        :data-open="isOpen ? 'true' : undefined"
        :data-pressed="isOpen ? 'true' : undefined"
        :data-hovered="triggerHovered ? 'true' : undefined"
        :class="ui.trigger({ class: props.ui?.trigger })"
        @pointerdown="onTriggerPointerdown"
        @click="onTriggerClick"
        @pointerenter="triggerHovered = $event.pointerType === 'mouse'"
        @pointerleave="triggerHovered = false"
      >
        <slot name="indicator" :open="isOpen">
          <svg aria-hidden="true" data-slot="combo-box-trigger-default-icon" fill="none" height="16" role="presentation" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd" d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06" fill="currentColor" fill-rule="evenodd" />
          </svg>
        </slot>
      </button>
    </ComboboxAnchor>
    <div
      v-if="showValue"
      :id="valueId"
      data-slot="combo-box-value"
      :data-placeholder="isPlaceholder ? 'true' : undefined"
      :class="ui.value({ class: props.ui?.value })"
    >
      <slot name="value" :selected-items="selectedItems" :is-placeholder="isPlaceholder" :text="valueText">{{ valueText }}</slot>
    </div>
    <FieldDescription />
    <FieldError />
    <template v-if="name && !submitText">
      <input v-for="(value, i) in hiddenValues" :key="i" type="hidden" :name="name" :value="value">
    </template>
    <ComboboxPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
      <ComboboxContent
        ref="content"
        position="popper"
        :role="undefined"
        :aria-orientation="undefined"
        :aria-multiselectable="undefined"
        :data-orientation="undefined"
        data-slot="combo-box-popover"
        side="bottom"
        align="center"
        :side-offset="8"
        :collision-padding="12"
        :class="ui.popover({ class: props.ui?.popover })"
      >
        <div
          :id="listboxId"
          role="listbox"
          aria-orientation="vertical"
          data-slot="list-box"
          data-layout="stack"
          data-orientation="vertical"
          aria-label="Suggestions"
          :aria-labelledby="hasLabel ? `${listboxId} ${labelId}` : undefined"
          :aria-multiselectable="multiple ? 'true' : undefined"
          :data-empty="visibleCount ? undefined : 'true'"
          :class="listBoxUi.base()"
          @mousedown.prevent
          @pointerdown="pressRelease.onPointerdown"
          @pointerup="pressRelease.onPointerup"
        >
          <ListBoxRows
            v-if="forwarded.length || slots['item-indicator']"
            :blocks="blocks"
            :selected-values="selectedValues"
            :selection-mode="selectionMode"
            :disabled="disabled"
            :classes="listBoxUi as any"
            :component="ComboboxItem"
            :virtual-focus="virtualFocus"
            :option-attrs="optionAttrs"
            :loading="loading"
            @load-more="emit('loadMore')"
          >
            <template v-for="name in forwarded" #[name]="state">
              <slot :name="name" v-bind="state as any" />
            </template>
            <template v-if="slots['item-indicator']" #indicator="state">
              <slot name="item-indicator" v-bind="state as ListBoxItemSlotProps<T>" />
            </template>
          </ListBoxRows>
          <!-- Slot-less branch: forwarded (dynamic) slots would force-update the rows on every render -->
          <ListBoxRows
            v-else
            :blocks="blocks"
            :selected-values="selectedValues"
            :selection-mode="selectionMode"
            :disabled="disabled"
            :classes="listBoxUi as any"
            :component="ComboboxItem"
            :virtual-focus="virtualFocus"
            :option-attrs="optionAttrs"
            :loading="loading"
            @load-more="emit('loadMore')"
          />
        </div>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
