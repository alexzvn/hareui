<script lang="ts">
import type { ComponentSlots } from '../types/tv'
import type { InputProps } from './Input.vue'
import theme from '../theme/textField'

type TextField = typeof theme

export interface TextFieldProps {
  /** Label text rendered above the input. */
  label?: string
  /** Helper text rendered below the input. Hidden while the field is invalid. */
  description?: string
  /** Error message rendered below the input when `invalid` is true. */
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
   * Whether the field is invalid.
   * @defaultValue false
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
  /** Error content, rendered when `invalid`. Replaces the `errorMessage` prop. */
  error?: () => any
}
</script>

<script setup lang="ts">
import { computed, provide, ref, toRef, useAttrs, useId } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'
import Description from './Description.vue'
import FieldError from './FieldError.vue'
import Input from './Input.vue'
import Label from './Label.vue'
import { textFieldContextKey } from './textFieldContext'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TextFieldProps>(), { type: 'text' })
const slots = defineSlots<TextFieldSlots>()
/** The input value. */
const modelValue = defineModel<string | number>()
if (modelValue.value === undefined && props.defaultValue !== undefined)
  modelValue.value = props.defaultValue

// `aria-label` / `aria-labelledby` name the input (as in HeroUI), not the wrapper div
const attrs = useAttrs()
const ariaLabel = computed(() => attrs['aria-label'] as string | undefined)
const ariaLabelledby = computed(() => attrs['aria-labelledby'] as string | undefined)
const rootAttrs = computed(() => {
  const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs
  return rest
})

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
const hasError = computed(() => props.invalid && !!(props.errorMessage || slots.error))
const descriptionId = computed(() => `${id.value}-description`)
const errorId = computed(() => `${id.value}-error`)
const describedBy = computed(() => [
  hasDescription.value ? descriptionId.value : undefined,
  hasError.value ? errorId.value : undefined,
].filter(Boolean).join(' ') || undefined)

provide(textFieldContextKey, {
  id,
  describedBy,
  invalid: toRef(() => props.invalid),
  disabled: toRef(() => props.disabled),
  required: toRef(() => props.required),
  readonly: toRef(() => props.readonly),
  variant: toRef(() => props.variant),
  fullWidth: toRef(() => props.fullWidth),
  ariaLabel,
  ariaLabelledby,
})

const ui = useComponentUI('textField', theme, () => ({ fullWidth: props.fullWidth }))
</script>

<template>
  <div
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
      <Input v-model="modelValue" :type="type" :name="name" :placeholder="placeholder" />
    </slot>
    <Description v-if="hasDescription" :id="descriptionId">
      <slot name="description">
        {{ description }}
      </slot>
    </Description>
    <FieldError v-if="hasError" :id="errorId">
      <slot name="error">
        {{ errorMessage }}
      </slot>
    </FieldError>
  </div>
</template>
