<template>
  <RadioGroupItem
    :id="id"
    :value="value"
    :disabled="isDisabled"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :aria-describedby="describedBy"
    data-slot="radio-button-group-item"
    :data-selected="selected ? 'true' : undefined"
    :data-invalid="group.invalid.value ? 'true' : undefined"
    :data-readonly="group.readonly.value ? 'true' : undefined"
    :class="cls('item', props.class)"
    @keydown.capture="submitOnEnter"
  >
    <span
      v-if="indicator"
      aria-hidden="true"
      data-slot="radio-button-group-indicator"
      :data-custom="customIndicator ? 'true' : undefined"
      :class="cls('indicator')"
    >
      <slot v-if="customIndicator" name="indicator" v-bind="slotProps" />
      <span v-else data-slot="radio-control" :class="radioUI.control({ class: cls('control') })">
        <span
          data-slot="radio-indicator"
          :class="radioUI.indicator({ class: cls('controlIndicator') })"
        />
      </span>
    </span>
    <span data-slot="radio-button-group-item-content" :class="cls('content')">
      <span
        v-if="hasIcon"
        aria-hidden="true"
        data-slot="radio-button-group-item-icon"
        :class="cls('icon')"
      >
        <slot name="icon" v-bind="slotProps">
          <span v-if="typeof icon === 'string'" :class="icon" />
          <component :is="icon" v-else />
        </slot>
      </span>
      <span data-slot="radio-button-group-item-text" :class="cls('itemText')">
        <span
          v-if="hasLabel"
          :id="labelId"
          data-slot="radio-button-group-item-label"
          :class="cls('itemLabel')"
        >
          <slot name="label" v-bind="slotProps">{{ label }}</slot>
        </span>
        <span
          v-if="hasDescription"
          :id="descriptionId"
          data-slot="radio-button-group-item-description"
          :class="cls('itemDescription')"
        >
          <slot name="description" v-bind="slotProps">{{ description }}</slot>
        </span>
        <!-- `contents`: the slot children stay flex items of the text column -->
        <span
          v-if="slots.default"
          :id="extraId"
          data-slot="radio-button-group-item-extra"
          class="contents"
        >
          <slot v-bind="slotProps" />
        </span>
      </span>
    </span>
  </RadioGroupItem>
</template>

<script lang="ts">
import type { Component } from 'vue'

import type { ComponentSlots } from '@/types/tv'

import theme from './theme'

export interface RadioButtonGroupItemProps {
  /** The value submitted and bound to the group's `v-model` when the item is selected. */
  value: string
  /** The item title. */
  label?: string
  /** Help text rendered below the title. */
  description?: string
  /** Leading icon: a class string (such as `i-lucide-truck`) or a component. */
  icon?: string | Component
  /**
   * Whether the item is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether to show the selection indicator in the top-end corner.
   * @defaultValue true
   */
  indicator?: boolean
  /** The id of the item's radio. Generated when omitted. */
  id?: string
  /** Additional classes merged into the card. */
  class?: any
  /** Per-slot class overrides for this item. Merged after the group's `ui`. */
  ui?: Omit<ComponentSlots<typeof theme>, 'base'>
}

export interface RadioButtonGroupItemSlotProps {
  /** Whether the item is selected. */
  selected: boolean
  /** Whether the item is disabled, directly or through the group. */
  disabled: boolean
}

export interface RadioButtonGroupItemSlots {
  /** Extra content rendered after the title and description. */
  default?: (props: RadioButtonGroupItemSlotProps) => any
  /** The title content. Replaces the `label` prop. */
  label?: (props: RadioButtonGroupItemSlotProps) => any
  /** The description content. Replaces the `description` prop. */
  description?: (props: RadioButtonGroupItemSlotProps) => any
  /** The leading icon. Replaces the `icon` prop. */
  icon?: (props: RadioButtonGroupItemSlotProps) => any
  /** A custom indicator icon, shown in accent color while the item is selected. Replaces the radio dot. */
  indicator?: (props: RadioButtonGroupItemSlotProps) => any
}
</script>

<script setup lang="ts">
import { RadioGroupItem } from 'reka-ui'
import { computed, useSlots } from 'vue'

import radioGroupTheme from '@/components/radio-group/theme'
import { submitOnEnter } from '@/composables/forwardRootClick'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'

import { useRadioButtonGroup } from './context'

const props = withDefaults(defineProps<RadioButtonGroupItemProps>(), { indicator: true })
defineSlots<RadioButtonGroupItemSlots>()
const slots = useSlots()
const group = useRadioButtonGroup()

const hasIcon = computed(() => !!(props.icon || slots.icon))
const customIndicator = computed(() => !!slots.indicator)

const ui = useComponentUI('radioButtonGroup', theme, () => ({
  layout: group.layout.value,
  variant: group.variant.value,
  withIcon: hasIcon.value,
  customIndicator: customIndicator.value,
}))
// The default indicator is the radio dot of `RadioGroup`, so it follows that theme (and its overrides).
const radioUI = useComponentUI('radioGroup', radioGroupTheme, () => ({
  variant: group.variant.value,
}))

function cls(
  slot: keyof NonNullable<RadioButtonGroupItemProps['ui']>,
  extra?: RadioButtonGroupItemProps['class'],
) {
  return ui.value[slot]({ class: [group.ui.value?.[slot], props.ui?.[slot], extra] })
}

const selected = computed(() => group.selected.value === props.value)
// Reka merges the group's disabled state into the radio and sets `data-disabled=""` on it.
const isDisabled = computed(() => group.disabled.value || props.disabled)
const slotProps = computed(() => ({ selected: selected.value, disabled: isDisabled.value }))

// Named by the title alone; the description and the default slot content are announced through aria-describedby.
const { id, labelId, descriptionId, hasLabel, hasDescription, describedBy } = useFieldChrome({
  props,
  slots,
  describedByIds: () => [slots.default && extraId.value, group.describedBy.value],
  describedByIdsPosition: 'afterDescription',
})
const extraId = computed(() => `${id.value}-extra`)
</script>
