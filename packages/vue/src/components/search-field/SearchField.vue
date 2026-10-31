<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="search-field"
    :data-disabled="disabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-empty="isEmpty ? 'true' : undefined"
    :class="ui.base()"
  >
    <FieldLabel :for="id" />
    <div
      data-slot="search-field-group"
      role="group"
      :data-invalid="invalid ? 'true' : undefined"
      :data-disabled="disabled ? 'true' : undefined"
      :data-focus-within="isFocusWithin ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :class="ui.group()"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
    >
      <span data-slot="search-field-search-icon" :class="ui.searchIcon()">
        <slot name="icon">
          <svg
            aria-hidden="true"
            fill="none"
            height="16"
            role="presentation"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M11.5 7a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-.82 4.74a6 6 0 1 1 1.06-1.06l2.79 2.79a.75.75 0 1 1-1.06 1.06z"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>
        </slot>
      </span>
      <input
        v-bind="inputAttrs"
        :id="id"
        ref="input"
        v-model="modelValue"
        type="search"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled || undefined"
        :required="required || undefined"
        :readonly="readonly || undefined"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        data-slot="search-field-input"
        :data-invalid="invalid ? 'true' : undefined"
        :class="ui.input()"
        @keydown.enter="onEnter"
        @keydown.esc="onEscape"
      />
      <CloseButton
        v-if="slots.clearIcon"
        data-slot="search-field-clear-button"
        :aria-label="t('searchField.clear')"
        tabindex="-1"
        :disabled="disabled || readonly || undefined"
        :class="ui.clearButton()"
        @mousedown.prevent
        @click="onClear"
      >
        <slot name="clearIcon" />
      </CloseButton>
      <CloseButton
        v-else
        data-slot="search-field-clear-button"
        :aria-label="t('searchField.clear')"
        tabindex="-1"
        :disabled="disabled || readonly || undefined"
        :class="ui.clearButton()"
        @mousedown.prevent
        @click="onClear"
      />
    </div>
    <FieldDescription />
    <FieldError />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots, useTemplateRef } from 'vue'

import CloseButton from '@/components/close-button/CloseButton.vue'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import { splitInputAttrs } from '@/components/text-field/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { useLocale } from '@/composables/useLocale'

import type { SearchFieldProps, SearchFieldSlots, SearchFieldEmits } from './SearchField.types'
import theme from './theme'

defineOptions({ inheritAttrs: false })

const { t } = useLocale()

const props = withDefaults(defineProps<SearchFieldProps>(), { invalid: undefined })
const emit = defineEmits<SearchFieldEmits>()
const slots = useSlots()
defineSlots<SearchFieldSlots>()

// `aria-label`, `autocomplete` and other input attributes go to the input, as in HeroUI; the rest stay on the root
const attrs = useAttrs()
const splitAttrs = computed(() => splitInputAttrs(attrs))
const inputAttrs = computed(() => splitAttrs.value.input)
const rootAttrs = computed(() => splitAttrs.value.root)

/** The search query. */
const modelValue = defineModel<string>()
if (modelValue.value === undefined && props.defaultValue !== undefined)
  modelValue.value = props.defaultValue

const root = useTemplateRef<HTMLElement>('root')
const input = useTemplateRef<HTMLInputElement>('input')

const { validation, invalid } = useFieldValidation({
  value: () => modelValue.value ?? '',
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  formField: props,
  onReset: () => {
    modelValue.value = props.defaultValue ?? ''
  },
})

const disabled = useFieldsetDisabled(() => props.disabled)
const isEmpty = computed(() => !modelValue.value)

const isFocusWithin = ref(false)
const isFocusVisible = ref(false)
const onFocusIn = (event: FocusEvent) => {
  isFocusWithin.value = true
  isFocusVisible.value = event.target instanceof Element && event.target.matches(':focus-visible')
}

const onFocusOut = (event: FocusEvent) => {
  if (
    event.currentTarget instanceof Element &&
    event.relatedTarget instanceof Node &&
    event.currentTarget.contains(event.relatedTarget)
  )
    return

  isFocusWithin.value = false
  isFocusVisible.value = false
}

// Kept for backward compatibility with native form submission, matching RAC's useSearchField: Enter submits via
// the `submit` event instead of letting the browser submit the surrounding form. Disabled or readonly fields
// still swallow Enter but don't submit.
const onEnter = (event: KeyboardEvent) => {
  event.preventDefault()
  if (disabled.value || props.readonly) return
  emit('submit', modelValue.value ?? '')
}

// Matches RAC: Escape clears the field and stops there (an enclosing dialog stays open), but does nothing and lets
// the key through when the field is already empty, disabled or readonly.
const onEscape = (event: KeyboardEvent) => {
  if (disabled.value || props.readonly || !modelValue.value) return
  event.preventDefault()
  event.stopPropagation()
  modelValue.value = ''
  emit('clear')
}

const onClear = () => {
  // RAC focuses the input before the click reaches the button, so it never leaves the input
  input.value?.focus()
  modelValue.value = ''
  emit('clear')
}

const { id, describedBy, FieldLabel, FieldDescription, FieldError } = useFieldChrome({
  props,
  slots,
  invalid,
  validation,
  disabled,
  required: () => props.required,
  hideDescriptionWhenInvalid: true,
  ariaDescribedBy: () => attrs['aria-describedby'] as string | undefined,
})

const ui = useComponentUI('searchField', {
  theme,
  variantProps: () => ({
    variant: props.variant,
    fullWidth: props.fullWidth,
  }),
  props,
})
</script>
