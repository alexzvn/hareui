<script lang="ts">
import type { ValidateFn, ValidationResult } from '../../composables/useFieldValidation'
import type { ComponentSlots } from '../../types/tv'
import type { ValidationBehavior } from '../form/context'
import type { FormFieldProps } from '../form/types'
import theme from './theme'

type SearchField = typeof theme

export interface SearchFieldProps extends FormFieldProps {
  /** Label text rendered above the field. */
  label?: string
  /** Helper text rendered below the field. Hidden while the field is invalid. */
  description?: string
  /** Error message rendered below the field while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * The id of the input; label, description and error ids derive from it.
   * @defaultValue useId()
   */
  id?: string
  /** The name of the input, used when submitting a form. */
  name?: string
  /** Temporary text shown when the input is empty. */
  placeholder?: string
  /** The initial value when uncontrolled (no `v-model`). */
  defaultValue?: string
  /**
   * Visual variant of the field.
   * @defaultValue 'primary'
   */
  variant?: 'primary' | 'secondary'
  /**
   * Whether the field takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether the field is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the field is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the field is required.
   * @defaultValue false
   */
  required?: boolean
  /**
   * Whether the input can be selected but not changed.
   * @defaultValue false
   */
  readonly?: boolean
  /** Validates the value. Return an error message (or several) when invalid, `true`/`null`/`undefined` when valid. */
  validate?: ValidateFn<string>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<SearchField>
}

export interface SearchFieldSlots {
  /** Label content. Replaces the `label` prop. */
  label?: () => any
  /** Replaces the default search icon. */
  icon?: () => any
  /** Replaces the default clear (×) icon inside the clear button. */
  clearIcon?: () => any
  /** Description content. Replaces the `description` prop. */
  description?: () => any
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
}

export interface SearchFieldEmits {
  /** Emitted when the value changes. */
  'update:modelValue': [value: string]
  /** Emitted when the user presses Enter inside the input. */
  'submit': [value: string]
  /** Emitted when the value is cleared, via the clear button or Escape. */
  'clear': []
}
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots, useTemplateRef } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import { useFieldChrome } from '../../composables/useFieldChrome'
import { useFieldValidation } from '../../composables/useFieldValidation'
import CloseButton from '../close-button/CloseButton.vue'
import { useFieldsetDisabled } from '../fieldset/context'
import { splitInputAttrs } from '../text-field/context'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SearchFieldProps>(), { invalid: undefined })
const emit = defineEmits<SearchFieldEmits>()
const slots = useSlots()
defineSlots<SearchFieldSlots>()

// `aria-label`, `autocomplete` and other input attributes go to the input, as in HeroUI; the rest stay on the root
const attrs = useAttrs()
const splitAttrs = computed(() => splitInputAttrs(attrs))
const inputAttrs = computed(() => splitAttrs.value.input)
const rootAttrs = computed(() => splitAttrs.value.root)

/** The search query. */
const modelValue = defineModel<string>()
if (modelValue.value === undefined && props.defaultValue !== undefined)
  modelValue.value = props.defaultValue

const root = useTemplateRef<HTMLElement>('root')
const input = useTemplateRef<HTMLInputElement>('input')
const { validation } = useFieldValidation({
  value: () => modelValue.value ?? '',
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  formField: props,
  onReset: () => {
    modelValue.value = props.defaultValue ?? ''
  },
})
const invalid = computed(() => validation.value.isInvalid)
const disabled = useFieldsetDisabled(() => props.disabled)
const isEmpty = computed(() => !modelValue.value)

const focusWithin = ref(false)
const focusVisible = ref(false)
function onFocusIn(event: FocusEvent) {
  focusWithin.value = true
  focusVisible.value = event.target instanceof Element && event.target.matches(':focus-visible')
}
function onFocusOut(event: FocusEvent) {
  if (event.currentTarget instanceof Element && event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))
    return
  focusWithin.value = false
  focusVisible.value = false
}

// Kept for backward compatibility with native form submission, matching RAC's useSearchField: Enter submits via
// the `submit` event instead of letting the browser submit the surrounding form. Disabled or readonly fields
// still swallow Enter but don't submit.
function onEnter(event: KeyboardEvent) {
  event.preventDefault()
  if (disabled.value || props.readonly)
    return
  emit('submit', modelValue.value ?? '')
}
// Matches RAC: Escape clears the field and stops there (an enclosing dialog stays open), but does nothing and lets
// the key through when the field is already empty, disabled or readonly.
function onEscape(event: KeyboardEvent) {
  if (disabled.value || props.readonly || !modelValue.value)
    return
  event.preventDefault()
  event.stopPropagation()
  modelValue.value = ''
  emit('clear')
}
function onClear() {
  // RAC focuses the input before the click reaches the button, so it never leaves the input
  input.value?.focus()
  modelValue.value = ''
  emit('clear')
}

const { id, describedBy, FieldLabel, FieldDescription, FieldError } = useFieldChrome({
  props,
  slots,
  invalid,
  validation,
  disabled,
  required: () => props.required,
  hideDescriptionWhenInvalid: true,
  ariaDescribedBy: () => attrs['aria-describedby'] as string | undefined,
})

const ui = useComponentUI('searchField', theme, () => ({ variant: props.variant, fullWidth: props.fullWidth }))
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="search-field"
    :data-disabled="disabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-empty="isEmpty ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <FieldLabel :for="id" />
    <div
      data-slot="search-field-group"
      role="group"
      :data-invalid="invalid ? 'true' : undefined"
      :data-disabled="disabled ? 'true' : undefined"
      :data-focus-within="focusWithin ? 'true' : undefined"
      :data-focus-visible="focusVisible ? 'true' : undefined"
      :class="ui.group({ class: props.ui?.group })"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
    >
      <span data-slot="search-field-search-icon" :class="ui.searchIcon({ class: props.ui?.searchIcon })">
        <slot name="icon">
          <svg aria-hidden="true" fill="none" height="16" role="presentation" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd" d="M11.5 7a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-.82 4.74a6 6 0 1 1 1.06-1.06l2.79 2.79a.75.75 0 1 1-1.06 1.06z" fill="currentColor" fill-rule="evenodd" />
          </svg>
        </slot>
      </span>
      <input
        v-bind="inputAttrs"
        :id="id"
        ref="input"
        v-model="modelValue"
        type="search"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled || undefined"
        :required="required || undefined"
        :readonly="readonly || undefined"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        data-slot="search-field-input"
        :data-invalid="invalid ? 'true' : undefined"
        :class="ui.input({ class: props.ui?.input })"
        @keydown.enter="onEnter"
        @keydown.esc="onEscape"
      >
      <CloseButton
        v-if="slots.clearIcon"
        data-slot="search-field-clear-button"
        aria-label="Clear search"
        tabindex="-1"
        :disabled="disabled || readonly || undefined"
        :class="ui.clearButton({ class: props.ui?.clearButton })"
        @mousedown.prevent
        @click="onClear"
      >
        <slot name="clearIcon" />
      </CloseButton>
      <CloseButton
        v-else
        data-slot="search-field-clear-button"
        aria-label="Clear search"
        tabindex="-1"
        :disabled="disabled || readonly || undefined"
        :class="ui.clearButton({ class: props.ui?.clearButton })"
        @mousedown.prevent
        @click="onClear"
      />
    </div>
    <FieldDescription />
    <FieldError />
  </div>
</template>
