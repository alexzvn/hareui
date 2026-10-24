import type { ComponentMountingOptions } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ComponentOptions } from 'vue'
import { h, nextTick } from 'vue'

import type { ComboBoxValidationValue, ComboBoxValue } from '@/components/combo-box/ComboBox.types'
import ComboBox from '@/components/combo-box/ComboBox.vue'
import type { ListBoxEntry } from '@/components/list-box/ListBox.types'

import { expectAccessible } from './a11y'

const items = [
  { value: 'aardvark', label: 'Aardvark' },
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'kangaroo', label: 'Kangaroo', disabled: true },
]

const flush = async () => {
  for (let i = 0; i < 4; i++) {
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
  }
}

const options = () => [...document.querySelectorAll<HTMLElement>('[role=option]')]
const texts = () => options().map((o) => o.textContent?.trim())

afterEach(() => {
  document.body.innerHTML = ''
})

const setup = (
  props: ComponentMountingOptions<typeof ComboBox>['props'] = {},
  slots?: ComponentMountingOptions<typeof ComboBox>['slots'],
) => {
  const wrapper = mount(ComboBox, {
    props: { items, label: 'Animal', ...props },
    slots,
    attachTo: document.body,
  })

  const input = wrapper.get<HTMLInputElement>('input[role=combobox]')

  return { wrapper, input }
}

