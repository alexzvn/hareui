import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import InlineSelect from '@/components/inline-select/InlineSelect.vue'
import Select from '@/components/select/Select.vue'

import { expectAccessible } from './a11y'

const items = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'ja', label: 'Japanese' },
]

const trigger = '[data-slot=select-trigger]'
const value = '[data-slot=select-value]'

// A task, not `flushPromises` (setImmediate): Select's `blur` settles in a `setTimeout`
const flush = () => new Promise((r) => setTimeout(r, 0))
const optionEls = () => [...document.querySelectorAll<HTMLElement>('[role=option]')]
const focusedText = () => document.activeElement?.textContent?.trim()

const press = async (key: string) => {
  document.activeElement!.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
  )

  await flush()
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('InlineSelect', () => {
  it('renders the default indicator and names the root inline-select', () => {
    const wrapper = mount(InlineSelect, {
      props: { items, defaultValue: 'en' },
      attrs: { 'aria-label': 'Language' },
    })

    expect(wrapper.attributes('data-slot')).toBe('inline-select')
    expect(wrapper.get(value).text()).toBe('English')
    const indicator = wrapper.get('[data-slot=select-indicator]')
    expect(indicator.attributes('aria-hidden')).toBe('true')
    expect(indicator.find('svg').exists()).toBe(true)
    expect(wrapper.get(trigger).attributes('aria-label')).toBe('Language')
  })

  it('names the trigger with aria-label plus the current value', () => {
    const wrapper = mount(InlineSelect, {
      props: { items, defaultValue: 'en', id: 'lang' },
      attrs: { 'aria-label': 'Language' },
    })

    const t = wrapper.get(trigger)
    expect(t.attributes('aria-label')).toBe('Language')
    expect(t.attributes('aria-labelledby')).toBe('lang lang-value')
    expect(wrapper.get(value).attributes('id')).toBe('lang-value')
  })

  it('updates v-model when an option is picked and closes', async () => {
    const Host = defineComponent({
      setup() {
        const model = ref<string | null>('en')
        return () =>
          h('div', [
            h(InlineSelect, {
              items: items,
              'aria-label': 'Language',
              modelValue: model.value,
              'onUpdate:modelValue': (v: unknown) => (model.value = v as string | null),
            }),
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
    const wrapper = mount(InlineSelect, {
      props: { items, defaultValue: 'es' },
      attachTo: document.body,
    })

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
    const wrapper = mount(InlineSelect, {
      props: { items, defaultValue: 'es' },
      attachTo: document.body,
    })

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
    const wrapper = mount(InlineSelect, {
      props: { items, defaultValue: 'en' },
      attachTo: document.body,
    })

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
    const wrapper = mount(InlineSelect, {
      props: { items, selectionMode: 'multiple', modelValue: ['en'] },
      attachTo: document.body,
    })

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
    const wrapper = mount(InlineSelect, {
      props: { items, defaultOpen: true },
      attachTo: document.body,
    })

    await flush()
    const popover = () => document.querySelector<HTMLElement>('[data-slot=select-popover]')!
    expect(popover().getAttribute('data-side')).toBe('bottom')
    expect(popover().getAttribute('data-align')).toBe('end')
    wrapper.unmount()

    const top = mount(InlineSelect, {
      props: { items, defaultOpen: true, side: 'top', align: 'start' },
      attachTo: document.body,
    })

    await flush()
    expect(popover().getAttribute('data-side')).toBe('top')
    expect(popover().getAttribute('data-align')).toBe('start')
    top.unmount()
  })

  it('replaces the indicator and renders leading content through slots', () => {
    const wrapper = mount(InlineSelect, {
      props: { items, defaultValue: 'en' },
      slots: {
        indicator: () => h('i', { 'data-testid': 'custom-indicator' }),
        leading: () => h('span', { 'data-testid': 'team-icon' }, 'N'),
      },
    })

    const indicator = wrapper.get('[data-slot=select-indicator]')
    expect(indicator.find('[data-testid=custom-indicator]').exists()).toBe(true)
    expect(indicator.find('svg').exists()).toBe(false)
    const children = [...wrapper.get(trigger).element.children]
    expect(children[0]!.getAttribute('data-testid')).toBe('team-icon')
    expect(children[1]!.getAttribute('data-slot')).toBe('select-value')
  })

  const openWithKeyboard = async (props: Record<string, unknown> = {}) => {
    const wrapper = mount(InlineSelect, {
      props: { items, defaultValue: 'en', id: 'lang', ...props },
      attrs: { 'aria-label': 'Language' },
      attachTo: document.body,
    })

    wrapper.get<HTMLElement>(trigger).element.focus()
    await wrapper.get(trigger).trigger('keydown', { key: 'ArrowDown' })
    await flush()
    await flush()

    return wrapper
  }

  it('has no axe violations idle (aria-label or visible label), disabled, and with a custom indicator', async () => {
    const named = { 'aria-label': 'Language' }
    for (const create of [
      () =>
        mount(InlineSelect, {
          props: { items, defaultValue: 'en' },
          attrs: named,
          attachTo: document.body,
        }),
      () => mount(InlineSelect, { props: { items, label: 'Language' }, attachTo: document.body }),
      () =>
        mount(InlineSelect, {
          props: { items, defaultValue: 'en', disabled: true },
          attrs: named,
          attachTo: document.body,
        }),
      () =>
        mount(InlineSelect, {
          props: { items },
          attrs: named,
          slots: { indicator: () => h('svg', { 'aria-hidden': 'true' }) },
          attachTo: document.body,
        }),
    ]) {
      const wrapper = create()
      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('has no axe violations while open, in single and multiple mode', async () => {
    const single = await openWithKeyboard()
    expect(document.querySelector('[role=listbox]')).not.toBeNull()
    await expectAccessible()
    single.unmount()

    const multiple = await openWithKeyboard({
      selectionMode: 'multiple',
      defaultValue: ['en', 'fr'],
    })

    await expectAccessible()
    multiple.unmount()
  })

  it('names the open listbox and its popover after the aria-label-only trigger', async () => {
    const wrapper = await openWithKeyboard()
    const t = wrapper.get(trigger)
    expect(t.attributes('aria-haspopup')).toBe('listbox')
    expect(t.attributes('aria-expanded')).toBe('true')
    expect(document.querySelector('[role=listbox]')!.getAttribute('aria-label')).toBe('Language')

    expect(
      document.querySelector('[data-slot=select-popover]')!.getAttribute('aria-labelledby'),
    ).toBe('lang')

    expect(optionEls().map((o) => o.getAttribute('aria-selected'))).toEqual([
      'true',
      'false',
      'false',
      'false',
    ])

    wrapper.unmount()
  })

  it('Escape returns focus to the trigger and collapses it', async () => {
    const wrapper = await openWithKeyboard()
    expect(focusedText()).toBe('English')
    await press('Escape')
    await flush()
    expect(wrapper.get(trigger).attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(wrapper.get(trigger).element)
    wrapper.unmount()
  })

  it('End / Home move to the last and first options while open', async () => {
    const wrapper = await openWithKeyboard()
    await press('End')
    expect(focusedText()).toBe('Japanese')
    await press('Home')
    expect(focusedText()).toBe('English')
    wrapper.unmount()
  })

  it('disabled trigger does not open', async () => {
    const wrapper = mount(InlineSelect, {
      props: { items, disabled: true },
      attachTo: document.body,
    })

    expect(wrapper.get(trigger).attributes('disabled')).toBeDefined()
    await wrapper.get(trigger).trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(document.querySelector('[role=listbox]')).toBeNull()
    wrapper.unmount()
  })
})

describe('InlineSelect events', () => {
  it('forwards focus when the trigger gains focus', async () => {
    const wrapper = mount(InlineSelect, {
      props: { items, defaultValue: 'en' },
      attrs: { 'aria-label': 'Language' },
      attachTo: document.body,
    })

    ;(wrapper.get(trigger).element as HTMLElement).focus()
    await flush()
    expect(wrapper.emitted('focus')).toHaveLength(1)
  })

  it('forwards blur when focus leaves the trigger', async () => {
    const outside = document.body.appendChild(document.createElement('button'))

    const wrapper = mount(InlineSelect, {
      props: { items, defaultValue: 'en' },
      attrs: { 'aria-label': 'Language' },
      attachTo: document.body,
    })

    ;(wrapper.get(trigger).element as HTMLElement).focus()
    await flush()
    outside.focus()
    await flush()
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  it('forwards change when the user picks an option', async () => {
    const wrapper = mount(InlineSelect, {
      props: { items, defaultValue: 'en' },
      attrs: { 'aria-label': 'Language' },
      attachTo: document.body,
    })

    await wrapper.get(trigger).trigger('click')
    await flush()
    document.querySelectorAll<HTMLElement>('[role=option]')[1].click()
    await flush()
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('emits null, not undefined, when the selection is cleared', async () => {
    const wrapper = mount(InlineSelect, {
      props: { items, defaultValue: 'en' },
      attrs: { 'aria-label': 'Language' },
    })

    wrapper.findComponent(Select).vm.$emit('update:modelValue', undefined)
    await flush()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
  })
})
