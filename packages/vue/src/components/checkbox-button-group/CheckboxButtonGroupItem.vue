<template>
  <CheckboxRoot
    v-bind="$attrs"
    :id="id"
    :value="value"
    :disabled="disabled"
    :aria-invalid="group.invalid.value ? 'true' : undefined"
    :aria-readonly="group.readonly.value ? 'true' : undefined"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :aria-describedby="describedBy"
    data-slot="checkbox-button-group-item"
    :data-selected="selected ? 'true' : undefined"
    :data-invalid="group.invalid.value ? 'true' : undefined"
    :data-readonly="group.readonly.value ? 'true' : undefined"
    :class="itemUi.item({ class: groupUi('item') })"
    @keydown.capture="submitOnEnter"
    @mousedown="group.readonly.value && $event.preventDefault()"
  >
    <template v-if="indicator">
      <span
        v-if="hasCustomIndicator"
        aria-hidden="true"
        data-slot="checkbox-button-group-indicator"
        data-custom="true"
        :class="itemUi.indicator({ class: groupUi('indicator') })"
      >
        <slot name="indicator" v-bind="slotProps" />
      </span>
      <span
        v-else
        aria-hidden="true"
        data-slot="checkbox-button-group-indicator"
        :class="
          group.checkboxUi.value.control({
            class: itemUi.indicator({ class: groupUi('indicator') }),
          })
        "
      >
        <span data-slot="checkbox-indicator" :class="group.checkboxUi.value.indicator()">
          <svg
            aria-hidden="true"
            data-slot="checkbox-default-indicator--checkmark"
            fill="none"
            role="presentation"
            stroke="currentColor"
            stroke-dasharray="22"
            :stroke-dashoffset="selected ? 44 : 66"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 17 18"
          >
            <polyline points="1 9 7 14 15 4" />
          </svg>
        </span>
      </span>
    </template>
    <span
      data-slot="checkbox-button-group-item-content"
      :class="itemUi.content({ class: groupUi('content') })"
    >
      <span
        v-if="hasIcon"
        aria-hidden="true"
        data-slot="checkbox-button-group-item-icon"
        :class="itemUi.icon({ class: groupUi('icon') })"
      >
        <slot name="icon" v-bind="slotProps">
          <span v-if="typeof icon === 'string'" :class="icon" />
          <component :is="icon" v-else />
        </slot>
      </span>
      <span
        data-slot="checkbox-button-group-item-text"
        :class="itemUi.itemText({ class: groupUi('itemText') })"
      >
        <span
          v-if="hasLabel"
          :id="labelId"
          data-slot="checkbox-button-group-item-label"
          :class="itemUi.itemLabel({ class: groupUi('itemLabel') })"
        >
          <slot name="label" v-bind="slotProps">{{ label }}</slot>
        </span>
        <span
          v-if="hasDescription"
          :id="descriptionId"
          data-slot="checkbox-button-group-item-description"
          :class="itemUi.itemDescription({ class: groupUi('itemDescription') })"
        >
          <slot name="description" v-bind="slotProps">{{ description }}</slot>
        </span>
        <!-- `contents`: the slot children stay flex items of the text column -->
        <span
          v-if="slots.default"
          :id="extraId"
          data-slot="checkbox-button-group-item-extra"
          class="contents"
        >
          <slot v-bind="slotProps" />
        </span>
      </span>
    </span>
  </CheckboxRoot>
</template>

<script setup lang="ts">
import { CheckboxRoot } from 'reka-ui'
import { computed, inject, useSlots } from 'vue'

import { submitOnEnter } from '@/composables/forwardRootClick'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'

import type {
  CheckboxButtonGroupItemProps,
  CheckboxButtonGroupItemSlots,
} from './CheckboxButtonGroupItem.types'
import { checkboxButtonGroupContextKey } from './context'
import theme from './theme'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<CheckboxButtonGroupItemProps>(), { indicator: true })
defineSlots<CheckboxButtonGroupItemSlots>()
const slots = useSlots()

const injected = inject(checkboxButtonGroupContextKey, null)
if (!injected) throw new Error('CheckboxButtonGroupItem must be used inside a CheckboxButtonGroup.')
const group = injected

const selected = computed(() => group.selected.value.includes(props.value))

// Reka merges the group's disabled state into the control; mirror it on the card for styling.
const isDisabled = computed(() => group.disabled.value || props.disabled)
const slotProps = computed(() => ({ selected: selected.value, disabled: isDisabled.value }))

const hasCustomIndicator = computed(() => !!slots.indicator)
const hasIcon = computed(() => !!(props.icon || slots.icon))

// Resolved per item: the indicator and icon variants depend on this item's slots / props.
const itemUi = useComponentUI('checkboxButtonGroup', {
  theme,
  variantProps: () => ({
    layout: group.layout.value,
    variant: group.variant.value,
    customIndicator: hasCustomIndicator.value,
    withIcon: hasIcon.value,
  }),
  props,
  classSlot: 'item',
})

// Named by the title alone; the description and the default slot content are announced through aria-describedby.
const { id, labelId, descriptionId, hasLabel, hasDescription, describedBy } = useFieldChrome({
  props,
  slots,
  describedByIds: () => [slots.default && extraId.value, group.describedBy.value],
  describedByIdsPosition: 'afterDescription',
})

const extraId = computed(() => `${id.value}-extra`)

// The group's `ui` sits under the item's own `ui` / `class`.
const groupUi = (slot: keyof NonNullable<CheckboxButtonGroupItemProps['ui']>) => {
  return group.uiOverrides.value?.[slot]
}
</script>
