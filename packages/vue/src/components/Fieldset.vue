<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { ComponentSlots } from '../types/tv'
import theme from '../theme/fieldset'

type Fieldset = typeof theme

export interface FieldsetProps {
  /**
   * The element or component to render as.
   * @defaultValue 'fieldset'
   */
  as?: PrimitiveProps['as']
  /** The legend text. */
  legend?: string
  /** Help text rendered below the legend. */
  description?: string
  /**
   * Disables every control inside, like a native `<fieldset disabled>`, including div-based ones.
   * @defaultValue false
   */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Fieldset>
}

export interface FieldsetSlots {
  /** The legend content. Replaces the `legend` prop. */
  legend?: () => any
  /** The description content. Replaces the `description` prop. */
  description?: () => any
  /** Form fields, rendered inside the field group. */
  default?: () => any
  /** Action buttons or helper text below the fields. */
  actions?: () => any
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { provide, toRef } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'
import Description from './Description.vue'
import { fieldsetContextKey } from './fieldsetContext'

const props = withDefaults(defineProps<FieldsetProps>(), { as: 'fieldset' })
const slots = defineSlots<FieldsetSlots>()

provide(fieldsetContextKey, { disabled: toRef(() => props.disabled) })

const ui = useComponentUI('fieldset', theme, () => ({}))
</script>

<template>
  <Primitive
    :as="as"
    data-slot="fieldset"
    :disabled="disabled || undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <legend v-if="legend || slots.legend" data-slot="fieldset-legend" :class="ui.legend({ class: props.ui?.legend })">
      <slot name="legend">
        {{ legend }}
      </slot>
    </legend>
    <Description v-if="description || slots.description" :class="ui.description({ class: props.ui?.description })">
      <slot name="description">
        {{ description }}
      </slot>
    </Description>
    <div v-if="slots.default" data-slot="fieldset-field-group" :class="ui.fieldGroup({ class: props.ui?.fieldGroup })">
      <slot />
    </div>
    <div v-if="slots.actions" data-slot="fieldset-actions" :class="ui.actions({ class: props.ui?.actions })">
      <slot name="actions" />
    </div>
  </Primitive>
</template>
