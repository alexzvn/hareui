import { CalendarDate, parseDate } from '@internationalized/date'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Calendar from '../src/components/calendar/Calendar.vue'

const focused = new CalendarDate(2025, 1, 15)

describe('calendar', () => {
  it('clicking a day selects it and emits update:modelValue', async () => {
    const wrapper = mount(Calendar, { props: { defaultPlaceholder: focused } })
    const day10 = wrapper.findAll('[data-slot=calendar-cell]').find(cell => cell.text() === '10')!
    await day10.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toMatchObject({ year: 2025, month: 1, day: 10 })
    expect(day10.attributes('data-selected')).toBe('true')
    wrapper.unmount()
  })

  it('min/max bounds mark out-of-range days disabled and unclickable', async () => {
    const wrapper = mount(Calendar, {
      props: {
        defaultPlaceholder: focused,
        minValue: new CalendarDate(2025, 1, 10),
        maxValue: new CalendarDate(2025, 1, 20),
      },
    })
    const day5 = wrapper.findAll('[data-slot=calendar-cell]').find(cell => cell.text() === '5')!
    expect(day5.attributes('data-disabled')).toBe('')

    await day5.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('isDateUnavailable blocks selection of matching dates', async () => {
    const wrapper = mount(Calendar, {
      props: {
        defaultPlaceholder: focused,
        isDateUnavailable: date => date.day === 18,
      },
    })
    const day18 = wrapper.findAll('[data-slot=calendar-cell]').find(cell => cell.text() === '18')!
    expect(day18.attributes('data-unavailable')).toBe('')

    await day18.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('disabled prevents selection of any date', async () => {
    const wrapper = mount(Calendar, { props: { defaultPlaceholder: focused, disabled: true } })
    const day10 = wrapper.findAll('[data-slot=calendar-cell]').find(cell => cell.text() === '10')!
    await day10.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('year picker trigger opens the year grid and selecting a year keeps month/day, only swapping the year', async () => {
    const wrapper = mount(Calendar, { props: { defaultPlaceholder: focused, yearPicker: true } })
    const trigger = wrapper.find('[data-slot=calendar-year-picker-trigger]')
    expect(trigger.text()).toContain('2025')

    await trigger.trigger('click')
    await nextTick()
    expect(wrapper.find('[data-slot=calendar-year-picker-grid]').attributes('data-open')).toBe('true')

    const year2030 = wrapper.findAll('[data-slot=calendar-year-picker-year-cell]').find(cell => cell.text() === '2030')!
    await year2030.trigger('click')
    await nextTick()

    expect(wrapper.find('[data-slot=calendar-year-picker-grid]').attributes('data-open')).toBeUndefined()
    expect(trigger.text()).toContain('2030')
    expect(wrapper.emitted('update:placeholder')?.[0]?.[0]).toMatchObject({ year: 2030, month: 1, day: 15 })
    wrapper.unmount()
  })
  it('numberOfMonths renders one panel per month with shared prev/next paging by the full width', async () => {
    const wrapper = mount(Calendar, { props: { defaultPlaceholder: focused, numberOfMonths: 2 } })
    const panels = wrapper.findAll('[data-slot=calendar-panel]')
    expect(panels).toHaveLength(2)
    expect(panels[0].text()).toContain('January')
    expect(panels[1].text()).toContain('February')
    // Only the first panel gets a prev button, only the last gets a next button.
    expect(panels[0].find('[data-slot=calendar-nav-button]').exists()).toBe(true)
    expect(panels[1].findAll('[data-slot=calendar-nav-button]')).toHaveLength(1)

    await panels[1].find('[data-slot=calendar-nav-button]').trigger('click')
    expect(panels[0].text()).toContain('March')
    expect(panels[1].text()).toContain('April')
    wrapper.unmount()
  })

  it('invalid sets aria-invalid/data-invalid on the root', () => {
    const wrapper = mount(Calendar, { props: { defaultPlaceholder: focused, invalid: true } })
    const root = wrapper.find('[data-slot=calendar]')
    expect(root.attributes('aria-invalid')).toBe('true')
    expect(root.attributes('data-invalid')).toBe('')
    wrapper.unmount()
  })
})

describe('calendar week/day view (visibleDuration)', () => {
  const cells = (w: { findAll: (s: string) => any[] }) => w.findAll('[data-slot=calendar-cell]')

  it('week view renders one 7-day row with a range heading, and pages by the visible weeks', async () => {
    const wrapper = mount(Calendar, { props: { ariaLabel: 'Week', locale: 'en-US', visibleDuration: { weeks: 1 }, defaultPlaceholder: parseDate('2025-01-15') } })
    expect(cells(wrapper).map((c: any) => c.text())).toEqual(['12', '13', '14', '15', '16', '17', '18'])
    expect(wrapper.get('[data-slot=calendar-heading]').text().replace(/\s/g, ' ')).toBe('January 12 – 18, 2025')
    await wrapper.findAll('[data-slot=calendar-nav-button]')[1]!.trigger('click')
    expect(cells(wrapper)[0]!.text()).toBe('19')
  })

  it('day view (< 7 days) shows only the visible days with matching weekday headers', () => {
    const wrapper = mount(Calendar, { props: { ariaLabel: 'Days', locale: 'en-US', visibleDuration: { days: 5 }, defaultPlaceholder: parseDate('2025-01-15') } })
    expect(cells(wrapper).map((c: any) => c.text())).toEqual(['13', '14', '15', '16', '17'])
    expect(wrapper.findAll('[data-slot=calendar-header-cell]').map(c => c.text())).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
  })

  it('day view (>= 7 days) shows week rows with leading days disabled', () => {
    const wrapper = mount(Calendar, { props: { ariaLabel: 'Days', locale: 'en-US', visibleDuration: { days: 10 }, defaultPlaceholder: parseDate('2025-01-15') } })
    const all = cells(wrapper)
    expect(all[0]!.text()).toBe('5')
    expect(all[0]!.attributes('data-disabled')).toBe('')
    expect(all[3]!.attributes('data-disabled')).toBeUndefined()
    expect(all.at(-1)!.text()).toBe('17')
  })

  it('clicking selects, arrow keys move focus across pages, Enter selects', async () => {
    const wrapper = mount(Calendar, { props: { ariaLabel: 'Week', locale: 'en-US', visibleDuration: { weeks: 1 }, defaultPlaceholder: parseDate('2025-01-15') }, attachTo: document.body })
    await cells(wrapper)[1]!.trigger('click')
    expect((wrapper.emitted('update:modelValue')!.at(-1)![0] as any).toString()).toBe('2025-01-13')
    const grid = wrapper.get('[data-slot=calendar-grid]')
    for (let i = 0; i < 6; i++)
      await grid.trigger('keydown', { key: 'ArrowRight' })
    expect(cells(wrapper)[0]!.text()).toBe('19')
    await grid.trigger('keydown', { key: 'Enter' })
    expect((wrapper.emitted('update:modelValue')!.at(-1)![0] as any).toString()).toBe('2025-01-19')
    wrapper.unmount()
  })
})
