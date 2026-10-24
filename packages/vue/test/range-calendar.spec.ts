import { CalendarDate, parseDate } from '@internationalized/date'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import type { DateRange } from '../src/components/range-calendar/RangeCalendar.vue'
import RangeCalendar from '../src/components/range-calendar/RangeCalendar.vue'
import { expectAccessible } from './a11y'

const focused = new CalendarDate(2025, 1, 15)

describe('rangeCalendar', () => {
  it('clicking a start then an end day selects the range and emits update:modelValue', async () => {
    const wrapper = mount(RangeCalendar, { props: { defaultPlaceholder: focused } })
    const day10 = wrapper
      .findAll('[data-slot=range-calendar-cell]')
      .find((cell) => cell.text() === '10')!
    const day20 = wrapper
      .findAll('[data-slot=range-calendar-cell]')
      .find((cell) => cell.text() === '20')!
    await day10.trigger('mouseenter')
    await day10.trigger('click')
    await day20.trigger('mouseenter')
    await day20.trigger('click')

    const lastEmit = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as DateRange
    expect(lastEmit.start).toMatchObject({ year: 2025, month: 1, day: 10 })
    expect(lastEmit.end).toMatchObject({ year: 2025, month: 1, day: 20 })
    wrapper.unmount()
  })

  it('min/max bounds mark out-of-range days disabled and unclickable', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        defaultPlaceholder: focused,
        minValue: new CalendarDate(2025, 1, 10),
        maxValue: new CalendarDate(2025, 1, 20),
      },
    })
    const day5 = wrapper
      .findAll('[data-slot=range-calendar-cell]')
      .find((cell) => cell.text() === '5')!
    expect(day5.attributes('data-disabled')).toBe('')

    await day5.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('isDateUnavailable blocks a range from being anchored on that date', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        defaultPlaceholder: focused,
        isDateUnavailable: (date) => date.day === 18,
      },
    })
    const day18 = wrapper
      .findAll('[data-slot=range-calendar-cell]')
      .find((cell) => cell.text() === '18')!
    expect(day18.attributes('data-unavailable')).toBe('')

    await day18.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('isDateUnavailable receives the in-progress anchor date, resetting once the range completes', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        defaultPlaceholder: focused,
        // Dates more than 7 days from the anchor become unavailable mid-selection, matching
        // HeroUI's anchor-unavailable-dates demo (React Aria's isDateUnavailable(date, anchorDate)).
        isDateUnavailable: (date, anchor) => anchor !== null && Math.abs(date.day - anchor.day) > 7,
      },
    })
    const cell = (d: number) =>
      wrapper.findAll('[data-slot=range-calendar-cell]').find((c) => c.text() === String(d))!

    expect(cell(25).attributes('data-unavailable')).toBeUndefined()
    await cell(10).trigger('mouseenter')
    await cell(10).trigger('click')
    expect(cell(25).attributes('data-unavailable')).toBe('')
    expect(cell(15).attributes('data-unavailable')).toBeUndefined()

    await cell(15).trigger('mouseenter')
    await cell(15).trigger('click')
    expect(cell(25).attributes('data-unavailable')).toBeUndefined()
    wrapper.unmount()
  })

  it('disabled prevents selecting any date', async () => {
    const wrapper = mount(RangeCalendar, { props: { defaultPlaceholder: focused, disabled: true } })
    const day10 = wrapper
      .findAll('[data-slot=range-calendar-cell]')
      .find((cell) => cell.text() === '10')!
    await day10.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('year picker trigger shows the start date month and selecting a year keeps month/day', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        modelValue: { start: new CalendarDate(2025, 6, 5), end: new CalendarDate(2025, 6, 12) },
        yearPicker: true,
      },
    })
    const trigger = wrapper.find('[data-slot=calendar-year-picker-trigger]')
    expect(trigger.text()).toContain('2025')
    expect(trigger.text()).toMatch(/June/)

    await trigger.trigger('click')
    await nextTick()
    expect(wrapper.find('[data-slot=calendar-year-picker-grid]').attributes('data-open')).toBe(
      'true',
    )

    const year2030 = wrapper
      .findAll('[data-slot=calendar-year-picker-year-cell]')
      .find((cell) => cell.text() === '2030')!
    await year2030.trigger('click')
    await nextTick()

    expect(
      wrapper.find('[data-slot=calendar-year-picker-grid]').attributes('data-open'),
    ).toBeUndefined()
    expect(trigger.text()).toContain('2030')
    expect(trigger.text()).toMatch(/June/)
    expect(wrapper.emitted('update:placeholder')?.[0]?.[0]).toMatchObject({
      year: 2030,
      month: 6,
      day: 5,
    })
    wrapper.unmount()
  })

  it('numberOfMonths renders one panel per month with shared prev/next paging by the full width', async () => {
    const wrapper = mount(RangeCalendar, {
      props: { defaultPlaceholder: focused, numberOfMonths: 2 },
    })
    const panels = wrapper.findAll('[data-slot=calendar-panel]')
    expect(panels).toHaveLength(2)
    expect(panels[0].text()).toContain('January')
    expect(panels[1].text()).toContain('February')
    expect(panels[0].find('[data-slot=range-calendar-nav-button]').exists()).toBe(true)
    expect(panels[1].findAll('[data-slot=range-calendar-nav-button]')).toHaveLength(1)

    await panels[1].find('[data-slot=range-calendar-nav-button]').trigger('click')
    expect(panels[0].text()).toContain('March')
    expect(panels[1].text()).toContain('April')
    wrapper.unmount()
  })

  it('maximumDays restricts how far the end date can be from the start', async () => {
    const wrapper = mount(RangeCalendar, { props: { defaultPlaceholder: focused, maximumDays: 5 } })
    const day10 = wrapper
      .findAll('[data-slot=range-calendar-cell]')
      .find((cell) => cell.text() === '10')!
    const day20 = wrapper
      .findAll('[data-slot=range-calendar-cell]')
      .find((cell) => cell.text() === '20')!
    await day10.trigger('mouseenter')
    await day10.trigger('click')
    await day20.trigger('mouseenter')

    // day20 is 10 days after day10, past the 5-day cap, so Reka disables it...
    expect(day20.attributes('data-disabled')).toBe('')
    await day20.trigger('click')
    // ...and clicking a disabled cell cannot close the range.
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    wrapper.unmount()
  })

  it('invalid sets aria-invalid/data-invalid on the root', () => {
    const wrapper = mount(RangeCalendar, { props: { defaultPlaceholder: focused, invalid: true } })
    const root = wrapper.find('[data-slot=range-calendar]')
    expect(root.attributes('aria-invalid')).toBe('true')
    expect(root.attributes('data-invalid')).toBe('')
    wrapper.unmount()
  })

  it('#cell follows parent state and switches back to the day number when the slot is removed', async () => {
    const tag = ref('a')
    const show = ref(true)
    const App = defineComponent({
      components: { RangeCalendar },
      setup: () => ({ tag, show, focused }),
      template: `<RangeCalendar :default-placeholder="focused"><template v-if="show" #cell="{ date }">{{ tag }}{{ date.day }}</template></RangeCalendar>`,
    })
    const wrapper = mount(App)
    const day15 = () =>
      wrapper.findAll('[data-slot=range-calendar-cell]').find((cell) => cell.text().endsWith('15'))!
    expect(day15().text()).toBe('a15')
    tag.value = 'b'
    await nextTick()
    expect(day15().text()).toBe('b15')
    show.value = false
    await nextTick()
    expect(day15().text()).toBe('15')
    show.value = true
    await nextTick()
    expect(day15().text()).toBe('b15')
    wrapper.unmount()
  })

  it('hovering while selecting re-renders only the days entering or leaving the preview', async () => {
    let dayUpdates = 0
    const countDayUpdates = {
      updated(this: { $el: unknown }) {
        if (this.$el instanceof Element && this.$el.matches('[role=gridcell]')) dayUpdates++
      },
    }
    const wrapper = mount(RangeCalendar, {
      props: { defaultPlaceholder: focused },
      global: { mixins: [countDayUpdates] },
    })
    const day = (n: number) =>
      wrapper.findAll('[data-slot=range-calendar-cell]').find((cell) => cell.text() === String(n))!
    await day(10).trigger('mouseenter')
    await day(10).trigger('click')
    await day(12).trigger('mouseenter')
    dayUpdates = 0
    await day(13).trigger('mouseenter')
    // Only day 13 joins the preview; the cell (and its own wrappers) update, the other ~34 days don't.
    expect(dayUpdates).toBeGreaterThan(0)
    expect(dayUpdates).toBeLessThanOrEqual(4)
    wrapper.unmount()
  })
})

