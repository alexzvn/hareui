<template>
  <div
    v-bind="rootAttrs"
    data-slot="input-group"
    role="group"
    :aria-disabled="disabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @click="onClick"
  >
    <div
      v-if="hasPrefix"
      data-slot="input-group-prefix"
      :class="ui.prefix({ class: props.ui?.prefix })"
    >
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
      :class="ui.input({ class: props.ui?.input })"
    />
    <input
      v-else
      v-bind="controlAttrs"
      ref="input"
      v-model="value"
      :type="type"
      data-slot="input-group-input"
      :class="ui.input({ class: props.ui?.input })"
    />
    <div
      v-if="hasSuffix"
      data-slot="input-group-suffix"
      :class="ui.suffix({ class: props.ui?.suffix })"
    >
      <slot name="suffix">
        {{ suffix }}
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'

import theme from './theme'

type InputGroup = typeof theme

export type InputGroupProps = {
  /**
   * The native input type.
   * @defaultValue 'text'
   */
  type?: string
  /** The id of the input. Defaults to the id provided by a surrounding `TextField`. */
  id?: string
  /** The name of the input, used when submitting a form. */
  name?: string
  /** Temporary text shown when the input is empty. */
  placeholder?: string
  /** The initial value when uncontrolled (no `v-model`). */
  defaultValue?: string | number
  /**
   * Visual variant of the group. Defaults to the surrounding `TextField` variant.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<InputGroup>['variant']
  /**
   * Whether the input group takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether the input is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the input is invalid.
   * @defaultValue false
   */
  invalid?: boolean
  /**
   * Whether the input is required.
   * @defaultValue false
   */
  required?: boolean
  /**
   * Whether the input can be selected but not changed. Defaults to the surrounding `TextField`.
   * @defaultValue false
   */
  readonly?: boolean
  /** Validates the value when used without a `TextField` (inside one, set `validate` on the TextField). */
  validate?: ValidateFn<string | number>
  /**
   * Validation behavior when used without a `TextField`. Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** Text content rendered before the input. Replaced by the `#prefix` slot. */
  prefix?: string
  /** Text content rendered after the input. Replaced by the `#suffix` slot. */
  suffix?: string
  /**
   * Renders a multiline `<textarea>` (`data-slot="input-group-textarea"`) instead of the input, like HeroUI's `InputGroup.TextArea`.
   * The group then grows with the content and aligns the prefix/suffix to the top.
   * @defaultValue false
   */
  textarea?: boolean
  /** Number of visible text lines when `textarea` is set. */
  rows?: number
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<InputGroup>
} & FormFieldProps

export type InputGroupSlots = {
  /** Content rendered before the input (icon, text or a button). Replaces the `prefix` prop. */
  prefix?: () => any
  /** Content rendered after the input (icon, text or a button). Replaces the `suffix` prop. */
  suffix?: () => any
}
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, useAttrs, useTemplateRef, watch } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { splitInputAttrs, textFieldContextKey } from '@/components/text-field/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldValidation } from '@/composables/useFieldValidation'

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

const type = computed(() => props.type ?? field?.type.value ?? 'text')
const name = computed(() => props.name ?? field?.name.value)

const id = computed(() => props.id ?? field?.id.value)
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
function onClick(event: MouseEvent) {
  const target = event.target as Element
  if (!input.value || target === input.value || input.value.contains(target)) return
  const interactive = target.closest?.(INTERACTIVE)
  if (
    interactive &&
    interactive !== event.currentTarget &&
    (event.currentTarget as Element).contains(interactive)
  )
    return
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
    [attrs['aria-describedby'] as string | undefined, field?.describedBy.value]
      .filter(Boolean)
      .join(' ') || undefined,
  'data-invalid': invalid.value ? 'true' : undefined,
  'data-disabled': disabled.value ? 'true' : undefined,
}))

const ui = useComponentUI('inputGroup', theme, () => ({
  variant: variant.value,
  fullWidth: fullWidth.value,
}))
</script>
