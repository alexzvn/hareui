<template>
  <component
    :is="toolbar ? Primitive : RovingFocusGroup"
    ref="root"
    :as="as"
    v-bind="toolbar ? {} : { orientation, loop: false }"
    :role="selectionMode === 'single' ? 'radiogroup' : toolbar ? 'group' : 'toolbar'"
    :aria-orientation="toolbar && selectionMode !== 'single' ? undefined : orientation"
    :aria-disabled="isDisabled || undefined"
    data-slot="toggle-button-group"
    :data-orientation="orientation"
    :data-disabled="isDisabled ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @keydown.capture="onKeydownCapture"
  >
    <slot :selected="selected" />
  </component>
</template>

<script setup lang="ts">
import { Primitive, RovingFocusGroup } from 'reka-ui'
import { computed, inject, provide, ref, toRef, useTemplateRef, watch } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { toolbarContextKey } from '@/components/toolbar/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFirstChild } from '@/composables/useFirstChild'

import { toggleButtonGroupContextKey } from './context'
import theme from './theme'
import type { ToggleButtonGroupProps, ToggleButtonGroupSlots } from './ToggleButtonGroup.types'

const props = withDefaults(defineProps<ToggleButtonGroupProps>(), {
  as: 'div',
  selectionMode: 'single',
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

defineSlots<ToggleButtonGroupSlots>()

// Inside a Toolbar the group takes the toolbar's orientation and leaves arrow keys to it. As a multiple-selection
// `role="group"` there it omits `aria-orientation`, which that role doesn't support (React Aria sets it anyway).
const toolbar = inject(toolbarContextKey, null)
const orientation = computed(() => props.orientation ?? toolbar?.orientation.value ?? 'horizontal')

const local = ref(props.defaultValue ?? [])
watch(
  () => props.defaultValue,
  (value) => (local.value = value ?? []),
)

const selected = computed(() => props.modelValue ?? local.value)
const isDisabled = useFieldsetDisabled(() => props.disabled)

// React Aria semantics: single selection replaces the selection, pressing the selected button clears it.
const toggle = (value: string) => {
  const isSelected = selected.value.includes(value)
  const next =
    props.selectionMode === 'single'
      ? isSelected
        ? []
        : [value]
      : isSelected
        ? selected.value.filter((v) => v !== value)
        : [...selected.value, value]

  if (props.disallowEmptySelection && next.length === 0) return
  local.value = next
  emit('update:modelValue', next)
}

// Reka's roving focus jumps to the first / last button on Home / End (and PageUp / PageDown); RAC's toggle button
// group only moves with the arrow keys. Inside a Toolbar the toolbar's own handler already ignores them.
const onKeydownCapture = (event: KeyboardEvent) => {
  if (!toolbar && ['Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) event.stopPropagation()
}

const ui = useComponentUI('toggleButtonGroup', theme, () => ({
  orientation: orientation.value,
  fullWidth: props.fullWidth,
  detached: props.detached,
}))

const firstChild = useFirstChild(useTemplateRef('root'))

provide(toggleButtonGroupContextKey, {
  selectionMode: toRef(() => props.selectionMode),
  selected,
  disabled: isDisabled,
  toggle,
  size: toRef(() => props.size),
  separator: toRef(() => props.separator),
  firstChild,
  roving: !toolbar,
  ui,
  uiOverrides: toRef(() => props.ui),
})
</script>
