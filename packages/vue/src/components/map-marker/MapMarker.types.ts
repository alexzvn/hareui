import type { MapColor, MapPoint, MapPosition } from '@/components/map/types'
import type { CloseButtonProp } from '@/types/closeButton'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type MapMarkerTheme = typeof theme

/** Which point of the marker sits on its position. */
export type MapMarkerAnchor = 'center' | 'top' | 'bottom' | 'left' | 'right'

/** Which side of its anchor a tooltip or popup opens on. */
export type MapOverlaySide = 'top' | 'bottom' | 'left' | 'right'

/** Props of `MapMarker`: an element pinned to a position on the map. */
export type MapMarkerProps = {
  /**
   * Where the marker sits. With `draggable`, `v-model:position` follows the drag, in the form it was given (`{ long,
   * lat }` or `[long, lat]`).
   */
  position: MapPosition
  /** The text of the default label, and the marker's accessible name. */
  label?: string
  /** The color of the default dot. */
  color?: MapColor
  /**
   * Which point of the marker sits on `position`. `bottom` suits pins whose tip marks the place.
   * @defaultValue 'center'
   */
  anchor?: MapMarkerAnchor
  /**
   * Whether the marker can be dragged to a new position.
   * @defaultValue false
   */
  draggable?: boolean
  /** Additional classes merged into the marker element. */
  class?: ClassValue
  /** Per-slot class overrides, for the marker and its dot, label and tooltip. */
  ui?: ComponentSlots<MapMarkerTheme>
}

/** Events of `MapMarker`. */
export type MapMarkerEmits = {
  /** The marker was pressed, with the pointer or with `Enter` or `Space`. */
  click: [event: MouseEvent | KeyboardEvent]
  /** A drag ended at `position`. */
  dragend: [position: MapPoint]
  /** The pointer moved onto the marker (`true`) or off it (`false`). */
  hover: [isHovered: boolean]
  /** The marker moved while dragged, in the form `position` was given. */
  'update:position': [position: MapPosition]
}

/** Slots of `MapMarker`. */
export type MapMarkerSlots = {
  /**
   * The marker's content. Without content other than `MapMarkerTooltip` and `MapMarkerPopup`, the marker draws a dot
   * from `color` and a label from `label`.
   */
  default?: () => unknown
}

/** Props of `MapMarkerDot`: the round dot of a marker. */
export type MapMarkerDotProps = {
  /** The dot color. Defaults to the marker's `color`, then the `--map-marker-color` variable. */
  color?: MapColor
  /** The color of the ring around the dot. Defaults to the `--map-marker-ring-color` variable. */
  ringColor?: MapColor
  /** Additional classes merged into the dot. */
  class?: ClassValue
}

/** Props of `MapMarkerLabel`: a short text next to a marker. */
export type MapMarkerLabelProps = {
  /**
   * Which side of the marker the label sits on.
   * @defaultValue 'top'
   */
  position?: 'top' | 'bottom'
  /** Additional classes merged into the label. */
  class?: ClassValue
}

/** Slots of `MapMarkerLabel`. */
export type MapMarkerLabelSlots = {
  /** The label text. */
  default?: () => unknown
}

/** Props of `MapMarkerTooltip`: a hint shown while the marker is hovered or focused. */
export type MapMarkerTooltipProps = {
  /**
   * Which side of the marker the tooltip opens on.
   * @defaultValue 'top'
   */
  side?: MapOverlaySide
  /** Additional classes merged into the tooltip. */
  class?: ClassValue
}

/** Slots of `MapMarkerTooltip`. */
export type MapMarkerTooltipSlots = {
  /** The tooltip content. */
  default?: () => unknown
}

/** Props of `MapMarkerPopup`: a card that pressing the marker opens. */
export type MapMarkerPopupProps = {
  /**
   * Shows a close button in the top corner; an object sets its icon or label.
   * @defaultValue false
   */
  closeButton?: CloseButtonProp
  /**
   * Whether pressing outside the popup or `Escape` closes it.
   * @defaultValue true
   */
  dismissible?: boolean
  /** Which side of the marker the popup opens on. Defaults to the side with the most room in the map. */
  side?: MapOverlaySide
  /**
   * The distance between the marker's position and the popup, in pixels.
   * @defaultValue 16
   */
  sideOffset?: number
  /** Additional classes merged into the popup card. */
  class?: ClassValue
}

/** Slots of `MapMarkerPopup`. */
export type MapMarkerPopupSlots = {
  /** The popup content; `close` closes it. */
  default?: (props: { close: () => void }) => unknown
}
