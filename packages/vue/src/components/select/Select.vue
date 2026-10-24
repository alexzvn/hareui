<script lang="ts">
import type { ValidateFn, ValidationResult } from '../../composables/useFieldValidation'
import type { PortalTarget } from '../../config'
import type { ComponentSlots } from '../../types/tv'
import type { ValidationBehavior } from '../form/context'
import type { FormFieldProps } from '../form/types'
import type { ListBoxEntry, ListBoxItem, ListBoxItemSlotProps, ListBoxSection, ListBoxValue } from '../list-box/ListBox.vue'
import theme from './theme'

type Select = typeof theme

export type SelectValue = ListBoxValue | ListBoxValue[] | null

export interface SelectProps<T extends ListBoxItem = ListBoxItem> extends FormFieldProps {
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
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Select>
}

export interface SelectValueSlotProps<T extends ListBoxItem = ListBoxItem> {
  /** The selected options, in collection order. */
  selectedItems: T[]
  /** Whether nothing is selected. */
  isPlaceholder: boolean
  /** The placeholder, or the selected labels joined as a list. */
  text: string
}

export interface SelectSlots<T extends ListBoxItem = ListBoxItem> {
  /** Label content. Replaces `label`. */
  'label'?: () => any
  /** Content inside the trigger before the value. */
  'leading'?: () => any
  /** Trigger value content. Defaults to the selected label(s) or the placeholder. */
  'value'?: (props: SelectValueSlotProps<T>) => any
  /** Trigger indicator content. Defaults to a chevron. */
  'indicator'?: (props: { open: boolean }) => any
  /** Clear button content. Defaults to a close icon. */
  'clear'?: () => any
  /** Description content. Replaces `description`. */
  'description'?: () => any
  /** Error content, rendered while invalid. */
  'error'?: (props: ValidationResult) => any
  /** Whole content of each option (forwarded to ListBox `#item`). */
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
  /** Rendered in the popover when `items` is empty (ListBox `#empty`). */
  'empty'?: () => any
  /** Shown after the last option while `loading` is true (ListBox `#loading`). */
  'loading'?: () => any
}

export interface SelectEmits {
  /** The selection was cleared with the clear button or Backspace / Delete. */
  clear: []
  /** The popover opened or closed (`v-model:open`). */
  'update:open': [value: boolean]
  /** The end of the option list scrolled into view while `loading` is false (ListBox `load-more`). */
  'loadMore': []
}
</script>