const type = async (input: ReturnType<typeof setup>['input'], text: string) => {
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
      modelValue: 'cat',
      'onUpdate:modelValue': (value: ComboBoxValue | undefined) =>
        wrapper.setProps({ modelValue: value }),
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
    const { wrapper, input } = setup({
      allowsCustomValue: true,
      name: 'animal',
      defaultValue: 'cat',
    })

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
    const { wrapper, input } = setup({
      selectionMode: 'multiple',
      modelValue: ['dog'],
      valuePlaceholder: 'None',
    })

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
      validate: (v: ComboBoxValidationValue) => (v.selectedKey === 'cat' ? 'No cats' : true),
    })

    await flush()
    expect(wrapper.get('[data-slot=combo-box]').attributes('data-invalid')).toBe('true')
    expect(wrapper.get('[data-slot=field-error]').text()).toBe('No cats')

    expect(wrapper.get('input[role=combobox]').attributes('aria-describedby')).toContain(
      wrapper.get('[data-slot=field-error]').attributes('id'),
    )

    wrapper.unmount()
  })

  it('renders sections, separators, the #empty slot and a custom indicator', async () => {
    const sections: ListBoxEntry[] = [
      { type: 'section', label: 'A', items: [{ value: 'a1', label: 'Apple' }] },
      { type: 'separator' },
      { type: 'section', label: 'B', items: [{ value: 'b1', label: 'Banana' }] },
    ]

    const { wrapper, input } = setup(
      { items: sections, allowsEmptyCollection: true },
      {
        empty: () => 'Nothing',
        indicator: () => h('i', { class: 'custom' }),
      },
    )

    expect(wrapper.find('[data-slot=combo-box-trigger] i.custom').exists()).toBe(true)
    await input.trigger('focus')
    await flush()

    expect(
      [...document.querySelectorAll('[data-slot=header]')].map((e) => e.textContent?.trim()),
    ).toEqual(['A', 'B'])

    expect(document.querySelectorAll('[data-slot=separator]').length).toBe(1)
    await type(input, 'ban')

    expect(
      [...document.querySelectorAll('[data-slot=header]')].map((e) => e.textContent?.trim()),
    ).toEqual(['B'])

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
    const hidden = (wrapper: ReturnType<typeof setup>['wrapper']) =>
      wrapper.get<HTMLInputElement>('input[type=hidden]').element.value

    const pointer = (el: Element, type: string, init: PointerEventInit = {}) =>
      el.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerType: 'mouse',
          ...init,
        }),
      )

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
      const spy = vi
        .spyOn(window, 'getComputedStyle')
        .mockImplementation((el: Element, pseudo?: string | null) => {
          if (!el.matches('[data-slot=combo-box-popover]')) return realComputedStyle(el, pseudo)

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

        expect(
          document.querySelector('[data-slot=combo-box-popover]')?.getAttribute('data-state'),
        ).toBe('closed')

        expect(texts()).toEqual(['Aardvark', 'Cat', 'Kangaroo'])
        wrapper.unmount()
      } finally {
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

    const wrapper = mount(ComboBox, {
      props: { items, label: 'Animal' },
      attachTo: document.body,
      global: { mixins: [countOptionUpdates] },
    })

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

  describe('accessibility', () => {
    /** The text an `aria-labelledby` / `aria-describedby` list points at; fails on dangling ids. */
    const refText = (ids: string | null | undefined) =>
      (ids ?? '')
        .split(' ')
        .filter(Boolean)
        .map((id) => {
          const el = document.getElementById(id)
          expect(el, `#${id} exists`).not.toBeNull()

          return el!.getAttribute('aria-label') ?? el!.textContent!.trim()
        })
        .join(' ')

    const listbox = () => document.querySelector<HTMLElement>('[role=listbox]')

    it('has no axe violations closed, with a description, disabled and read-only', async () => {
      for (const props of [
        {},
        { description: 'Pick one', placeholder: 'Search animals' },
        { disabled: true },
        { readonly: true, defaultValue: 'cat' },
      ]) {
        const { wrapper } = setup(props)
        await flush()
        await expectAccessible()
        wrapper.unmount()
      }
    })

    it('has no axe violations open, with a highlighted, a selected and a disabled option', async () => {
      const { wrapper, input } = setup({ defaultValue: 'cat' })
      await input.trigger('focus')
      await flush()
      await input.trigger('keydown', { key: 'ArrowDown' })
      await flush()
      expect(input.attributes('aria-activedescendant')).toBeDefined()
      await expectAccessible()
      wrapper.unmount()
    })

    it('has no axe violations open in multiple mode and with the empty state', async () => {
      const multi = setup({ selectionMode: 'multiple', defaultValue: ['dog'] })
      await multi.input.trigger('focus')
      await flush()
      await expectAccessible()
      multi.wrapper.unmount()

      const empty = setup({ allowsEmptyCollection: true }, { empty: () => 'No results' })
      await empty.input.trigger('focus')
      await type(empty.input, 'xyz')
      expect(document.querySelector('[data-slot=empty-state]')).not.toBeNull()
      await expectAccessible()
      empty.wrapper.unmount()
    })

    it('has no axe violations open with sections and separators', async () => {
      const sections: ListBoxEntry[] = [
        { type: 'section', label: 'A', items: [{ value: 'a1', label: 'Apple' }] },
        { type: 'separator' },
        { type: 'section', label: 'B', items: [{ value: 'b1', label: 'Banana' }] },
      ]

      const { wrapper, input } = setup({ items: sections })
      try {
        await input.trigger('focus')
        await flush()

        // Each section is a group named by its header
        const groups = [...document.querySelectorAll('[role=listbox] > [role=group]')]
        expect(groups.map((g) => refText(g.getAttribute('aria-labelledby')))).toEqual(['A', 'B'])
        await expectAccessible()
      } finally {
        wrapper.unmount()
      }
    })

    it('has no axe violations when invalid with an error message', async () => {
      const { wrapper, input } = setup({
        invalid: true,
        errorMessage: 'Pick an animal',
        description: 'Required',
      })

      await flush()
      expect(input.attributes('aria-invalid')).toBe('true')
      await expectAccessible()
      wrapper.unmount()
    })

    it('names the input, the trigger and the listbox from the label', async () => {
      const { wrapper, input } = setup({ description: 'Pick one' })
      expect(refText(input.attributes('aria-labelledby'))).toBe('Animal')

      expect(
        document.querySelector(`label[for="${input.attributes('id')}"]`)?.textContent?.trim(),
      ).toBe('Animal')

      expect(refText(input.attributes('aria-describedby'))).toBe('Pick one')
      const trigger = wrapper.get('[data-slot=combo-box-trigger]')
      expect(refText(trigger.attributes('aria-labelledby'))).toBe('Show suggestions Animal')
      await input.trigger('focus')
      await flush()
      expect(refText(listbox()!.getAttribute('aria-labelledby'))).toBe('Suggestions Animal')
      wrapper.unmount()
    })

    it('an aria-label names the input when there is no visible label', async () => {
      const wrapper = mount(ComboBox, {
        props: { items },
        attrs: { 'aria-label': 'Animal' },
        attachTo: document.body,
      })

      const input = wrapper.get('input[role=combobox]')
      expect(input.attributes('aria-label')).toBe('Animal')
      expect(input.attributes('aria-labelledby')).toBeUndefined()
      await expectAccessible()
      wrapper.unmount()
    })

    it('aria-expanded / aria-controls follow the popup on the input and the trigger', async () => {
      const { wrapper, input } = setup()
      const trigger = wrapper.get('[data-slot=combo-box-trigger]')
      expect(input.attributes('aria-expanded')).toBe('false')
      expect(input.attributes('aria-controls')).toBeUndefined()
      expect(trigger.attributes('aria-haspopup')).toBe('listbox')
      await input.trigger('focus')
      await flush()
      expect(input.attributes('aria-expanded')).toBe('true')
      expect(trigger.attributes('aria-expanded')).toBe('true')
      expect(input.attributes('aria-controls')).toBe(listbox()!.id)
      expect(trigger.attributes('aria-controls')).toBe(listbox()!.id)
      wrapper.unmount()
    })

    it('options expose aria-selected; multiple mode is aria-multiselectable', async () => {
      const single = setup({ defaultValue: 'cat' })
      await single.input.trigger('focus')
      await flush()

      expect(options().map((o) => o.getAttribute('aria-selected'))).toEqual([
        'false',
        'true',
        'false',
        'false',
      ])

      expect(listbox()!.hasAttribute('aria-multiselectable')).toBe(false)
      single.wrapper.unmount()

      const multi = setup({ selectionMode: 'multiple', defaultValue: ['aardvark', 'dog'] })
      await multi.input.trigger('focus')
      await flush()
      expect(listbox()!.getAttribute('aria-multiselectable')).toBe('true')

      expect(options().map((o) => o.getAttribute('aria-selected'))).toEqual([
        'true',
        'false',
        'true',
        'false',
      ])

      expect(refText(multi.input.attributes('aria-describedby'))).toBe('Aardvark and Dog')
      multi.wrapper.unmount()
    })

    it('a disabled option is exposed with aria-disabled', async () => {
      const { wrapper, input } = setup()
      try {
        await input.trigger('focus')
        await flush()
        expect(options()[3]!.getAttribute('aria-disabled')).toBe('true')

        expect(
          options()
            .slice(0, 3)
            .map((o) => o.getAttribute('aria-disabled')),
        ).toEqual([null, null, null])
      } finally {
        wrapper.unmount()
      }
    })

    it('ArrowDown on a closed field opens it on the first option, ArrowUp on the last enabled one', async () => {
      const down = setup({ menuTrigger: 'manual' })
      await down.input.trigger('focus')
      await down.input.trigger('keydown', { key: 'ArrowDown' })
      await flush()
      expect(down.input.attributes('aria-expanded')).toBe('true')
      expect(down.input.attributes('aria-activedescendant')).toBe(options()[0]!.id)
      down.wrapper.unmount()

      const up = setup({ menuTrigger: 'manual' })
      await up.input.trigger('focus')
      await up.input.trigger('keydown', { key: 'ArrowUp' })
      await flush()

      // Kangaroo (last) is disabled
      expect(up.input.attributes('aria-activedescendant')).toBe(options()[2]!.id)
      up.wrapper.unmount()
    })

    it('Home / End move to the first / last enabled option and the arrows stop at the ends', async () => {
      const { wrapper, input } = setup()
      await input.trigger('focus')
      await flush()
      const active = () => input.attributes('aria-activedescendant')
      await input.trigger('keydown', { key: 'End' })
      await flush()
      expect(active()).toBe(options()[2]!.id)
      await input.trigger('keydown', { key: 'ArrowDown' })
      await flush()
      expect(active()).toBe(options()[2]!.id)
      await input.trigger('keydown', { key: 'Home' })
      await flush()
      expect(active()).toBe(options()[0]!.id)
      await input.trigger('keydown', { key: 'ArrowUp' })
      await flush()
      expect(active()).toBe(options()[0]!.id)
      wrapper.unmount()
    })

    it('Escape closes the listbox and keeps focus in the input', async () => {
      const { wrapper, input } = setup()
      input.element.focus()
      await flush()
      expect(input.attributes('aria-expanded')).toBe('true')
      await input.trigger('keydown', { key: 'Escape' })
      await flush()
      expect(input.attributes('aria-expanded')).toBe('false')
      expect(input.attributes('aria-activedescendant')).toBeUndefined()
      expect(document.activeElement).toBe(input.element)
      wrapper.unmount()
    })

    it('focus stays in the input while options are highlighted and after the trigger toggles the popup', async () => {
      const { wrapper, input } = setup({ menuTrigger: 'manual' })
      const trigger = wrapper.get<HTMLButtonElement>('[data-slot=combo-box-trigger]')

      // The trigger is a pointer affordance: Tab goes to the input only
      expect(trigger.attributes('tabindex')).toBe('-1')
      trigger.element.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }))
      await flush()
      expect(document.activeElement).toBe(input.element)
      expect(input.attributes('aria-expanded')).toBe('true')
      expect(input.attributes('aria-activedescendant')).toBe(options()[0]!.id)
      await input.trigger('keydown', { key: 'ArrowDown' })
      await flush()
      expect(document.activeElement).toBe(input.element)
      expect(options().some((o) => o.contains(document.activeElement))).toBe(false)
      wrapper.unmount()
    })

    it('a disabled field is out of the tab order and its trigger is disabled', async () => {
      const { wrapper, input } = setup({ disabled: true })
      expect((input.element as HTMLInputElement).disabled).toBe(true)

      expect(wrapper.get<HTMLButtonElement>('[data-slot=combo-box-trigger]').element.disabled).toBe(
        true,
      )

      wrapper.unmount()
    })
  })
})
