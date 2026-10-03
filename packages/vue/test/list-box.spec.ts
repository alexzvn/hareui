import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import ListBox from '../src/components/list-box/ListBox.vue'

const items = [
  { value: 'a', label: 'Alpha', description: 'First' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma', disabled: true },
]
const option = '[data-slot=list-box-item]'

describe('ListBox', () => {
  it('single selection: click selects, emits the value, marks the item', async () => {
    const wrapper = mount(ListBox, { props: { items }, attachTo: document.body })
    const options = wrapper.findAll(option)
    await options[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b'])
    expect(options[1]!.attributes('aria-selected')).toBe('true')
    expect(options[1]!.attributes('data-selected')).toBe('true')
    expect(options[0]!.attributes('data-selected')).toBeUndefined()
    wrapper.unmount()
  })

  it('multiple selection accumulates an array; disabled items stay unselectable', async () => {
    const wrapper = mount(ListBox, { props: { items, selectionMode: 'multiple' }, attachTo: document.body })
    const options = wrapper.findAll(option)
    await options[0]!.trigger('click')
    await options[1]!.trigger('click')
    await options[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b']])
    expect(wrapper.get('[role=listbox]').attributes('aria-multiselectable')).toBe('true')
    wrapper.unmount()
  })

  it('selectionMode none emits action and never selects', async () => {
    const wrapper = mount(ListBox, { props: { items, selectionMode: 'none' }, attachTo: document.body })
    await wrapper.findAll(option)[0]!.trigger('click')
    expect(wrapper.emitted('action')).toEqual([['a']])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find(option).attributes('data-selection-mode')).toBeUndefined()
    expect(wrapper.find('[data-slot=list-box-item-indicator]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('v-model drives the selection; defaultValue seeds it when unbound', async () => {
    const controlled = mount(ListBox, { props: { items, modelValue: 'a' } })
    expect(controlled.findAll(option)[0]!.attributes('data-selected')).toBe('true')
    await controlled.setProps({ modelValue: 'b' })
    expect(controlled.findAll(option)[1]!.attributes('data-selected')).toBe('true')
    const seeded = mount(ListBox, { props: { items, defaultValue: 'b' } })
    expect(seeded.findAll(option)[1]!.attributes('data-selected')).toBe('true')
    expect(seeded.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders sections with headers, separators, and forwards item slots with state', () => {
    const wrapper = mount(ListBox, {
      props: { modelValue: 'b', items: [{ type: 'section', label: 'Actions', items: items.slice(0, 2) }, { type: 'separator' }, { type: 'section', items: [items[2]!] }] },
      slots: { 'item-trailing': ({ item, selected, index }: any) => h('kbd', `${item.value}:${selected}:${index}`) },
    })
    expect(wrapper.findAll('section')).toHaveLength(2)
    expect(wrapper.get('header[data-slot=header]').text()).toBe('Actions')
    expect(wrapper.get('hr[data-slot=separator]').attributes('data-orientation')).toBe('horizontal')
    expect(wrapper.findAll('kbd').map(k => k.text())).toEqual(['a:false:0', 'b:true:1', 'c:false:2'])
  })
})