describe('range calendar week/day view (visibleDuration)', () => {
  it('two clicks select a range in day view; the anchor is passed to isDateUnavailable', async () => {
    const anchors: (string | null)[] = []
    const wrapper = mount(RangeCalendar, {
      props: {
        ariaLabel: 'Trip',
        locale: 'en-US',
        visibleDuration: { days: 10 },
        defaultPlaceholder: parseDate('2025-01-15'),
        isDateUnavailable: (_d: any, anchor: any) => {
          anchors.push(anchor?.toString() ?? null)
          return false
        },
      },
    })
    const cell = (day: string) =>
      wrapper.findAll('[data-slot=range-calendar-cell]').find((c) => c.text() === day)!
    await cell('9').trigger('click')
    expect(anchors.at(-1)).toBe('2025-01-09')
    await cell('12').trigger('click')
    const value = wrapper.emitted('update:modelValue')!.at(-1)![0] as any
    expect([value.start.toString(), value.end.toString()]).toEqual(['2025-01-09', '2025-01-12'])
    expect(cell('9').attributes('data-selection-start')).toBe('true')
    expect(cell('12').attributes('data-selection-end')).toBe('true')
  })
})

describe('range calendar anchor-dependent unavailable dates', () => {
  it('anchoring caps the cell on both sides and limits paging to the available run', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        ariaLabel: 'Trip',
        defaultPlaceholder: parseDate('2025-01-15'),
        isDateUnavailable: (date: any, anchor: any) =>
          anchor != null && Math.abs(date.compare(anchor)) > 7,
      },
      attachTo: document.body,
    })
    const day10 = wrapper.get('[data-value="2025-01-10"]')
    await day10.trigger('mouseenter')
    await day10.trigger('click')
    expect(day10.attributes('data-selection-start')).toBe('true')
    expect(day10.attributes('data-selection-end')).toBe('true')
    expect(wrapper.get('[data-value="2025-01-18"]').attributes('data-unavailable')).toBe('')
    const [, next] = wrapper.findAll('[data-slot=range-calendar-nav-button]')
    expect(next!.attributes('disabled')).toBeDefined()
    await wrapper.get('[data-value="2025-01-14"]').trigger('mouseenter')
    await wrapper.get('[data-value="2025-01-14"]').trigger('click')
    expect(wrapper.get('[data-value="2025-01-18"]').attributes('data-unavailable')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('range calendar keyboard paging and outside days', () => {
  const heading = (w: { get: (s: string) => { text: () => string } }) =>
    w.get('[data-slot=range-calendar-heading]').text()
  const activeDate = () => document.activeElement?.getAttribute('data-value')
  async function mountFocused() {
    const wrapper = mount(RangeCalendar, {
      props: {
        locale: 'en-US',
        defaultPlaceholder: parseDate('2025-01-15'),
        defaultValue: { start: parseDate('2025-01-10'), end: parseDate('2025-01-12') },
      },
      attachTo: document.body,
    })
    ;(wrapper.get('[data-value="2025-01-15"]').element as HTMLElement).focus()
    expect(activeDate()).toBe('2025-01-15')
    return wrapper
  }
  async function press(init: KeyboardEventInit) {
    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }),
    )
    await nextTick()
    await nextTick()
  }

  // behaviour-final-check R3
  it('Home and End move focus to the first and last day of the month', async () => {
    const wrapper = await mountFocused()
    await press({ key: 'Home', code: 'Home' })
    expect(activeDate()).toBe('2025-01-01')
    await press({ key: 'End', code: 'End' })
    expect(activeDate()).toBe('2025-01-31')
    expect(heading(wrapper)).toBe('January 2025')
    wrapper.unmount()
  })

  // behaviour-final-check R3
  it('PageDown and PageUp move focus by one month, keeping the day of the month', async () => {
    const wrapper = await mountFocused()
    await press({ key: 'PageDown', code: 'PageDown' })
    expect(heading(wrapper)).toBe('February 2025')
    expect(activeDate()).toBe('2025-02-15')
    await press({ key: 'PageUp', code: 'PageUp' })
    await press({ key: 'PageUp', code: 'PageUp' })
    expect(heading(wrapper)).toBe('December 2024')
    expect(activeDate()).toBe('2024-12-15')
    wrapper.unmount()
  })

  // behaviour-final-check R3
  it('Shift+PageDown and Shift+PageUp move focus by one year, keeping month and day', async () => {
    const wrapper = await mountFocused()
    await press({ key: 'PageDown', code: 'PageDown', shiftKey: true })
    expect(heading(wrapper)).toBe('January 2026')
    expect(activeDate()).toBe('2026-01-15')
    await press({ key: 'PageUp', code: 'PageUp', shiftKey: true })
    await press({ key: 'PageUp', code: 'PageUp', shiftKey: true })
    expect(heading(wrapper)).toBe('January 2024')
    expect(activeDate()).toBe('2024-01-15')
    wrapper.unmount()
  })

  // behaviour-final-check R4
  it('clicking a leading outside-month day neither navigates nor changes the range', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        locale: 'en-US',
        defaultPlaceholder: parseDate('2025-01-15'),
        defaultValue: { start: parseDate('2025-01-10'), end: parseDate('2025-01-12') },
      },
    })
    const outside = wrapper.get('[data-value="2024-12-31"]')
    expect(outside.attributes('data-outside-view')).toBeDefined()
    await outside.trigger('mouseenter')
    await outside.trigger('click')
    await nextTick()
    expect(heading(wrapper)).toBe('January 2025')
    expect(wrapper.get('[data-value="2025-01-10"]').attributes('data-selection-start')).toBe('true')
    expect(wrapper.get('[data-value="2025-01-12"]').attributes('data-selection-end')).toBe('true')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  // behaviour-final-check R4
  it('clicking a trailing outside-month day neither navigates nor changes the range', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        locale: 'en-US',
        defaultPlaceholder: parseDate('2025-01-15'),
        defaultValue: { start: parseDate('2025-01-10'), end: parseDate('2025-01-12') },
      },
    })
    const outside = wrapper.get('[data-value="2025-02-01"]')
    expect(outside.attributes('data-outside-view')).toBeDefined()
    await outside.trigger('mouseenter')
    await outside.trigger('click')
    await nextTick()
    expect(heading(wrapper)).toBe('January 2025')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('range calendar live range preview', () => {
  const selectedDays = (w: {
    findAll: (s: string) => { attributes: (n: string) => string | undefined; text: () => string }[]
  }) =>
    w
      .findAll('[data-slot=range-calendar-cell]')
      .filter(
        (c) =>
          c.attributes('data-selected') === 'true' &&
          c.attributes('data-outside-view') === undefined,
      )
      .map((c) => c.text())

  // behaviour-final-check R1
  it('hovering a later day after the first click marks anchor to hovered cells as selected', async () => {
    const wrapper = mount(RangeCalendar, {
      props: { locale: 'en-US', defaultPlaceholder: parseDate('2025-01-15') },
    })
    const cell = (d: string) => wrapper.get(`[data-value="2025-01-${d}"]`)
    await cell('10').trigger('mouseenter')
    await cell('10').trigger('click')
    await cell('15').trigger('mouseenter')
    expect(selectedDays(wrapper)).toEqual(['10', '11', '12', '13', '14', '15'])
    expect(cell('10').attributes('data-selection-start')).toBe('true')
    expect(cell('15').attributes('data-selection-end')).toBe('true')
    wrapper.unmount()
  })

  // behaviour-final-check R1
  it('moving the hover back shrinks the preview and the end marker follows the pointer', async () => {
    const wrapper = mount(RangeCalendar, {
      props: { locale: 'en-US', defaultPlaceholder: parseDate('2025-01-15') },
    })
    const cell = (d: string) => wrapper.get(`[data-value="2025-01-${d}"]`)
    await cell('10').trigger('mouseenter')
    await cell('10').trigger('click')
    await cell('18').trigger('mouseenter')
    await cell('13').trigger('mouseenter')
    expect(selectedDays(wrapper)).toEqual(['10', '11', '12', '13'])
    expect(cell('13').attributes('data-selection-end')).toBe('true')
    expect(cell('18').attributes('data-selection-end')).toBeUndefined()
    wrapper.unmount()
  })

  // behaviour-final-check R2 (live-preview part only; the RAC one-day focus offset is unconfirmed)
  it('keyboard anchoring with Enter then ArrowRight previews the range up to the focused day', async () => {
    const wrapper = mount(RangeCalendar, {
      props: { locale: 'en-US', defaultPlaceholder: parseDate('2025-01-15') },
      attachTo: document.body,
    })
    ;(wrapper.get('[data-value="2025-01-15"]').element as HTMLElement).focus()
    const press = async (init: KeyboardEventInit) => {
      document.activeElement!.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }),
      )
      await nextTick()
      await nextTick()
    }
    await press({ key: 'Enter', code: 'Enter' })
    for (let i = 0; i < 3; i++) await press({ key: 'ArrowRight', code: 'ArrowRight' })

    const focusedDay = document.activeElement!.textContent!.trim()
    expect(Number(focusedDay)).toBeGreaterThanOrEqual(18)
    expect(selectedDays(wrapper)).toContain('16')
    expect(selectedDays(wrapper)).toContain('17')
    expect(document.activeElement!.getAttribute('data-selection-end')).toBe('true')
    wrapper.unmount()
  })
})

