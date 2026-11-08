import type { InjectionKey, Ref, ShallowRef } from 'vue'
import { inject } from 'vue'

import type { MapColor, MapPosition } from '@/components/map/types'
import type { ComponentSlots } from '@/types/tv'

import type theme from './theme'

/** The popup of a marker, as `MapMarkerPopup` registers it. */
export type MarkerPopupHandle = {
  isOpen: Readonly<Ref<boolean>>
  toggle: () => void
}

/** What `MapMarker` shares with its parts. */
export type MapMarkerContext = {
  /** The marker's `ui` prop, which its parts layer under their own classes. */
  ui: () => ComponentSlots<typeof theme> | undefined
  position: () => MapPosition
  color: () => MapColor | undefined
  /** The marker's focusable element. */
  base: Readonly<ShallowRef<HTMLElement | null>>
  /** Whether the marker is hovered or has keyboard focus. */
  isActive: Readonly<Ref<boolean>>
  popup: ShallowRef<MarkerPopupHandle | undefined>
}

export const mapMarkerContextKey: InjectionKey<MapMarkerContext> = Symbol('hareui-map-marker')

/** The element whose presses toggle a popup, so the popup doesn't treat them as presses outside. */
export const mapPopupTriggerKey: InjectionKey<Readonly<ShallowRef<HTMLElement | null>>> = Symbol(
  'hareui-map-popup-trigger',
)

export const injectMarkerContext = (part: string) => {
  const context = inject(mapMarkerContextKey, null)
  if (!context) throw new Error(`[HareUI] ${part} must be used inside <MapMarker>.`)

  return context
}
