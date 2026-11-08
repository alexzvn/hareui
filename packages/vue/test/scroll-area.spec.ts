import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, onMounted, useTemplateRef } from 'vue'

import type {
  ScrollAreaExposed,
  ScrollAreaProps,
  ScrollAreaSlotProps,
} from '@/components/scroll-area/ScrollArea.types'
import ScrollArea from '@/components/scroll-area/ScrollArea.vue'

type Row = { id: number; title: string }

const rows: Row[] = Array.from({ length: 1000 }, (_, index) => ({
  id: index,
  title: `Row ${index}`,
}))

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.restoreAllMocks()
})

const renderRow = ({ item, index }: ScrollAreaSlotProps<Row>) =>
  h('p', { 'data-row': index }, item.title)

const mountArea = (
  props: Partial<ScrollAreaProps<Row>> = {},
  slot: (props: ScrollAreaSlotProps<Row>) => unknown = renderRow,
) => {
  wrapper = mount(ScrollArea, {
    props: props as never,
    slots: { default: slot as never },
    attachTo: document.body,
  })

  return wrapper
}

const renderedIndices = (area: VueWrapper) =>
  area.findAll('[data-row]').map((row) => Number(row.attributes('data-row')))

// happy-dom has no layout: the virtualizer reads the scroll element's box and clamps scrolling to the scroll size,
// so give them sizes (restored after each test)
const mockLayout = () => {
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(300)
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300)
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(300)
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(300)
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(1_000_000)
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(1_000_000)
}

// A plain list of 30 px rows in a 300 px root, laid out from the root's top edge
const mountPlainList = () => {
  mockLayout()

  const area = mountArea({ items: rows.slice(0, 50) })
  const root = area.element as HTMLElement
  vi.spyOn(root, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 300, 300))

  area.findAll('[data-slot=item]').forEach((item, index) => {
    vi.spyOn(item.element, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(0, index * 30, 300, 30),
    )
  })

  const { scrollToIndex } = area.vm as unknown as ScrollAreaExposed

  return { scrollToIndex, scrollBy: vi.spyOn(root, 'scrollBy') }
}

const uniformRows = { estimateSize: 30, overscan: 2, skipMeasurement: true }

describe('ScrollArea items', () => {
  it('renders every item through the default slot, with its index', () => {
    const area = mountArea({ items: rows.slice(0, 5) })

    expect(area.findAll('[data-slot=item]')).toHaveLength(5)
    expect(renderedIndices(area)).toEqual([0, 1, 2, 3, 4])
    expect(area.text()).toContain('Row 4')
  })

  it('renders the default slot once as the content without items', () => {
    const area = mountArea({}, () => h('p', 'Free content'))

    expect(area.find('[data-slot=item]').exists()).toBe(false)
    expect(area.get('[data-slot=viewport]').text()).toBe('Free content')
  })

  it('exposes its orientation', () => {
    const area = mountArea({ items: rows.slice(0, 3), orientation: 'horizontal' })

    expect(area.attributes('data-orientation')).toBe('horizontal')
  })

  it('fades its edges through a scroll shadow when shadow is set', () => {
    const area = mountArea({ items: rows.slice(0, 3), shadow: { size: 24 } })

    expect(area.attributes('data-scroll-shadow-mode')).toBe('auto')
    expect(area.attributes('data-scroll-shadow-size')).toBe('24')
  })

  it('has no edge fade by default', () => {
    const area = mountArea({ items: rows.slice(0, 3) })

    expect(area.attributes('data-scroll-shadow-mode')).toBeUndefined()
  })

  it('scrolls a plain list to an item with scrollToIndex', () => {
    const { scrollToIndex, scrollBy } = mountPlainList()

    scrollToIndex(20, { align: 'start', behavior: 'smooth' })

    expect(scrollBy).toHaveBeenCalledWith({ top: 600, behavior: 'smooth' })
  })

  it('centers a plain list item when asked to', () => {
    const { scrollToIndex, scrollBy } = mountPlainList()

    scrollToIndex(20, { align: 'center' })

    expect(scrollBy).toHaveBeenCalledWith({ top: 465, behavior: undefined })
  })

  it('leaves a plain list alone when the item is already in view', () => {
    const { scrollToIndex, scrollBy } = mountPlainList()

    scrollToIndex(3)

    expect(scrollBy).not.toHaveBeenCalled()
  })
})

