<template>
  <div
    ref="root"
    data-slot="checkbox"
    :data-state="state"
    :data-selected="state === 'checked' ? 'true' : undefined"
    :data-indeterminate="state === 'indeterminate' ? 'true' : undefined"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :class="ui.base()"
    @click="forwardRootClick($event, '[data-slot=checkbox-content]')"
    @mousedown="
      keepFocusWhenReadonly($event, { readonly, contentSelector: '[data-slot=checkbox-content]' })
    "
  >
    <CheckboxRoot
      v-bind="$attrs"
      :id="id"
      :model-value="checked"
      :name="name"
      :value="value"
      :required="required"
      :disabled="isDisabled"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-readonly="readonly ? 'true' : undefined"
      :aria-describedby="describedBy"
      data-slot="checkbox-content"
      :class="ui.content()"
      @keydown.capture="submitOnEnter"
      @update:model-value="onUpdate"
    >
      <span data-slot="checkbox-control" :class="ui.control()">
        <span aria-hidden="true" data-slot="checkbox-indicator" :class="ui.indicator()">
          <slot name="indicator" :state="state">
            <svg
              v-if="state === 'indeterminate'"
              aria-hidden="true"
              data-slot="checkbox-default-indicator--indeterminate"
              fill="none"
              role="presentation"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="3"
              viewBox="0 0 24 24"
            >
              <line x1="21" x2="3" y1="12" y2="12" />
            </svg>
            <svg
              v-else
              aria-hidden="true"
              data-slot="checkbox-default-indicator--checkmark"
              fill="none"
              role="presentation"
              stroke="currentColor"
              stroke-dasharray="22"
              :stroke-dashoffset="state === 'checked' ? 44 : 66"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 17 18"
            >
              <polyline points="1 9 7 14 15 4" />
            </svg>
          </slot>
        </span>
      </span>
      <slot name="label" :state="state">{{ label }}</slot>
    </CheckboxRoot>
    <FieldDescription />
    <FieldError />
  </div>
</template>

<script setup lang="ts">
import { CheckboxRoot } from 'reka-ui'
import { computed, ref, useSlots, useTemplateRef } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import {
  forwardRootClick,
  keepFocusWhenReadonly,
  submitOnEnter,
} from '@/composables/forwardRootClick'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { createChangeEvent } from '@/utils/formControlEvents'

import type { CheckboxState, CheckboxProps, CheckboxSlots } from './Checkbox.types'
import theme from './theme'

defineOptions({ inheritAttrs: false })

// `undefined` defaults stop Vue casting absent boolean props to `false`: uncontrolled mode and `defaultValue` apply,
// and an unset `invalid` leaves validation in charge
const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: undefined,
  invalid: undefined,
})

const emit = defineEmits<{
  /** Emitted when the checked state changes. */
  'update:modelValue': [value: boolean | 'indeterminate']
  /** Emitted after the user toggles the checkbox (not on `v-model` writes or form reset). */
  change: [event: Event]
}>()

defineSlots<CheckboxSlots>()
const slots = useSlots()

const ui = useComponentUI('checkbox', {
  theme,
  variantProps: () => ({
    variant: props.variant,
  }),
  props,
})

const local = ref(props.defaultValue ?? false)
const checked = computed(() => props.modelValue ?? local.value)
const state = computed<CheckboxState>(() => {
  if (checked.value === 'indeterminate') return 'indeterminate'

  return checked.value ? 'checked' : 'unchecked'
})

const root = useTemplateRef<HTMLElement>('root')
const isDisabled = useFieldsetDisabled(() => props.disabled)

const { validation, invalid, commitValidation } = useFieldValidation({
  formField: props,
  value: () => checked.value === true,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  onReset: () => {
    local.value = props.defaultValue ?? false
    emit('update:modelValue', local.value)
  },
})

const { id, describedBy, FieldDescription, FieldError } = useFieldChrome({
  props,
  slots,
  invalid,
  validation,
  slotProps: () => ({ state: state.value }),
})

const onUpdate = (value: boolean | 'indeterminate') => {
  // RAC `isReadOnly`: the control stays focusable but never changes state
  if (props.readonly) return
  local.value = value
  emit('update:modelValue', value)
  commitValidation()
  emit('change', createChangeEvent())
}
</script>
