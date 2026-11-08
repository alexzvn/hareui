import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { createHareUI } from '@/config'
import * as lib from '@/index'
import {
  Map as HareMap,
  MapControls,
  MapMarker,
  MapMarkerPopup,
  MapMarkerTooltip,
  MapRoute,
  MapZoomControl,
  useMap,
} from '@/map'
import type { MapMarkerItem, MapMarkerSlotProps } from '@/map'

// maplibre-gl draws with WebGL, which happy-dom lacks. The stand-in records the maps, markers and sources the
// component creates and, like maplibre-gl, puts each marker's and popup's element in the map container.
const fake = vi.hoisted(() => {
  const imports = { count: 0 }
  const maps: FakeMap[] = []
  const markers: FakeMarker[] = []
  const setWorkerUrl = vi.fn<(url: string) => void>()

  type Listener = (event?: unknown) => void
  type SourceData = { features?: { geometry: { coordinates: unknown } }[] }

  class Emitter {
    readonly listeners = new Map<string, Listener[]>()

    readonly on = (type: string, listener: Listener) => {
      this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener])

      return this
    }

    readonly off = (type: string, listener: Listener) => {
      this.listeners.set(
        type,
        (this.listeners.get(type) ?? []).filter((other) => other !== listener),
      )

      return this
    }

    readonly fire = (type: string, event?: unknown) => {
      for (const listener of this.listeners.get(type) ?? []) listener(event)
    }
  }

  const handler = () => ({ enable: vi.fn<() => void>(), disable: vi.fn<() => void>() })

  class FakeMap extends Emitter {
    readonly container: HTMLElement
    readonly canvas = document.createElement('canvas')
    readonly sources = new Map<string, { data: SourceData }>()
    readonly layers = new Set<string>()
    center = { lng: 0, lat: 0 }
    zoom = 1
    readonly boxZoom = handler()
    readonly doubleClickZoom = handler()
    readonly dragPan = handler()
    readonly dragRotate = handler()
    readonly keyboard = handler()
    readonly scrollZoom = handler()
    readonly touchPitch = handler()
    readonly touchZoomRotate = handler()
    readonly remove = vi.fn<() => void>()
    readonly flyTo = vi.fn<() => void>()
    readonly easeTo = vi.fn<() => void>()
    readonly fitBounds = vi.fn<() => void>()
    readonly resetNorthPitch = vi.fn<() => void>()
    readonly setFeatureState = vi.fn<() => void>()
    readonly setLayoutProperty = vi.fn<() => void>()
    readonly setPaintProperty = vi.fn<() => void>()
    readonly setProjection = vi.fn<() => void>()
    readonly setStyle = vi.fn<() => void>()
    readonly setMinZoom = vi.fn<() => void>()
    readonly setMaxZoom = vi.fn<() => void>()
    readonly getCanvas = () => this.canvas
    readonly getContainer = () => this.container
    readonly getBearing = () => 0
    readonly getPitch = () => 0
    readonly getCenter = () => this.center
    readonly getZoom = () => this.zoom
    readonly getMinZoom = () => 0
    readonly getMaxZoom = () => 22
    readonly getStyle = () => ({ layers: [] })
    readonly getLayer = (id: string) => (this.layers.has(id) ? { id } : undefined)
    readonly getSource = (id: string) => this.sources.get(id)
    readonly queryRenderedFeatures = () => []

    readonly addSource = (id: string, source: { data: SourceData }) => {
      const stored = { ...source, setData: (data: SourceData) => (stored.data = data) }
      this.sources.set(id, stored)
    }

    readonly removeSource = (id: string) => this.sources.delete(id)
    readonly addLayer = (layer: { id: string }) => this.layers.add(layer.id)
    readonly removeLayer = (id: string) => this.layers.delete(id)
    readonly zoomTo = vi.fn<(zoom: number) => void>()

    readonly jumpTo = (camera: { center?: [number, number]; zoom?: number }) => {
      if (camera.center) this.center = { lng: camera.center[0], lat: camera.center[1] }
      if (camera.zoom !== undefined) this.zoom = camera.zoom
    }

    constructor(options: { container: HTMLElement; center: [number, number]; zoom: number }) {
      super()
      this.container = options.container
      this.center = { lng: options.center[0], lat: options.center[1] }
      this.zoom = options.zoom
      maps.push(this)
    }

    /** Finishes loading: the style and the first frame. */
    readonly load = () => {
      this.fire('style.load')
      this.fire('load')
    }

    /** Moves the camera as a drag would. */
    readonly moveTo = (lng: number, lat: number) => {
      this.center = { lng, lat }
      this.fire('move')
    }
  }

  class FakeMarker extends Emitter {
    readonly element: HTMLElement
    lngLat: [number, number] = [0, 0]
    readonly setDraggable = vi.fn<() => void>()

    readonly getLngLat = () => ({
      lng: this.lngLat[0],
      lat: this.lngLat[1],
      toArray: () => this.lngLat,
    })

    constructor(options: { element: HTMLElement }) {
      super()
      this.element = options.element
      markers.push(this)
    }

    readonly setLngLat = (lngLat: [number, number]) => {
      this.lngLat = lngLat

      return this
    }

    readonly addTo = (map: FakeMap) => {
      map.container.append(this.element)

      return this
    }

    readonly remove = () => {
      this.element.remove()

      return this
    }
  }

  class FakePopup {
    content: HTMLElement | undefined
    readonly setLngLat = () => this

    readonly setDOMContent = (content: HTMLElement) => {
      this.content = content

      return this
    }

    readonly addTo = (map: FakeMap) => {
      if (this.content) map.container.append(this.content)

      return this
    }

    readonly remove = () => {
      this.content?.remove()

      return this
    }
  }

  return { FakeMap, FakeMarker, FakePopup, imports, maps, markers, setWorkerUrl }
})

