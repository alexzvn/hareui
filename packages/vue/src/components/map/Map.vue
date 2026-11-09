<template>
  <div
    ref="root"
    data-slot="map"
    :data-loaded="isLoaded || undefined"
    :data-loading="isLoading || undefined"
    :class="ui.base({ class: 'relative isolate size-full overflow-hidden' })"
  >
    <div ref="container" data-slot="map-canvas" :class="ui.canvas({ class: CANVAS_CLASS })" />
    <span ref="probe" hidden />

    <div v-if="isLoading" data-slot="map-loader" :class="ui.loader()">
      <Spinner size="sm" color="current" :class="ui.loaderSpinner()" />
    </div>

    <template v-if="map">
      <MapPolygon
        v-for="(polygon, index) in polygons"
        :key="polygon.id ?? index"
        v-bind="withoutId(polygon)"
        v-on="
          itemListeners('onPolygonClick', (position, event) =>
            emit('polygonClick', polygon, position, event),
          )
        "
      />
      <MapRoute
        v-for="(route, index) in routes"
        :key="route.id ?? index"
        v-bind="withoutId(route)"
        v-on="
          itemListeners('onRouteClick', (position, event) =>
            emit('routeClick', route, position, event),
          )
        "
      />
      <MapArc
        v-for="(arc, index) in arcs"
        :key="arc.id ?? index"
        v-bind="withoutId(arc)"
        v-on="
          itemListeners('onArcClick', (position, event) => emit('arcClick', arc, position, event))
        "
      />
      <MapHeatmap v-if="heatmap" v-bind="heatmap" />
      <MapClusterLayer
        v-if="clusters"
        v-bind="clusters"
        v-on="
          listensTo('onPointClick')
            ? { pointClick: (point: P, event: MouseEvent) => emit('pointClick', point, event) }
            : {}
        "
      />
      <MapMarker
        v-for="(marker, index) in markers"
        :key="marker.id ?? index"
        :position="marker.position"
        :label="marker.label"
        :color="marker.color"
        :anchor="marker.anchor"
        :draggable="marker.draggable"
        :class="marker.class"
        :ui="marker.ui"
        @click="emit('markerClick', marker, $event)"
        @dragend="emit('markerDragend', marker, $event)"
      >
        <slot
          v-if="markerSlot(marker, 'marker')"
          :name="markerSlot(marker, 'marker')!"
          :marker="marker"
        />
        <MapMarkerTooltip v-if="markerSlot(marker, 'tooltip')">
          <slot :name="markerSlot(marker, 'tooltip')!" :marker="marker" />
        </MapMarkerTooltip>
        <MapMarkerPopup v-if="markerSlot(marker, 'popup')" v-slot="{ close }" close-button>
          <slot :name="markerSlot(marker, 'popup')!" :marker="marker" :close="close" />
        </MapMarkerPopup>
      </MapMarker>
      <MapControls v-if="controlOptions" :position="controlOptions.position">
        <MapZoomControl v-if="controlOptions.zoom" />
        <MapCompassControl v-if="controlOptions.compass" />
        <MapLocateControl v-if="controlOptions.locate" />
        <MapFullscreenControl v-if="controlOptions.fullscreen" />
      </MapControls>
    </template>

    <slot v-if="map" />
  </div>
</template>

<script
  setup
  lang="ts"
  generic="M extends MapMarkerItem = MapMarkerItem, P extends MapPoint = MapPoint"
>
import type { Map as MapLibreMap } from 'maplibre-gl'
import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'

import MapCompassControl from '@/components/map-controls/MapCompassControl.vue'
import MapControls from '@/components/map-controls/MapControls.vue'
import MapFullscreenControl from '@/components/map-controls/MapFullscreenControl.vue'
import MapLocateControl from '@/components/map-controls/MapLocateControl.vue'
import MapZoomControl from '@/components/map-controls/MapZoomControl.vue'
import MapMarker from '@/components/map-marker/MapMarker.vue'
import MapMarkerPopup from '@/components/map-marker/MapMarkerPopup.vue'
import MapMarkerTooltip from '@/components/map-marker/MapMarkerTooltip.vue'
import Spinner from '@/components/spinner/Spinner.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { hareUIConfigKey } from '@/config'