describe('range calendar press-drag selection', () => {
  const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 10))
  const fire = (el: Element, type: string) =>
    el.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, pointerType: 'mouse' }))
  // A real pointer drag ends with pointerup on the release cell and no click on either cell (the click targets the
  // common ancestor of the pressed and released elements).
  async function dragTo(wrapper: ReturnType<typeof mount>, from: string, ...over: string[]) {
    const cell = (d: string) => wrapper.get(`[data-value="${d}"]`)
    fire(cell(from).element, 'pointerdown')
    await tick()
    for (const d of over) {
      fire(cell(d).element, 'pointerenter')
      await cell(d).trigger('mouseenter')
    }
    return cell
  }

  // behaviour-final-check R8
  it('dragging from a pressed day previews the range live under the pointer', async () => {
    const wrapper = mount(RangeCalendar, {
      props: { locale: 'en-US', defaultPlaceholder: parseDate('2025-01-15') },
      attachTo: document.body,
    })
    const cell = await dragTo(wrapper, '2025-01-06', '2025-01-08', '2025-01-10')
    expect(cell('2025-01-06').attributes('data-selection-start')).toBe('true')
    expect(cell('2025-01-08').attributes('data-selected')).toBe('true')
    expect(cell('2025-01-10').attributes('data-selection-end')).toBe('true')
    wrapper.unmount()
  })

  // behaviour-final-check R8
  it('releasing a drag over another day commits the range from the pressed day to that day', async () => {
    const wrapper = mount(RangeCalendar, {
      props: { locale: 'en-US', defaultPlaceholder: parseDate('2025-01-15') },
      attachTo: document.body,
    })
    const cell = await dragTo(wrapper, '2025-01-06', '2025-01-08', '2025-01-14')
    fire(cell('2025-01-14').element, 'pointerup')
    await tick()
    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as DateRange | undefined
    expect([value?.start?.toString(), value?.end?.toString()]).toEqual(['2025-01-06', '2025-01-14'])
    wrapper.unmount()
  })

  // behaviour-final-check R9
  it('dragging from the end of an existing range adjusts that end while the start stays anchored', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        locale: 'en-US',
        defaultValue: { start: parseDate('2025-01-10'), end: parseDate('2025-01-15') },
      },
      attachTo: document.body,
    })
    const cell = await dragTo(wrapper, '2025-01-15', '2025-01-16', '2025-01-17')
    fire(cell('2025-01-17').element, 'pointerup')
    await tick()
    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as DateRange | undefined
    expect([value?.start?.toString(), value?.end?.toString()]).toEqual(['2025-01-10', '2025-01-17'])
    wrapper.unmount()
  })

  // behaviour-final-check R9
  it('dragging from the start of an existing range adjusts that start while the end stays anchored', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        locale: 'en-US',
        defaultValue: { start: parseDate('2025-01-10'), end: parseDate('2025-01-15') },
      },
      attachTo: document.body,
    })
    const cell = await dragTo(wrapper, '2025-01-10', '2025-01-09', '2025-01-08')
    fire(cell('2025-01-08').element, 'pointerup')
    await tick()
    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as DateRange | undefined
    expect([value?.start?.toString(), value?.end?.toString()]).toEqual(['2025-01-08', '2025-01-15'])
    wrapper.unmount()
  })
})

