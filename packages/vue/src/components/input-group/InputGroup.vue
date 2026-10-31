<template>
  <div
    v-bind="rootAttrs"
    data-slot="input-group"
    role="group"
    :aria-disabled="disabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :class="ui.base()"
    @click="onClick"
  >
    <div v-if="hasPrefix" data-slot="input-group-prefix" :class="ui.prefix()">
      <slot name="prefix">
        {{ prefix }}
      </slot>
    </div>
    <textarea
      v-if="textarea"
      v-bind="controlAttrs"
      ref="input"
      v-model="value"
      :rows="rows"
      data-slot="input-group-textarea"
      :class="ui.input()"
    />
    <input
      v-else
      v-bind="controlAttrs"
      ref="input"
      v-model="value"
      :type="type"
      data-slot="input-group-input"
      :class="ui.input()"
    />
    <div v-if="hasSuffix" data-slot="input-group-suffix" :class="ui.suffix()">
      <slot name="suffix">
        {{ suffix }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, useAttrs, useTemplateRef, watch } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { splitInputAttrs, textFieldContextKey } from '@/components/text-field/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { useFormField } from '@/composables/useFormField'

import type { InputGroupProps, InputGroupSlots } from './InputGroup.types'
import theme from './theme'

defineOptions({ inheritAttrs: false })

// `aria-label`, `autocomplete` and other input attributes go to the input (labelling the group would leave the
// input itself unnamed); the rest stay on the group
const attrs = useAttrs()
const splitAttrs = computed(() => splitInputAttrs(attrs))
const rootAttrs = computed(() => splitAttrs.value.root)

const props = withDefaults(defineProps<InputGroupProps>(), {
  type: undefined,
  fullWidth: undefined,
  disabled: undefined,
  invalid: undefined,
  required: undefined,
  readonly: undefined,
})

const slots = defineSlots<InputGroupSlots>()

/** The input value. */
const modelValue = defineModel<string | number>()

const field = inject(textFieldContextKey, null)

// Inside a TextField, the input without its own v-model uses the field's value; with one, it mirrors into the field
// so the field's `validate` and form reset see what the user typed
const vnodeProps = getCurrentInstance()?.vnode.props ?? {}
const ownModel =
  !field || ['modelValue', 'model-value', 'onUpdate:modelValue'].some((key) => key in vnodeProps)

const value = computed({
  get: () => (ownModel ? modelValue.value : field!.model.value),
  set: (v) => {
    if (ownModel) modelValue.value = v
    if (field) field.model.value = v
  },
})

if (value.value === undefined && props.defaultValue !== undefined) value.value = props.defaultValue

if (field && ownModel) {
  watch(
    modelValue,
    (v) => {
      field.model.value = v
    },
    { immediate: true },
  )

  // The field writes its model on form reset; pass that back to the parent's v-model
  watch(field.model, (v) => {
    if (v !== modelValue.value) modelValue.value = v
  })
}

// A bare InputGroup inside a FormField takes its id, name and description ids, and shows its errors there
const formField = useFormField({
  id: () => props.id,
  name: () => props.name,
  validation: () => own?.validation.value,
  disabled: () => disabled.value,
  required: () => props.required,
})

const type = computed(() => props.type ?? field?.type.value ?? 'text')
const name = computed(() => props.name ?? field?.name.value ?? formField.name.value)

const id = computed(() => props.id ?? field?.id.value ?? formField.id.value)
const variant = computed(() => props.variant ?? field?.variant.value)
const fullWidth = computed(() => props.fullWidth ?? field?.fullWidth.value ?? false)
const disabled = useFieldsetDisabled(() => props.disabled ?? field?.disabled.value ?? false)
const required = computed(() => props.required ?? field?.required.value ?? false)
const readonly = computed(() => props.readonly ?? field?.readonly.value ?? false)

// Inside a TextField the field owns validation; a bare InputGroup validates itself
const input = useTemplateRef<HTMLInputElement | HTMLTextAreaElement>('input')
const own = field
  ? null
  : useFieldValidation({
      value: () => value.value ?? '',
      validate: () => props.validate,
      invalid: () => props.invalid,
      validationBehavior: () => props.validationBehavior,
      name: () => props.name,
      root: () => input.value,
      formField: props,
      onReset: () => {
        value.value = props.defaultValue ?? ''
      },
    })

const invalid = computed(() =>
  own ? own.validation.value.isInvalid : (props.invalid ?? field?.invalid.value ?? false),
)

const hasPrefix = computed(() => !!(props.prefix || slots.prefix))
const hasSuffix = computed(() => !!(props.suffix || slots.suffix))

// HeroUI focuses the input when anything else in the group is clicked (prefix/suffix text and padding). Clicks on
// interactive content (a suffix button) are left alone: RAC's usePress stops their click from reaching the group,
// so the button keeps focus, and Enter/Space on it don't land in the input.
const INTERACTIVE =
  'a[href], button, input, select, textarea, label, [role=button], [role=link], [tabindex]:not([tabindex="-1"]), [contenteditable=""], [contenteditable=true]'

const onClick = (event: MouseEvent) => {
  const target = event.target as Element
  if (!input.value || target === input.value || input.value.contains(target)) return

  const group = event.currentTarget as Element
  const interactive = target.closest?.(INTERACTIVE)
  const isInsideInteractive = !!interactive && interactive !== group && group.contains(interactive)
  if (isInsideInteractive) return

  input.value.focus()
}

// Shared by the <input> and the <textarea> branch
const controlAttrs = computed(() => ({
  ...field?.inputAttrs.value,
  ...splitAttrs.value.input,
  id: id.value,
  name: name.value,
  placeholder: props.placeholder,
  disabled: disabled.value || undefined,
  required: required.value || undefined,
  readonly: readonly.value || undefined,
  'aria-invalid': invalid.value ? ('true' as const) : undefined,
  'aria-describedby':
    [
      attrs['aria-describedby'] as string | undefined,
      field?.describedBy.value ?? formField.describedBy.value,
    ]
      .filter(Boolean)
      .join(' ') || undefined,
  'data-invalid': invalid.value ? 'true' : undefined,
  'data-disabled': disabled.value ? 'true' : undefined,
}))

const ui = useComponentUI('inputGroup', {
  theme,
  variantProps: () => ({
    variant: variant.value,
    fullWidth: fullWidth.value,
  }),
  props,
})
</script>