import { createColorResolver } from './color'
import type { MapLibre } from './context'
import { provideMapContext } from './context'
import { createLineLayers } from './lineLayers'
import type { MapEmits, MapMarkerItem, MapProps, MapSlots } from './Map.types'
import MapArc from './MapArc.vue'
import MapClusterLayer from './MapClusterLayer.vue'
import MapHeatmap from './MapHeatmap.vue'
import MapPolygon from './MapPolygon.vue'
import MapRoute from './MapRoute.vue'
import { createPointer } from './pointer'
import { toLngLat, toPoint, toPositionLike } from './position'
import theme from './theme'
import type {
  MapFitOptions,
  MapPoint,
  MapPosition,
  MapStyle,
  MapViewport,
  UseMapReturn,
} from './types'
import { useColorScheme } from './useColorScheme'
import { mapWorkerUrl } from './worker'

const DEFAULT_STYLES = {
  light: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
}

const HANDLERS = [
  'boxZoom',
  'doubleClickZoom',
  'dragPan',
  'dragRotate',
  'keyboard',
  'scrollZoom',
  'touchPitch',
  'touchZoomRotate',
] as const

// What maplibre-gl's own stylesheet does for its DOM, so the map works with `unstyled`; the theme only styles it.
const CANVAS_CLASS = [
  'absolute inset-0 [-webkit-tap-highlight-color:transparent]',
  // Canvas, sized by maplibre-gl
  '[&_.maplibregl-canvas]:absolute [&_.maplibregl-canvas]:top-0 [&_.maplibregl-canvas]:left-0',
  // Grab cursors while the map can be dragged
  '[&_.maplibregl-interactive]:cursor-grab [&_.maplibregl-interactive]:select-none [&_.maplibregl-interactive:active]:cursor-grabbing',
  '[&_.maplibregl-interactive.maplibregl-track-pointer]:cursor-pointer',
  // Touch gestures the map handles itself, so the page doesn't pan or zoom with them
  '[&_.maplibregl-touch-zoom-rotate]:[touch-action:pan-x_pan-y] [&_.maplibregl-touch-zoom-rotate_canvas]:[touch-action:pan-x_pan-y]',
  '[&_.maplibregl-touch-drag-pan]:[touch-action:pinch-zoom] [&_.maplibregl-touch-drag-pan_canvas]:[touch-action:pinch-zoom]',
  '[&_.maplibregl-touch-zoom-rotate.maplibregl-touch-drag-pan]:touch-none [&_.maplibregl-touch-zoom-rotate.maplibregl-touch-drag-pan_canvas]:touch-none',
  '[&_.maplibregl-touch-zoom-rotate.maplibregl-touch-drag-pan.maplibregl-cooperative-gestures]:[touch-action:pan-x_pan-y]',
  '[&_.maplibregl-touch-zoom-rotate.maplibregl-touch-drag-pan.maplibregl-cooperative-gestures_canvas]:[touch-action:pan-x_pan-y]',
  // Markers and popups, moved by maplibre-gl transforms
  '[&_.maplibregl-marker]:absolute [&_.maplibregl-marker]:top-0 [&_.maplibregl-marker]:left-0 [&_.maplibregl-marker]:will-change-transform',
  '[&_.maplibregl-popup]:pointer-events-none [&_.maplibregl-popup]:absolute [&_.maplibregl-popup]:top-0 [&_.maplibregl-popup]:left-0 [&_.maplibregl-popup]:z-10 [&_.maplibregl-popup]:flex [&_.maplibregl-popup]:will-change-transform',
  '[&_.maplibregl-popup-content]:pointer-events-auto',
  // Control corners
  '[&_:is(.maplibregl-ctrl-top-left,.maplibregl-ctrl-top-right,.maplibregl-ctrl-bottom-left,.maplibregl-ctrl-bottom-right)]:pointer-events-none',
  '[&_:is(.maplibregl-ctrl-top-left,.maplibregl-ctrl-top-right,.maplibregl-ctrl-bottom-left,.maplibregl-ctrl-bottom-right)]:absolute',
  '[&_:is(.maplibregl-ctrl-top-left,.maplibregl-ctrl-top-right,.maplibregl-ctrl-bottom-left,.maplibregl-ctrl-bottom-right)]:z-10',
  '[&_.maplibregl-ctrl-top-left]:top-0 [&_.maplibregl-ctrl-top-left]:left-0 [&_.maplibregl-ctrl-top-right]:top-0 [&_.maplibregl-ctrl-top-right]:right-0',
  '[&_.maplibregl-ctrl-bottom-left]:bottom-0 [&_.maplibregl-ctrl-bottom-left]:left-0 [&_.maplibregl-ctrl-bottom-right]:right-0 [&_.maplibregl-ctrl-bottom-right]:bottom-0',
  '[&_.maplibregl-ctrl]:pointer-events-auto',
  // Attribution: the button shows only when compact, the credits only when not compact or opened
  '[&_.maplibregl-ctrl-attrib-button]:hidden [&_.maplibregl-compact_.maplibregl-ctrl-attrib-button]:block',
  '[&_.maplibregl-compact:not(.maplibregl-compact-show)_.maplibregl-ctrl-attrib-inner]:hidden [&_.maplibregl-attrib-empty]:hidden',
  // Shift-drag box zoom outline, sized by maplibre-gl
  '[&_.maplibregl-boxzoom]:absolute [&_.maplibregl-boxzoom]:top-0 [&_.maplibregl-boxzoom]:left-0 [&_.maplibregl-boxzoom]:size-0',
  // The `cooperativeGestures` hint: over the map, shown only while maplibre-gl flags it, with the message for the pointer
  '[&_.maplibregl-cooperative-gesture-screen]:pointer-events-none [&_.maplibregl-cooperative-gesture-screen]:absolute [&_.maplibregl-cooperative-gesture-screen]:inset-0',
  '[&_.maplibregl-cooperative-gesture-screen]:z-20 [&_.maplibregl-cooperative-gesture-screen]:opacity-0 [&_.maplibregl-cooperative-gesture-screen.maplibregl-show]:opacity-100',
  '[&_.maplibregl-mobile-message]:hidden pointer-coarse:[&_.maplibregl-mobile-message]:block pointer-coarse:[&_.maplibregl-desktop-message]:hidden',
]

