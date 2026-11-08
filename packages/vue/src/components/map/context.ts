import type * as MapLibreModule from 'maplibre-gl'
import type { Map as MapLibreMap } from 'maplibre-gl'
import type { InjectionKey, Ref, ShallowRef } from 'vue'
import { inject, onBeforeUnmount, provide, watchEffect } from 'vue'

import type { LineLayers } from './lineLayers'
import type { MapPointer } from './pointer'
import type { MapColor, UseMapReturn } from './types'

export type MapLibre = typeof MapLibreModule

/** What `Map` shares with its parts. */
export type MapContext = {
  /** The maplibre-gl module, loaded on mount. */
  maplibre: ShallowRef<MapLibre | undefined>
  map: ShallowRef<MapLibreMap | undefined>
  /** The map's root element. */
  root: Readonly<ShallowRef<HTMLElement | null>>
  isLoaded: Ref<boolean>
  /** Whether the current style has loaded, so sources and layers can be added. A new style resets it. */
  isStyled: Ref<boolean>
  /** Counts loaded styles; a new style drops every source and layer the parts added. */
  styleVersion: Ref<number>
  /** `color` as `rgb()`/`rgba()` in the map's color scheme; `fallback` (a `--map-*` variable) when unset. */
  resolveColor: (color: MapColor | undefined, fallback: string) => string
  /** The number in the CSS variable `name` on the map, or `fallback`. */
  readNumber: (name: string, fallback: number) => number
  lines: LineLayers
  pointer: MapPointer
  api: UseMapReturn
}

const mapContextKey: InjectionKey<MapContext> = Symbol('hareui-map')

export const provideMapContext = (context: MapContext) => provide(mapContextKey, context)

/** The context of the enclosing `Map`; throws outside one. */
export const injectMapContext = (part: string) => {
  const context = inject(mapContextKey, null)
  if (!context) throw new Error(`[HareUI] ${part} must be used inside <Map>.`)

  return context
}

/**
 * Runs `draw` once the style is ready, again on every change of what it reads and after every new style. `remove`
 * runs on unmount, while the style still holds what `draw` added.
 */
export const useStyleEffect = (
  context: MapContext,
  { draw, remove }: { draw: (map: MapLibreMap) => void; remove: (map: MapLibreMap) => void },
) => {
  watchEffect(() => {
    const map = context.map.value
    if (!map || !context.isStyled.value) return

    void context.styleVersion.value
    draw(map)
  })

  onBeforeUnmount(() => {
    const map = context.map.value
    if (map && context.isStyled.value) remove(map)
  })
}
