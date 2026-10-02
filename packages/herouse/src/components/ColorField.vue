<script lang="ts">
import type { Color, ColorChannel, ColorSpace } from 'reka-ui'
import type { ValidateFn, ValidationResult } from '../composables/useFieldValidation'
import type { ComponentSlots } from '../types/tv'
import type { ValidationBehavior } from './formContext'
import theme from '../theme/colorField'

type ColorField = typeof theme

export interface ColorFieldProps {
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
  /** The name of the field, used when submitting a form. */
  name?: string
  /** Temporary text shown when the input is empty. */
  placeholder?: string
  /**
   * The committed color (controlled). A hex string or a Reka `Color` object. Falls back to the
   * enclosing `ColorPicker`'s color when neither this nor `v-model` is set.
   */
  modelValue?: string | Color
  /**
   * The initial value when uncontrolled (no `v-model`) and outside a `ColorPicker`.
   * @defaultValue '#000000'
   */
  defaultValue?: string | Color
  /** The color space to operate in when `channel` is set. */
  colorSpace?: ColorSpace
  /** The color channel to edit (e.g. `'hue'`, `'red'`, `'alpha'`). If unset, edits the hex value. */
  channel?: ColorChannel
  /** Locale used to format and parse channel numbers. Defaults to the `ConfigProvider` locale. */
  locale?: string
  /** Custom step for increment/decrement. Defaults to the channel's natural step, or 1 for hex. */
  step?: number
  /**
   * Whether changing the value with the mouse wheel is disabled.
   * @defaultValue false
   */
  disableWheelChange?: boolean
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
   * Whether the value can be selected but not changed.
   * @defaultValue false
   */
  readonly?: boolean
  /** Validates the committed color. Return an error message (or several) when invalid. */
  validate?: ValidateFn<Color>
  /**
   * `native` blocks form submission and shows errors on commit or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ColorField>
}

export interface ColorFieldSlots {
  /** Label content. Replaces the `label` prop. */
  label?: () => any
  /** Content rendered before the input, e.g. a `ColorSwatch`. */
  prefix?: () => any
  /** Content rendered after the input, e.g. a unit label. */
  suffix?: () => any
  /** Description content. Replaces the `description` prop. */
  description?: () => any
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
}

export interface ColorFieldEmits {
  /** Emitted when the committed color changes (on blur, Enter, stepper or wheel). */
  'update:modelValue': [value: string | Color]
}
</script>

<script setup lang="ts">
import { ColorFieldInput, ColorFieldRoot, normalizeColor } from 'reka-ui'
import { computed, ref, useAttrs, useId, useSlots, useTemplateRef, watch } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'
import { useFieldValidation } from '../composables/useFieldValidation'
import { useColorPickerContext } from './colorPickerContext'
import Description from './Description.vue'
import FieldError from './FieldError.vue'
import Label from './Label.vue'
import ColorFieldHexCase from './colorFieldHexCase'

defineOptions({ inheritAttrs: false })

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<ColorFieldProps>(), { invalid: undefined })
const emit = defineEmits<ColorFieldEmits>()
const slots = useSlots()
defineSlots<ColorFieldSlots>()

const pickerCtx = useColorPickerContext()
// Uncontrolled (`modelValue === undefined`) and inside a `ColorPicker`: the context drives the value, and we still
// forward every commit to it (and emit `update:modelValue`) so sibling colour components stay in sync.
const hasOwnModel = computed(() => props.modelValue !== undefined)
const modelValueForRoot = computed<string | Color | undefined>(() => {
  if (hasOwnModel.value)
    return props.modelValue
  return pickerCtx ? pickerCtx.color.value : undefined
})

// Reka only updates on commit (blur / Enter / stepper / page jump / wheel), like RAC's ColorField; tracked locally
// for `validate` and so an uncontrolled field without a `ColorPicker` still has a value to validate against.
const formColor = ref<Color>(normalizeColor(modelValueForRoot.value ?? props.defaultValue ?? '#000000'))
watch(modelValueForRoot, (value) => {
  if (value !== undefined)
    formColor.value = normalizeColor(value)
})

const root = useTemplateRef<HTMLElement>('root')
const { validation, commitValidation } = useFieldValidation({
  value: () => formColor.value,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  onReset: () => {
    const next = normalizeColor(props.defaultValue ?? '#000000')
    formColor.value = next
    emit('update:modelValue', next)
    if (pickerCtx && !hasOwnModel.value)
      pickerCtx.setColor(next)
  },
})
const invalid = computed(() => validation.value.isInvalid)

function onUpdateColor(color: Color) {
  formColor.value = color
  emit('update:modelValue', color)
  if (pickerCtx && !hasOwnModel.value)
    pickerCtx.setColor(color)
  commitValidation()
}

// `aria-label` / `aria-labelledby` name the input (as in HeroUI), not the wrapper div
const attrs = useAttrs()
const rootAttrs = computed(() => {
  const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs
  return rest
})

const autoId = useId()
const id = computed(() => props.id ?? autoId)
const hasLabel = computed(() => !!(props.label || slots.label))
const hasPrefix = computed(() => !!slots.prefix)
const hasSuffix = computed(() => !!slots.suffix)
const hasDescription = computed(() => !!(props.description || slots.description))
const hasError = computed(() => invalid.value && !!(props.errorMessage || slots.error || validation.value.validationErrors.length))
const descriptionId = computed(() => `${id.value}-description`)
const errorId = computed(() => `${id.value}-error`)
const describedBy = computed(() => [
  hasDescription.value ? descriptionId.value : undefined,
  hasError.value ? errorId.value : undefined,
].filter(Boolean).join(' ') || undefined)

const ui = useComponentUI('colorField', theme, () => ({ variant: props.variant, fullWidth: props.fullWidth }))

// RAC Group's `data-focus-within` / `data-focus-visible`
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
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="color-field"
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
    <ColorFieldRoot
      :model-value="modelValueForRoot"
      :default-value="defaultValue"
      :color-space="colorSpace"
      :channel="channel"
      :placeholder="placeholder"
      :locale="locale"
      :step="step"
      :disable-wheel-change="disableWheelChange"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :name="name"
      data-slot="color-input-group"
      :data-invalid="invalid ? 'true' : undefined"
      :data-focus-within="focusWithin ? 'true' : undefined"
      :data-focus-visible="focusVisible ? 'true' : undefined"
      :class="ui.group({ class: props.ui?.group })"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
      @update:color="onUpdateColor"
    >
      <ColorFieldHexCase />
      <div v-if="hasPrefix" data-slot="color-input-group-prefix" :class="ui.prefix({ class: props.ui?.prefix })">
        <slot name="prefix" />
      </div>
      <ColorFieldInput
        :id="id"
        data-slot="color-input-group-input"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        :aria-label="attrs['aria-label']"
        :aria-labelledby="attrs['aria-labelledby']"
        :class="ui.input({ class: props.ui?.input })"
      />
      <div v-if="hasSuffix" data-slot="color-input-group-suffix" :class="ui.suffix({ class: props.ui?.suffix })">
        <slot name="suffix" />
      </div>
    </ColorFieldRoot>
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
