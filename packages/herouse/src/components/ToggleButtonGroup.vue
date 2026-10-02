<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { ComponentSlots, ComponentVariants } from '../types/tv'
import type { ToggleButtonProps } from './ToggleButton.vue'
import theme from '../theme/toggleButtonGroup'

type ToggleButtonGroup = typeof theme

export interface ToggleButtonGroupProps {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** The `value`s of the selected ToggleButtons (controlled, `v-model`). */
  modelValue?: string[]
  /**
   * The initially selected values when uncontrolled.
   * @defaultValue []
   */
  defaultValue?: string[]
  /**
   * Whether one or several buttons can be selected. Single selection makes the buttons radios.
   * @defaultValue 'single'
   */
  selectionMode?: 'single' | 'multiple'
  /**
   * Whether the last selected button can't be deselected.
   * @defaultValue false
   */
  disallowEmptySelection?: boolean
  /**
   * Layout direction, also the arrow keys that move focus.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<ToggleButtonGroup>['orientation']
  /** Size applied to every ToggleButton that doesn't set its own. */
  size?: ToggleButtonProps['size']
  /**
   * Disables every ToggleButton in the group; a ToggleButton's own `:disabled="false"` re-enables it.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the group stretches to its container and the buttons share the width.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Separates the buttons with a gap and fully rounds each one instead of joining them.
   * @defaultValue false
   */
  detached?: boolean
  /**
   * Draws a divider at the start of every button except the first (HeroUI's `ToggleButtonGroup.Separator`).
   * Hidden when `detached`.
   * @defaultValue false
   */
  separator?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. `button` is added to each ToggleButton, `separator` to each divider. */
  ui?: ComponentSlots<ToggleButtonGroup>
}

export interface ToggleButtonGroupSlots {
  /** The ToggleButtons, each with a `value`. */
  default?: (props: { selected: string[] }) => any
}
</script>

<script setup lang="ts">
import { RovingFocusGroup } from 'reka-ui'
import { computed, provide, ref, toRef, watch } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'
import { useFieldsetDisabled } from './fieldsetContext'
import { toggleButtonGroupContextKey } from './toggleButtonGroupContext'

const props = withDefaults(defineProps<ToggleButtonGroupProps>(), { as: 'div', selectionMode: 'single', orientation: 'horizontal' })
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()
defineSlots<ToggleButtonGroupSlots>()

const local = ref(props.defaultValue ?? [])
watch(() => props.defaultValue, value => (local.value = value ?? []))
const selected = computed(() => props.modelValue ?? local.value)
const isDisabled = useFieldsetDisabled(() => props.disabled)

// React Aria semantics: single selection replaces the selection, pressing the selected button clears it.
function toggle(value: string) {
  const isSelected = selected.value.includes(value)
  const next = props.selectionMode === 'single'
    ? (isSelected ? [] : [value])
    : (isSelected ? selected.value.filter(v => v !== value) : [...selected.value, value])
  if (props.disallowEmptySelection && next.length === 0)
    return
  local.value = next
  emit('update:modelValue', next)
}

const ui = useComponentUI('toggleButtonGroup', theme, () => ({
  orientation: props.orientation,
  fullWidth: props.fullWidth,
  detached: props.detached,
}))

provide(toggleButtonGroupContextKey, {
  selectionMode: toRef(() => props.selectionMode),
  selected,
  disabled: isDisabled,
  toggle,
  size: toRef(() => props.size),
  separator: toRef(() => props.separator),
  ui,
  uiOverrides: toRef(() => props.ui),
})
</script>

<template>
  <RovingFocusGroup
    :as="as"
    :orientation="orientation"
    :loop="false"
    :role="selectionMode === 'single' ? 'radiogroup' : 'toolbar'"
    :aria-orientation="orientation"
    :aria-disabled="isDisabled || undefined"
    data-slot="toggle-button-group"
    :data-orientation="orientation"
    :data-disabled="isDisabled ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot :selected="selected" />
  </RovingFocusGroup>
</template>