const props = withDefaults(defineProps<MapProps<M, P>>(), {
  projection: 'mercator',
  interactive: true,
  loading: false,
  controls: false,
})

const emit = defineEmits<MapEmits<M, P>>()
const slots = defineSlots<MapSlots<M>>()

/** The position at the center of the map. Use `v-model:center` to follow it as the map moves. */
const center = defineModel<MapPosition>('center', { default: () => ({ long: 0, lat: 0 }) })

/** The zoom level, from 0 (the whole world) to 22. Use `v-model:zoom` to follow it. */
const zoom = defineModel<number>('zoom', { default: 1 })

/** The rotation in degrees, clockwise from north. Use `v-model:bearing` to follow it. */
const bearing = defineModel<number>('bearing', { default: 0 })

/** The tilt in degrees, from 0 (straight down) to 85. Use `v-model:pitch` to follow it. */
const pitch = defineModel<number>('pitch', { default: 0 })

const instance = getCurrentInstance()
const config = inject(hareUIConfigKey, undefined)

const rootRef = useTemplateRef<HTMLDivElement>('root')
const containerRef = useTemplateRef<HTMLDivElement>('container')
const probeRef = useTemplateRef<HTMLSpanElement>('probe')

const { colorScheme, themeVersion } = useColorScheme(rootRef)

const maplibre = shallowRef<MapLibre>()
const map = shallowRef<MapLibreMap>()
const isLoaded = ref(false)
const isStyled = ref(false)
const styleVersion = ref(0)

const colors = createColorResolver(() => probeRef.value)
const lines = createLineLayers(() => isStyled.value)
const pointer = createPointer()

