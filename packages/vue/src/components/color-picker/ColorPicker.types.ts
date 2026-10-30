import type { Color } from 'reka-ui'
import type { VNode } from 'vue'

import type { PortalTarget } from '@/config'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ColorPicker = typeof theme

/** Props for `ColorPicker`, a swatch trigger that opens a popover of colour controls sharing one value. */
export type ColorPickerProps = {
  /** The current colour (controlled). Use with `v-model`. */
  modelValue?: string | Color
  /** The initial colour when uncontrolled. */
  defaultValue?: string | Color
  /** Whether the popover is open (controlled). Use with `v-model:open`. */
  open?: boolean
  /** Whether the popover is open initially when uncontrolled. */
  defaultOpen?: boolean
  /**
   * Side of the trigger the popover opens on.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * Alignment of the popover against the trigger. Defaults to `start`, i.e. bottom left in LTR.
   * @defaultValue 'start'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * Distance in px between the trigger and the popover.
   * @defaultValue 8
   */
  sideOffset?: number
  /**
   * Renders the color picker popover in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Whether the trigger is disabled. */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ColorPicker>
}

/** Slots for `ColorPicker`: the trigger content and the popover's colour controls. */
export type ColorPickerSlots = {
  /** Content of the trigger button, typically a ColorSwatch and a Label. Receives the current colour and open state. */
  trigger?: (props: { color: Color; open: boolean }) => VNode[]
  /**
   * Popover content (ColorArea, ColorSlider, ColorField, ColorSwatchPicker, …). Colour components rendered here
   * follow the picker's colour unless they have their own `v-model`.
   */
  default?: (props: { color: Color; close: () => void }) => VNode[]
}

/** Events emitted by `ColorPicker`. */
export type ColorPickerEmits = {
  /** Emitted when the colour changes. */
  'update:modelValue': [value: Color]
  /** Emitted when the popover opens or closes. */
  'update:open': [value: boolean]
}