vi.mock('maplibre-gl', () => {
  fake.imports.count += 1

  return {
    Map: fake.FakeMap,
    Marker: fake.FakeMarker,
    Popup: fake.FakePopup,
    getWorkerUrl: () => '',
    setWorkerUrl: fake.setWorkerUrl,
  }
})

enableAutoUnmount(afterEach)

const MARKERS: MapMarkerItem[] = [
  { id: 'alfama', position: [-9.13, 38.711], label: 'Alfama' },
  { id: 'belem', position: { long: -9.206, lat: 38.697 }, slot: 'tower' },
]

type MountOptions = Parameters<typeof mount>[1]

// Mounts the map and waits for it to load maplibre-gl and draw its first frame.
const mountMap = async (options: MountOptions = {}) => {
  const wrapper = mount(HareMap, options)
  await vi.waitFor(() => expect(fake.maps).toHaveLength(1))
  await flushPromises()
  fake.maps[0].load()
  await flushPromises()

  return wrapper
}

const markerElements = (wrapper: Awaited<ReturnType<typeof mountMap>>) =>
  wrapper.findAll('[data-slot="map-marker"]')

beforeEach(() => {
  fake.maps.length = 0
  fake.markers.length = 0
  fake.setWorkerUrl.mockClear()
})

describe('Map', () => {
  // Runs first, before any map mounts and loads maplibre-gl.
  it('lives on its own subpath: neither entry loads maplibre-gl until a map mounts', () => {
    expect(lib).not.toHaveProperty('Map')
    expect(lib).not.toHaveProperty('MapMarker')
    expect(fake.imports.count).toBe(0)
  })

  it('shows the loader until the map first draws', async () => {
    const wrapper = mount(HareMap)
    await vi.waitFor(() => expect(fake.maps).toHaveLength(1))

    expect(wrapper.find('[data-slot="map-loader"]').exists()).toBe(true)

    fake.maps[0].load()
    await flushPromises()

    expect(wrapper.find('[data-slot="map-loader"]').exists()).toBe(false)
  })

  it('places `MapMarker` children at positions given as `[long, lat]` or `{ long, lat }`', async () => {
    const wrapper = await mountMap({
      slots: {
        default: () => [
          h(MapMarker, { position: [-9.13, 38.711], label: 'Alfama' }),
          h(MapMarker, { position: { long: -9.206, lat: 38.697 } }),
        ],
      },
    })

    expect(fake.markers.map((marker) => marker.lngLat)).toEqual([
      [-9.13, 38.711],
      [-9.206, 38.697],
    ])

    expect(markerElements(wrapper).map((marker) => marker.attributes('aria-label'))).toEqual([
      'Alfama',
      'Map marker',
    ])

    expect(markerElements(wrapper)[0].text()).toBe('Alfama')
  })

  it('renders the `#marker` slot for each item of `markers`, or the slot named after its `slot`', async () => {
    const wrapper = await mountMap({
      props: { markers: MARKERS },
      slots: {
        marker: (props: MapMarkerSlotProps) => h('span', `pin ${props.marker.label}`),
        'tower-marker': (props: MapMarkerSlotProps) => h('b', String(props.marker.id)),
      },
    })

    expect(markerElements(wrapper).map((marker) => marker.text())).toEqual(['pin Alfama', 'belem'])

    expect(wrapper.find('[data-slot="map-marker-dot"]').exists()).toBe(false)
  })

  it('emits `markerClick` with the item when a marker of `markers` is pressed', async () => {
    const wrapper = await mountMap({ props: { markers: MARKERS, onMarkerClick: () => {} } })

    await markerElements(wrapper)[0].trigger('click')

    expect(wrapper.emitted('markerClick')).toEqual([[MARKERS[0], expect.any(MouseEvent)]])
  })

  it('opens a marker popup as a dialog named by the marker; `Escape` closes it and focus returns', async () => {
    const wrapper = await mountMap({
      attachTo: document.body,
      slots: {
        default: () =>
          h(MapMarker, { position: [-9.13, 38.711], label: 'Alfama' }, () =>
            h(MapMarkerPopup, null, () => h('p', 'Steep lanes and fado')),
          ),
      },
    })

    const marker = markerElements(wrapper)[0]

    expect(marker.attributes('role')).toBe('button')
    expect(marker.attributes('aria-expanded')).toBe('false')

    // A marker is a `div`.
    const element = marker.element as HTMLElement
    element.focus()
    await marker.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')

    expect(dialog?.getAttribute('aria-label')).toBe('Alfama')
    expect(dialog?.textContent).toContain('Steep lanes and fado')
    expect(marker.attributes('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(dialog)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()

    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(element)
  })

  it('describes a marker by its tooltip while it is hovered', async () => {
    const wrapper = await mountMap({
      slots: {
        default: () =>
          h(MapMarker, { position: [-9.13, 38.711], label: 'Alfama' }, () =>
            h(MapMarkerTooltip, null, () => 'Open until 23:00'),
          ),
      },
    })

    const marker = markerElements(wrapper)[0]

    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)

    await marker.trigger('pointerenter')

    const tooltip = wrapper.find('[role="tooltip"]')

    expect(tooltip.text()).toBe('Open until 23:00')
    expect(marker.attributes('aria-describedby')).toBe(tooltip.attributes('id'))
  })

  it('keeps `v-model:center` in the form it was given while the map moves', async () => {
    const wrapper = await mountMap({ props: { center: [-9.14, 38.72], zoom: 12 } })

    fake.maps[0].moveTo(-9.15, 38.73)

    expect(wrapper.emitted('update:center')).toEqual([[[-9.15, 38.73]]])

    await wrapper.setProps({ center: { long: -9.15, lat: 38.73 } })
    fake.maps[0].moveTo(-9.16, 38.74)

    expect(wrapper.emitted('update:center')?.at(-1)).toEqual([{ long: -9.16, lat: 38.74 }])
  })

  it('emits `click` with the position as `{ long, lat }`', async () => {
    const wrapper = await mountMap()

    fake.maps[0].fire('click', {
      lngLat: { lng: -9.14, lat: 38.71 },
      point: { x: 0, y: 0 },
      originalEvent: new MouseEvent('click'),
    })

    expect(wrapper.emitted('click')).toEqual([
      [{ long: -9.14, lat: 38.71 }, expect.any(MouseEvent)],
    ])
  })

  it('draws `MapRoute` through its positions', async () => {
    await mountMap({
      slots: {
        default: () => h(MapRoute, { points: [[-9.14, 38.71], { long: -9.13, lat: 38.712 }] }),
      },
    })

    const drawn = [...fake.maps[0].sources.values()].flatMap((source) => source.data.features ?? [])

    expect(drawn.map((feature) => feature.geometry.coordinates)).toContainEqual([
      [-9.14, 38.71],
      [-9.13, 38.712],
    ])
  })

  it('shows zoom buttons with `controls`, disabled at the zoom limit', async () => {
    const wrapper = await mountMap({ props: { controls: true, zoom: 22 } })

    const zoomIn = wrapper.get('[aria-label="Zoom in"]')
    const zoomOut = wrapper.get('[aria-label="Zoom out"]')

    expect(zoomIn.attributes('disabled')).toBeDefined()

    await zoomOut.trigger('click')

    expect(fake.maps[0].zoomTo).toHaveBeenCalledWith(21, expect.anything())
  })

  it('renders custom controls inside `MapControls`', async () => {
    const wrapper = await mountMap({
      slots: { default: () => h(MapControls, { position: 'top-left' }, () => h(MapZoomControl)) },
    })

    expect(wrapper.find('[data-slot="map-controls"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Zoom in"]').exists()).toBe(true)
  })

  it('gives `useMap()` the map instance inside its default slot', async () => {
    let api: ReturnType<typeof useMap> | undefined
    const Probe = defineComponent(() => {
      api = useMap()

      return () => null
    })

    await mountMap({ slots: { default: () => h(Probe) } })

    expect(api?.map.value).toBe(fake.maps[0])
    expect(api?.isLoaded.value).toBe(true)
  })

  it('throws when a part is used outside `Map`', () => {
    expect(() => mount(MapMarker, { props: { position: [0, 0] } })).toThrow(/inside <Map>/)
  })

  it('hands the worker URL from `createHareUI({ map: { workerUrl } })` to maplibre-gl', async () => {
    await mountMap({
      global: { plugins: [createHareUI({ map: { workerUrl: '/maplibre-worker.mjs' } })] },
    })

    expect(fake.setWorkerUrl).toHaveBeenCalledWith('/maplibre-worker.mjs')
  })
})
