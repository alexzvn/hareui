<template>
  <div
    data-slot="form-field"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-required="isRequired ? 'true' : undefined"
    :class="ui.base()"
  >
    <div
      v-if="present.label || present.description"
      data-slot="form-field-wrapper"
      :class="ui.wrapper()"
    >
      <div v-if="present.label" data-slot="form-field-label-wrapper" :class="ui.labelWrapper()">
        <Label
          :id="labelId"
          :for="labelFor"
          :required="isRequired"
          :invalid="isInvalid"
          :disabled="!!control?.disabled()"
          :class="ui.label()"
        >
          <slot name="label" :label="label">{{ label }}</slot>
        </Label>
        <span v-if="present.hint" :id="hintId" data-slot="form-field-hint" :class="ui.hint()">
          <slot name="hint" :hint="hint">{{ hint }}</slot>
        </span>
      </div>
      <Description v-if="present.description" :id="descriptionId" :class="ui.description()">
        <slot name="description" :description="description">{{ description }}</slot>
      </Description>
    </div>
    <div data-slot="form-field-container" :class="ui.container()">
      <slot
        v-bind="{
          error,
          id: controlId,
          name,
          labelId,
          describedBy,
          invalid: isInvalid,
          required: isRequired,
        }"
      />
      <FieldError v-if="isErrorShown" :id="errorId" :class="ui.error()">
        <slot name="error" :error="error">{{ errorText }}</slot>
      </FieldError>
      <Description v-else-if="present.help" :id="helpId" :class="ui.help()">
        <slot name="help" :help="help">{{ help }}</slot>
      </Description>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeUpdate,
  onWatcherCleanup,
  provide,
  shallowRef,
  toRef,
  useId,
  watch,
} from 'vue'

import Description from '@/components/description/Description.vue'
import FieldError from '@/components/field-error/FieldError.vue'
import { formContextKey } from '@/components/form/context'
import Label from '@/components/label/Label.vue'
import { useComponentUI } from '@/composables/useComponentUI'

import type { FormFieldControl } from './context'
import { formFieldContextKey } from './context'
import { getFormError } from './formError'
import type { FormFieldProps, FormFieldSlots } from './FormField.types'
import theme from './theme'

const props = withDefaults(defineProps<FormFieldProps>(), { error: undefined })
const slots = defineSlots<FormFieldSlots>()

const form = inject(formContextKey, null)

const controlId = useId()
const hintId = `${controlId}-hint`
const descriptionId = `${controlId}-description`
const helpId = `${controlId}-help`
const errorId = `${controlId}-error`

// `slots` isn't reactive: mirror part presence into a ref so `describedBy`, read by the control, follows slot swaps
const readPresence = () => ({
  label: !!(props.label || slots.label),
  hint: !!(props.hint || slots.hint),
  description: !!(props.description || slots.description),
  help: !!(props.help || slots.help),
  error: !!slots.error,
})

const present = shallowRef(readPresence())
const labelId = computed(() => (present.value.label ? `${controlId}-label` : undefined))

onBeforeUpdate(() => {
  const next = readPresence()
  const prev = present.value
  const keys = Object.keys(next) as (keyof typeof next)[]
  if (keys.some((key) => next[key] !== prev[key])) present.value = next
})

// The HareUI field or custom control that claimed the field (see `useFormField`)
const control = shallowRef<FormFieldControl | null>(null)

const register = (next: FormFieldControl) => {
  control.value = next

  return () => {
    if (control.value === next) control.value = null
  }
}

const labelFor = computed(() => (control.value ? control.value.labelTarget() : controlId))

// `Form.setErrors` keeps only errors for registered names. A control that validates itself registers its own name;
// for any other control the field registers `name`, so a `Form` error for it lands in `formError`.
watch(
  () => (control.value?.validation() ? undefined : props.name),
  (name) => {
    if (!form || !name) return

    onWatcherCleanup(
      form.registerInput(name, { id: () => labelFor.value, pattern: () => props.errorPattern }),
    )
  },
  { immediate: true },
)

// The first `Form` error for `name` or `errorPattern`, for controls that don't report their own validation
const formError = computed(() => {
  if (!form) return undefined

  const owner = { name: props.name, pattern: props.errorPattern }

  return getFormError(form.errors.value, owner)?.message
})

const controlError = computed<string | true | undefined>(() => {
  const validation = control.value?.validation()
  if (!validation) return formError.value
  if (!validation.isInvalid) return undefined

  return validation.validationErrors.join(' ') || true
})

const error = computed<string | true | undefined>(() => props.error || controlError.value)
const isInvalid = computed(() => !!error.value)
const errorText = computed(() => (typeof error.value === 'string' ? error.value : ''))
const isRequired = computed(() => props.required || !!control.value?.required())

const isErrorShown = computed(
  () => props.error !== false && isInvalid.value && (!!errorText.value || present.value.error),
)

const describedBy = computed(
  () =>
    [
      present.value.description && descriptionId,
      present.value.hint && hintId,
      !isErrorShown.value && present.value.help && helpId,
      isErrorShown.value && errorId,
    ]
      .filter(Boolean)
      .join(' ') || undefined,
)

const name = toRef(() => props.name)

provide(formFieldContextKey, {
  controlId,
  labelId,
  descriptionId: toRef(() => (present.value.description ? descriptionId : undefined)),
  describedBy,
  name,
  size: toRef(() => props.size),
  required: toRef(() => !!props.required),
  errorProp: toRef(() => props.error),
  error,
  invalid: isInvalid,
  errorPattern: toRef(() => props.errorPattern),
  eagerValidation: toRef(() => props.eagerValidation),
  validateOnInputDelay: toRef(() => props.validateOnInputDelay),
  register,
})

const ui = useComponentUI('formField', {
  theme,
  variantProps: () => ({ size: props.size }),
  props,
})
</script>
