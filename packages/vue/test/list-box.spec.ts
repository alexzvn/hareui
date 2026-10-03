import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
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

  describe('keyboard and pointer selection (behaviour parity)', () => {
    const fruit = [
      { value: 'a', label: 'Apple' },
      { value: 'b', label: 'Banana' },
      { value: 'c', label: 'Cherry', disabled: true },
      { value: 'd', label: 'Date' },
      { value: 'e', label: 'Elderberry' },
    ]
    const press = (el: Element, key: string, init: KeyboardEventInit = {}) =>
      el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }))
    const last = (w: ReturnType<typeof mount>) => (w.emitted('update:modelValue')?.at(-1)?.[0] as string[] | string | null | undefined)
    const sorted = (v: unknown) => [...(v as string[])].sort()

    // Failed assertions skip `unmount()`; keep a leaked tree from polluting the next test's focus.
    afterEach(() => {
      document.body.innerHTML = ''
    })

    async function setup(selectionMode: 'none' | 'single' | 'multiple') {
      const wrapper = mount(ListBox, { props: { items: fruit, selectionMode }, attachTo: document.body })
      await wrapper.vm.$nextTick()
      return { wrapper, opts: wrapper.findAll(option).map(o => o.element as HTMLElement) }
    }

    it('Shift+ArrowDown extends the selection from the anchor and skips disabled items', async () => {
      // behaviour-final-check L1 / H8
      const { wrapper, opts } = await setup('multiple')
      await wrapper.findAll(option)[0]!.trigger('click')
      opts[0]!.focus()
      press(opts[0]!, 'ArrowDown', { shiftKey: true })
      await wrapper.vm.$nextTick()
      press(document.activeElement!, 'ArrowDown', { shiftKey: true })
      await wrapper.vm.$nextTick()
      expect(sorted(last(wrapper))).toEqual(['a', 'b', 'd'])
      wrapper.unmount()
    })

    it('Shift+End and Shift+Home select the contiguous range from the anchor to the edge', async () => {
      // behaviour-final-check L1 / H8
      const { wrapper, opts } = await setup('multiple')
      await wrapper.findAll(option)[1]!.trigger('click')
      opts[1]!.focus()
      press(opts[1]!, 'End', { shiftKey: true })
      await wrapper.vm.$nextTick()
      expect(sorted(last(wrapper))).toEqual(['b', 'd', 'e'])
      press(document.activeElement!, 'Home', { shiftKey: true })
      await wrapper.vm.$nextTick()
      expect(sorted(last(wrapper))).toEqual(['a', 'b'])
      wrapper.unmount()
    })

    it('Shift+click selects the contiguous range from the previously clicked item', async () => {
      // behaviour-final-check L1 / H8
      const { wrapper } = await setup('multiple')
      const options = wrapper.findAll(option)
      await options[0]!.trigger('click')
      await options[4]!.trigger('click', { shiftKey: true })
      expect(sorted(last(wrapper))).toEqual(['a', 'b', 'd', 'e'])
      wrapper.unmount()
    })

    it('Ctrl/Meta+A selects every enabled item and keeps focus on the focused item', async () => {
      // behaviour-final-check L2
      const { wrapper, opts } = await setup('multiple')
      opts[1]!.focus()
      press(opts[1]!, 'a', { metaKey: true })
      await wrapper.vm.$nextTick()
      expect(sorted(last(wrapper))).toEqual(['a', 'b', 'd', 'e'])
      expect(document.activeElement).toBe(opts[1])
      wrapper.unmount()
    })

    it('Escape clears the selection in multiple mode', async () => {
      // behaviour-final-check L3
      const { wrapper, opts } = await setup('multiple')
      await wrapper.findAll(option)[0]!.trigger('click')
      await wrapper.findAll(option)[1]!.trigger('click')
      expect(sorted(last(wrapper))).toEqual(['a', 'b'])
      opts[1]!.focus()
      press(opts[1]!, 'Escape')
      await wrapper.vm.$nextTick()
      expect(wrapper.findAll('[data-selected=true]')).toHaveLength(0)
      wrapper.unmount()
    })

    it('Escape clears the selection in single mode', async () => {
      // behaviour-final-check L3
      const { wrapper, opts } = await setup('single')
      await wrapper.findAll(option)[4]!.trigger('click')
      expect(last(wrapper)).toBe('e')
      opts[4]!.focus()
      press(opts[4]!, 'Escape')
      await wrapper.vm.$nextTick()
      expect(wrapper.findAll('[data-selected=true]')).toHaveLength(0)
      wrapper.unmount()
    })

    it('PageDown moves focus toward the end of the list', async () => {
      // behaviour-final-check L4
      const { wrapper, opts } = await setup('single')
      opts[1]!.focus()
      press(opts[1]!, 'PageDown')
      await wrapper.vm.$nextTick()
      expect(document.activeElement).toBe(opts[4])
      wrapper.unmount()
    })

    it('PageUp moves focus toward the start of the list', async () => {
      // behaviour-final-check L4
      const { wrapper, opts } = await setup('single')
      opts[3]!.focus()
      press(opts[3]!, 'PageUp')
      await wrapper.vm.$nextTick()
      expect(document.activeElement).toBe(opts[0])
      wrapper.unmount()
    })

    it('selectionMode none: ArrowDown after a mouse click continues from the clicked item', async () => {
      // behaviour-final-check L5
      const { wrapper, opts } = await setup('none')
      // A mouse press focuses the pressed option before the click fires.
      await wrapper.findAll(option)[1]!.trigger('mousedown', { button: 0 })
      opts[1]!.focus()
      await wrapper.findAll(option)[1]!.trigger('click')
      press(document.activeElement!, 'ArrowDown')
      await wrapper.vm.$nextTick()
      // Cherry (index 2) is disabled, so the cursor lands on Date.
      expect(document.activeElement).toBe(opts[3])
      wrapper.unmount()
    })
  })
})
