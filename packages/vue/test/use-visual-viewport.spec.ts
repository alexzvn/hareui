import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, Suspense } from 'vue'

import { useVisualViewport } from '@/composables/useVisualViewport'

const Probe = defineComponent({
  setup() {
    const style = useVisualViewport()
    return () => h('div', { style: style.value })
  },
})

const resizeCalls = (spy: { mock: { calls: unknown[][] } }) =>
  spy.mock.calls.filter(([type]) => type === 'resize')

const readVar = (el: Element, name: string) => (el as HTMLElement).style.getPropertyValue(name)

// jsdom has no `visualViewport`; a stub stands in for Safari's.
const stubVisualViewport = () => {
  const viewport = Object.assign(new EventTarget(), { height: 800, offsetTop: 0 })
  Object.defineProperty(window, 'visualViewport', { configurable: true, value: viewport })

  return viewport
}

describe('useVisualViewport', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    Reflect.deleteProperty(window, 'visualViewport')
  })

  it('shares one resize listener across instances and removes it after the last unmount', async () => {
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    const a = mount(Probe)
    const b = mount(Probe)
    expect(resizeCalls(add)).toHaveLength(1)

    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(432)
    window.dispatchEvent(new Event('resize'))
    await nextTick()

    for (const w of [a, b]) expect(readVar(w.element, '--visual-viewport-height')).toBe('432px')

    a.unmount()
    expect(resizeCalls(remove)).toHaveLength(0)
    b.unmount()
    expect(resizeCalls(remove)).toHaveLength(1)
    expect(resizeCalls(remove)[0][1]).toBe(resizeCalls(add)[0][1])
  })

  it('keeps tracking for mounted overlays after Suspense discards one that never mounted', async () => {
    // Never resolves, so the Suspense branch holding the first probe is discarded without mounting.
    const Pending = defineComponent({
      async setup() {
        await Promise.withResolvers<void>().promise
        return () => null
      },
    })

    mount(() => h(Suspense, null, () => h('div', [h(Probe), h(Pending)]))).unmount()

    const a = mount(Probe)
    const b = mount(Probe)
    a.unmount()

    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(517)
    window.dispatchEvent(new Event('resize'))
    await nextTick()

    expect(readVar(b.element, '--visual-viewport-height')).toBe('517px')
    b.unmount()
  })

  it('follows the visual viewport offset when it scrolls, as iOS does when the keyboard opens', async () => {
    const viewport = stubVisualViewport()
    const add = vi.spyOn(viewport, 'addEventListener')
    const remove = vi.spyOn(viewport, 'removeEventListener')
    const wrapper = mount(Probe)
    expect(readVar(wrapper.element, '--visual-viewport-top')).toBe('0px')

    Object.assign(viewport, { height: 420, offsetTop: 310 })
    viewport.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect(readVar(wrapper.element, '--visual-viewport-top')).toBe('310px')
    expect(readVar(wrapper.element, '--visual-viewport-height')).toBe('420px')

    wrapper.unmount()
    const scrollListener = add.mock.calls.find(([type]) => type === 'scroll')?.[1]
    expect(remove).toHaveBeenCalledWith('scroll', scrollListener)
  })
})
