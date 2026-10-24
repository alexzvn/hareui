import { CalendarDate } from '@internationalized/date'
import { mount } from '@vue/test-utils'
import { DateFieldInput, DateFieldRoot, DateRangeFieldInput, DateRangeFieldRoot } from 'reka-ui'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import DateInputGroup from '../src/components/date-input-group/DateInputGroup.vue'
import { expectAccessible } from './a11y'

const date = new CalendarDate(2025, 1, 15)

// DateInputGroup isn't exported: it is only rendered inside a Reka date root, as the fields and pickers do
function field(groupProps: Record<string, unknown> = {}, rootProps: Record<string, unknown> = {}) {
  return defineComponent(
    () => () =>
      h('div', [
        h('span', { id: 'lbl' }, 'Due date'),
        h('span', { id: 'desc' }, 'Pick a weekday'),
        h(
          DateFieldRoot,
          { defaultValue: date, ...rootProps },
          {
            default: ({ segments }: { segments: { part: string; value: string }[] }) =>
              h(DateInputGroup, { segments, segmentInput: DateFieldInput, ...groupProps }),
          },
        ),
      ]),
  )
}

function rangeField(groupProps: Record<string, unknown> = {}) {
  return defineComponent(
    () => () =>
      h('div', [
        h('span', { id: 'lbl' }, 'Trip'),
        h(
          DateRangeFieldRoot,
          { defaultValue: { start: date, end: date.add({ days: 3 }) } },
          {
            default: ({
              segments,
            }: {
              segments: {
                start: { part: string; value: string }[]
                end: { part: string; value: string }[]
              }
            }) =>
              h(DateInputGroup, {
                segments: segments.start,
                endSegments: segments.end,
                segmentInput: DateRangeFieldInput,
                ...groupProps,
              }),
          },
        ),
      ]),
  )
}

const spinbuttons = (root: ParentNode) => [
  ...root.querySelectorAll<HTMLElement>('[role=spinbutton]'),
]

/** Accessible name per aria-labelledby (an element referencing itself contributes its own aria-label). */
function accessibleName(el: HTMLElement) {
  const ids = el.getAttribute('aria-labelledby')
  if (!ids) return el.getAttribute('aria-label')
  return ids
    .split(' ')
    .map((id) => {
      const target = document.getElementById(id)
      expect(target, `aria-labelledby id "${id}" exists`).not.toBeNull()
      return target === el ? el.getAttribute('aria-label') : target!.textContent
    })
    .join('')
}

describe('DateInputGroup', () => {
  it('passes axe labelled, described, aria-labelled, invalid, read-only, disabled and in range mode', async () => {
    const cases = [
      field({ labelledby: 'lbl' }),
      field({ labelledby: 'lbl', describedby: 'desc' }),
      field({ ariaLabel: 'Due date' }),
      field({ labelledby: 'lbl', describedby: 'desc', invalid: true }),
      field({ labelledby: 'lbl' }, { readonly: true }),
      field({ labelledby: 'lbl', disabled: true }, { disabled: true }),
      rangeField({ labelledby: 'lbl' }),
    ]
    for (const component of cases) {
      const wrapper = mount(component, { attachTo: document.body })
      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('names the group by the field label and each segment by its field name followed by that label', () => {
    const wrapper = mount(field({ labelledby: 'lbl' }), { attachTo: document.body })
    const group = wrapper.get('[data-slot=date-input-group]')
    expect(group.attributes('role')).toBe('group')
    expect(group.attributes('aria-labelledby')).toBe('lbl')
    expect(spinbuttons(wrapper.element).map(accessibleName)).toEqual([
      'month, Due date',
      'day, Due date',
      'year, Due date',
    ])
    const ids = spinbuttons(wrapper.element).map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    wrapper.unmount()
  })

  it('an aria-label (no visible label) names the group and is appended to every segment name', () => {
    const wrapper = mount(field({ ariaLabel: 'Due date' }), { attachTo: document.body })
    expect(wrapper.get('[data-slot=date-input-group]').attributes('aria-label')).toBe('Due date')
    expect(spinbuttons(wrapper.element).map(accessibleName)).toEqual([
      'month, Due date',
      'day, Due date',
      'year, Due date',
    ])
    wrapper.unmount()
  })

  it('literal separators are hidden from assistive tech', () => {
    const wrapper = mount(field({ labelledby: 'lbl' }))
    const literals = wrapper.findAll('[data-segment=literal]')
    expect(literals.length).toBeGreaterThan(0)
    expect(literals.every((l) => l.attributes('aria-hidden') === 'true')).toBe(true)
    wrapper.unmount()
  })

  it('the description describes the group and only the first segment; while invalid it describes every segment', async () => {
    const wrapper = mount(field({ labelledby: 'lbl', describedby: 'desc' }), {
      attachTo: document.body,
    })
    expect(wrapper.get('[data-slot=date-input-group]').attributes('aria-describedby')).toBe('desc')
    expect(spinbuttons(wrapper.element).map((s) => s.getAttribute('aria-describedby'))).toEqual([
      'desc',
      null,
      null,
    ])
    wrapper.unmount()

    const invalid = mount(field({ labelledby: 'lbl', describedby: 'desc', invalid: true }), {
      attachTo: document.body,
    })
    for (const segment of spinbuttons(invalid.element)) {
      expect(segment.getAttribute('aria-describedby')).toBe('desc')
      expect(segment.getAttribute('aria-invalid')).toBe('true')
    }
    invalid.unmount()
  })

  it('read-only segments stay focusable and report aria-readonly; disabled ones leave the tab order', () => {
    const readonly = mount(field({ labelledby: 'lbl' }, { readonly: true }))
    for (const segment of spinbuttons(readonly.element)) {
      expect(segment.getAttribute('aria-readonly')).toBe('true')
      expect(segment.getAttribute('tabindex')).toBe('0')
    }
    readonly.unmount()

    const disabled = mount(field({ labelledby: 'lbl', disabled: true }, { disabled: true }))
    for (const segment of spinbuttons(disabled.element)) {
      expect(segment.getAttribute('aria-disabled')).toBe('true')
      expect(segment.hasAttribute('tabindex')).toBe(false)
    }
    disabled.unmount()
  })

  it('range mode: segments are named Start Date / End Date plus the label, and every segment is tabbable in order', () => {
    const wrapper = mount(rangeField({ labelledby: 'lbl' }), { attachTo: document.body })
    const segments = spinbuttons(wrapper.element)
    expect(segments.map(accessibleName)).toEqual([
      'month, Start Date, Trip',
      'day, Start Date, Trip',
      'year, Start Date, Trip',
      'month, End Date, Trip',
      'day, End Date, Trip',
      'year, End Date, Trip',
    ])
    expect(new Set(segments.map((s) => s.id)).size).toBe(6)
    expect(segments.every((s) => s.getAttribute('tabindex') === '0')).toBe(true)
    wrapper.unmount()
  })
})
