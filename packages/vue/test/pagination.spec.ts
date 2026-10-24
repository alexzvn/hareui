import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createTextVNode } from 'vue'

import type { PaginationProps, PaginationSlots } from '@/components/pagination/Pagination.types'
import Pagination from '@/components/pagination/Pagination.vue'

import { expectAccessible } from './a11y'

const labels = (wrapper: ReturnType<typeof mount>) =>
  wrapper
    .findAll('[data-slot=pagination-content] > li')
    .slice(1, -1)
    .map((li) => li.text())

describe('pagination', () => {
  it('ellipsis keeps first, last and the neighbours of the current page', async () => {
    const wrapper = mount(Pagination, { props: { total: 12, ellipsis: true } })
    expect(labels(wrapper)).toEqual(['1', '2', '…', '12'])
    await wrapper.setProps({ page: 6 })
    expect(labels(wrapper)).toEqual(['1', '…', '5', '6', '7', '…', '12'])
    await wrapper.setProps({ page: 11 })
    expect(labels(wrapper)).toEqual(['1', '…', '10', '11', '12'])
  })

  it('previous / next move the page and are disabled at the bounds', async () => {
    const wrapper = mount(Pagination, { props: { total: 3 } })
    const prev = () => wrapper.find('[data-slot=pagination-previous]')
    const next = () => wrapper.find('[data-slot=pagination-next]')
    expect(prev().attributes('disabled')).toBeDefined()

    await next().trigger('click')
    await next().trigger('click')
    expect(wrapper.emitted('update:page')).toEqual([[2], [3]])
    expect(next().attributes('disabled')).toBeDefined()
    expect(wrapper.find('[aria-current=page]').text()).toBe('3')
  })

  it('clicking a page link selects it; disabled blocks every button', async () => {
    const wrapper = mount(Pagination, { props: { total: 3 } })
    await wrapper.findAll('[data-slot=pagination-link]')[1]!.trigger('click')
    expect(wrapper.emitted('update:page')).toEqual([[2]])

    const off = mount(Pagination, { props: { total: 3, disabled: true } })
    expect(off.findAll('button').every((b) => b.attributes('disabled') !== undefined)).toBe(true)
  })
})

describe('Pagination accessibility', () => {
  it('passes axe by default, with ellipses, icon-only arrows, a summary, hidden pages and disabled', async () => {
    // Pick turns the interfaces into plain object types, which mount()'s index-signature options accept.
    const cases: {
      props: PaginationProps
      slots?: Pick<PaginationSlots, keyof PaginationSlots>
    }[] = [
      { props: { total: 5 } },
      { props: { total: 12, ellipsis: true, defaultPage: 6 } },
      { props: { total: 5, prevLabel: '', nextLabel: '' } },
      {
        props: { total: 5 },
        slots: { summary: ({ page, total }) => [createTextVNode(`Page ${page} of ${total}`)] },
      },
      { props: { total: 5, hidePages: true } },
      { props: { total: 5, disabled: true } },
    ]

    for (const options of cases) {
      const wrapper = mount(Pagination, { ...options, attachTo: document.body })
      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('is a navigation landmark named "pagination" that marks exactly the current page', async () => {
    const wrapper = mount(Pagination, { props: { total: 5, defaultPage: 2 } })
    expect(wrapper.attributes('role')).toBe('navigation')
    expect(wrapper.attributes('aria-label')).toBe('pagination')
    const current = () => wrapper.findAll('[aria-current]')
    expect(current().map((el) => [el.text(), el.attributes('aria-current')])).toEqual([
      ['2', 'page'],
    ])

    await wrapper.findAll('[data-slot=pagination-link]')[3]!.trigger('click')
    expect(current().map((el) => el.text())).toEqual(['4'])
    wrapper.unmount()
  })

  it('previous / next are named by their text, or by a fallback label when icon-only; icons and ellipses are hidden', () => {
    const named = mount(Pagination, { props: { total: 12, ellipsis: true } })

    const name = (el: Element) =>
      el.getAttribute('aria-label') ??
      [...el.querySelectorAll('span:not([aria-hidden])')].map((s) => s.textContent).join('')

    expect(name(named.get('[data-slot=pagination-previous]').element)).toBe('Previous')
    expect(name(named.get('[data-slot=pagination-next]').element)).toBe('Next')

    expect(
      named
        .findAll('[data-slot=pagination-ellipsis]')
        .every((e) => e.attributes('aria-hidden') === 'true'),
    ).toBe(true)

    expect(
      named.findAll('[data-slot$=-icon]').every((e) => e.attributes('aria-hidden') === 'true'),
    ).toBe(true)

    named.unmount()

    const iconOnly = mount(Pagination, { props: { total: 3, prevLabel: '', nextLabel: '' } })
    expect(iconOnly.get('[data-slot=pagination-previous]').attributes('aria-label')).toBe(
      'Previous page',
    )

    expect(iconOnly.get('[data-slot=pagination-next]').attributes('aria-label')).toBe('Next page')
    iconOnly.unmount()
  })

  it('every enabled control is a native button in the Tab order; bound and disabled controls leave it', () => {
    const wrapper = mount(Pagination, { props: { total: 3 } })
    const buttons = wrapper.findAll('button')
    expect(
      buttons.every(
        (b) => b.attributes('type') === 'button' && b.attributes('tabindex') === undefined,
      ),
    ).toBe(true)

    expect(buttons.map((b) => (b.element as HTMLButtonElement).disabled)).toEqual([
      true,
      false,
      false,
      false,
      false,
    ])

    wrapper.unmount()
  })

  it('keeps focus on the activated page button when the ellipsis window shifts around it', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 12, ellipsis: true, defaultPage: 5 },
      attachTo: document.body,
    })

    const six = wrapper.findAll('[data-slot=pagination-link]').find((b) => b.text() === '6')!
    ;(six.element as HTMLElement).focus()
    await six.trigger('click')
    expect(labels(wrapper)).toEqual(['1', '…', '5', '6', '7', '…', '12'])
    expect(document.activeElement).toBe(six.element)
    expect(six.attributes('aria-current')).toBe('page')
    wrapper.unmount()
  })
})
