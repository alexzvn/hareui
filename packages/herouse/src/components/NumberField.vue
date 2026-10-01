<script lang="ts">
import type { ComponentSlots } from '../types/tv'
import theme from '../theme/numberField'

type NumberField = typeof theme

export interface NumberFieldProps {
  /** Label text rendered above the group. */
  label?: string
  /** Helper text rendered below the group. Hidden while the field is invalid. */
  description?: string
  /** Error message rendered below the group when `invalid` is true. */
  errorMessage?: string
  /**
   * The id of the input; label, description and error ids derive from it.
   * @defaultValue useId()
   */
  id?: string
  /** The name of the value, used when submitting a form. */
  name?: string
  /** Temporary text shown when the input is empty. */
  placeholder?: string
  /** The initial value when uncontrolled (no `v-model`). */
  defaultValue?: number
  /** The smallest allowed value. */
  min?: number
  /** The largest allowed value. */
  max?: number
  /**
   * The amount the value changes per increment/decrement.
   * @defaultValue 1
   */
  step?: number
  /** Formatting options for the displayed value (`Intl.NumberFormat`). */
  formatOptions?: Intl.NumberFormatOptions
  /** Locale used to format and parse the value. Defaults to the `ConfigProvider` locale. */
  locale?: string
  /**
   * Visual variant of the group.
   * @defaultValue 'primary'
   */
  variant?: 'primary' | 'secondary'
  /**
   * Whether the field takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether to render the increment button.
   * @defaultValue true
   */
  increment?: boolean
  /**
   * Whether to render the decrement button.
   * @defaultValue true
   */
  decrement?: boolean
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
   * Whether the value can be selected but not changed.
   * @defaultValue false
   */
  readonly?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<NumberField>
}

export interface NumberFieldSlots {
  /** Label content. Replaces the `label` prop. */
  label?: () => any
  /** Increment button content. Defaults to a plus icon. */
  increment?: () => any
  /** Decrement button content. Defaults to a minus icon. */
  decrement?: () => any
  /** Description content. Replaces the `description` prop. */
  description?: () => any
  /** Error content, rendered when `invalid`. Replaces the `errorMessage` prop. */
  error?: () => any
}
</script>

<script setup lang="ts">
import { NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput, NumberFieldRoot } from 'reka-ui'
import { computed, useAttrs, useId } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'
import Description from './Description.vue'
import FieldError from './FieldError.vue'
import Label from './Label.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<NumberFieldProps>(), { step: 1, increment: true, decrement: true })
const slots = defineSlots<NumberFieldSlots>()
/** The numeric value; `undefined` while the input is empty. */
const modelValue = defineModel<number | null>()

// `aria-label` / `aria-labelledby` name the input (as in HeroUI), not the wrapper div
const attrs = useAttrs()
const rootAttrs = computed(() => {
  const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs
  return rest
})

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

const ui = useComponentUI('numberField', theme, () => ({ variant: props.variant, fullWidth: props.fullWidth }))
</script>

<template>
  <div
    v-bind="rootAttrs"
    data-slot="number-field"
    :data-disabled="disabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <Label v-if="hasLabel" :for="id" :disabled="disabled" :invalid="invalid" :required="required">
      <slot name="label">
        {{ label }}
      </slot>
    </Label>
    <NumberFieldRoot
      :id="id"
      v-model="modelValue"
      :default-value="defaultValue"
      :min="min"
      :max="max"
      :step="step"
      :format-options="formatOptions"
      :locale="locale"
      :name="name"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      data-slot="number-field-group"
      :data-invalid="invalid ? 'true' : undefined"
      :class="ui.group({ class: props.ui?.group })"
    >
      <NumberFieldDecrement
        v-if="decrement"
        slot="decrement"
        data-slot="number-field-decrement-button"
        :class="ui.decrementButton({ class: props.ui?.decrementButton })"
      >
        <slot name="decrement">
          <svg
            aria-hidden="true"
            data-slot="number-field-decrement-button-icon"
            fill="none"
            height="16"
            role="presentation"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path clip-rule="evenodd" d="M1.75 8a.75.75 0 0 1 .75-.75h11a.75.75 0 0 1 0 1.5h-11A.75.75 0 0 1 1.75 8" fill="currentColor" fill-rule="evenodd" />
          </svg>
        </slot>
      </NumberFieldDecrement>
      <NumberFieldInput
        data-slot="number-field-input"
        :placeholder="placeholder"
        :required="required || undefined"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        :aria-label="attrs['aria-label']"
        :aria-labelledby="attrs['aria-labelledby']"
        :class="ui.input({ class: props.ui?.input })"
      />
      <NumberFieldIncrement
        v-if="increment"
        slot="increment"
        data-slot="number-field-increment-button"
        :class="ui.incrementButton({ class: props.ui?.incrementButton })"
      >
        <slot name="increment">
          <svg
            aria-hidden="true"
            data-slot="number-field-increment-button-icon"
            fill="none"
            height="16"
            role="presentation"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path clip-rule="evenodd" d="M8 1.75a.75.75 0 0 1 .75.75v4.75h4.75a.75.75 0 0 1 0 1.5H8.75v4.75a.75.75 0 0 1-1.5 0V8.75H2.5a.75.75 0 0 1 0-1.5h4.75V2.5A.75.75 0 0 1 8 1.75" fill="currentColor" fill-rule="evenodd" />
          </svg>
        </slot>
      </NumberFieldIncrement>
    </NumberFieldRoot>
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
