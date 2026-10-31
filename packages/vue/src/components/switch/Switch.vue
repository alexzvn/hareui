<template>
  <div
    ref="root"
    :data-slot="($attrs['data-slot'] as string | undefined) ?? 'switch'"
    :data-state="checked ? 'checked' : 'unchecked'"
    :data-selected="checked ? 'true' : undefined"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :class="ui.base()"
    @click="forwardRootClick($event, '[data-slot=switch-content]')"
    @mousedown="
      keepFocusWhenReadonly($event, { readonly, contentSelector: '[data-slot=switch-content]' })
    "
  >
    <SwitchRoot
      v-bind="$attrs"
      :id="id"
      :model-value="checked"
      :name="name"
      :value="value"
      :required="required"
      :disabled="isDisabled"
      :aria-describedby="describedBy"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-readonly="readonly ? 'true' : undefined"
      data-slot="switch-content"
      :class="ui.content()"
      @keydown.capture="submitOnEnter"
      @update:model-value="onUpdate"
    >
      <span data-slot="switch-control" :class="ui.control()">
        <span data-slot="switch-thumb" :class="ui.thumb()">
          <span v-if="slots.icon" data-slot="switch-icon" :class="ui.icon()">
            <slot name="icon" :checked="checked" />
          </span>
        </span>
      </span>
      <slot name="label" :checked="checked">{{ label }}</slot>
    </SwitchRoot>
    <FieldDescription />
    <FieldError />
  </div>
</template>

<script setup lang="ts">
import { SwitchRoot } from 'reka-ui'
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

import type { SwitchProps, SwitchSlots } from './Switch.types'
import theme from './theme'

// Attributes go to the switch button; a `data-slot` attribute also renames the root, so a wrapper (CellSwitch) can
// claim it while the button keeps `switch-content`
defineOptions({ inheritAttrs: false })

// `undefined` defaults stop Vue casting absent boolean props to `false`: uncontrolled mode and `defaultValue` apply,
// and an unset `invalid` leaves validation in charge
const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: undefined,
  invalid: undefined,
})

const emit = defineEmits<{
  /** Emitted when the checked state changes. */
  'update:modelValue': [value: boolean]
  /** Emitted after the user toggles the switch (not on `v-model` writes or form reset). */
  change: [event: Event]
}>()

defineSlots<SwitchSlots>()
const slots = useSlots()

const ui = useComponentUI('switch', {
  theme,
  variantProps: () => ({
    size: props.size,
  }),
  props,
})

const local = ref(props.defaultValue ?? false)
const checked = computed(() => props.modelValue ?? local.value)

const root = useTemplateRef<HTMLElement>('root')
const isDisabled = useFieldsetDisabled(() => props.disabled)

const { validation, invalid, commitValidation } = useFieldValidation({
  formField: props,
  value: () => checked.value,
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
  disabled: isDisabled,
  slotProps: () => ({ checked: checked.value }),
})

const onUpdate = (value: boolean) => {
  // RAC `isReadOnly`: the control stays focusable but never changes state
  if (props.readonly) return
  local.value = value
  emit('update:modelValue', value)
  commitValidation()
  emit('change', createChangeEvent())
}
</script>