describe('ScrollArea virtualize', () => {
  it('renders only the window of items in view', async () => {
    mockLayout()
    const area = mountArea({ items: rows, virtualize: uniformRows })
    await vi.waitFor(() => expect(renderedIndices(area).length).toBeGreaterThan(0))

    const indices = renderedIndices(area)
    expect(indices[0]).toBe(0)
    expect(indices.length).toBeLessThan(20)
    expect(area.get('[data-slot=viewport]').attributes('style')).toContain('30000px')
  })

  it('moves the window as the list scrolls', async () => {
    mockLayout()
    const area = mountArea({ items: rows, virtualize: uniformRows })
    await vi.waitFor(() => expect(renderedIndices(area).length).toBeGreaterThan(0))

    const root = area.element as HTMLElement
    root.scrollTop = 15_000
    root.dispatchEvent(new Event('scroll'))

    await vi.waitFor(() => expect(renderedIndices(area)).toContain(500))
    expect(renderedIndices(area)).not.toContain(0)
  })

  it('windows a horizontal list along its width', async () => {
    mockLayout()
    const area = mountArea({ items: rows, orientation: 'horizontal', virtualize: uniformRows })
    await vi.waitFor(() => expect(renderedIndices(area).length).toBeGreaterThan(0))

    expect(renderedIndices(area).length).toBeLessThan(20)
    expect(area.get('[data-slot=viewport]').attributes('style')).toContain('inline-size: 30000px')
  })

  it('scrolls to an item not rendered yet with scrollToIndex', async () => {
    mockLayout()
    const area = mountArea({ items: rows, virtualize: uniformRows })
    await nextTick()

    const exposed = area.vm as unknown as ScrollAreaExposed
    expect(exposed.virtualizer).toBeDefined()
    exposed.scrollToIndex(800, { align: 'start' })

    // Browsers fire `scroll` after a programmatic scroll; happy-dom only moves `scrollTop`
    const root = area.element as HTMLElement
    expect(root.scrollTop).toBe(24_000)
    root.dispatchEvent(new Event('scroll'))

    await vi.waitFor(() => expect(renderedIndices(area)).toContain(800))
  })

  it('scrolls to an item when scrollToIndex runs as the parent mounts', async () => {
    mockLayout()

    const Parent = defineComponent({
      setup() {
        const area = useTemplateRef<ScrollAreaExposed>('area')
        onMounted(() => area.value?.scrollToIndex(400, { align: 'start' }))

        return () => h(ScrollArea, { ref: 'area', items: rows, virtualize: uniformRows }, renderRow)
      },
    })

    wrapper = mount(Parent, { attachTo: document.body })

    await vi.waitFor(() => expect(wrapper!.get('[data-slot=root]').element.scrollTop).toBe(12_000))
  })

  it('lays items out in lanes', async () => {
    mockLayout()

    const area = mountArea(
      { items: rows, virtualize: { ...uniformRows, lanes: 3 } },
      ({ item, index, virtualItem }) =>
        h('p', { 'data-row': index, 'data-lane': virtualItem?.lane }, item.title),
    )

    await vi.waitFor(() => expect(renderedIndices(area).length).toBeGreaterThan(0))

    const lanes = new Set(area.findAll('[data-lane]').map((row) => row.attributes('data-lane')))
    expect([...lanes].sort()).toEqual(['0', '1', '2'])

    // 3 items share each 30 px row: 334 rows for 1000 items
    expect(area.get('[data-slot=viewport]').attributes('style')).toContain('10020px')
  })
})
