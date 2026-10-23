import type { ComponentOptions } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import type { ComboBoxValue } from '../src/components/combo-box/ComboBox.vue'
import ComboBox from '../src/components/combo-box/ComboBox.vue'

const items = [
  { value: 'aardvark', label: 'Aardvark' },
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'kangaroo', label: 'Kangaroo', disabled: true },
]
const flush = async () => {
  for (let i = 0; i < 4; i++) {
    await nextTick()
    await new Promise(r => setTimeout(r, 0))
  }
}
const options = () => [...document.querySelectorAll<HTMLElement>('[role=option]')]
const texts = () => options().map(o => o.textContent?.trim())

afterEach(() => {
  document.body.innerHTML = ''
})

function setup(props: Record<string, any> = {}, slots?: Record<string, any>) {
  const wrapper = mount(ComboBox, { props: { items, label: 'Animal', ...props }, slots, attachTo: document.body })
  const input = wrapper.get<HTMLInputElement>('input[role=combobox]')
  return { wrapper, input }
}

async function type(input: ReturnType<typeof setup>['input'], text: string) {
  input.element.value = text
  await input.trigger('input')
  await flush()
}

describe('ComboBox', () => {
  it('opens on focus with every option and filters as the user types', async () => {
    const { wrapper, input } = setup()
    await input.trigger('focus')
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(texts()).toEqual(['Aardvark', 'Cat', 'Dog', 'Kangaroo'])

    await type(input, 'a')
    expect(texts()).toEqual(['Aardvark', 'Cat', 'Kangaroo'])
    await type(input, 'DO')
    expect(texts()).toEqual(['Dog'])
    wrapper.unmount()
  })

  it('selects with the arrow keys and Enter, fills the input and closes', async () => {
    const { wrapper, input } = setup()
    await input.trigger('focus')
    await type(input, 'd')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    expect(input.attributes('aria-activedescendant')).toBe(options()[0]!.id)
    expect(options()[0]!.getAttribute('data-focused')).toBe('true')
    await input.trigger('keydown', { key: 'Enter' })
    await flush()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['aardvark'])
    expect(input.element.value).toBe('Aardvark')
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('clicking an option selects it; disabled options are skipped', async () => {
    const { wrapper, input } = setup()
    await input.trigger('focus')
    await flush()
    options()[3]!.click()
    await flush()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    options()[2]!.click()
    await flush()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['dog'])
    expect(input.element.value).toBe('Dog')
    wrapper.unmount()
  })

  it('with v-model, picking an option fills the input before blur', async () => {
    const { wrapper, input } = setup({
      'modelValue': 'cat',
      'onUpdate:modelValue': (value: ComboBoxValue) => wrapper.setProps({ modelValue: value }),
    })
    expect(input.element.value).toBe('Cat')
    await input.trigger('focus')
    await flush()
    options()[2]!.click()
    await flush()
    expect(wrapper.props('modelValue')).toBe('dog')
    expect(input.element.value).toBe('Dog')
    wrapper.unmount()
  })

  it('reverts unmatched text on Escape and blur; clearing the text clears the selection', async () => {
    const { wrapper, input } = setup({ defaultValue: 'cat' })
    expect(input.element.value).toBe('Cat')
    await input.trigger('focus')
    await type(input, 'Caz')
    await input.trigger('keydown', { key: 'Escape' })
    await flush()
    expect(input.element.value).toBe('Cat')

    await type(input, 'zzz')
    await input.trigger('blur')
    await flush()
    expect(input.element.value).toBe('Cat')

    await input.trigger('focus')
    await type(input, '')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    wrapper.unmount()
  })

  it('allowsCustomValue keeps typed text and submits it', async () => {
    const { wrapper, input } = setup({ allowsCustomValue: true, name: 'animal', defaultValue: 'cat' })
    expect(input.attributes('name')).toBe('animal')
    await input.trigger('focus')
    await type(input, 'Unicorn')
    await input.trigger('blur')
    await flush()
    expect(input.element.value).toBe('Unicorn')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    wrapper.unmount()
  })

  it('submits the key in a hidden input by default, the text with formValue="text"', async () => {
    const key = setup({ name: 'animal', defaultValue: 'cat' })
    expect(key.wrapper.get<HTMLInputElement>('input[type=hidden]').element.value).toBe('cat')
    expect(key.input.attributes('name')).toBeUndefined()
    key.wrapper.unmount()
    const text = setup({ name: 'animal', defaultValue: 'cat', formValue: 'text' })
    expect(text.wrapper.find('input[type=hidden]').exists()).toBe(false)
    expect(text.input.attributes('name')).toBe('animal')
    text.wrapper.unmount()
  })

  it('menuTrigger="manual" opens only from the trigger and the arrow keys', async () => {
    const { wrapper, input } = setup({ menuTrigger: 'manual' })
    await input.trigger('focus')
    await type(input, 'c')
    expect(input.attributes('aria-expanded')).toBe('false')
    await wrapper.get('[data-slot=combo-box-trigger]').trigger('pointerdown', { button: 0 })
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(texts()).toEqual(['Aardvark', 'Cat', 'Dog', 'Kangaroo'])
    wrapper.unmount()
  })

  it('multiple mode keeps the popover open, clears the text and lists the values', async () => {
    const { wrapper, input } = setup({ selectionMode: 'multiple', modelValue: ['dog'], valuePlaceholder: 'None' })
    expect(wrapper.get('[data-slot=combo-box-value]').text()).toBe('Dog')
    await input.trigger('focus')
    await type(input, 'aa')
    options()[0]!.click()
    await flush()
    const last = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as string[]
    expect([...last].sort()).toEqual(['aardvark', 'dog'])
    await wrapper.setProps({ modelValue: last })
    expect(input.element.value).toBe('')
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[data-slot=combo-box-value]').text()).toBe('Dog and Aardvark')
    wrapper.unmount()
  })

  it('disabled and readonly do not open', async () => {
    const disabled = setup({ disabled: true })
    expect(disabled.input.attributes('disabled')).toBeDefined()
    expect(disabled.wrapper.get('[data-slot=combo-box]').attributes('data-disabled')).toBe('true')
    disabled.wrapper.unmount()
    const readonly = setup({ readonly: true, defaultValue: 'cat' })
    await readonly.input.trigger('focus')
    await flush()
    expect(readonly.input.attributes('aria-expanded')).toBe('false')
    expect(readonly.input.attributes('readonly')).toBeDefined()
    readonly.wrapper.unmount()
  })

  it('validate receives the selection; invalid shows the error and hides the description', async () => {
    const { wrapper } = setup({
      defaultValue: 'cat',
      validationBehavior: 'aria',
      description: 'Pick one',
      validate: (v: { selectedKey: string | null }) => v.selectedKey === 'cat' ? 'No cats' : true,
    })
    await flush()
    expect(wrapper.get('[data-slot=combo-box]').attributes('data-invalid')).toBe('true')
    expect(wrapper.get('[data-slot=field-error]').text()).toBe('No cats')
    expect(wrapper.get('input[role=combobox]').attributes('aria-describedby')).toContain(wrapper.get('[data-slot=field-error]').attributes('id'))
    wrapper.unmount()
  })

  it('renders sections, separators, the #empty slot and a custom indicator', async () => {
    const sections = [
      { type: 'section', label: 'A', items: [{ value: 'a1', label: 'Apple' }] },
      { type: 'separator' },
      { type: 'section', label: 'B', items: [{ value: 'b1', label: 'Banana' }] },
    ]
    const { wrapper, input } = setup({ items: sections, allowsEmptyCollection: true }, {
      empty: () => 'Nothing',
      indicator: () => h('i', { class: 'custom' }),
    })
    expect(wrapper.find('[data-slot=combo-box-trigger] i.custom').exists()).toBe(true)
    await input.trigger('focus')
    await flush()
    expect([...document.querySelectorAll('[data-slot=header]')].map(e => e.textContent?.trim())).toEqual(['A', 'B'])
    expect(document.querySelectorAll('[data-slot=separator]').length).toBe(1)
    await type(input, 'ban')
    expect([...document.querySelectorAll('[data-slot=header]')].map(e => e.textContent?.trim())).toEqual(['B'])
    await type(input, 'xyz')
    expect(document.querySelector('[data-slot=empty-state]')?.textContent).toBe('Nothing')
    wrapper.unmount()
  })

  it('v-model:input-value and v-model:open are controllable', async () => {
    const { wrapper, input } = setup({ inputValue: 'ca', open: true })
    await flush()
    expect(input.element.value).toBe('ca')
    expect(input.attributes('aria-expanded')).toBe('true')
    await type(input, 'cat')
    expect(wrapper.emitted('update:inputValue')?.at(-1)).toEqual(['cat'])
    await wrapper.setProps({ open: false })
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  describe('behaviour parity (React Aria)', () => {
    const hidden = (wrapper: ReturnType<typeof setup>['wrapper']) => wrapper.get<HTMLInputElement>('input[type=hidden]').element.value
    const pointer = (el: Element, type: string, init: PointerEventInit = {}) =>
      el.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, button: 0, pointerType: 'mouse', ...init }))

    it('clearing the text of a selected item and tabbing away commits empty, not the first option', async () => {
      // behaviour-final-check H6 / C1
      const { wrapper, input } = setup({ name: 'animal', defaultValue: 'cat' })
      expect(hidden(wrapper)).toBe('cat')
      await input.trigger('focus')
      await flush()
      await type(input, '')
      await input.trigger('keydown', { key: 'Tab' })
      await input.trigger('blur')
      await flush()
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
      expect(hidden(wrapper)).toBe('')
      expect(input.element.value).toBe('')
      wrapper.unmount()
    })

    it('clearing the text of a selected item and pressing Enter commits empty, not the first option', async () => {
      // behaviour-final-check H6 / C1
      const { wrapper, input } = setup({ name: 'animal', defaultValue: 'cat' })
      await input.trigger('focus')
      await flush()
      await type(input, '')
      await input.trigger('keydown', { key: 'Enter' })
      await flush()
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
      expect(hidden(wrapper)).toBe('')
      expect(input.element.value).toBe('')
      wrapper.unmount()
    })

    it('keeps the filtered options in the popover while it animates out after committing a filtered search', async () => {
      // behaviour-final-check C2
      // happy-dom runs no CSS, so report an exit animation on the closed popover to keep it mounted like a browser does
      const realComputedStyle = window.getComputedStyle.bind(window)
      const spy = vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element, pseudo?: string | null) => {
        if (!el.matches('[data-slot=combo-box-popover]'))
          return realComputedStyle(el, pseudo)
        return {
          display: 'block',
          get animationName() {
            return el.getAttribute('data-state') === 'closed' ? 'exit' : 'none'
          },
        } as CSSStyleDeclaration
      })
      try {
        const { wrapper, input } = setup()
        await input.trigger('focus')
        await type(input, 'a')
        expect(texts()).toEqual(['Aardvark', 'Cat', 'Kangaroo'])
        await input.trigger('keydown', { key: 'ArrowDown' })
        await flush()
        await input.trigger('keydown', { key: 'Enter' })
        await flush()
        expect(input.element.value).toBe('Aardvark')
        expect(input.attributes('aria-expanded')).toBe('false')
        expect(document.querySelector('[data-slot=combo-box-popover]')?.getAttribute('data-state')).toBe('closed')
        expect(texts()).toEqual(['Aardvark', 'Cat', 'Kangaroo'])
        wrapper.unmount()
      }
      finally {
        spy.mockRestore()
      }
    })

    it('pressing one option, moving to another and releasing selects the option under the pointer', async () => {
      // behaviour-final-check C6
      const { wrapper, input } = setup()
      await input.trigger('focus')
      await flush()
      pointer(options()[0]!, 'pointerdown')
      pointer(options()[2]!, 'pointerup')
      await flush()
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['dog'])
      expect(input.element.value).toBe('Dog')
      expect(input.attributes('aria-expanded')).toBe('false')
      wrapper.unmount()
    })

    it('drops the virtual focus after a pointer pick in multiple mode, keeps it after a keyboard pick', async () => {
      // behaviour-final-check C5
      const { wrapper, input } = setup({ selectionMode: 'multiple' })
      await input.trigger('focus')
      await flush()
      pointer(options()[1]!, 'pointerdown')
      options()[1]!.click()
      await flush()
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['cat']])
      expect(input.attributes('aria-expanded')).toBe('true')
      expect(input.attributes('aria-activedescendant')).toBeUndefined()
      await input.trigger('keydown', { key: 'ArrowDown' })
      await flush()
      await input.trigger('keydown', { key: 'Enter' })
      await flush()
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['cat', 'aardvark']])
      expect(input.attributes('aria-activedescendant')).toBe(options()[0]!.id)
      wrapper.unmount()
    })
  })

  it('typing a second filter character does not re-render options whose props did not change', async () => {
    const updated: string[] = []
    const countOptionUpdates: ComponentOptions = {
      updated() {
        if (this.$el instanceof Element && this.$el.matches('[role=option]'))
          updated.push(this.$el.textContent!.trim())
      },
    }
    const wrapper = mount(ComboBox, { props: { items, label: 'Animal' }, attachTo: document.body, global: { mixins: [countOptionUpdates] } })
    const input = wrapper.get<HTMLInputElement>('input[role=combobox]')
    await input.trigger('focus')
    await type(input, 'a')
    updated.length = 0
    // Aardvark stays the first row; Kangaroo moves up a row (new props)
    await type(input, 'ar')
    expect(texts()).toEqual(['Aardvark', 'Kangaroo'])
    expect(updated).not.toContain('Aardvark')
    wrapper.unmount()
  })
})
