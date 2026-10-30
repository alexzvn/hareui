<template>
  <CheckboxGroupRoot
    ref="root"
    role="group"
    :model-value="selected"
    :name="name"
    :disabled="isDisabled"
    :required="required"
    :roving-focus="false"
    data-slot="checkbox-group"
    :data-invalid="invalid ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :aria-describedby="describedBy"
    :class="ui.base()"
    @update:model-value="onUpdate"
  >
    <!-- `as` falls through to Reka `Label`: the group label names the group via aria-labelledby, not a form control -->
    <FieldLabel :id="labelId" as="span" :invalid="false" />
    <FieldDescription />
    <div
      v-for="(item, index) in items"
      :key="item.value"
      data-slot="checkbox"
      :data-state="selected.includes(item.value) ? 'checked' : 'unchecked'"
      :data-selected="selected.includes(item.value) ? 'true' : undefined"
      :data-disabled="isDisabled || item.disabled ? 'true' : undefined"
      :data-invalid="invalid ? 'true' : undefined"
      :data-readonly="readonly ? 'true' : undefined"
      :class="itemUi.base()"
      @click="forwardRootClick($event, '[data-slot=checkbox-content]')"
      @mousedown="
        keepFocusWhenReadonly($event, { readonly, contentSelector: '[data-slot=checkbox-content]' })
      "
    >
      <RekaCheckboxRoot
        :id="`${id}-${index}`"
        :value="item.value"
        :disabled="item.disabled"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-readonly="readonly ? 'true' : undefined"
        :aria-describedby="
          [hasItemDescription(item) && `${id}-${index}-description`, describedBy]
            .filter(Boolean)
            .join(' ') || undefined
        "
        data-slot="checkbox-content"
        :data-selected="selected.includes(item.value) ? 'true' : undefined"
        :class="itemUi.content()"
        @keydown.capture="submitOnEnter"
      >
        <span data-slot="checkbox-control" :class="itemUi.control()">
          <span aria-hidden="true" data-slot="checkbox-indicator" :class="itemUi.indicator()">
            <slot name="indicator" :item="item" :checked="selected.includes(item.value)">
              <svg
                aria-hidden="true"
                data-slot="checkbox-default-indicator--checkmark"
                fill="none"
                role="presentation"
                stroke="currentColor"
                stroke-dasharray="22"
                :stroke-dashoffset="selected.includes(item.value) ? 44 : 66"
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
        <slot name="item-label" :item="item" :index="index">{{ item.label }}</slot>
      </RekaCheckboxRoot>
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
  </CheckboxGroupRoot>
</template>

<script setup lang="ts" generic="T extends CheckboxGroupItem = CheckboxGroupItem">
import { CheckboxGroupRoot, CheckboxRoot as RekaCheckboxRoot } from 'reka-ui'
import type { ComponentPublicInstance } from 'vue'
import { computed, useSlots, useTemplateRef } from 'vue'

import checkboxTheme from '@/components/checkbox/theme'
import Description from '@/components/description/Description.vue'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import {
  forwardRootClick,
  keepFocusWhenReadonly,
  submitOnEnter,
} from '@/composables/forwardRootClick'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'

import type {
  CheckboxGroupItem,
  CheckboxGroupProps,
  CheckboxGroupSlots,
} from './CheckboxGroup.types'
import theme from './theme'

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<CheckboxGroupProps<T>>(), {
  items: () => [],
  invalid: undefined,
})

defineSlots<CheckboxGroupSlots<T>>()

/** The selected values. Bind with `v-model`. */
const modelValue = defineModel<string[]>()
const slots = useSlots()

const ui = useComponentUI('checkboxGroup', {
  theme,
  variantProps: () => ({
    variant: props.variant,
  }),
  props,
})

// Items are literally HeroUI's `<Checkbox>` inside `<CheckboxGroup>`: reuse its theme/classes verbatim.
const itemUi = useComponentUI('checkbox', {
  theme: checkboxTheme,
  variantProps: () => ({
    variant: props.variant,
  }),
  // `ui.item` is each checkbox's root (`base`); `content`, `control` and `indicator` keep the checkbox theme's names.
  props: {
    get ui() {
      return {
        base: props.ui?.item,
        content: props.ui?.content,
        control: props.ui?.control,
        indicator: props.ui?.indicator,
      }
    },
  },
})

// `[]` (not `undefined`): Reka self-manages its state when `modelValue` is undefined, which would let
// `readonly` items change selection behind our back.
const selected = computed(() => modelValue.value ?? props.defaultValue ?? [])

const root = useTemplateRef<ComponentPublicInstance>('root')
const isDisabled = useFieldsetDisabled(() => props.disabled)

const { validation, invalid, commitValidation } = useFieldValidation({
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

const { id, labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } =
  useFieldChrome({
    props,
    slots,
    invalid,
    validation,
    disabled: isDisabled,
  })

const hasItemDescription = (item: CheckboxGroupItem) => {
  return !!(item.description || slots['item-description'])
}

const onUpdate = (value: string[]) => {
  // `isReadOnly`: items stay focusable but the selection never changes
  if (props.readonly) return

  modelValue.value = value
  commitValidation()
}
</script>
