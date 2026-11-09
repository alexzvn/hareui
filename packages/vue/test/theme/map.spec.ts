import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { createHareUI } from '@/config'
import { Map as HareMap } from '@/map'

// The classes render before maplibre-gl loads, so it never has to.
vi.mock('maplibre-gl', () => new Promise(() => {}))

describe('Map theme', () => {
  it('keeps the rules maplibre-gl needs to place its DOM with `unstyled`, dropping the look', () => {
    const plugins = [createHareUI({ unstyled: ['map'] })]
    const wrapper = mount(HareMap, { global: { plugins } })
    const canvas = wrapper.get('[data-slot="map-canvas"]').classes()

    expect(wrapper.classes()).toEqual(['relative', 'isolate', 'size-full', 'overflow-hidden'])

    expect(canvas).toEqual(
      expect.arrayContaining([
        'absolute',
        'inset-0',
        '[&_.maplibregl-canvas]:absolute',
        '[&_.maplibregl-touch-zoom-rotate.maplibregl-touch-drag-pan]:touch-none',
        '[&_.maplibregl-marker]:absolute',
        '[&_.maplibregl-popup]:absolute',
        '[&_.maplibregl-popup-content]:pointer-events-auto',
        '[&_.maplibregl-ctrl-bottom-right]:bottom-0',
        '[&_.maplibregl-ctrl-attrib-button]:hidden',
        '[&_.maplibregl-boxzoom]:absolute',
        '[&_.maplibregl-cooperative-gesture-screen]:opacity-0',
      ]),
    )

    expect(canvas).not.toContain('[&_.maplibregl-ctrl-attrib]:rounded-full')
    expect(canvas).not.toContain('[&_.maplibregl-boxzoom]:border-accent')
  })
})