let isDisposed = false

const isLoading = computed(() => props.loading || !isLoaded.value)

const ui = useComponentUI('map', { theme, variantProps: () => ({}), props })

const isStylePair = (
  style: NonNullable<MapProps['mapStyle']>,
): style is { light: MapStyle; dark: MapStyle } =>
  typeof style === 'object' && 'light' in style && 'dark' in style

const mapStyle = computed(() => {
  const style = props.mapStyle ?? DEFAULT_STYLES
  if (!isStylePair(style)) return style

  return style[props.colorMode ?? colorScheme.value]
})

const controlOptions = computed(() => {
  if (!props.controls) return undefined
  const controls = props.controls === true ? {} : props.controls

  return { ...controls, zoom: controls.zoom ?? true }
})

const listensTo = (event: string) => Boolean(instance?.vnode.props?.[event])

/** The listeners of an item part: a `click` that forwards to `Map`'s own event, only while `Map` has a listener. */
const itemListeners = (event: string, click: (position: MapPoint, event: MouseEvent) => void) =>
  listensTo(event) ? { click } : {}

const withoutId = <T extends { id?: unknown }>({ id: _, ...item }: T) => item

/** The slot that renders `part` of `marker`: `#<slot>-<part>` when the item names one, else `#<part>`. */
const markerSlot = <K extends 'marker' | 'tooltip' | 'popup'>(
  marker: M,
  part: K,
): K | `${string}-${K}` | undefined => {
  const named = `${marker.slot}-${part}` as const
  if (marker.slot && slots[named]) return named

  return slots[part] ? part : undefined
}

// Theme changes repaint the colors the parts read through `resolveColor`.
watch(themeVersion, () => colors.clear(), { flush: 'sync' })

const resolveColor = (color: string | undefined, fallback: string) => {
  void themeVersion.value

  return colors.resolve(color ?? `var(${fallback})`)
}

const readNumber = (name: string, fallback: number) => {
  void themeVersion.value
  const root = rootRef.value
  const value = root ? Number.parseFloat(getComputedStyle(root).getPropertyValue(name)) : Number.NaN

  return Number.isFinite(value) ? value : fallback
}

const viewport = (current: MapLibreMap): MapViewport => {
  const { lng, lat } = current.getCenter()

  return {
    center: { long: lng, lat },
    zoom: current.getZoom(),
    bearing: current.getBearing(),
    pitch: current.getPitch(),
  }
}

const flyTo: UseMapReturn['flyTo'] = (target, options = {}) => {
  const current = map.value
  if (!current) return

  const camera = { ...target, center: target.center && toLngLat(target.center) }
  if (options.duration === 0) {
    current.jumpTo(camera)
    return
  }

  current.flyTo({ ...camera, duration: options.duration })
}

const fitPoints = (points: MapPosition[], options: MapFitOptions = {}) => {
  const current = map.value
  const [first, ...rest] = points
  if (!current || !maplibre.value || !first) return

  const bounds = new maplibre.value.LngLatBounds(toLngLat(first), toLngLat(first))
  for (const point of rest) bounds.extend(toLngLat(point))

  // A map that isn't laid out yet, such as one in a hidden tab, fits once it gets its size.
  const canvas = current.getCanvas()
  if (!canvas.clientWidth || !canvas.clientHeight) {
    current.once('resize', () => fitPoints(points, options))
    return
  }

  const { padding = 40, maxZoom = current.getMaxZoom() } = options
  const camera = current.cameraForBounds(bounds, {
    padding:
      typeof padding === 'number' ? padding : { top: 0, right: 0, bottom: 0, left: 0, ...padding },
    maxZoom,
  })

  // No camera fits when the padding leaves no room.
  if (!camera) return

  if (options.duration === 0) current.jumpTo(camera)
  else current.easeTo({ ...camera, duration: options.duration })
}

const api: UseMapReturn = { map, isLoaded, flyTo, fitPoints }

