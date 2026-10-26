<template>
  <RadioGroupRoot
    ref="root"
    :model-value="selected"
    :name="name"
    :disabled="isDisabled"
    :required="required"
    :orientation="orientation"
    data-slot="radio-group"
    :data-invalid="invalid ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-readonly="readonly ? 'true' : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :aria-describedby="describedBy"
    :class="ui.base()"
    @update:model-value="onUpdate"
    @keydown.capture="onKeydownCapture"
  >
    <!-- `as` falls through to Reka `Label`: a group label names the radiogroup via aria-labelledby, not a form control (HeroUI renders a span).
         `disabled` is passed explicitly because Reka sets the root's `data-disabled` to "". -->
    <FieldLabel :id="labelId" as="span" :invalid="false" />
    <FieldDescription />
    <div
      v-for="(item, index) in items"
      :key="item.value"
      data-slot="radio"
      :data-state="selected === item.value ? 'checked' : 'unchecked'"
      :data-selected="selected === item.value ? 'true' : undefined"
      :data-disabled="isDisabled || item.disabled ? 'true' : undefined"
      :data-invalid="invalid ? 'true' : undefined"
      :class="ui.item()"
      @click="forwardRootClick($event, '[data-slot=radio-content]')"
    >
      <RekaRadioGroupItem
        :id="`${id}-${index}`"
        :value="item.value"
        :disabled="item.disabled"
        :aria-describedby="
          [hasItemDescription(item) && `${id}-${index}-description`, describedBy]
            .filter(Boolean)
            .join(' ') || undefined
        "
        data-slot="radio-content"
        :data-selected="selected === item.value ? 'true' : undefined"
        :class="ui.content()"
        @keydown.capture="submitOnEnter"
      >
        <span data-slot="radio-control" :class="ui.control()">
          <span aria-hidden="true" data-slot="radio-indicator" :class="ui.indicator()"
            ><slot
              v-if="slots.indicator"
              name="indicator"
              :item="item"
              :checked="selected === item.value"
          /></span>
        </span>
        <slot name="item-label" :item="item" :index="index">{{ item.label }}</slot>
      </RekaRadioGroupItem>
      <Description
        v-if="hasItemDescription(item) && $slots['item-description']"
        :id="`${id}-${index}-description`"
      >
        <slot name="item-description" :item="item" :index="index">{{ item.description }}</slot>
      </Description>
      <Description v-else-if="hasItemDescription(item)" :id="`${id}-${index}-description`">{{
        item.description
      }}</Description>
    </div>
    <FieldError />
  </RadioGroupRoot>
</template>

<script setup lang="ts" generic="T extends RadioGroupItem = RadioGroupItem">
import { RadioGroupItem as RekaRadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { computed, useSlots, useTemplateRef } from 'vue'

import Description from '@/components/description/Description.vue'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import { forwardRootClick, submitOnEnter } from '@/composables/forwardRootClick'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'

import type { RadioGroupItem, RadioGroupProps, RadioGroupSlots } from './RadioGroup.types'
import theme from './theme'

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<RadioGroupProps<T>>(), {
  items: () => [],
  orientation: 'vertical',
  invalid: undefined,
})

defineSlots<RadioGroupSlots<T>>()

/** The value of the selected item. Bind with `v-model`. */
const modelValue = defineModel<string>()
const slots = useSlots()

const ui = useComponentUI('radioGroup', {
  theme,
  variantProps: () => ({
    variant: props.variant,
    orientation: props.orientation,
  }),
  props,
})

// `null` (not `undefined`) when nothing is selected: Reka self-manages its state when `modelValue` is undefined,
// which would let `readonly` items change selection behind our back.
const selected = computed(() => modelValue.value ?? props.defaultValue ?? null)

const root = useTemplateRef<InstanceType<typeof RadioGroupRoot>>('root')
const isDisabled = useFieldsetDisabled(() => props.disabled)

const { validation, commitValidation } = useFieldValidation({
  formField: props,
  value: () => selected.value,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value?.$el as Element | undefined,
  onReset: () => {
    modelValue.value = props.defaultValue
  },
})

const invalid = computed(() => validation.value.isInvalid)

const { id, labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } =
  useFieldChrome({
    props,
    slots,
    invalid,
    validation,
    disabled: isDisabled,
  })

const hasItemDescription = (item: RadioGroupItem) => {
  return !!(item.description || slots['item-description'])
}

// Reka's roving focus moves focus (without selecting) on Home / End / PageUp / PageDown; RAC's radio group
// ignores them, so stop them before they reach the focused radio.
const onKeydownCapture = (event: KeyboardEvent) => {
  if (['Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) event.stopPropagation()
}

const onUpdate = (value: unknown) => {
  // RAC `isReadOnly`: items stay focusable but the selection never changes
  if (props.readonly) return
  modelValue.value = value as string
  commitValidation()
}
</script>
