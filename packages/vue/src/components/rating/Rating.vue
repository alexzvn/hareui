<template>
  <RadioGroupRoot
    ref="root"
    :model-value="selected"
    :name="name"
    :disabled="isDisabled"
    :required="required"
    :orientation="orientation"
    :loop="false"
    data-slot="rating"
    :data-invalid="invalid ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-readonly="readonly ? 'true' : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :aria-describedby="describedBy"
    :class="ui.base()"
    @keydown.capture="onKeydownCapture"
  >
    <FieldLabel :id="labelId" as="span" :invalid="false" />
    <FieldDescription />
    <div
      data-slot="rating-items"
      :data-orientation="orientation"
      :class="ui.items()"
      @mouseleave="hovered = 0"
    >
      <span
        v-for="{ item, steps } in itemSteps"
        :key="item"
        data-slot="rating-item"
        :data-active="getFill(item) === 1 ? 'true' : undefined"
        :data-partial="isPartial(item) ? 'true' : undefined"
        :class="ui.item()"
      >
        <span
          data-slot="rating-icon"
          aria-hidden="true"
          :data-active="getFill(item) === 1 ? 'true' : undefined"
          :class="ui.icon()"
        >
          <slot name="item" :index="item" :filled="getFill(item) === 1">
            <RatingIcon :icon="getFill(item) === 1 ? icon : (emptyIcon ?? icon)" />
          </slot>
        </span>
        <span
          v-if="isPartial(item)"
          data-slot="rating-fill"
          aria-hidden="true"
          :style="{ width: `${getFill(item) * 100}%` }"
          :class="ui.fill()"
        >
          <span data-slot="rating-icon" data-active="true" :class="ui.icon()">
            <slot name="item" :index="item" :filled="true">
              <RatingIcon :icon="icon" />
            </slot>
          </span>
        </span>
        <RadioGroupItem
          v-for="({ fraction, value }, index) in steps"
          :key="fraction"
          :value="value"
          :disabled="readonly"
          :aria-label="itemLabel(value, length)"
          data-slot="rating-step"
          :data-value="value"
          :style="{ width: `${fraction * 100}%`, zIndex: steps.length - index }"
          :class="ui.step()"
          @select="onSelect($event, value)"
          @mouseenter="onStepEnter(value)"
          @pointerdown="onStepPress($event, value)"
          @pointerup="pressed = 0"
          @pointercancel="pressed = 0"
          @pointerleave="pressed = 0"
        />
      </span>
    </div>
    <FieldError />
  </RadioGroupRoot>
</template>

<script setup lang="ts">
import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { computed, nextTick, ref, useSlots, useTemplateRef } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { clamp, roundToPrecision } from '@/utils/number'

import type { RatingEmits, RatingProps, RatingSlots } from './Rating.types'
import RatingIcon from './RatingIcon.vue'
import theme from './theme'

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<RatingProps>(), {
  modelValue: undefined,
  defaultValue: 0,
  length: 5,
  step: 1,
  orientation: 'horizontal',
  invalid: undefined,
  itemLabel: (value: number, length: number) => `${value} out of ${length}`,
})

const emit = defineEmits<RatingEmits>()

defineSlots<RatingSlots>()
const slots = useSlots()

const isDisabled = useFieldsetDisabled(() => props.disabled)
const isInteractive = computed(() => !isDisabled.value && !props.readonly)

const ui = useComponentUI('rating', {
  theme,
  variantProps: () => ({
    color: props.color,
    size: props.size,
    orientation: props.orientation,
    readonly: props.readonly,
    disabled: isDisabled.value,
  }),
  props,
})

// Uncontrolled state lives here; Reka always sees a controlled value
const local = ref(props.defaultValue)
const current = computed(() => props.modelValue ?? local.value)
const hovered = ref(0)

// The step under a held press, shown before the press commits on release
const pressed = ref(0)

// `null` while unrated, so no radio is checked and a required rating reports a missing value
const selected = computed(() => (current.value > 0 ? current.value : null))

// Fractional steps split an item into stacked radios, each covering the item from its left edge, so a press on the
// item's left part picks the smaller value
const stepFractions = computed(() => {
  const count = Math.round(1 / props.step)

  return Array.from({ length: count }, (_, index) => roundToPrecision((index + 1) * props.step, 2))
})

const itemSteps = computed(() =>
  Array.from({ length: props.length }, (_, index) => ({
    item: index + 1,
    steps: stepFractions.value.map((fraction) => ({
      fraction,
      value: roundToPrecision(index + fraction, 2),
    })),
  })),
)

const displayed = computed(() => pressed.value || hovered.value || current.value)

// Rounded so a value like 3.7 fills its fourth item to exactly 70%
const getFill = (item: number) => {
  const fill = clamp(displayed.value - (item - 1), { min: 0, max: 1 })

  return roundToPrecision(fill, 4)
}

const isPartial = (item: number) => {
  const fill = getFill(item)

  return fill > 0 && fill < 1
}

const root = useTemplateRef<InstanceType<typeof RadioGroupRoot>>('root')

const { validation, invalid, commitValidation } = useFieldValidation({
  formField: props,
  value: () => selected.value,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value?.$el as Element | undefined,
  onReset: () => {
    local.value = props.defaultValue
    emit('update:modelValue', props.defaultValue)
  },
})

const { labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } = useFieldChrome(
  {
    props,
    slots,
    invalid,
    validation,
    disabled: isDisabled,
  },
)

const commit = (value: number) => {
  if (value === current.value) return
  local.value = value
  emit('update:modelValue', value)
  emit('change', value)
  commitValidation()
}

// Every press, arrow key and Space lands here (also on the checked radio, which is how `clearable` clears).
// Reka's own selection is cancelled: the value is always the one committed below.
const onSelect = (event: Event, value: number) => {
  event.preventDefault()
  if (!isInteractive.value) return

  const isClearing = props.clearable && value === current.value
  if (isClearing) hovered.value = 0
  commit(isClearing ? 0 : value)
}

const onStepPress = (event: PointerEvent, value: number) => {
  if (event.button === 0 && isInteractive.value) pressed.value = value
}

const onStepEnter = (value: number) => {
  if (props.hoverable && isInteractive.value) hovered.value = value
}

const focusStep = (value: number) => {
  const el = root.value?.$el as HTMLElement | undefined
  el?.querySelector<HTMLElement>(`[data-slot=rating-step][data-value="${value}"]`)?.focus()
}

const EDGE_KEYS = ['Home', 'End', 'PageUp', 'PageDown']

// Home / End select the lowest / highest value. Reka's roving focus would only move focus to the first / last radio
// (also on PageUp / PageDown) without selecting it.
const onKeydownCapture = (event: KeyboardEvent) => {
  if (!EDGE_KEYS.includes(event.key)) return
  event.preventDefault()
  event.stopPropagation()

  const isHome = event.key === 'Home'
  if (!isInteractive.value || (!isHome && event.key !== 'End')) return

  const target = isHome ? stepFractions.value[0]! : props.length
  commit(target)
  nextTick(() => focusStep(target))
}
</script>
