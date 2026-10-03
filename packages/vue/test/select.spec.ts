import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Select from '../src/components/select/Select.vue'

const items = [
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'emu', label: 'Emu', disabled: true },
  { value: 'eel', label: 'Eel' },
]
const trigger = '[data-slot=select-trigger]'
const value = '[data-slot=select-value]'
const flush = () => new Promise(r => setTimeout(r, 0))

afterEach(() => {
  document.body.innerHTML = ''
})

describe('Select', () => {
  it('shows the placeholder, then the selected label after picking an option, and closes', async () => {
    const wrapper = mount(Select, { props: { items, label: 'Pet', placeholder: 'Pick one' }, attachTo: document.body })
    expect(wrapper.get(value).text()).toBe('Pick one')
    expect(wrapper.get(value).attributes('data-placeholder')).toBe('true')

    await wrapper.get(trigger).trigger('click')
    await flush()
    const options = document.querySelectorAll<HTMLElement>('[role=option]')
    expect([...options].map(o => o.textContent?.trim())).toEqual(['Cat', 'Dog', 'Emu', 'Eel'])
    options[1]!.click()
    await flush()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['dog'])
    expect(wrapper.get(value).text()).toBe('Dog')
    expect(wrapper.get(value).attributes('data-placeholder')).toBeUndefined()
    expect(document.querySelector('[role=listbox]')).toBeNull()
    expect(wrapper.attributes('data-open')).toBeUndefined()
    wrapper.unmount()
  })

  it('focuses the selected option on open, else the first option', async () => {
    const selected = mount(Select, { props: { items, defaultValue: 'eel' }, attachTo: document.body })
    await selected.get(trigger).trigger('click')
    await flush()
    await flush()
    expect(document.activeElement?.textContent?.trim()).toBe('Eel')
    selected.unmount()

    const empty = mount(Select, { props: { items }, attachTo: document.body })
    await empty.get(trigger).trigger('click')
    await flush()
    await flush()
    expect(document.activeElement?.textContent?.trim()).toBe('Cat')
    empty.unmount()
  })

  it('multiple mode keeps the popover open and lists labels in collection order', async () => {
    const wrapper = mount(Select, { props: { items, selectionMode: 'multiple', modelValue: ['eel'] }, attachTo: document.body })
    await wrapper.get(trigger).trigger('click')
    await flush()
    document.querySelectorAll<HTMLElement>('[role=option]')[0]!.click()
    await flush()
    const last = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as string[]
    expect([...last].sort()).toEqual(['cat', 'eel'])
    await wrapper.setProps({ modelValue: last })
    expect(wrapper.get(value).text()).toBe('Cat and Eel')
    expect(document.querySelector('[role=listbox]')).not.toBeNull()
    wrapper.unmount()
  })

  it('clear button and Backspace reset the selection and emit clear', async () => {
    const wrapper = mount(Select, { props: { items, clearable: true, defaultValue: 'cat' }, attachTo: document.body })
    const clear = wrapper.get('[data-slot=select-clear-button]')
    expect(clear.attributes('data-empty')).toBeUndefined()
    await clear.trigger('click')
    expect(wrapper.get(value).attributes('data-placeholder')).toBe('true')
    expect(clear.attributes('data-empty')).toBe('true')
    expect(document.querySelector('[role=listbox]')).toBeNull()

    await wrapper.setProps({ modelValue: 'dog' })
    await wrapper.get(trigger).trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('clear')).toHaveLength(2)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    wrapper.unmount()
  })

  it('typeahead on the closed trigger skips disabled options', async () => {
    const wrapper = mount(Select, { props: { items }, attachTo: document.body })
    await wrapper.get(trigger).trigger('keydown', { key: 'e' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['eel'])
    wrapper.unmount()
  })

  it('typeahead on the closed trigger searches from the selected option inclusive, so a repeated character stays', async () => {
    // behaviour-final-check S8 (RAC useTypeSelect + ListKeyboardDelegate.getKeyForSearch)
    const wrapper = mount(Select, { props: { items: [...items, { value: 'cow', label: 'Cow' }] }, attachTo: document.body })
    await wrapper.get(trigger).trigger('keydown', { key: 'c' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['cat'])
    await new Promise(r => setTimeout(r, 1100))
    await wrapper.get(trigger).trigger('keydown', { key: 'c' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['cat'])
    await wrapper.get(trigger).trigger('keydown', { key: 'o' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['cow'])
    wrapper.unmount()
  })

  it('submits the selection through the hidden select and blocks required forms natively', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    const wrapper = mount(Select, { props: { items, name: 'pet', required: true, label: 'Pet' }, attachTo: form })
    expect(form.checkValidity()).toBe(false)
    await wrapper.setProps({ modelValue: 'dog' })
    await nextTick()
    expect(new FormData(form).get('pet')).toBe('dog')
    expect(form.checkValidity()).toBe(true)
    wrapper.unmount()
  })

  it('wires label, description and error ids onto the trigger', async () => {
    const wrapper = mount(Select, {
      props: { items, id: 's', label: 'Pet', description: 'Help', invalid: true, errorMessage: 'Bad' },
      attachTo: document.body,
    })
    const btn = wrapper.get(trigger)
    expect(btn.attributes('aria-labelledby')).toBe('s-label s-value')
    expect(btn.attributes('aria-describedby')).toBe('s-description s-error')
    expect(btn.attributes('aria-invalid')).toBe('true')
    expect(wrapper.attributes('data-invalid')).toBe('true')
    expect(wrapper.get('[data-slot=field-error]').text()).toBe('Bad')
    wrapper.unmount()
  })

  it('disabled trigger does not open', async () => {
    const wrapper = mount(Select, { props: { items, disabled: true }, attachTo: document.body })
    await wrapper.get(trigger).trigger('click')
    await wrapper.get(trigger).trigger('keydown', { key: 'ArrowDown' })
    await flush()
    expect(document.querySelector('[role=listbox]')).toBeNull()
    expect(wrapper.emitted('update:open')).toBeUndefined()
    wrapper.unmount()
  })

  describe('behaviour parity (React Aria)', () => {
    const fruits = [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
      { value: 'tomato', label: 'Tomato' },
    ]
    const optionEls = () => [...document.querySelectorAll<HTMLElement>('[role=option]')]
    const focusedText = () => document.activeElement?.textContent?.trim()
    const pointer = (el: Element, type: string, init: PointerEventInit = {}) =>
      el.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, button: 0, pointerType: 'mouse', ...init }))
    async function press(k: string) {
      document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
      await flush()
    }
    async function openByClick(props: Record<string, unknown>) {
      const wrapper = mount(Select, { props: { items, ...props }, attachTo: document.body })
      await wrapper.get(trigger).trigger('click')
      await flush()
      await flush()
      return wrapper
    }

    it('returns focus to the trigger after an outside pointerdown closes the popover', async () => {
      // behaviour-final-check S1
      const wrapper = await openByClick({})
      expect(document.querySelector('[role=listbox]')).not.toBeNull()
      pointer(document.body, 'pointerdown')
      pointer(document.body, 'pointerup')
      document.body.click()
      await flush()
      await flush()
      expect(document.querySelector('[role=listbox]')).toBeNull()
      expect(document.activeElement?.getAttribute('data-slot')).toBe('select-trigger')
      wrapper.unmount()
    })

    it('leaves focus on a focusable element that an outside press moved it to', async () => {
      // behaviour-final-check S1 (RAC FocusScope only restores focus that is lost or still inside)
      const wrapper = await openByClick({})
      const other = document.createElement('input')
      document.body.appendChild(other)
      pointer(other, 'pointerdown')
      other.focus()
      await flush()
      await flush()
      expect(document.querySelector('[role=listbox]')).toBeNull()
      expect(document.activeElement).toBe(other)
      wrapper.unmount()
    })

    it('ArrowUp opens on the selected option when there is one', async () => {
      // behaviour-final-check S2
      const wrapper = mount(Select, { props: { items, defaultValue: 'dog' }, attachTo: document.body })
      wrapper.get<HTMLElement>(trigger).element.focus()
      await wrapper.get(trigger).trigger('keydown', { key: 'ArrowUp' })
      await flush()
      await flush()
      expect(focusedText()).toBe('Dog')
      wrapper.unmount()
    })

    it('a second mouse press on the trigger closes the popover', async () => {
      // behaviour-final-check S7
      const wrapper = mount(Select, { props: { items }, attachTo: document.body })
      const el = wrapper.get(trigger).element
      for (let i = 0; i < 2; i++) {
        pointer(el, 'pointerdown')
        pointer(el, 'pointerup')
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }))
        await flush()
        await flush()
        expect(wrapper.get(trigger).attributes('aria-expanded')).toBe(i === 0 ? 'true' : 'false')
      }
      wrapper.unmount()
    })

    it('ArrowUp on the closed trigger opens with the last enabled option focused', async () => {
      // behaviour-final-check S2
      const wrapper = mount(Select, { props: { items }, attachTo: document.body })
      wrapper.get<HTMLElement>(trigger).element.focus()
      await wrapper.get(trigger).trigger('keydown', { key: 'ArrowUp' })
      await flush()
      await flush()
      expect(document.querySelector('[role=listbox]')).not.toBeNull()
      expect(focusedText()).toBe('Eel')
      wrapper.unmount()
    })

    it('hovering an option makes it the keyboard-focused option, so ArrowDown continues from it', async () => {
      // behaviour-final-check S3
      const wrapper = await openByClick({ items: fruits })
      expect(focusedText()).toBe('Apple')
      pointer(optionEls()[1]!, 'pointermove')
      await flush()
      expect(focusedText()).toBe('Banana')
      await press('ArrowDown')
      expect(focusedText()).toBe('Cherry')
      wrapper.unmount()
    })

    it('PageDown moves to the last option and PageUp back to the first in a short list', async () => {
      // behaviour-final-check S4
      const wrapper = await openByClick({ items: fruits })
      expect(focusedText()).toBe('Apple')
      await press('PageDown')
      expect(focusedText()).toBe('Tomato')
      await press('PageUp')
      expect(focusedText()).toBe('Apple')
      wrapper.unmount()
    })

    it('typeahead works straight after arrow keys and ignores non-printable keys', async () => {
      // behaviour-final-check S5
      const wrapper = await openByClick({ items: fruits })
      await press('ArrowDown')
      await press('ArrowDown')
      expect(focusedText()).toBe('Cherry')
      await press('t')
      expect(focusedText()).toBe('Tomato')
      wrapper.unmount()
    })

    it('Space continues a non-empty typeahead string instead of selecting and closing', async () => {
      // behaviour-final-check S6
      const numbered = [
        { value: 1, label: 'Option 1' },
        { value: 2, label: 'Option 2' },
        { value: 3, label: 'Option 3' },
      ]
      const wrapper = await openByClick({ items: numbered })
      for (const k of ['o', 'p', 't', 'i', 'o', 'n', ' ', '2'])
        await press(k)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(document.querySelector('[role=listbox]')).not.toBeNull()
      expect(focusedText()).toBe('Option 2')
      wrapper.unmount()
    })

    it('a mouse pointerdown on the trigger opens the popover before the click', async () => {
      // behaviour-final-check S7
      const wrapper = mount(Select, { props: { items }, attachTo: document.body })
      pointer(wrapper.get(trigger).element, 'pointerdown')
      await flush()
      expect(document.querySelector('[role=listbox]')).not.toBeNull()
      expect(wrapper.get(trigger).attributes('aria-expanded')).toBe('true')
      wrapper.unmount()
    })

    it('press on the trigger, drag onto an option and release selects that option', async () => {
      // behaviour-final-check S7
      const wrapper = mount(Select, { props: { items }, attachTo: document.body })
      const el = wrapper.get(trigger).element
      pointer(el, 'pointerdown')
      await flush()
      await flush()
      expect(optionEls()).toHaveLength(4)
      const dog = optionEls().find(o => o.textContent?.trim() === 'Dog')
      expect(dog).toBeDefined()
      pointer(dog!, 'pointerup')
      await flush()
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['dog'])
      expect(document.querySelector('[role=listbox]')).toBeNull()
      wrapper.unmount()
    })
  })
})
