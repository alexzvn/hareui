import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import InlineSelect from '../src/components/inline-select/InlineSelect.vue'

const items = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'ja', label: 'Japanese' },
]
const trigger = '[data-slot=select-trigger]'
const value = '[data-slot=select-value]'
const flush = flushPromises
const optionEls = () => [...document.querySelectorAll<HTMLElement>('[role=option]')]
const focusedText = () => document.activeElement?.textContent?.trim()
async function press(key: string) {
  document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
  await flush()
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('InlineSelect', () => {
  it('renders the default indicator and names the root inline-select', () => {
    const wrapper = mount(InlineSelect, { props: { items, defaultValue: 'en' }, attrs: { 'aria-label': 'Language' } })
    expect(wrapper.attributes('data-slot')).toBe('inline-select')
    expect(wrapper.get(value).text()).toBe('English')
    const indicator = wrapper.get('[data-slot=select-indicator]')
    expect(indicator.attributes('aria-hidden')).toBe('true')
    expect(indicator.find('svg').exists()).toBe(true)
    expect(wrapper.get(trigger).attributes('aria-label')).toBe('Language')
  })

  it('names the trigger with aria-label plus the current value', () => {
    const wrapper = mount(InlineSelect, { props: { items, defaultValue: 'en', id: 'lang' }, attrs: { 'aria-label': 'Language' } })
    const t = wrapper.get(trigger)
    expect(t.attributes('aria-label')).toBe('Language')
    expect(t.attributes('aria-labelledby')).toBe('lang lang-value')
    expect(wrapper.get(value).attributes('id')).toBe('lang-value')
  })

  it('updates v-model when an option is picked and closes', async () => {
    const Host = defineComponent({
      setup() {
        const model = ref<string | null>('en')
        return () => h('div', [
          h(InlineSelect, { 'items': items, 'aria-label': 'Language', 'modelValue': model.value, 'onUpdate:modelValue': (v: unknown) => (model.value = v as string | null) }),
          h('output', model.value ?? ''),
        ])
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await wrapper.get(trigger).trigger('click')
    await flush()
    optionEls()[2]!.click()
    await flush()
    expect(wrapper.get('output').text()).toBe('fr')
    expect(wrapper.get(value).text()).toBe('French')
    expect(document.querySelector('[role=listbox]')).toBeNull()
    wrapper.unmount()
  })

  it('works uncontrolled from defaultValue', async () => {
    const wrapper = mount(InlineSelect, { props: { items, defaultValue: 'es' }, attachTo: document.body })
    expect(wrapper.get(value).text()).toBe('Spanish')
    await wrapper.get(trigger).trigger('click')
    await flush()
    optionEls()[3]!.click()
    await flush()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['ja'])
    expect(wrapper.get(value).text()).toBe('Japanese')
    wrapper.unmount()
  })

  it('opens with ArrowDown on the selected option, moves with arrows, selects with Enter and refocuses the trigger', async () => {
    const wrapper = mount(InlineSelect, { props: { items, defaultValue: 'es' }, attachTo: document.body })
    wrapper.get<HTMLElement>(trigger).element.focus()
    await wrapper.get(trigger).trigger('keydown', { key: 'ArrowDown' })
    await flush()
    await flush()
    expect(wrapper.attributes('data-open')).toBe('true')
    expect(wrapper.get('[data-slot=select-indicator]').attributes('data-open')).toBe('true')
    expect(focusedText()).toBe('Spanish')
    await press('ArrowDown')
    expect(focusedText()).toBe('French')
    await press('Enter')
    await flush()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['fr'])
    expect(document.querySelector('[role=listbox]')).toBeNull()
    expect(document.activeElement?.getAttribute('data-slot')).toBe('select-trigger')
    wrapper.unmount()
  })

  it('closes with Escape without changing the selection', async () => {
    const wrapper = mount(InlineSelect, { props: { items, defaultValue: 'en' }, attachTo: document.body })
    wrapper.get<HTMLElement>(trigger).element.focus()
    await wrapper.get(trigger).trigger('keydown', { key: 'ArrowDown' })
    await flush()
    await flush()
    await press('Escape')
    await flush()
    expect(document.querySelector('[role=listbox]')).toBeNull()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('keeps the popover open in multiple mode and lists the selected labels', async () => {
    const wrapper = mount(InlineSelect, { props: { items, selectionMode: 'multiple', modelValue: ['en'] }, attachTo: document.body })
    await wrapper.get(trigger).trigger('click')
    await flush()
    optionEls()[2]!.click()
    await flush()
    const last = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as string[]
    expect([...last].sort()).toEqual(['en', 'fr'])
    await wrapper.setProps({ modelValue: last })
    expect(wrapper.get(value).text()).toBe('English and French')
    expect(document.querySelector('[role=listbox]')).not.toBeNull()
    wrapper.unmount()
  })

  it('aligns the popover to the bottom end by default and follows side / align', async () => {
    const wrapper = mount(InlineSelect, { props: { items, defaultOpen: true }, attachTo: document.body })
    await flush()
    const popover = () => document.querySelector<HTMLElement>('[data-slot=select-popover]')!
    expect(popover().getAttribute('data-side')).toBe('bottom')
    expect(popover().getAttribute('data-align')).toBe('end')
    wrapper.unmount()

    const top = mount(InlineSelect, { props: { items, defaultOpen: true, side: 'top', align: 'start' }, attachTo: document.body })
    await flush()
    expect(popover().getAttribute('data-side')).toBe('top')
    expect(popover().getAttribute('data-align')).toBe('start')
    top.unmount()
  })

  it('replaces the indicator and renders leading content through slots', () => {
    const wrapper = mount(InlineSelect, {
      props: { items, defaultValue: 'en' },
      slots: {
        indicator: () => h('i', { class: 'custom-indicator' }),
        leading: () => h('span', { class: 'team-icon' }, 'N'),
      },
    })
    const indicator = wrapper.get('[data-slot=select-indicator]')
    expect(indicator.find('.custom-indicator').exists()).toBe(true)
    expect(indicator.find('svg').exists()).toBe(false)
    const children = [...wrapper.get(trigger).element.children]
    expect(children[0]!.classList.contains('team-icon')).toBe(true)
    expect(children[1]!.getAttribute('data-slot')).toBe('select-value')
  })

  it('disabled trigger does not open', async () => {
    const wrapper = mount(InlineSelect, { props: { items, disabled: true }, attachTo: document.body })
    expect(wrapper.get(trigger).attributes('disabled')).toBeDefined()
    await wrapper.get(trigger).trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(document.querySelector('[role=listbox]')).toBeNull()
    wrapper.unmount()
  })
})
