<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="native-select"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :class="ui.base()"
  >
    <FieldLabel :for="id" />
    <div data-slot="native-select-trigger" :class="ui.trigger()">
      <select
        v-bind="selectAttrs"
        :id="id"
        ref="select"
        data-slot="native-select-select"
        :value="current"
        :name="name"
        :autocomplete="autocomplete"
        :required="required && (validationBehavior ?? 'native') === 'native'"
        :aria-required="required ? 'true' : undefined"
        :disabled="isDisabled"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        :data-placeholder="current === '' ? 'true' : undefined"
        :class="ui.select()"
        @change="onChange"
      >
        <option v-if="placeholder !== undefined" value="">
          {{ placeholder }}
        </option>
        <template v-for="(item, index) in items" :key="index">
          <optgroup v-if="isGroup(item)" :label="item.label" :disabled="item.disabled">
            <option
              v-for="option in item.items.map(optionOf)"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </option>
          </optgroup>
          <option v-else :value="optionOf(item).value" :disabled="optionOf(item).disabled">
            {{ optionOf(item).label }}
          </option>
        </template>
        <slot />
      </select>
      <span aria-hidden="true" data-slot="native-select-indicator" :class="ui.indicator()">
        <slot name="indicator">
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </slot>
      </span>
    </div>
    <FieldDescription />
    <FieldError />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useAttrs, useSlots, useTemplateRef } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'

import type {
  NativeSelectOption,
  NativeSelectGroup,
  NativeSelectItem,
  NativeSelectProps,
  NativeSelectSlots,
} from './NativeSelect.types'
import theme from './theme'

defineOptions({ inheritAttrs: false })

// `undefined` defaults keep an absent `invalid` from counting as controlled-valid
const props = withDefaults(defineProps<NativeSelectProps>(), { invalid: undefined })

const emit = defineEmits<{
  /** Emitted when the user picks an option. */
  'update:modelValue': [value: string]
}>()

defineSlots<NativeSelectSlots>()
const slots = useSlots()
const attrs = useAttrs()

const ui = useComponentUI('nativeSelect', {
  theme,
  variantProps: () => ({
    variant: props.variant,
    fullWidth: props.fullWidth,
  }),
  props,
})

const root = useTemplateRef<HTMLElement>('root')
const select = useTemplateRef<HTMLSelectElement>('select')
const isDisabled = useFieldsetDisabled(() => props.disabled)

const local = ref(props.defaultValue ?? '')
const current = computed(() => props.modelValue ?? local.value)

// The value form reset restores: `defaultValue`, or the option the browser picked at mount
let initial = local.value

// Without a default, the value form reset restores is the first enabled option, as for a native `<select>`.
// Read it from the DOM: binding `value=""` with no empty option leaves the browser with nothing selected.
onMounted(() => {
  if (props.defaultValue !== undefined || !select.value) return

  const first = [...select.value.options].find(
    (option) =>
      !option.disabled &&
      !(option.parentElement instanceof HTMLOptGroupElement && option.parentElement.disabled),
  )

  initial = first?.value ?? ''
  if (props.modelValue === undefined) local.value = initial
})

const { validation, invalid, commitValidation } = useFieldValidation({
  formField: props,
  value: () => current.value,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  onReset: () => {
    local.value = props.defaultValue ?? initial
    emit('update:modelValue', local.value)

    // The browser resets the `<select>` after the `reset` listeners run, and microtasks run in between
    // when the reset comes from a user click, so restore the bound value in a new task
    setTimeout(() => {
      if (select.value) select.value.value = current.value
    })
  },
})

const { id, describedBy, FieldLabel, FieldDescription, FieldError } = useFieldChrome({
  props,
  slots,
  invalid,
  validation,
  disabled: isDisabled,
  required: () => props.required,
  hideDescriptionWhenInvalid: true,
  ariaDescribedBy: () => attrs['aria-describedby'] as string | undefined,
})

const rootAttrs = computed(() => ({ style: attrs.style }))

const selectAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const optionOf = (option: NativeSelectOption) => {
  return typeof option === 'string'
    ? { value: option, label: option, disabled: false }
    : { ...option, label: option.label ?? option.value }
}

const isGroup = (item: NativeSelectItem): item is NativeSelectGroup => {
  return typeof item === 'object' && 'items' in item
}

const onChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  local.value = value
  emit('update:modelValue', value)
  commitValidation()
}
</script>
