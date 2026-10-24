<template>
  <Switch
    :id="id"
    data-slot="cell-switch"
    :model-value="modelValue"
    :default-value="defaultValue"
    :error-message="errorMessage"
    :disabled="disabled"
    :invalid="invalid"
    :readonly="readonly"
    :required="required"
    :validate="validate"
    :validation-behavior="validationBehavior"
    :name="name"
    :value="value"
    :eager-validation="eagerValidation"
    :validate-on-input-delay="validateOnInputDelay"
    :error-pattern="errorPattern"
    :ui="{
      base: ui.base({ class: [props.ui?.base, props.class] }),
      content: ui.trigger({ class: props.ui?.trigger }),
      control: ui.control({ class: props.ui?.control }),
      thumb: ui.thumb({ class: props.ui?.thumb }),
    }"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #label="{ checked }">
      <span data-slot="cell-switch-label" :class="ui.label({ class: props.ui?.label })">
        <slot name="label" :checked="checked">{{ label }}</slot>
      </span>
    </template>
    <template v-if="slots.error" #error="validation">
      <slot name="error" v-bind="validation" />
    </template>
    <template v-if="slots.icon" #icon="{ checked }">
      <slot name="icon" :checked="checked" />
    </template>
  </Switch>
</template>

<script setup lang="ts">
import Switch from '@/components/switch/Switch.vue'
import { useComponentUI } from '@/composables/useComponentUI'

import type { CellSwitchProps, CellSwitchEmits, CellSwitchSlots } from './CellSwitch.types'
import theme from './theme'

// `undefined` defaults keep uncontrolled mode and validation working, as in Switch
const props = withDefaults(defineProps<CellSwitchProps>(), {
  modelValue: undefined,
  invalid: undefined,
})

const emit = defineEmits<CellSwitchEmits>()
const slots = defineSlots<CellSwitchSlots>()

const ui = useComponentUI('cellSwitch', theme, () => ({
  variant: props.variant,
}))
// The row is Switch's own button, so a click anywhere on it toggles the switch. The root's `data-slot` replaces
// Switch's, so the theme repeats the Switch rules that key off `[data-slot=switch]`.
// No comment above `<Switch>` in the template: in dev it would make the root a fragment and stop attribute fallthrough.
</script>
