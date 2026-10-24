import type { ComponentOptions } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import type { ListBoxProps } from '../src/components/list-box/ListBox.vue'
import ListBox from '../src/components/list-box/ListBox.vue'
import { expectAccessible } from './a11y'

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

  describe('accessibility', () => {
    const fruit = [
      { value: 'a', label: 'Apple' },
      { value: 'b', label: 'Banana', description: 'Yellow' },
      { value: 'c', label: 'Cherry', disabled: true },
      { value: 'd', label: 'Date' },
    ]
    const sectioned = [
      { type: 'section' as const, label: 'Fruit', items: fruit.slice(0, 2) },
      { type: 'separator' as const },
      { type: 'section' as const, items: fruit.slice(2) },
    ]
    const press = (key: string, init: KeyboardEventInit = {}) =>
      document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }))
    const focusedText = () => document.activeElement?.closest('[role=option]')?.textContent?.trim()

    afterEach(() => {
      document.body.innerHTML = ''
    })

    it('has no axe violations in single, multiple and action modes, with selections and a disabled option', async () => {
      const cases: Pick<ListBoxProps, keyof ListBoxProps>[] = [
        { items: fruit },
        { items: fruit, defaultValue: 'b' },
        { items: fruit, selectionMode: 'multiple' as const, defaultValue: ['a', 'd'] },
        { items: fruit, selectionMode: 'none' as const },
        { items: fruit, disabled: true },
      ]
      for (const props of cases) {
        const wrapper = mount(ListBox, { props, attrs: { 'aria-label': 'Fruit' }, attachTo: document.body })
        await wrapper.vm.$nextTick()
        await expectAccessible(wrapper)
        wrapper.unmount()
      }
    })

    it('has no axe violations with labelled and unlabelled sections and separators', async () => {
      const wrapper = mount(ListBox, { props: { items: sectioned }, attrs: { 'aria-label': 'Fruit' }, attachTo: document.body })
      await expectAccessible(wrapper)
      wrapper.unmount()
    })

    it('has no axe violations with an empty state and while loading more', async () => {
      const empty = mount(ListBox, { props: { items: [] }, attrs: { 'aria-label': 'Fruit' }, slots: { empty: () => 'No fruit' }, attachTo: document.body })
      expect(empty.text()).toBe('No fruit')
      await expectAccessible(empty)
      empty.unmount()

      const loading = mount(ListBox, { props: { items: fruit, loading: true }, attrs: { 'aria-label': 'Fruit' }, slots: { loading: () => h('span', { role: 'status' }, 'Loading…') }, attachTo: document.body })
      await expectAccessible(loading)
      loading.unmount()
    })

    it('passes its accessible name to the listbox element', () => {
      const wrapper = mount(ListBox, { props: { items: fruit }, attrs: { 'aria-label': 'Fruit' } })
      expect(wrapper.get('[role=listbox]').attributes('aria-label')).toBe('Fruit')
      expect(wrapper.get('[role=listbox]').attributes('aria-orientation')).toBe('vertical')
      wrapper.unmount()
    })

    it('names and describes a rich option by its label and description', () => {
      const wrapper = mount(ListBox, { props: { items: fruit }, attrs: { 'aria-label': 'Fruit' } })
      const banana = wrapper.findAll(option)[1]!
      expect(banana.find(`[id="${banana.attributes('aria-labelledby')}"]`).text()).toBe('Banana')
      expect(banana.find(`[id="${banana.attributes('aria-describedby')}"]`).text()).toBe('Yellow')
      // A plain option is named by its text
      expect(wrapper.findAll(option)[0]!.attributes('aria-labelledby')).toBeUndefined()
      wrapper.unmount()
    })

    it('reflects selected and disabled state on the options', async () => {
      const wrapper = mount(ListBox, { props: { items: fruit, selectionMode: 'multiple', defaultValue: ['a'] }, attachTo: document.body })
      const opts = wrapper.findAll(option)
      expect(opts.map(o => o.attributes('aria-selected'))).toEqual(['true', 'false', 'false', 'false'])
      expect(opts.map(o => o.attributes('aria-disabled'))).toEqual([undefined, undefined, 'true', undefined])
      await opts[3]!.trigger('click')
      expect(opts[3]!.attributes('aria-selected')).toBe('true')
      wrapper.unmount()

      const disabled = mount(ListBox, { props: { items: fruit, disabled: true } })
      expect(disabled.findAll(option).every(o => o.attributes('aria-disabled') === 'true')).toBe(true)
      disabled.unmount()
    })

    it('selectionMode none exposes no selection state', () => {
      const wrapper = mount(ListBox, { props: { items: fruit, selectionMode: 'none' } })
      expect(wrapper.findAll(option).some(o => o.attributes('aria-selected') !== undefined)).toBe(false)
      wrapper.unmount()
    })

    it('labels each section group by its header, and leaves an unlabelled section without a dangling reference', () => {
      const wrapper = mount(ListBox, { props: { items: sectioned } })
      const [labelled, unlabelled] = wrapper.findAll('[role=group]')
      const header = wrapper.get('header')
      expect(labelled!.attributes('aria-labelledby')).toBe(header.attributes('id'))
      expect(header.text()).toBe('Fruit')
      expect(unlabelled!.attributes('aria-labelledby')).toBeUndefined()
      expect(unlabelled!.findAll(option)).toHaveLength(2)
      wrapper.unmount()
    })

    it('has a single tab stop, and entering the list focuses the selected option, else the first one', async () => {
      for (const [defaultValue, expected] of [['d', 'Date'], [undefined, 'Apple']] as const) {
        const wrapper = mount(ListBox, { props: { items: fruit, defaultValue }, attachTo: document.body })
        await flushPromises()
        const stops = [...document.querySelectorAll<HTMLElement>('[tabindex="0"]')]
        expect(stops).toHaveLength(1)
        stops[0]!.focus()
        await flushPromises()
        expect(focusedText()).toBe(expected)
        wrapper.unmount()
      }
    })

    it('arrow keys skip disabled options; Home / End jump to the ends; Enter and Space select', async () => {
      const wrapper = mount(ListBox, { props: { items: fruit }, attachTo: document.body })
      await wrapper.vm.$nextTick()
      const opts = wrapper.findAll(option).map(o => o.element as HTMLElement)
      opts[0]!.focus()
      press('ArrowDown')
      await wrapper.vm.$nextTick()
      expect(focusedText()).toContain('Banana')
      press('ArrowDown')
      await wrapper.vm.$nextTick()
      expect(focusedText()).toBe('Date')
      press('Home')
      await wrapper.vm.$nextTick()
      expect(focusedText()).toBe('Apple')
      press('End')
      await wrapper.vm.$nextTick()
      expect(focusedText()).toBe('Date')
      press('Enter')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['d'])
      press('Home')
      await wrapper.vm.$nextTick()
      press(' ')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['a'])
      expect(opts[0]!.getAttribute('aria-selected')).toBe('true')
      wrapper.unmount()
    })

    it('Enter on an action list emits action for the focused option', async () => {
      const wrapper = mount(ListBox, { props: { items: fruit, selectionMode: 'none' }, attachTo: document.body })
      await wrapper.vm.$nextTick()
      ;(wrapper.findAll(option)[3]!.element as HTMLElement).focus()
      press('Enter')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('action')).toEqual([['d']])
      wrapper.unmount()
    })

    it('a disabled option cannot be selected by the keyboard or the pointer', async () => {
      const wrapper = mount(ListBox, { props: { items: fruit }, attachTo: document.body })
      await wrapper.vm.$nextTick()
      const cherry = wrapper.findAll(option)[2]!
      await cherry.trigger('click')
      ;(cherry.element as HTMLElement).focus()
      press('Enter')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      wrapper.unmount()
    })

    it('re-entering the list returns focus to the last focused option', async () => {
      const outside = document.createElement('button')
      document.body.append(outside)
      const wrapper = mount(ListBox, { props: { items: fruit }, attachTo: document.body })
      await flushPromises()
      ;(wrapper.findAll(option)[3]!.element as HTMLElement).focus()
      await flushPromises()
      outside.focus()
      await flushPromises()
      const stop = document.querySelector<HTMLElement>('[data-slot=list-box] [tabindex="0"], [data-slot=list-box][tabindex="0"]')!
      expect(stop.getAttribute('role')).toBe('listbox')
      stop.focus()
      await flushPromises()
      expect(focusedText()).toBe('Date')
      wrapper.unmount()
    })
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

    it('escapeKeyBehavior none keeps the selection and lets Escape through', async () => {
      const wrapper = mount(ListBox, { props: { items: fruit, selectionMode: 'single', escapeKeyBehavior: 'none' }, attachTo: document.body })
      await wrapper.vm.$nextTick()
      const opts = wrapper.findAll(option)
      await opts[0]!.trigger('click')
      ;(opts[0]!.element as HTMLElement).focus()
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
      opts[0]!.element.dispatchEvent(event)
      await wrapper.vm.$nextTick()
      expect(event.defaultPrevented).toBe(false)
      expect(wrapper.findAll('[data-selected=true]')).toHaveLength(1)
      wrapper.unmount()
    })

    it('highlightOnHover focuses the hovered option so the keyboard continues from it', async () => {
      const wrapper = mount(ListBox, { props: { items: fruit, highlightOnHover: true }, attachTo: document.body })
      await wrapper.vm.$nextTick()
      const opts = wrapper.findAll(option).map(o => o.element as HTMLElement)
      opts[1]!.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse' }))
      expect(document.activeElement).toBe(opts[1])
      press(opts[1]!, 'ArrowDown')
      await wrapper.vm.$nextTick()
      expect(document.activeElement).toBe(opts[3])
      wrapper.unmount()
    })

    it('typeahead right after an arrow key matches the typed character only', async () => {
      const { wrapper, opts } = await setup('single')
      opts[0]!.focus()
      press(opts[0]!, 'ArrowDown')
      await wrapper.vm.$nextTick()
      press(document.activeElement!, 'e')
      expect(document.activeElement).toBe(opts[4])
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      wrapper.unmount()
    })
  })

  describe('render scope', () => {
    const many = Array.from({ length: 50 }, (_, i) => ({ value: `v${i}`, label: `Item ${i}` }))
    // Option elements whose ListBoxOption re-rendered (Reka's own primitives under it are out of scope)
    const updatedOptions = new Set<Element>()
    const trackOptionUpdates: ComponentOptions = {
      updated() {
        if (this.$options.__name === 'ListBoxOption' && this.$el instanceof Element && this.$el.matches(option))
          updatedOptions.add(this.$el)
      },
    }
    const press = (el: Element, key: string) =>
      el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))

    afterEach(() => {
      document.body.innerHTML = ''
    })

    it('ArrowDown re-renders only the previously and newly focused options', async () => {
      const wrapper = mount(ListBox, { props: { items: many }, attachTo: document.body, global: { mixins: [trackOptionUpdates] } })
      await wrapper.vm.$nextTick()
      const opts = wrapper.findAll(option).map(o => o.element as HTMLElement)
      opts[0]!.focus()
      press(opts[0]!, 'ArrowDown')
      await wrapper.vm.$nextTick()
      updatedOptions.clear()
      press(document.activeElement!, 'ArrowDown')
      await wrapper.vm.$nextTick()
      expect(document.activeElement).toBe(opts[2])
      expect(opts[2]!.dataset.focused).toBe('true')
      expect(updatedOptions.has(opts[2]!)).toBe(true)
      expect([...updatedOptions].filter(el => el !== opts[1] && el !== opts[2]).length).toBe(0)
      wrapper.unmount()
    })

    it('selecting re-renders only the options whose selected state changes', async () => {
      const wrapper = mount(ListBox, { props: { items: [{ type: 'section', label: 'S', items: many.slice(0, 25) }, ...many.slice(25)] }, attachTo: document.body, global: { mixins: [trackOptionUpdates] } })
      await wrapper.vm.$nextTick()
      const opts = wrapper.findAll(option).map(o => o.element as HTMLElement)
      opts[3]!.click()
      await wrapper.vm.$nextTick()
      updatedOptions.clear()
      opts[30]!.click()
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['v30'])
      expect(opts[30]!.dataset.selected).toBe('true')
      expect(opts[3]!.dataset.selected).toBeUndefined()
      expect(updatedOptions.has(opts[30]!)).toBe(true)
      expect([...updatedOptions].filter(el => el !== opts[3] && el !== opts[30]).length).toBe(0)
      wrapper.unmount()
    })

    it('typeahead queries the option collection once per key, whatever the list length', async () => {
      const wrapper = mount(ListBox, { props: { items: many }, attachTo: document.body })
      await wrapper.vm.$nextTick()
      const opts = wrapper.findAll(option).map(o => o.element as HTMLElement)
      opts[0]!.focus()
      const query = vi.spyOn(Element.prototype, 'querySelectorAll')
      // No match: every option is checked
      press(opts[0]!, 'z')
      const collectionQueries = query.mock.calls.filter(([selector]) => selector.includes('data-reka-collection-item')).length
      query.mockRestore()
      expect(document.activeElement).toBe(opts[0])
      expect(collectionQueries).toBe(1)
      wrapper.unmount()
    })
  })
})
