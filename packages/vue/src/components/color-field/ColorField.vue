<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="color-field"
    :data-disabled="disabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :class="ui.base()"
  >
    <FieldLabel :for="id" />
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
      data-slot="color-input-group"
      :data-invalid="invalid ? 'true' : undefined"
      :data-focus-within="focusState.isFocusWithin ? 'true' : undefined"
      :data-focus-visible="focusState.isFocusVisible ? 'true' : undefined"
      :class="ui.group()"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
      @update:color="onUpdateColor"
    >
      <ColorFieldBridge
        :is-empty="() => empty"
        :on-clear="onClear"
        :on-fill="onUpdateColor"
        :name="name"
        :step="step"
        :locale="locale"
      />
      <!-- Prefix/suffix go through `useSlotOutlet` components: a `<slot>` outlet here would make Vue flag the root's slots as forwarded and re-render the root on every render -->
      <div v-if="slotPresence.hasPrefix" data-slot="color-input-group-prefix" :class="ui.prefix()">
        <PrefixOutlet />
      </div>
      <ColorFieldInput
        :id="id"
        data-slot="color-input-group-input"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-required="required ? 'true' : undefined"
        :aria-describedby="describedBy"
        :aria-label="attrs['aria-label']"
        :aria-labelledby="attrs['aria-labelledby']"
        :class="ui.input()"
        @keydown="onInputKeydown"
      />
      <div v-if="slotPresence.hasSuffix" data-slot="color-input-group-suffix" :class="ui.suffix()">
        <SuffixOutlet />
      </div>
    </ColorFieldRoot>
    <FieldDescription />
    <FieldError />
  </div>
</template>

<script setup lang="ts">
import { ColorFieldInput, ColorFieldRoot, normalizeColor } from 'reka-ui'
import type { Color } from 'reka-ui'
import {
  computed,
  nextTick,
  onBeforeUpdate,
  ref,
  shallowReactive,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
} from 'vue'

import { useColorPickerContext } from '@/components/color-picker/context'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { useSlotOutlet } from '@/composables/useSlotOutlet'

import type { ColorFieldEmits, ColorFieldProps, ColorFieldSlots } from './ColorField.types'
import ColorFieldBridge from './colorFieldBridge'
import theme from './theme'

defineOptions({ inheritAttrs: false })

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<ColorFieldProps>(), { invalid: undefined })
const disabled = useFieldsetDisabled(() => props.disabled)
const emit = defineEmits<ColorFieldEmits>()
const slots = useSlots()
const PrefixOutlet = useSlotOutlet(slots, 'prefix')
const SuffixOutlet = useSlotOutlet(slots, 'suffix')
defineSlots<ColorFieldSlots>()

const pickerCtx = useColorPickerContext()

// Uncontrolled (`modelValue === undefined`) and inside a `ColorPicker`: the context drives the value, and we still
// forward every commit to it (and emit `update:modelValue`) so sibling colour components stay in sync.
const hasOwnModel = computed(() => props.modelValue !== undefined)
const modelValueForRoot = computed<string | Color | undefined>(() => {
  if (hasOwnModel.value) return props.modelValue ?? undefined

  return pickerCtx ? pickerCtx.color.value : undefined
})

// Option A of the empty-value decision: React Aria's ColorField can be empty (`null`), Reka's always holds a colour
// (`#000000`). While "empty" the input text is blanked (see colorFieldBridge.ts); Reka and the form keep `#000000`.
// `isFilledByCommit` covers the gap between a commit and the parent re-rendering with the new `modelValue`.
const emptiness = shallowReactive({
  isUncontrolledEmpty: props.defaultValue == null,
  isFilledByCommit: false,
})

const empty = computed(() => {
  if (emptiness.isFilledByCommit) return false
  if (hasOwnModel.value) return props.modelValue === null

  return !pickerCtx && emptiness.isUncontrolledEmpty
})

// Reka only updates on commit (blur / Enter / stepper / page jump / wheel), like RAC's ColorField; tracked locally
// for `validate` and so an uncontrolled field without a `ColorPicker` still has a value to validate against.
const formColor = ref<Color | null>(
  empty.value ? null : normalizeColor(modelValueForRoot.value ?? props.defaultValue ?? '#000000'),
)

watch(modelValueForRoot, (value) => {
  if (value !== undefined) formColor.value = normalizeColor(value)
})

