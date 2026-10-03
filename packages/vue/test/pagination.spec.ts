import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Pagination from '../src/components/pagination/Pagination.vue'

const labels = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('[data-slot=pagination-content] > li').slice(1, -1).map(li => li.text())

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
    expect(off.findAll('button').every(b => b.attributes('disabled') !== undefined)).toBe(true)
  })
})