provideMapContext({
  maplibre,
  map,
  root: rootRef,
  isLoaded,
  isStyled,
  styleVersion,
  resolveColor,
  readNumber,
  lines,
  pointer,
  api,
})

const setInteractive = (current: MapLibreMap, interactive: boolean) => {
  for (const handler of HANDLERS) current[handler][interactive ? 'enable' : 'disable']()
}

/** Copies the camera into the models, keeping the center in the form it was given. */
const readCamera = (current: MapLibreMap) => {
  const { center: point, ...camera } = viewport(current)
  const previous = toPoint(center.value)
  if (previous.long !== point.long || previous.lat !== point.lat) {
    center.value = toPositionLike(point, center.value)
  }

  if (zoom.value !== camera.zoom) zoom.value = camera.zoom
  if (bearing.value !== camera.bearing) bearing.value = camera.bearing
  if (pitch.value !== camera.pitch) pitch.value = camera.pitch
}

const listen = (current: MapLibreMap) => {
  current.on('load', () => {
    isLoaded.value = true
    // The compact attribution opens expanded; it starts as its "i" button instead, so it covers no data.
    current
      .getContainer()
      .querySelector('.maplibregl-compact-show')
      ?.classList.remove('maplibregl-compact-show')
    emit('load', current)
  })

  current.on('style.load', () => {
    current.setProjection({ type: props.projection })
    // The map starts in Mercator, which can clamp the center that a globe can show.
    current.jumpTo({
      center: toLngLat(center.value),
      zoom: zoom.value,
      bearing: bearing.value,
      pitch: pitch.value,
    })
    isStyled.value = true
    styleVersion.value++
    lines.redraw()
  })

  current.on('move', () => readCamera(current))
  current.on('moveend', () => emit('moveend', viewport(current)))

  current.on('click', (event) => {
    const target = event.originalEvent.target as Element | null
    if (target?.closest('.maplibregl-marker, .maplibregl-popup')) return

    const { lng, lat } = event.lngLat
    emit('click', { long: lng, lat }, event.originalEvent)
  })

  pointer.attach(current)
  lines.attach(current, pointer)
}

onMounted(async () => {
  const library = await import('maplibre-gl')
  if (isDisposed || !containerRef.value) return

  const url = mapWorkerUrl(config)
  if (url && library.getWorkerUrl() !== url) library.setWorkerUrl(url)

  const current = new library.Map({
    attributionControl: { compact: true },
    renderWorldCopies: false,
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
    interactive: props.interactive,
    ...props.options,
    container: containerRef.value,
    style: mapStyle.value,
    center: toLngLat(center.value),
    zoom: zoom.value,
    bearing: bearing.value,
    pitch: pitch.value,
  })

  listen(current)
  maplibre.value = library
  map.value = current
})

onBeforeUnmount(() => {
  isDisposed = true
})

// After the parts have unmounted and taken their layers off the map.
onUnmounted(() => map.value?.remove())

watch(mapStyle, (style, previous) => {
  const current = map.value
  if (!current || JSON.stringify(style) === JSON.stringify(previous)) return

  isStyled.value = false
  current.setStyle(style, { diff: false })
})

watch(
  () => props.projection,
  (type) => {
    if (isStyled.value) map.value?.setProjection({ type })
  },
)

watch(
  () => props.interactive,
  (interactive) => {
    if (map.value) setInteractive(map.value, interactive)
  },
)

watch(
  () => props.minZoom,
  (level) => map.value?.setMinZoom(level),
)

watch(
  () => props.maxZoom,
  (level) => map.value?.setMaxZoom(level),
)

watch([() => toLngLat(center.value), zoom, bearing, pitch], ([lngLat, level, angle, tilt]) => {
  const current = map.value
  if (!current) return

  const { center: point, ...camera } = viewport(current)
  const isSame =
    point.long === lngLat[0] &&
    point.lat === lngLat[1] &&
    camera.zoom === level &&
    camera.bearing === angle &&
    camera.pitch === tilt

  if (!isSame) current.jumpTo({ center: lngLat, zoom: level, bearing: angle, pitch: tilt })
})

defineExpose(api)
</script>