<script setup lang="ts" generic="T extends ListBoxItem = ListBoxItem">
import { injectPopoverRootContext, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { computed, defineComponent, provide, ref, useAttrs, useId, useTemplateRef, watch, watchEffect } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import { useFieldValidation } from '../../composables/useFieldValidation'
import { keyboardModalityKey, useKeyboardModality } from '../../composables/useKeyboardModality'
import { usePortal } from '../../composables/usePortal'
import { useFieldsetDisabled } from '../fieldset/context'
import listBoxTheme from '../list-box/theme'
import Description from '../description/Description.vue'
import FieldError from '../field-error/FieldError.vue'
import Label from '../label/Label.vue'
import ListBox from '../list-box/ListBox.vue'
import { useTypeahead } from '../list-box/useTypeahead'
import { usePressRelease } from './pressRelease'

defineOptions({ inheritAttrs: false })

// The popover's options mount after the press that opens it, so the modality is tracked from here
provide(keyboardModalityKey, useKeyboardModality())

// Absent booleans stay `undefined` (not `false`): `open` → uncontrolled, `invalid` → validation decides, `loading` → no sentinel
const props = withDefaults(defineProps<SelectProps<T>>(), {
  portal: undefined,
  selectionMode: 'single',
  defaultValue: undefined,
  placeholder: 'Select an item',
  side: 'bottom',
  align: 'center',
  open: undefined,
  invalid: undefined,
  loading: undefined,
})
const portalTarget = usePortal(() => props.portal)
const disabled = useFieldsetDisabled(() => props.disabled)
const emit = defineEmits<SelectEmits>()
const slots = defineSlots<SelectSlots<T>>()
const modelValue = defineModel<SelectValue>()

const multiple = computed(() => props.selectionMode === 'multiple')

// Selection: `v-model` wins when bound; otherwise local, seeded from `defaultValue`
const uncontrolled = ref<SelectValue>(props.defaultValue ?? (multiple.value ? [] : null))
const selection = computed<SelectValue>({
  get: () => modelValue.value !== undefined ? modelValue.value : uncontrolled.value,
  set: (value) => {
    uncontrolled.value = value
    modelValue.value = value
  },
})
const selectedValues = computed<ListBoxValue[]>(() => {
  const value = selection.value
  if (value == null)
    return []
  return Array.isArray(value) ? value : [value]
})

// Open state: the `open` prop wins when bound
const uncontrolledOpen = ref(props.defaultOpen ?? false)
const isOpen = computed({
  get: () => props.open ?? uncontrolledOpen.value,
  set: (value: boolean) => {
    uncontrolledOpen.value = value
    emit('update:open', value)
  },
})
function setOpen(value: boolean) {
  if (value && disabled.value)
    return
  isOpen.value = value
}

// Flat options in collection order
const options = computed<ListBoxItem[]>(() => (props.items ?? []).flatMap((entry) => {
  if ('type' in entry && entry.type === 'section')
    return entry.items
  if ('type' in entry && entry.type === 'separator')
    return []
  return [entry as ListBoxItem]
}))
const textOf = (item: ListBoxItem) => item.textValue ?? item.label ?? String(item.value)
const selectedItems = computed(() => options.value.filter(item => selectedValues.value.includes(item.value)) as T[])
const selectedSet = computed(() => new Set(selectedValues.value))
const listFormat = computed(() => new Intl.ListFormat(undefined, { type: 'conjunction' }))
const valueText = computed(() => selectedItems.value.length
  ? (multiple.value ? listFormat.value.format(selectedItems.value.map(textOf)) : textOf(selectedItems.value[0]!))
  : props.placeholder)
const isPlaceholder = computed(() => selectedItems.value.length === 0)

const root = useTemplateRef<HTMLElement>('root')
const trigger = useTemplateRef<{ $el: HTMLElement } | HTMLElement>('trigger')
const triggerEl = () => {
  const t = trigger.value
  return t instanceof HTMLElement ? t : t?.$el
}

const { validation, commitValidation } = useFieldValidation<SelectValue>({
  formField: props,
  value: () => selection.value,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  onReset: () => {
    selection.value = props.defaultValue ?? (multiple.value ? [] : null)
  },
})
const invalid = computed(() => validation.value.isInvalid)

function onListUpdate(value: ListBoxValue | ListBoxValue[] | null | undefined) {
  selection.value = value ?? (multiple.value ? [] : null)
  commitValidation()
  // Single selection closes the popover; focus returns to the trigger
  if (!multiple.value)
    setOpen(false)
}

function clear() {
  if (disabled.value || isPlaceholder.value)
    return
  selection.value = multiple.value ? [] : null
  commitValidation()
  emit('clear')
}

// RAC Select: typing on the closed trigger selects the first option, from the selected one onwards (inclusive, so a
// repeated character stays put) and then from the top, whose text starts with the typed string. Space opens instead.
const typeahead = useTypeahead({ start: 'current' })

function onTriggerKeydown(event: KeyboardEvent) {
  triggerPress = false
  if (disabled.value)
    return
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    // RAC focus strategy: ArrowUp opens on the last option (unless one is selected)
    openStrategy = event.key === 'ArrowUp' ? 'last' : 'first'
    setOpen(true)
  }
  else if ((event.key === 'Backspace' || event.key === 'Delete') && props.clearable && !isOpen.value) {
    event.preventDefault()
    clear()
  }
  else {
    typeahead.onKeydown(event, () => ({
      items: options.value,
      text: textOf,
      disabled: item => !!item.disabled,
      isCurrent: item => item.value === selectedValues.value[0],
    }), (match) => {
      if (!multiple.value) {
        selection.value = match.value
        commitValidation()
      }
    })
  }
}

