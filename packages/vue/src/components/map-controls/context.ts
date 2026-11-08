import type { InjectionKey } from 'vue'
import { inject } from 'vue'

import type { ComponentSlots } from '@/types/tv'

import type { MapControlsPosition } from './MapControls.types'
import type theme from './theme'

/** What `MapControls` shares with its buttons. */
export type MapControlsContext = {
  /** The controls' `ui` prop, which the groups and buttons layer under their own classes. */
  ui: () => ComponentSlots<typeof theme> | undefined
  position: () => MapControlsPosition
}

export const mapControlsContextKey: InjectionKey<MapControlsContext> = Symbol('hareui-map-controls')

export const injectControlsContext = (part: string) => {
  const context = inject(mapControlsContextKey, null)
  if (!context) throw new Error(`[HareUI] ${part} must be used inside <MapControls>.`)

  return context
}
