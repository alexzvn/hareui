<script lang="ts">
import type { Color } from 'reka-ui'

import type { PortalTarget } from '../../config'
import type { ComponentSlots } from '../../types/tv'
import type { ColorSwatchPickerItem } from '../color-swatch-picker/ColorSwatchPicker.vue'
import theme from './theme'

type CellColorPicker = typeof theme

export interface CellColorPickerProps {
  /** Text shown at the start of the row. */
  label?: string
  /** The current color. Use with `v-model`. */
  modelValue?: string | Color
  /**
   * The initial color when uncontrolled.
   * @defaultValue '#000000'
   */
  defaultValue?: string | Color
  /** Whether the popover is open. Use with `v-model:open`. */
  open?: boolean
  /**
   * Whether the popover starts open when uncontrolled.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /** Preset colors shown as swatches above the color area. */
  presets?: ColorSwatchPickerItem[]
  /**
   * Visual variant. Use `secondary` on surfaces.
   * @defaultValue 'default'
   */
  variant?: 'default' | 'secondary'
  /**
   * Side of the row the popover opens on.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * Alignment of the popover against the row.
   * @defaultValue 'end'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * Renders the popover in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /**
   * Whether the row is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<CellColorPicker>
}

export interface CellColorPickerSlots {
  /** Row label content. Replaces `label`. */
  label?: () => any
  /** Value text. Defaults to the color as uppercase hex, e.g. `#3B82F6`. */
  value?: (props: { color: Color; hex: string }) => any
  /** Popover content. Defaults to the presets, a saturation/brightness area and a hue slider. */
  default?: (props: { color: Color; close: () => void }) => any
}

export interface CellColorPickerEmits {
  /** The color changed (`v-model`). */
  'update:modelValue': [value: Color]
  /** The popover opened or closed (`v-model:open`). */
  'update:open': [value: boolean]
}
</script>

<script setup lang="ts">
import { colorToString } from 'reka-ui'

import { useComponentUI } from '../../composables/useComponentUI'
import ColorArea from '../color-area/ColorArea.vue'
import ColorPicker from '../color-picker/ColorPicker.vue'
import ColorSlider from '../color-slider/ColorSlider.vue'
import ColorSwatchPicker from '../color-swatch-picker/ColorSwatchPicker.vue'
import ColorSwatch from '../color-swatch/ColorSwatch.vue'
import { useFieldsetDisabled } from '../fieldset/context'

// `open: undefined` keeps an absent `open` uncontrolled
const props = withDefaults(defineProps<CellColorPickerProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  open: undefined,
  portal: undefined,
  variant: 'default',
  side: 'bottom',
  align: 'end',
})
const emit = defineEmits<CellColorPickerEmits>()
defineSlots<CellColorPickerSlots>()

const ui = useComponentUI('cellColorPicker', theme, () => ({ variant: props.variant }))
const disabled = useFieldsetDisabled(() => props.disabled)

// React Aria's `color.toString('hex')`: uppercase, no alpha
const toHex = (color: Color) => colorToString(color, 'hex').slice(0, 7).toUpperCase()
</script>

<template>
  <div
    data-slot="cell-color-picker"
    :data-disabled="disabled ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <ColorPicker
      :model-value="modelValue"
      :default-value="defaultValue"
      :open="open"
      :default-open="defaultOpen"
      :side="side"
      :align="align"
      :portal="portal"
      :disabled="disabled"
      :ui="{
        base: 'flex w-full',
        trigger: ui.trigger({ class: props.ui?.trigger }),
        popover: ui.popover({ class: props.ui?.popover }),
      }"
      @update:model-value="emit('update:modelValue', $event)"
      @update:open="emit('update:open', $event)"
    >
      <template #trigger="{ color }">
        <span data-slot="cell-color-picker-label" :class="ui.label({ class: props.ui?.label })">
          <slot name="label">
            {{ label }}
          </slot>
        </span>
        <span
          data-slot="cell-color-picker-value-display"
          :class="ui.valueDisplay({ class: props.ui?.valueDisplay })"
        >
          <slot name="value" :color="color" :hex="toHex(color)">
            {{ toHex(color) }}
          </slot>
        </span>
        <ColorSwatch :class="ui.swatch({ class: props.ui?.swatch })" />
      </template>
      <template #default="{ color, close }">
        <slot :color="color" :close="close">
          <ColorSwatchPicker
            v-if="presets?.length"
            :items="presets"
            aria-label="Color presets"
            size="xs"
            :ui="{ indicator: 'hidden' }"
            :class="ui.presets({ class: props.ui?.presets })"
          />
          <ColorArea
            aria-label="Color area"
            class="max-w-full"
            color-space="hsb"
            x-channel="saturation"
            y-channel="brightness"
          />
          <ColorSlider
            channel="hue"
            class="gap-1 px-1"
            color-space="hsb"
            label="Hue"
            :ui="{ output: 'text-muted' }"
          />
        </slot>
      </template>
    </ColorPicker>
  </div>
</template>
