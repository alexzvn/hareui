import { CalendarDate } from '@internationalized/date'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Calendar from '../src/components/Calendar.vue'

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
