<template>
  <Primitive
    :as="as"
    data-slot="fieldset"
    :role="isNative ? undefined : 'group'"
    :aria-labelledby="!isNative && (legend || slots.legend) ? legendId : undefined"
    :aria-describedby="description || slots.description ? descriptionId : undefined"
    :aria-disabled="!isNative && disabled ? 'true' : undefined"
    :disabled="disabled || undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <legend
      v-if="legend || slots.legend"
      :id="legendId"
      data-slot="fieldset-legend"
      :class="ui.legend({ class: props.ui?.legend })"
    >
      <slot name="legend">
        {{ legend }}
      </slot>
    </legend>
    <!-- Split so Description's slot is only forwarded (and force-updated) when a `description` slot is passed. -->
    <Description
      v-if="slots.description"
      :id="descriptionId"
      :class="ui.description({ class: props.ui?.description })"
    >
      <slot name="description">
        {{ description }}
      </slot>
    </Description>
    <Description
      v-else-if="description"
      :id="descriptionId"
      :class="ui.description({ class: props.ui?.description })"
    >
      {{ description }}
    </Description>
    <div
      v-if="slots.default"
      data-slot="fieldset-field-group"
      :class="ui.fieldGroup({ class: props.ui?.fieldGroup })"
    >
      <slot />
    </div>
    <div
      v-if="slots.actions"
      data-slot="fieldset-actions"
      :class="ui.actions({ class: props.ui?.actions })"
    >
      <slot name="actions" />
    </div>
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, provide, useId } from 'vue'

import Description from '@/components/description/Description.vue'
import { useComponentUI } from '@/composables/useComponentUI'

import { fieldsetContextKey, useFieldsetDisabled } from './context'
import type { FieldsetProps, FieldsetSlots } from './Fieldset.types'
import theme from './theme'

const props = withDefaults(defineProps<FieldsetProps>(), { as: 'fieldset' })
const slots = defineSlots<FieldsetSlots>()

// A disabled ancestor (Fieldset or Form) disables this one's descendants too
provide(fieldsetContextKey, { disabled: useFieldsetDisabled(() => props.disabled) })

// A native `<fieldset>` is named by its `<legend>`; any other element gets the same group semantics through ARIA.
// The description is announced with the group either way.
const isNative = computed(() => props.as === 'fieldset')
const baseId = useId()
const legendId = `${baseId}-legend`
const descriptionId = `${baseId}-description`

const ui = useComponentUI('fieldset', theme, () => ({}))
</script>
