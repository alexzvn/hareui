import type { Color } from 'reka-ui'
import type { VNode } from 'vue'

import type { ColorSwatchPickerItem } from '@/components/color-swatch-picker/ColorSwatchPicker.types'
import type { PortalTarget } from '@/config'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type CellColorPicker = typeof theme

export type CellColorPickerProps = {
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
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<CellColorPicker>
}

export type CellColorPickerSlots = {
  /** Row label content. Replaces `label`. */
  label?: () => VNode[]
  /** Value text. Defaults to the color as uppercase hex, e.g. `#3B82F6`. */
  value?: (props: { color: Color; hex: string }) => VNode[]
  /** Popover content. Defaults to the presets, a saturation/brightness area and a hue slider. */
  default?: (props: { color: Color; close: () => void }) => VNode[]
}

export type CellColorPickerEmits = {
  /** The color changed (`v-model`). */
  'update:modelValue': [value: Color]
  /** The popover opened or closed (`v-model:open`). */
  'update:open': [value: boolean]
}