// RAC Button / Select interaction states
const hovered = ref(false)
const focused = ref(false)
const focusVisible = ref(false)
function onTriggerFocus(event: FocusEvent) {
  focused.value = true
  focusVisible.value = event.target instanceof Element && event.target.matches(':focus-visible')
}
function onTriggerBlur() {
  focused.value = false
  focusVisible.value = false
}

// Focus moves into the list on open, as in RAC: the first selected option, else the first option (the last one
// when opened with ArrowUp), else (empty collection) the listbox itself
const content = useTemplateRef<{ $el: HTMLElement }>('content')
const listBox = useTemplateRef<{ highlightSelected: () => Promise<void> | undefined }>('listBox')
let openStrategy: 'first' | 'last' = 'first'
async function onOpenAutoFocus(event: Event) {
  event.preventDefault()
  const strategy = openStrategy
  openStrategy = 'first'
  await listBox.value?.highlightSelected()
  const list = content.value?.$el.querySelector<HTMLElement>('[data-slot=list-box]')
  // Reka's End key moves the highlight (and focus) to the last enabled option
  if (list && strategy === 'last' && isPlaceholder.value)
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', cancelable: true }))
  if (list && !list.contains(document.activeElement))
    list.focus()
}
// Reka's non-modal popover skips the trigger refocus after an outside press; RAC restores focus to the trigger
// unless the press moved it to another element
function onCloseAutoFocus(event: Event) {
  event.preventDefault()
  const active = document.activeElement
  if (!active || active === document.body || content.value?.$el.contains(active))
    triggerEl()?.focus()
}

// RAC Select opens on mouse press start, and releasing over an option selects it (press-drag-release)
let triggerPress = false
function onTriggerPointerdown(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || event.button !== 0 || disabled.value)
    return
  // The click that ends this press must not toggle again
  triggerPress = true
  triggerEl()?.focus()
  setOpen(!isOpen.value)
  const release = () => setTimeout(() => {
    triggerPress = false
  })
  window.addEventListener('pointerup', release, { once: true, capture: true })
  window.addEventListener('pointercancel', release, { once: true, capture: true })
}
function onTriggerMousedown(event: MouseEvent) {
  // Focus stays where the press put it (the trigger, or the list once open)
  if (triggerPress)
    event.preventDefault()
}
function onRootOpenChange(value: boolean) {
  if (!triggerPress)
    setOpen(value)
}
const pressRelease = usePressRelease()

// The validation composable focuses the first native control of an invalid field; the hidden <select>
// isn't focusable for users, so hand focus to the trigger (RAC marks it `data-react-aria-prevent-focus`)
function onHiddenInvalid() {
  requestAnimationFrame(() => {
    if (document.activeElement instanceof HTMLSelectElement && root.value?.contains(document.activeElement))
      triggerEl()?.focus({ focusVisible: true } as FocusOptions)
  })
}

const attrs = useAttrs()
const autoId = useId()
const id = computed(() => props.id ?? autoId)
const labelId = computed(() => `${id.value}-label`)
const valueId = computed(() => `${id.value}-value`)
const hasLabel = computed(() => !!(props.label || slots.label))
const hasDescription = computed(() => !!(props.description || slots.description))
const hasError = computed(() => invalid.value && !!(props.errorMessage || slots.error || validation.value.validationErrors.length))
const descriptionId = computed(() => `${id.value}-description`)
const errorId = computed(() => `${id.value}-error`)
const describedBy = computed(() => [
  hasDescription.value ? descriptionId.value : undefined,
  hasError.value ? errorId.value : undefined,
].filter(Boolean).join(' ') || undefined)
// `aria-labelledby` overrides `aria-label`, so an `aria-label`-only trigger references itself to keep that name (as RAC does)
const triggerLabelledBy = computed(() => [
  attrs['aria-labelledby'] as string | undefined,
  hasLabel.value ? labelId.value : undefined,
  attrs['aria-label'] && !attrs['aria-labelledby'] && !hasLabel.value ? id.value : undefined,
  valueId.value,
].filter(Boolean).join(' '))
const listLabelledBy = computed(() => (attrs['aria-labelledby'] as string | undefined) ?? (hasLabel.value ? labelId.value : undefined))
// RAC names the popover dialog like the listbox (or after an `aria-label`-only trigger). Reka labels its content with
// its own trigger id, which the trigger's `id` replaces, so point that id at the label instead (set before the trigger's
// setup, which only fills it when empty)
const popoverLabelledBy = computed(() => listLabelledBy.value ?? id.value)
const PopoverLabel = defineComponent({
  setup() {
    const popover = injectPopoverRootContext()
    watchEffect(() => {
      popover.triggerId = popoverLabelledBy.value
    })
    return () => null
  },
})
// Bound after the root's `data-slot`, so a wrapping component (CellSelect, InlineSelect) can rename the root
const rootAttrs = computed(() => {
  const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs
  return rest
})