watch(empty, (isEmpty) => {
  if (isEmpty) formColor.value = null
})

const root = useTemplateRef<HTMLElement>('root')
const { validation, commitValidation } = useFieldValidation({
  formField: props,
  value: () => formColor.value,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  onReset: () => {
    if (props.defaultValue == null && !pickerCtx) {
      emptiness.isUncontrolledEmpty = true
      formColor.value = null
      emit('update:modelValue', null)

      return
    }

    const next = normalizeColor(props.defaultValue ?? '#000000')
    formColor.value = next
    emit('update:modelValue', next)
    if (pickerCtx && !hasOwnModel.value) pickerCtx.setColor(next)
  },
})

const invalid = computed(() => validation.value.isInvalid)

const onUpdateColor = (color: Color) => {
  if (empty.value) {
    emptiness.isFilledByCommit = true
    emptiness.isUncontrolledEmpty = false

    nextTick(() => {
      emptiness.isFilledByCommit = false
    })
  }

  formColor.value = color
  emit('update:modelValue', color)
  if (pickerCtx && !hasOwnModel.value) pickerCtx.setColor(color)
  commitValidation()
}

const onClear = () => {
  if (pickerCtx && !hasOwnModel.value) return

  emptiness.isUncontrolledEmpty = true
  formColor.value = null
  emit('update:modelValue', null)
  commitValidation()
}

// Input types that block implicit submission when the form has no submit button
const BLOCKING_INPUT_TYPE =
  /^(?:text|search|url|tel|email|password|number|date|month|week|time|datetime-local)$/

const submitImplicitly = (form: HTMLFormElement) => {
  const elements = [...form.elements]
  const submitter = elements.find(
    (el): el is HTMLButtonElement | HTMLInputElement =>
      (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) &&
      (el.type === 'submit' || el.type === 'image'),
  )

  if (submitter) {
    if (!submitter.disabled) submitter.click()
    return
  }

  // Without a submit button, browsers only submit implicitly when a single field blocks it
  const blocking = elements.filter(
    (el) => el instanceof HTMLInputElement && BLOCKING_INPUT_TYPE.test(el.type),
  )

  if (blocking.length <= 1) form.requestSubmit()
}

// Reka `preventDefault`s Enter after committing, which also cancels the browser's implicit form submission
// (React Aria leaves it alone). Replayed once the committed value has rendered into the form input.
const onInputKeydown = (event: KeyboardEvent) => {
  const input = event.currentTarget
  if (event.key !== 'Enter' || event.isComposing || !(input instanceof HTMLInputElement)) return

  const form = input.form
  if (form) nextTick(() => submitImplicitly(form))
}

// `aria-label` / `aria-labelledby` name the input (as in HeroUI), not the wrapper div
const attrs = useAttrs()
const rootAttrs = computed(() => {
  const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs

  return rest
})

const { id, describedBy, FieldLabel, FieldDescription, FieldError } = useFieldChrome({
  props,
  slots,
  invalid,
  validation,
  disabled,
  required: () => props.required,
  hideDescriptionWhenInvalid: true,
})

// `slots` isn't reactive and the root no longer re-renders with this component, so mirror slot swaps into state
const slotPresence = shallowReactive({ hasPrefix: !!slots.prefix, hasSuffix: !!slots.suffix })

onBeforeUpdate(() => {
  slotPresence.hasPrefix = !!slots.prefix
  slotPresence.hasSuffix = !!slots.suffix
})

const ui = useComponentUI('colorField', {
  theme,
  variantProps: () => ({
    variant: props.variant,
    fullWidth: props.fullWidth,
  }),
  props,
})

// RAC Group's `data-focus-within` / `data-focus-visible`
const focusState = shallowReactive({ isFocusWithin: false, isFocusVisible: false })

const onFocusIn = (event: FocusEvent) => {
  focusState.isFocusWithin = true

  focusState.isFocusVisible =
    event.target instanceof Element && event.target.matches(':focus-visible')
}

const onFocusOut = (event: FocusEvent) => {
  const group = event.currentTarget
  const next = event.relatedTarget
  const isFocusStayingInside =
    group instanceof Element && next instanceof Node && group.contains(next)

  if (isFocusStayingInside) return

  focusState.isFocusWithin = false
  focusState.isFocusVisible = false
}
</script>
