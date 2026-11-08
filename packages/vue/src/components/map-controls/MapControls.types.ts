import type { IconValue } from '@/types/icon'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type MapControlsTheme = typeof theme

/** The corner of the map the controls sit in. */
export type MapControlsPosition = NonNullable<ComponentVariants<MapControlsTheme>['position']>

/** Props of `MapControls`: a column of control groups in a corner of the map. */
export type MapControlsProps = {
  /**
   * The corner of the map the controls sit in. The bottom corners leave room for the attribution.
   * @defaultValue 'bottom-right'
   */
  position?: MapControlsPosition
  /** Additional classes merged into the controls column. */
  class?: ClassValue
  /** Per-slot class overrides, for the column and every group and button in it. */
  ui?: ComponentSlots<MapControlsTheme>
}

/** Slots of `MapControls`. */
export type MapControlsSlots = {
  /** The controls. Empty, it shows `MapZoomControl`. */
  default?: () => unknown
}

/** Props of `MapLocateControl`. */
export type MapLocateControlProps = {
  /**
   * The zoom level the map flies to once the user's position is found.
   * @defaultValue 14
   */
  zoom?: number
}

/** Events of `MapLocateControl`. */
export type MapLocateControlEmits = {
  /** The user's position was found; the map flies there. */
  locate: [position: GeolocationPosition]
  /** The user's position couldn't be found, or the user declined to share it. */
  error: [error: GeolocationPositionError]
}

/** Props of `MapControlGroup`: buttons joined into one vertical group. */
export type MapControlGroupProps = {
  /** Additional classes merged into the group. */
  class?: ClassValue
}

/** Slots of `MapControlGroup`. */
export type MapControlGroupSlots = {
  /** `MapControlButton`s, split by thin lines. */
  default?: () => unknown
}

/** Props of `MapControlButton`: an icon button for a custom map action. */
export type MapControlButtonProps = {
  /** The icon: a class string (`i-gravity-ui-layers`) or a component. */
  icon?: IconValue
  /** The accessible name, also shown as the tooltip. */
  label: string
  /** Whether a toggle button, such as a layer switch, is on. Leave unset on buttons that don't toggle. */
  active?: boolean
  /**
   * Disables the button.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Replaces the icon with a spinner and marks the button busy.
   * @defaultValue false
   */
  pending?: boolean
  /** Additional classes merged into the button. */
  class?: ClassValue
}

/** Events of `MapControlButton`. */
export type MapControlButtonEmits = {
  /** The button was pressed. */
  click: [event: MouseEvent]
}

/** Slots of `MapControlButton`. */
export type MapControlButtonSlots = {
  /** Replaces the icon. */
  default?: () => unknown
}
