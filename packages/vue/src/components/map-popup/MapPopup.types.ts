import type { MapOverlaySide } from '@/components/map-marker/MapMarker.types'
import type { MapPosition } from '@/components/map/types'
import type { CloseButtonProp } from '@/types/closeButton'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type MapPopupTheme = typeof theme

/** Props of `MapPopup`: a card pinned to a position, such as the details of a clicked point. */
export type MapPopupProps = {
  /** Where the popup points to. */
  position: MapPosition
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
  /** Which side of the position the popup opens on. Defaults to the side with the most room in the map. */
  side?: MapOverlaySide
  /**
   * The distance between the position and the popup, in pixels.
   * @defaultValue 8
   */
  sideOffset?: number
  /** The popup's accessible name. */
  label?: string
  /** Additional classes merged into the popup card. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<MapPopupTheme>
}

/** Events of `MapPopup`. */
export type MapPopupEmits = {
  /** The popup was closed, with its close button, `Escape` or a press outside. */
  close: []
}

/** Slots of `MapPopup`. */
export type MapPopupSlots = {
  /** The popup content; `close` closes it. */
  default?: (props: { close: () => void }) => unknown
}