describe('range calendar non-contiguous ranges', () => {
  // behaviour-final-check R10
  it('does not mark unavailable days inside the selected range as selected', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        locale: 'en-US',
        allowNonContiguousRanges: true,
        isDateUnavailable: (date) => date.day === 18 || date.day === 19,
        defaultValue: { start: parseDate('2025-01-17'), end: parseDate('2025-01-22') },
      },
    })
    const cell = (d: string) => wrapper.get(`[data-value="2025-01-${d}"]`)
    expect(cell('17').attributes('data-selected')).toBe('true')
    expect(cell('20').attributes('data-selected')).toBe('true')
    expect(cell('18').attributes('data-unavailable')).toBeDefined()
    expect(cell('18').attributes('data-selected')).toBeUndefined()
    expect(cell('19').attributes('data-selected')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('range calendar keyboard commit', () => {
  const press = async (init: KeyboardEventInit) => {
    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }),
    )
    await nextTick()
    await nextTick()
  }

  // behaviour-final-check R2: React Aria advances focus one day on the anchoring Enter, then commits the focused day
  it('Enter anchors, arrows extend and Enter commits the focused day', async () => {
    const wrapper = mount(RangeCalendar, {
      props: { locale: 'en-US', defaultPlaceholder: parseDate('2025-01-15') },
      attachTo: document.body,
    })
    ;(wrapper.get('[data-value="2025-01-15"]').element as HTMLElement).focus()
    await press({ key: 'Enter', code: 'Enter' })
    expect(document.activeElement?.getAttribute('data-value')).toBe('2025-01-16')
    for (let i = 0; i < 3; i++) await press({ key: 'ArrowRight', code: 'ArrowRight' })
    await press({ key: 'Enter', code: 'Enter' })
    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as DateRange
    expect([value.start?.toString(), value.end?.toString()]).toEqual(['2025-01-15', '2025-01-19'])
    wrapper.unmount()
  })

  it('Escape cancels an anchored selection and restores the committed range', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        locale: 'en-US',
        defaultValue: { start: parseDate('2025-01-10'), end: parseDate('2025-01-12') },
      },
      attachTo: document.body,
    })
    ;(wrapper.get('[data-value="2025-01-20"]').element as HTMLElement).focus()
    await press({ key: 'Enter', code: 'Enter' })
    expect(wrapper.get('[data-value="2025-01-20"]').attributes('data-selection-start')).toBe('true')
    await press({ key: 'Escape', code: 'Escape' })
    expect(wrapper.get('[data-value="2025-01-10"]').attributes('data-selection-start')).toBe('true')
    expect(wrapper.get('[data-value="2025-01-12"]').attributes('data-selection-end')).toBe('true')
    expect(wrapper.get('[data-value="2025-01-20"]').attributes('data-selected')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('RangeCalendar accessibility', () => {
  const flush = () => new Promise((r) => setTimeout(r, 0))
  const press = (key: string) =>
    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', { key, code: key, bubbles: true, cancelable: true }),
    )
  const start = new CalendarDate(2025, 1, 15)
  const range = { start, end: start.add({ days: 3 }) }

  it('passes axe idle, selected, disabled, read-only, invalid, unavailable, multi-month and week view', async () => {
    const cases = [
      { defaultPlaceholder: start },
      { defaultValue: range, ariaLabel: 'Trip dates' },
      { defaultValue: range, disabled: true },
      { defaultValue: range, readonly: true },
      { defaultValue: range, invalid: true },
      {
        defaultValue: range,
        minValue: new CalendarDate(2025, 1, 5),
        isDateUnavailable: (d: CalendarDate) => d.day === 25,
      },
      { defaultValue: range, numberOfMonths: 2 },
      { defaultPlaceholder: start, visibleDuration: { weeks: 1 } },
      { defaultValue: range, yearPicker: true },
    ]
    for (const props of cases) {
      const wrapper = mount(RangeCalendar, { props: props as any, attachTo: document.body })
      await nextTick()
      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('passes axe mid-selection (anchored) and with the year picker open', async () => {
    const wrapper = mount(RangeCalendar, {
      props: { defaultPlaceholder: start, yearPicker: true },
      attachTo: document.body,
    })
    ;(wrapper.get('[data-value="2025-01-10"]').element as HTMLElement).focus()
    press('Enter')
    press('ArrowRight')
    await nextTick()
    await expectAccessible(wrapper)
    await wrapper.get('[data-slot=calendar-year-picker-trigger]').trigger('click')
    await flush()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is an application whose month grids are multiselectable and named by the calendar label and month', () => {
    const wrapper = mount(RangeCalendar, {
      props: { defaultValue: range, ariaLabel: 'Trip dates', numberOfMonths: 2 },
    })
    expect(wrapper.attributes('role')).toBe('application')
    expect(wrapper.attributes('aria-label')).toContain('Trip dates')
    const grids = wrapper.findAll('[data-slot=range-calendar-grid]')
    expect(grids.map((g) => g.attributes('role'))).toEqual(['grid', 'grid'])
    expect(grids.map((g) => g.attributes('aria-multiselectable'))).toEqual(['true', 'true'])
    expect(grids.map((g) => g.attributes('aria-label'))).toEqual([
      'Trip dates, January 2025',
      'Trip dates, February 2025',
    ])
    wrapper.unmount()
  })

  it('every day of the selected range is aria-selected; out-of-range days are aria-disabled', () => {
    const wrapper = mount(RangeCalendar, {
      props: { defaultValue: range, minValue: new CalendarDate(2025, 1, 5) },
    })
    const selected = wrapper
      .findAll('td[aria-selected=true] [data-slot=range-calendar-cell]')
      .map((c) => c.attributes('data-value'))
    expect(selected).toEqual(['2025-01-15', '2025-01-16', '2025-01-17', '2025-01-18'])
    expect(wrapper.get('[data-value="2025-01-15"]').attributes('aria-label')).toBe(
      'Wednesday, January 15, 2025',
    )
    expect(wrapper.get('[data-value="2025-01-04"]').attributes('aria-disabled')).toBe('true')
    wrapper.unmount()
  })

  it('only the range start is in the tab order, and the tab stop follows arrow-key focus', async () => {
    const wrapper = mount(RangeCalendar, {
      props: { defaultValue: range },
      attachTo: document.body,
    })
    const tabbable = () =>
      wrapper
        .findAll('[data-slot=range-calendar-cell][tabindex="0"]')
        .map((c) => c.attributes('data-value'))
    expect(tabbable()).toEqual(['2025-01-15'])
    ;(wrapper.get('[data-value="2025-01-15"]').element as HTMLElement).focus()
    press('ArrowUp')
    await nextTick()
    expect((document.activeElement as HTMLElement).dataset.value).toBe('2025-01-08')
    expect(tabbable()).toEqual(['2025-01-08'])
    wrapper.unmount()
  })

  it('year picker: focus lands on the selected year, arrows move it, and Escape returns focus to the trigger', async () => {
    const wrapper = mount(RangeCalendar, {
      props: { defaultValue: range, yearPicker: true },
      attachTo: document.body,
    })
    const trigger = wrapper.get('[data-slot=calendar-year-picker-trigger]')
    await trigger.trigger('click')
    await flush()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    const grid = wrapper.get('[data-slot=calendar-year-picker-grid]')
    expect(grid.attributes('role')).toBe('listbox')
    expect(grid.attributes('aria-label')).toBe('year')
    const active = () => document.activeElement as HTMLElement
    expect(active().dataset.year).toBe('2025')
    expect(active().getAttribute('aria-selected')).toBe('true')
    press('ArrowDown')
    expect(active().dataset.year).toBe('2028')
    press('Escape')
    await flush()
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(grid.attributes('aria-hidden')).toBe('true')
    expect(document.activeElement).toBe(trigger.element)
    wrapper.unmount()
  })
})
