<template>
  <RovingFocusItem v-if="group?.roving" as-child :focusable="!isDisabled" :active="selected">
    <Toggle
      ref="self"
      :as="as"
      :model-value="selected"
      :disabled="isDisabled"
      v-bind="roleAttrs"
      data-slot="toggle-button"
      :data-selected="selected ? 'true' : undefined"
      :class="ui.base({ class: [groupClass, props.ui?.base, props.class] })"
      @update:model-value="onUpdate"
    >
      <span
        v-if="showSeparator"
        aria-hidden="true"
        data-slot="toggle-button-group-separator"
        :class="group!.ui.value.separator({ class: group!.uiOverrides.value?.separator })"
      />
      <slot :selected="selected" :disabled="isDisabled" />
    </Toggle>
  </RovingFocusItem>
  <Toggle
    v-else
    ref="self"
    :as="as"
    :model-value="selected"
    :disabled="isDisabled"
    v-bind="roleAttrs"
    data-slot="toggle-button"
    :data-selected="selected ? 'true' : undefined"
    :class="ui.base({ class: [groupClass, props.ui?.base, props.class] })"
    @update:model-value="onUpdate"
  >
    <span
      v-if="showSeparator"
      aria-hidden="true"
      data-slot="toggle-button-group-separator"
      :class="group!.ui.value.separator({ class: group!.uiOverrides.value?.separator })"
    />
    <slot :selected="selected" :disabled="isDisabled" />
  </Toggle>
</template>

<script setup lang="ts">
import { RovingFocusItem, Toggle } from 'reka-ui'
import { computed, inject, ref, useTemplateRef, watch } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { toggleButtonGroupContextKey } from '@/components/toggle-button-group/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { refElement } from '@/composables/useFirstChild'

import theme from './theme'
import type { ToggleButtonProps, ToggleButtonSlots } from './ToggleButton.types'

// `undefined` stops Vue casting an absent `modelValue` to `false`, so uncontrolled mode applies.
const props = withDefaults(defineProps<ToggleButtonProps>(), {
  as: 'button',
  modelValue: undefined,
  disabled: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

defineSlots<ToggleButtonSlots>()

const group = inject(toggleButtonGroupContextKey, null)

const local = ref(props.defaultValue ?? false)
watch(
  () => props.defaultValue,
  (value) => (local.value = value ?? false),
)

const selected = computed(() =>
  group
    ? props.value !== undefined && group.selected.value.includes(props.value)
    : (props.modelValue ?? local.value),
)

const isDisabled = useFieldsetDisabled(() => props.disabled || group?.disabled.value || undefined)

const onUpdate = (value: boolean) => {
  if (group) {
    if (props.value !== undefined) group.toggle(props.value)
    return
  }

  local.value = value
  emit('update:modelValue', value)
}

const ui = useComponentUI('toggleButton', theme, () => ({
  variant: props.variant,
  size: props.size ?? group?.size.value,
  iconOnly: props.iconOnly,
}))

// HeroUI renders `ToggleButtonGroup.Separator` in every grouped button except the first.
const self = useTemplateRef<unknown>('self')
const showSeparator = computed(
  (): boolean => !!group?.separator.value && group.firstChild.value !== refElement(self.value),
)

const groupClass = computed(() =>
  group?.ui.value.button({ class: group.uiOverrides.value?.button }),
)

// Inside a single-selection group the buttons are radios, as in React Aria.
const roleAttrs = computed(() =>
  group?.selectionMode.value === 'single'
    ? { role: 'radio', 'aria-checked': selected.value, 'aria-pressed': undefined }
    : {},
)
</script>
