<script lang="ts">
import type { Color } from 'reka-ui'

import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import theme from './theme'

type ColorSwatchPicker = typeof theme

export type ColorSwatchPickerItem =
  | string
  | {
      /** The color as a hex/CSS color string. Identifies the item in `v-model`. */
      value: string
      /** Accessible name for the item. Defaults to the derived color name. */
      label?: string
      /** Whether this item is disabled. */
      disabled?: boolean
    }

export interface ColorSwatchPickerProps {
  /** The swatches to render. */
  items: ColorSwatchPickerItem[]
  /**
   * The selected color (controlled). A hex string or a `Color` object matching one of the items.
   * Falls back to the enclosing `ColorPicker`'s color when neither this nor `v-model` is set.
   */
  modelValue?: string | Color
  /** The initially selected color when uncontrolled. */
  defaultValue?: string | Color
  /**
   * Size of the swatches.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<ColorSwatchPicker>['size']
  /**
   * Shape of the swatches.
   * @defaultValue 'circle'
   */
  variant?: ComponentVariants<ColorSwatchPicker>['variant']
  /**
   * Layout direction.
   * @defaultValue 'grid'
   */
  layout?: ComponentVariants<ColorSwatchPicker>['layout']
  /**
   * Whether every item is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** The name of the field, used when submitting a form. */
  name?: string
  /** Element or component the root renders as. */
  as?: any
  /** Render the root as its single child instead of a wrapper element. */
  asChild?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ColorSwatchPicker>
}

export interface ColorSwatchPickerSlotProps {
  /** The item's color string. */
  value: string
  /** The item's accessible label, if any. */
  label?: string
  /** Whether the item is selected. */
  selected: boolean
}

export interface ColorSwatchPickerSlots {
  /** Replaces the whole content of an item (swatch and indicator). */
  default?: (props: ColorSwatchPickerSlotProps) => any
  /** Replaces the check icon inside the indicator (always rendered, revealed by the selected state). */
  indicator?: (props: ColorSwatchPickerSlotProps) => any
}

export interface ColorSwatchPickerEmits {
  /** Emitted when the selection changes. Emits a `Color` when the current value is a `Color`, else the item's string. */
  'update:modelValue': [value: string | Color]
}
</script>

<script setup lang="ts">
import {
  ColorSwatchPickerItem as ItemPrimitive,
  ColorSwatchPickerRoot,
  colorToString,
  normalizeColor,
} from 'reka-ui'
import { computed, ref } from 'vue'

import { useComponentUI } from '../../composables/useComponentUI'
import { useColorPickerContext } from '../color-picker/context'
import ColorSwatch from '../color-swatch/ColorSwatch.vue'
import { useFieldsetDisabled } from '../fieldset/context'
import ColorSwatchPickerBridge from './colorSwatchPickerBridge'

const props = defineProps<ColorSwatchPickerProps>()
const isDisabled = useFieldsetDisabled(() => props.disabled)
const emit = defineEmits<ColorSwatchPickerEmits>()
defineSlots<ColorSwatchPickerSlots>()

const pickerCtx = useColorPickerContext()

function keyOf(value: string | Color | undefined): string {
  if (value === undefined || value === '') return ''
  try {
    return colorToString(normalizeColor(value), 'hex').toLowerCase()
  } catch {
    return String(value)
  }
}

const normalized = computed(() =>
  props.items.map((item) => {
    const obj =
      typeof item === 'string'
        ? ({ value: item } as { value: string; label?: string; disabled?: boolean })
        : item
    return { ...obj, key: keyOf(obj.value) }
  }),
)

const internal = ref<string | Color | undefined>(props.defaultValue)
const hasOwnModel = computed(() => props.modelValue !== undefined)
const current = computed<string | Color | undefined>(() => {
  if (hasOwnModel.value) return props.modelValue
  if (pickerCtx) return pickerCtx.color.value
  return internal.value
})

// Reka matches by exact string, so map the current value onto the equivalent item's own string
const selected = computed(() => {
  const key = keyOf(current.value)
  return normalized.value.find((item) => item.key === key)?.value ?? ''
})

// Reka's root emits `update:modelValue` twice per selection (its own v-model plus the forwarded listener), so drop the repeat within a tick
let lastSelected: string | undefined
function onUpdate(value: unknown) {
  const next = (Array.isArray(value) ? value[0] : value) as string | undefined
  if (!next || next === lastSelected) return
  lastSelected = next
  queueMicrotask(() => (lastSelected = undefined))
  const out: string | Color = typeof current.value === 'object' ? normalizeColor(next) : next
  if (!hasOwnModel.value) {
    internal.value = out
    if (pickerCtx) pickerCtx.setColor(out)
  }
  emit('update:modelValue', out)
}

const ui = useComponentUI('colorSwatchPicker', theme, () => ({
  size: props.size,
  variant: props.variant,
  layout: props.layout,
}))
</script>

<template>
  <ColorSwatchPickerRoot
    :model-value="selected"
    :disabled="isDisabled"
    :name="name"
    :as="as"
    :as-child="asChild"
    :orientation="layout === 'stack' ? 'vertical' : 'horizontal'"
    data-slot="color-swatch-picker"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:model-value="onUpdate"
  >
    <ColorSwatchPickerBridge
      :selected="selected"
      :stack="layout === 'stack'"
      :disabled="isDisabled"
    />
    <!-- `aria-label` only when given: an undefined attr would override Reka's derived colour name on the option.
         `aria-disabled` because Reka marks disabled options with a `disabled` attribute, which a div doesn't expose. -->
    <ItemPrimitive
      v-for="item in normalized"
      :key="item.value"
      :value="item.value"
      :disabled="item.disabled"
      :aria-disabled="item.disabled || isDisabled ? 'true' : undefined"
      v-bind="item.label ? { 'aria-label': item.label } : {}"
      data-slot="color-swatch-picker-item"
      :style="{ '--color-swatch-current': item.value }"
      :class="ui.item({ class: props.ui?.item })"
    >
      <slot :value="item.value" :label="item.label" :selected="item.value === selected">
        <ColorSwatch
          :color="item.value"
          :color-name="item.label"
          data-slot="color-swatch-picker-swatch"
          :class="ui.swatch({ class: props.ui?.swatch })"
        />
        <span
          aria-hidden="true"
          data-slot="color-swatch-picker-indicator"
          :class="ui.indicator({ class: props.ui?.indicator })"
        >
          <slot
            name="indicator"
            :value="item.value"
            :label="item.label"
            :selected="item.value === selected"
          >
            <svg
              aria-hidden="true"
              data-slot="color-swatch-picker-checkmark"
              fill="none"
              role="presentation"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              viewBox="0 0 12 12"
            >
              <polyline points="2.5 6 5 8.5 9.5 3" />
            </svg>
          </slot>
        </span>
      </slot>
    </ItemPrimitive>
  </ColorSwatchPickerRoot>
</template>
