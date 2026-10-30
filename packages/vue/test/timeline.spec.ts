import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import type { TimelineItem } from '@/components/timeline'
import { Timeline } from '@/components/timeline'

import { expectAccessible } from './a11y'

const Pin = () => h('svg', { 'data-testid': 'pin-icon' })

const items: TimelineItem[] = [
  { value: 'packed', date: 'Mon', title: 'Bags packed', description: 'Two suitcases.', icon: Pin },
  { value: 'boarded', date: 'Tue', title: 'Boarded the ferry' },
  { value: 'arrived', title: 'Arrived on the island', description: 'Late evening.' },
]

const mountTimeline = (props: Record<string, unknown> = {}, slots = {}) =>
  mount(Timeline, { props: { items, ...props }, slots, attachTo: document.body })

const listItems = (wrapper: ReturnType<typeof mountTimeline>) => wrapper.findAll('li')

const states = (wrapper: ReturnType<typeof mountTimeline>) =>
  listItems(wrapper).map((li) => li.attributes('data-state'))

describe('Timeline', () => {
  it('renders an ordered list with one list item per event', async () => {
    const wrapper = mountTimeline()

    expect(wrapper.element.tagName).toBe('OL')
    expect(listItems(wrapper)).toHaveLength(3)
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('renders the date, title and description of each event, skipping missing ones', () => {
    const wrapper = mountTimeline()
    const [first, second, third] = listItems(wrapper)

    expect(first!.get('[data-slot=timeline-date]').text()).toBe('Mon')
    expect(first!.get('[data-slot=timeline-title]').text()).toBe('Bags packed')
    expect(first!.get('[data-slot=timeline-description]').text()).toBe('Two suitcases.')
    expect(second!.find('[data-slot=timeline-description]').exists()).toBe(false)
    expect(third!.find('[data-slot=timeline-date]').exists()).toBe(false)
  })

  it('draws a decorative connector between events but not after the last one', () => {
    const wrapper = mountTimeline()
    const connectors = wrapper.findAll('[data-slot=timeline-separator]')

    expect(connectors).toHaveLength(2)
    expect(connectors.every((c) => c.attributes('aria-hidden') === 'true')).toBe(true)
    expect(listItems(wrapper)[2]!.find('[data-slot=timeline-separator]').exists()).toBe(false)
  })

  it('renders the item icon in a marker hidden from assistive technology', () => {
    const wrapper = mountTimeline()
    const marker = listItems(wrapper)[0]!.get('[data-slot=timeline-indicator]')

    expect(marker.find('[data-testid=pin-icon]').exists()).toBe(true)
    expect(marker.attributes('aria-hidden')).toBe('true')
  })

  it('renders an avatar in the marker', () => {
    const wrapper = mountTimeline({ items: [{ title: 'Reviewed', avatar: { fallback: 'RK' } }] })

    expect(wrapper.get('[data-slot=timeline-indicator]').text()).toBe('RK')
  })

  it('marks the active index and the events before it from v-model', async () => {
    const wrapper = mountTimeline({ modelValue: 1 })

    expect(states(wrapper)).toEqual(['completed', 'active', undefined])
    expect(listItems(wrapper)[1]!.attributes('aria-current')).toBe('true')
    expect(listItems(wrapper)[0]!.attributes('aria-current')).toBeUndefined()

    await wrapper.setProps({ modelValue: 2 })
    expect(states(wrapper)).toEqual(['completed', 'completed', 'active'])
  })

  it('matches a string value against valueKey', () => {
    const wrapper = mountTimeline({
      modelValue: 'Boarded the ferry',
      valueKey: 'title',
    })

    expect(states(wrapper)).toEqual(['completed', 'active', undefined])
  })

  it('uses defaultValue when v-model is not bound', () => {
    const wrapper = mountTimeline({ defaultValue: 'arrived' })

    expect(states(wrapper)).toEqual(['completed', 'completed', 'active'])
  })

  it('counts the index from the end and completes the later events when reversed', () => {
    const wrapper = mountTimeline({ modelValue: 0, reverse: true })

    expect(states(wrapper)).toEqual([undefined, undefined, 'active'])

    const reversedByValue = mountTimeline({ modelValue: 'boarded', reverse: true })
    expect(states(reversedByValue)).toEqual([undefined, 'active', 'completed'])
  })

  it('leaves every event unmarked without an active value', () => {
    const wrapper = mountTimeline()

    expect(states(wrapper)).toEqual([undefined, undefined, undefined])

    expect(listItems(wrapper).map((li) => li.attributes('data-status'))).toEqual([
      'default',
      'default',
      'default',
    ])
  })

  it('applies an item status to its event', () => {
    const wrapper = mountTimeline({ items: [{ title: 'Flagged', status: 'warning' }] })

    expect(listItems(wrapper)[0]!.attributes('data-status')).toBe('warning')
  })

  it('marks only an event with the current status with aria-current', () => {
    const wrapper = mountTimeline({
      items: [
        { title: 'Flagged', status: 'warning' },
        { title: 'Now', status: 'current' },
      ],
    })

    const [warning, current] = listItems(wrapper)

    expect(warning!.attributes('aria-current')).toBeUndefined()
    expect(current!.attributes('aria-current')).toBe('true')
  })

  it('emits select with the clicked event', async () => {
    const wrapper = mountTimeline()

    await listItems(wrapper)[1]!.trigger('click')
    const [[event, item]] = wrapper.emitted('select') as [[MouseEvent, TimelineItem]]
    expect(event).toBeInstanceOf(MouseEvent)
    expect(item).toEqual(items[1])
  })

  it('replaces parts through the shared slots with the item and its state', () => {
    const wrapper = mountTimeline(
      { modelValue: 0 },
      {
        title: ({ item, index, state }: { item: TimelineItem; index: number; state?: string }) =>
          `${index}:${item.title}:${state ?? 'ahead'}`,
      },
    )

    expect(wrapper.findAll('[data-slot=timeline-title]').map((t) => t.text())).toEqual([
      '0:Bags packed:active',
      '1:Boarded the ferry:ahead',
      '2:Arrived on the island:ahead',
    ])
  })

  it('renders a part slot even when the item has no value for it', () => {
    const wrapper = mountTimeline({}, { date: () => 'TBD' })

    expect(listItems(wrapper)[2]!.get('[data-slot=timeline-date]').text()).toBe('TBD')
  })

  it('routes an item with a slot prefix to its own slots only', () => {
    const wrapper = mountTimeline(
      {
        items: [{ title: 'Plain' }, { title: 'Special', slot: 'special' }],
      },
      {
        title: () => 'shared',
        'special-title': () => 'own',
      },
    )

    expect(wrapper.findAll('[data-slot=timeline-title]').map((t) => t.text())).toEqual([
      'shared',
      'own',
    ])
  })

  it('replaces the whole content with the wrapper slot', () => {
    const wrapper = mountTimeline(
      {},
      { wrapper: ({ item }: { item: TimelineItem }) => `Custom ${item.title}` },
    )

    const first = listItems(wrapper)[0]!
    expect(first.get('[data-slot=timeline-wrapper]').text()).toBe('Custom Bags packed')
    expect(first.find('[data-slot=timeline-title]').exists()).toBe(false)
  })

  it('exposes a custom marker to assistive technology', () => {
    const wrapper = mountTimeline(
      {},
      { indicator: ({ index }: { index: number }) => `${index + 1}` },
    )

    const marker = wrapper.get('[data-slot=timeline-indicator]')

    expect(marker.text()).toBe('1')
    expect(marker.attributes('aria-hidden')).toBeUndefined()
  })

  it('moves the date out of the content with a centred axis', () => {
    const wrapper = mountTimeline({ axis: 'center' })
    const first = listItems(wrapper)[0]!

    expect(first.get('[data-slot=timeline-date]').text()).toBe('Mon')

    expect(
      first.get('[data-slot=timeline-wrapper]').find('[data-slot=timeline-date]').exists(),
    ).toBe(false)
  })

  it('keeps the date inside the content of a horizontal timeline', () => {
    const wrapper = mountTimeline({ axis: 'center', orientation: 'horizontal' })
    const wrapperSlot = listItems(wrapper)[0]!.get('[data-slot=timeline-wrapper]')

    expect(wrapperSlot.find('[data-slot=timeline-date]').exists()).toBe(true)
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')
  })
})
