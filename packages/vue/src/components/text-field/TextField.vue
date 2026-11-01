<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="textfield"
    :data-disabled="disabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-focus-within="focusState.isFocusWithin ? 'true' : undefined"
    :data-focus-visible="focusState.isFocusVisible ? 'true' : undefined"
    :class="ui.base()"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <FieldLabel :for="id" />
    <slot
      v-bind="{
        id,
        describedBy,
        invalid,
        disabled,
        required,
        readonly,
        focusWithin: focusState.isFocusWithin,
        focusVisible: focusState.isFocusVisible,
      }"
    >
      <Input :placeholder="placeholder" />
    </slot>
    <FieldDescription />
    <FieldError />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  provide,
  ref,
  shallowReactive,
  toRef,
  useAttrs,
  useTemplateRef,
  watch,
} from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import Input from '@/components/input/Input.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'
import type { ModelModifier } from '@/utils/modelModifiers'
import { toEmptyModelValue } from '@/utils/modelModifiers'

import { splitInputAttrs, textFieldContextKey } from './context'
import type { TextFieldProps, TextFieldSlots } from './TextField.types'
import theme from './theme'

defineOptions({ inheritAttrs: false })

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<TextFieldProps>(), { type: 'text', invalid: undefined })
const slots = defineSlots<TextFieldSlots>()

/** The input value. */
const [modelValue, modifiers] = defineModel<string | number | null, ModelModifier>({
  set: (v) => toEmptyModelValue(v, modifiers),
})

// `defaultValue` seeds the field without emitting `update:modelValue` on mount (RAC's `onChange` only reports
// changes). Writes that don't change the value (an inner Input mirroring the same value) don't emit either.
const uncontrolledValue = ref(props.defaultValue)
watch(modelValue, (v) => {
  // A parent clearing its v-model clears the field, not back to an earlier typed value
  if (v === undefined || v === null) uncontrolledValue.value = undefined
})

const value = computed<string | number | undefined>({
  get: () => modelValue.value ?? uncontrolledValue.value,
  set: (v) => {
    if (v === value.value) return
    uncontrolledValue.value = v
    modelValue.value = v
  },
})

const attrs = useAttrs()
const splitAttrs = computed(() => splitInputAttrs(attrs))
const inputAttrs = computed(() => splitAttrs.value.input)
const rootAttrs = computed(() => splitAttrs.value.root)

const root = useTemplateRef<HTMLElement>('root')
const { validation, invalid } = useFieldValidation({
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

const disabled = useFieldsetDisabled(() => props.disabled)

const focusState = shallowReactive({ isFocusWithin: false, isFocusVisible: false })
const onFocusIn = (event: FocusEvent) => {
  focusState.isFocusWithin = true

  focusState.isFocusVisible =
    event.target instanceof Element && event.target.matches(':focus-visible')
}

const onFocusOut = (event: FocusEvent) => {
  if (
    event.currentTarget instanceof Element &&
    event.relatedTarget instanceof Node &&
    event.currentTarget.contains(event.relatedTarget)
  )
    return

  focusState.isFocusWithin = false
  focusState.isFocusVisible = false
}

const { name, id, describedBy, FieldLabel, FieldDescription, FieldError } = useFieldChrome({
  props,
  slots,
  invalid,
  validation,
  disabled,
  required: () => props.required,
  hideDescriptionWhenInvalid: true,
  ariaDescribedBy: () => attrs['aria-describedby'] as string | undefined,
})

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
  modelModifiers: modifiers,
  name,
  type: toRef(() => props.type),
})

const ui = useComponentUI('textField', {
  theme,
  variantProps: () => ({ fullWidth: props.fullWidth }),
  props,
})
</script>