// ListBox item slots are forwarded; the option checkmark is `item-indicator` here (`indicator` is the chevron)
const itemSlots = ['item', 'item-leading', 'item-label', 'item-description', 'item-trailing', 'section-label', 'empty', 'loading'] as const
const forwarded = computed(() => itemSlots.filter(name => slots[name]))

const ui = useComponentUI('select', theme, () => ({ variant: props.variant, fullWidth: props.fullWidth }))
// Classes for the hidden indicator copies inside the value (RAC renders the item's own indicator there);
// per-item variant override, as in ListBoxOption
const listBoxUi = useComponentUI('listBox', listBoxTheme, () => ({}))
function valueIndicatorClass(item: ListBoxItem) {
  return (listBoxUi.value.indicator as (options?: { variant?: string }) => string)({ variant: item.variant })
}

watch(disabled, (disabled) => {
  if (disabled)
    setOpen(false)
})
</script>

<template>
  <div
    ref="root"
    data-slot="select"
    v-bind="rootAttrs"
    :data-focused="focused || isOpen ? 'true' : undefined"
    :data-focus-visible="focusVisible ? 'true' : undefined"
    :data-open="isOpen ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <!-- Each slot site is split so the no-slot branch isn't compiled as a forwarded slot, which would force-update the child on every render -->
    <Label
      v-if="hasLabel && $slots.label"
      :id="labelId"
      as="span"
      :disabled="disabled"
      :invalid="invalid"
      :required="required"
      @click="triggerEl()?.focus()"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </Label>
    <Label
      v-else-if="hasLabel"
      :id="labelId"
      as="span"
      :disabled="disabled"
      :invalid="invalid"
      :required="required"
      @click="triggerEl()?.focus()"
    >
      {{ label }}
    </Label>
    <PopoverRoot :open="isOpen" :modal="false" @update:open="onRootOpenChange">
      <PopoverLabel />
      <PopoverTrigger as-child>
        <button
          :id="id"
          ref="trigger"
          type="button"
          data-slot="select-trigger"
          aria-haspopup="listbox"
          :aria-label="attrs['aria-label'] as string | undefined"
          :aria-labelledby="triggerLabelledBy"
          :aria-describedby="describedBy"
          :aria-invalid="invalid ? 'true' : undefined"
          :disabled="disabled"
          :data-disabled="disabled ? 'true' : undefined"
          :data-pressed="isOpen ? 'true' : undefined"
          :data-hovered="hovered ? 'true' : undefined"
          :data-focused="focused ? 'true' : undefined"
          :data-focus-visible="focusVisible ? 'true' : undefined"
          :class="ui.trigger({ class: props.ui?.trigger })"
          @keydown="onTriggerKeydown"
          @focus="onTriggerFocus"
          @blur="onTriggerBlur"
          @pointerdown="onTriggerPointerdown"
          @mousedown="onTriggerMousedown"
          @pointerenter="hovered = $event.pointerType === 'mouse'"
          @pointerleave="hovered = false"
        >
          <slot name="leading" />
          <span
            :id="valueId"
            data-slot="select-value"
            :data-placeholder="isPlaceholder ? 'true' : undefined"
            :class="ui.value({ class: props.ui?.value })"
          >
            <slot name="value" :selected-items="selectedItems" :is-placeholder="isPlaceholder" :text="valueText">
              {{ valueText }}
              <!-- RAC SelectValue re-renders each selected item's children, indicator included; the value class hides it -->
              <span v-for="item in selectedItems" :key="String(item.value)" aria-hidden="true" data-slot="list-box-item-indicator" :class="valueIndicatorClass(item)">
                <svg aria-hidden="true" data-slot="list-box-item-indicator--checkmark" fill="none" role="presentation" stroke="currentColor" stroke-dasharray="22" stroke-dashoffset="66" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 17 18">
                  <polyline points="1 9 7 14 15 4" />
                </svg>
              </span>
            </slot>
          </span>
          <span
            v-if="clearable"
            aria-hidden="true"
            data-slot="select-clear-button"
            :data-empty="isPlaceholder ? 'true' : undefined"
            :class="ui.clearButton({ class: props.ui?.clearButton })"
            @pointerdown.stop
            @click.stop.prevent="clear"
          >
            <slot name="clear">
              <svg aria-hidden="true" data-slot="select-clear-button-icon" fill="none" height="16" role="presentation" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                <path clip-rule="evenodd" d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06Z" fill="currentColor" fill-rule="evenodd" />
              </svg>
            </slot>
          </span>
          <span
            v-if="slots.indicator"
            aria-hidden="true"
            data-slot="select-indicator"
            :data-open="isOpen ? 'true' : undefined"
            :class="ui.indicator({ class: props.ui?.indicator })"
          >
            <slot name="indicator" :open="isOpen" />
          </span>
          <svg
            v-else
            aria-hidden="true"
            data-slot="select-default-indicator"
            :data-open="isOpen ? 'true' : undefined"
            fill="none"
            height="16"
            role="presentation"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
            :class="ui.indicator({ class: props.ui?.indicator })"
          >
            <path clip-rule="evenodd" d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06" fill="currentColor" fill-rule="evenodd" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
        <PopoverContent
          ref="content"
          data-slot="select-popover"
          :side="side"
          :align="align"
          :side-offset="8"
          :collision-padding="12"
          :class="ui.popover({ class: props.ui?.popover })"
          @open-auto-focus="onOpenAutoFocus"
          @close-auto-focus="onCloseAutoFocus"
          @pointerdown="pressRelease.onPointerdown"
          @pointerup="pressRelease.onPointerup"
        >
          <ListBox
            ref="listBox"
            :model-value="multiple ? selectedValues : (selectedValues[0] ?? null)"
            :items="items"
            :selection-mode="selectionMode"
            highlight-on-hover
            escape-key-behavior="none"
            :loading="loading"
            :aria-labelledby="listLabelledBy"
            :aria-label="listLabelledBy ? undefined : (attrs['aria-label'] as string | undefined)"
            @update:model-value="onListUpdate"
            @load-more="emit('loadMore')"
          >
            <template v-for="name in forwarded" #[name]="state">
              <slot :name="name" v-bind="state as any" />
            </template>
            <template v-if="slots['item-indicator']" #indicator="state">
              <slot name="item-indicator" v-bind="state as ListBoxItemSlotProps<T>" />
            </template>
          </ListBox>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
    <Description v-if="hasDescription && $slots.description" :id="descriptionId">
      <slot name="description">
        {{ description }}
      </slot>
    </Description>
    <Description v-else-if="hasDescription" :id="descriptionId">
      {{ description }}
    </Description>
    <FieldError v-if="hasError && $slots.error" :id="errorId">
      <slot name="error" v-bind="validation">
        {{ errorMessage ?? validation.validationErrors.join(' ') }}
      </slot>
    </FieldError>
    <FieldError v-else-if="hasError" :id="errorId">
      {{ errorMessage ?? validation.validationErrors.join(' ') }}
    </FieldError>
    <!-- RAC HiddenSelect: carries form data and native `required` validity -->
    <div aria-hidden="true" data-a11y-ignore="aria-hidden-focus" style="border: 0; clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; white-space: nowrap; width: 1px;">
      <select
        tabindex="-1"
        :name="name"
        :multiple="multiple"
        :required="required && (validationBehavior ?? 'native') === 'native'"
        :disabled="disabled"
        :autocomplete="autocomplete"
        @invalid="onHiddenInvalid"
      >
        <option value="" />
        <option v-for="item in options" :key="item.value" :value="item.value" :selected="selectedSet.has(item.value)">
          {{ textOf(item) }}
        </option>
      </select>
    </div>
  </div>
</template>
