<script lang="ts">
import type { ValidateFn, ValidationResult } from '../../composables/useFieldValidation'
import type { ComponentSlots } from '../../types/tv'
import type { ValidationBehavior } from '../form/context'
import type { FormFieldProps } from '../form/types'
import type { InputProps } from '../input/Input.vue'
import theme from './theme'

type TextField = typeof theme

export interface TextFieldProps extends FormFieldProps {
  /** Label text rendered above the input. */
  label?: string
  /** Helper text rendered below the input. Hidden while the field is invalid. */
  description?: string
  /** Error message rendered below the input while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * The id of the input; label, description and error ids derive from it.
   * @defaultValue useId()
   */
  id?: string
  /** The name of the input, used when submitting a form. */
  name?: string
  /**
   * The native input type.
   * @defaultValue 'text'
   */
  type?: string
  /** Temporary text shown when the input is empty. */
  placeholder?: string
  /** The initial value when uncontrolled (no `v-model`). */
  defaultValue?: string | number
  /**
   * Visual variant of the input.
   * @defaultValue 'primary'
   */
  variant?: InputProps['variant']
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
  validate?: ValidateFn<string | number>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<TextField>
}

export interface TextFieldSlotProps {
  id: string
  describedBy: string | undefined
  invalid: boolean
  disabled: boolean
  required: boolean
  readonly: boolean
  /** Whether any element inside the field has focus. */
  focusWithin: boolean
  /** Whether that focus is keyboard-visible (`:focus-visible`). */
  focusVisible: boolean
}

export interface TextFieldSlots {
  /** Label content. Replaces the `label` prop. */
  label?: () => any
  /** Control slot. Replaces the default `Input` (e.g. an `Input` with custom props); `Input`s inside read the field context. */
  default?: (props: TextFieldSlotProps) => any
  /** Description content. Replaces the `description` prop. */
  description?: () => any
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
}
</script>

<script setup lang="ts">
import { computed, provide, ref, toRef, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import { useFieldValidation } from '../../composables/useFieldValidation'
import Description from '../description/Description.vue'
import FieldError from '../field-error/FieldError.vue'
import { useFieldsetDisabled } from '../fieldset/context'
import Input from '../input/Input.vue'
import Label from '../label/Label.vue'
import { textFieldContextKey } from './context'

defineOptions({ inheritAttrs: false })

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<TextFieldProps>(), { type: 'text', invalid: undefined })
const slots = defineSlots<TextFieldSlots>()
/** The input value. */
const modelValue = defineModel<string | number>()
// `defaultValue` seeds the field without emitting `update:modelValue` on mount (RAC's `onChange` only reports
// changes). Writes that don't change the value (an inner Input mirroring the same value) don't emit either.
const uncontrolledValue = ref(props.defaultValue)
watch(modelValue, (v) => {
  // A parent clearing its v-model clears the field, not back to an earlier typed value
  if (v === undefined)
    uncontrolledValue.value = undefined
})
const value = computed<string | number | undefined>({
  get: () => modelValue.value ?? uncontrolledValue.value,
  set: (v) => {
    if (v === value.value)
      return
    uncontrolledValue.value = v
    modelValue.value = v
  },
})

// Attributes that belong to the input (as in HeroUI, where TextField passes them to its Input), matched case-insensitively
// so `maxlength` and `maxLength` both work. Everything else stays on the wrapper div.
const INPUT_ATTRS = new Set([
  'autofocus', 'autocomplete', 'autocapitalize', 'autocorrect', 'spellcheck', 'inputmode', 'enterkeyhint',
  'maxlength', 'minlength', 'pattern', 'min', 'max', 'step', 'size', 'list', 'form', 'dirname',
  'aria-label', 'aria-labelledby', 'aria-details', 'aria-errormessage', 'aria-controls', 'aria-activedescendant', 'aria-autocomplete', 'aria-haspopup',
  'onfocus', 'onblur',
])
const attrs = useAttrs()
const inputAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => INPUT_ATTRS.has(key.toLowerCase()))))
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !INPUT_ATTRS.has(key.toLowerCase()) && key !== 'aria-describedby')))

const root = useTemplateRef<HTMLElement>('root')
const { validation } = useFieldValidation({
  value: () => value.value ?? '',
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  formField: props,
  onReset: () => {
    value.value = props.defaultValue ?? ''
  },
})
const invalid = computed(() => validation.value.isInvalid)
const disabled = useFieldsetDisabled(() => props.disabled)

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

const autoId = useId()
const id = computed(() => props.id ?? autoId)
const hasLabel = computed(() => !!(props.label || slots.label))
const hasDescription = computed(() => !!(props.description || slots.description))
const hasError = computed(() => invalid.value && !!(props.errorMessage || slots.error || validation.value.validationErrors.length))
const descriptionId = computed(() => `${id.value}-description`)
const errorId = computed(() => `${id.value}-error`)
const describedBy = computed(() => [
  attrs['aria-describedby'] as string | undefined,
  hasDescription.value ? descriptionId.value : undefined,
  hasError.value ? errorId.value : undefined,
].filter(Boolean).join(' ') || undefined)

provide(textFieldContextKey, {
  id,
  describedBy,
  invalid,
  disabled,
  required: toRef(() => props.required),
  readonly: toRef(() => props.readonly),
  variant: toRef(() => props.variant),
  fullWidth: toRef(() => props.fullWidth),
  inputAttrs,
  model: value,
  name: toRef(() => props.name),
  type: toRef(() => props.type),
})

const ui = useComponentUI('textField', theme, () => ({ fullWidth: props.fullWidth }))
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="textfield"
    :data-disabled="disabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-focus-within="focusWithin ? 'true' : undefined"
    :data-focus-visible="focusVisible ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <Label v-if="hasLabel" :for="id" :disabled="disabled" :invalid="invalid" :required="required">
      <slot name="label">
        {{ label }}
      </slot>
    </Label>
    <slot v-bind="{ id, describedBy, invalid, disabled, required, readonly, focusWithin, focusVisible }">
      <Input :placeholder="placeholder" />
    </slot>
    <Description v-if="hasDescription" :id="descriptionId">
      <slot name="description">
        {{ description }}
      </slot>
    </Description>
    <FieldError v-if="hasError" :id="errorId">
      <slot name="error" v-bind="validation">
        {{ errorMessage ?? validation.validationErrors.join(' ') }}
      </slot>
    </FieldError>
  </div>
</template>
