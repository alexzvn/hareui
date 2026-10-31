import type { ComponentMountingOptions } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'

import Autocomplete from '@/components/autocomplete/Autocomplete.vue'
import Checkbox from '@/components/checkbox/Checkbox.vue'
import ComboBox from '@/components/combo-box/ComboBox.vue'
import DropZone from '@/components/drop-zone/DropZone.vue'
import InputOtp from '@/components/input-otp/InputOtp.vue'
import NumberField from '@/components/number-field/NumberField.vue'
import Select from '@/components/select/Select.vue'
import Switch from '@/components/switch/Switch.vue'
import TextField from '@/components/text-field/TextField.vue'

const items = [
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'eel', label: 'Eel' },
]

const flush = async () => {
  for (let i = 0; i < 5; i++) {
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
  }
}

const options = () => [...document.querySelectorAll<HTMLElement>('[role=option]')]
const searchInput = () => document.querySelector<HTMLInputElement>('[data-slot=search-field-input]')

const key = async (el: Element, k: string) => {
  el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
  await flush()
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('Select events', () => {
  const setup = (props: ComponentMountingOptions<typeof Select>['props'] = {}) => {
    const wrapper = mount(Select, {
      props: { items, label: 'Pet', ...props },
      attachTo: document.body,
    })

    return { wrapper, trigger: wrapper.get<HTMLElement>('[data-slot=select-trigger]') }
  }

  it('emits focus when the trigger gains focus', async () => {
    const { wrapper, trigger } = setup()
    trigger.element.focus()
    await nextTick()
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('focus')![0]![0]).toBeInstanceOf(FocusEvent)
    wrapper.unmount()
  })

  it('emits blur when focus leaves the field', async () => {
    const { wrapper, trigger } = setup()
    trigger.element.focus()
    trigger.element.blur()
    await flush()
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(wrapper.emitted('blur')![0]![0]).toBeInstanceOf(FocusEvent)
    wrapper.unmount()
  })

  it('emits focus and blur with the trigger’s own focus / blur events', async () => {
    const { wrapper, trigger } = setup()
    trigger.element.focus()
    trigger.element.blur()
    await flush()
    const focus = wrapper.emitted<[FocusEvent]>('focus')![0]![0]
    const blur = wrapper.emitted<[FocusEvent]>('blur')![0]![0]
    expect(focus.type).toBe('focus')
    expect(focus.target).toBe(trigger.element)
    expect(blur.type).toBe('blur')
    expect(blur.target).toBe(trigger.element)
    wrapper.unmount()
  })

  it('opening the list and picking an option emits no blur until focus leaves the field', async () => {
    const { wrapper, trigger } = setup()
    trigger.element.focus()
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    await key(document.activeElement!, 'ArrowDown')
    await key(document.activeElement!, ' ')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['dog'])
    expect(document.activeElement).toBe(trigger.element)
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toBeUndefined()

    trigger.element.blur()
    await flush()
    expect(wrapper.emitted('blur')).toHaveLength(1)
    wrapper.unmount()
  })

  it('emits change once when an option is picked', async () => {
    const { wrapper, trigger } = setup()
    await trigger.trigger('click')
    await flush()
    options()[1]!.click()
    await flush()
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')![0]![0]).toBeInstanceOf(Event)
    wrapper.unmount()
  })

  it('emits change when typeahead selects on the closed trigger', async () => {
    const { wrapper, trigger } = setup()
    await trigger.trigger('keydown', { key: 'e' })
    expect(wrapper.emitted('change')).toHaveLength(1)
    wrapper.unmount()
  })

  it('does not emit change for a v-model write', async () => {
    const { wrapper } = setup({ modelValue: 'cat' })
    await wrapper.setProps({ modelValue: 'dog' })
    expect(wrapper.emitted('change')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('ComboBox events', () => {
  const setup = () => {
    const wrapper = mount(ComboBox, {
      props: { items, label: 'Animal' },
      attachTo: document.body,
    })

    return { wrapper, input: wrapper.get<HTMLInputElement>('input[role=combobox]') }
  }

  it('emits focus when the input gains focus', async () => {
    const { wrapper, input } = setup()
    input.element.focus()
    await flush()
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('focus')![0]![0]).toBeInstanceOf(FocusEvent)
    wrapper.unmount()
  })

  it('emits blur when focus leaves the input', async () => {
    const { wrapper, input } = setup()
    input.element.focus()
    await flush()
    input.element.blur()
    await flush()
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(wrapper.emitted('blur')![0]![0]).toBeInstanceOf(FocusEvent)
    wrapper.unmount()
  })

  it('emits blur a task after focus leaves the input, like Select', async () => {
    const { wrapper, input } = setup()
    input.element.focus()
    await flush()
    input.element.blur()
    expect(wrapper.emitted('blur')).toBeUndefined()
    await flush()
    expect(wrapper.emitted('blur')).toHaveLength(1)
    wrapper.unmount()
  })

  it('emits focus and blur with the input’s own focus / blur events', async () => {
    const { wrapper, input } = setup()
    input.element.focus()
    input.element.blur()
    await flush()
    const focus = wrapper.emitted<[FocusEvent]>('focus')![0]![0]
    const blur = wrapper.emitted<[FocusEvent]>('blur')![0]![0]
    expect(focus.type).toBe('focus')
    expect(focus.target).toBe(input.element)
    expect(blur.type).toBe('blur')
    expect(blur.target).toBe(input.element)
    wrapper.unmount()
  })

  it('emits highlight with the option element and value on arrow-key navigation', async () => {
    const { wrapper, input } = setup()
    input.element.focus()
    await flush()
    await input.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    const payload = wrapper.emitted('highlight')?.at(-1)?.[0]
    expect(payload).toEqual({ ref: options()[0], value: 'cat' })
    wrapper.unmount()
  })

  it('emits highlight undefined once as Escape closes the popover, then nothing', async () => {
    const { wrapper, input } = setup()
    input.element.focus()
    await flush()
    await input.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    const countBeforeEscape = wrapper.emitted('highlight')!.length
    await input.trigger('keydown', { key: 'Escape' })
    await flush()
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(wrapper.emitted('highlight')!.slice(countBeforeEscape)).toEqual([[undefined]])
    wrapper.unmount()
  })

  it('emits highlight undefined once as an Enter pick closes the popover, then nothing', async () => {
    const { wrapper, input } = setup()
    input.element.focus()
    await flush()
    await input.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    const countBeforePick = wrapper.emitted('highlight')!.length
    await input.trigger('keydown', { key: 'Enter' })
    await flush()
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(wrapper.emitted('highlight')!.slice(countBeforePick)).toEqual([[undefined]])
    wrapper.unmount()
  })

  it('does not emit change while highlighting', async () => {
    const { wrapper, input } = setup()
    input.element.focus()
    await flush()
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    expect(wrapper.emitted('change')).toBeUndefined()
    wrapper.unmount()
  })

  it('emits change once when an option is picked with Enter', async () => {
    const { wrapper, input } = setup()
    input.element.focus()
    await flush()
    await input.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    await input.trigger('keydown', { key: 'Enter' })
    await flush()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['cat'])
    expect(wrapper.emitted('change')).toHaveLength(1)
    wrapper.unmount()
  })

  it('emits change once when custom text is committed with nothing selected', async () => {
    const wrapper = mount(ComboBox, {
      props: { items, label: 'Animal', allowsCustomValue: true },
      attachTo: document.body,
    })

    const input = wrapper.get<HTMLInputElement>('input[role=combobox]')
    input.element.focus()
    await flush()
    await input.setValue('Ferret')
    input.element.blur()
    await flush()
    expect(input.element.value).toBe('Ferret')
    expect(wrapper.emitted('change')).toHaveLength(1)
    wrapper.unmount()
  })

  it('does not emit change when the same custom text is committed again', async () => {
    const wrapper = mount(ComboBox, {
      props: { items, label: 'Animal', allowsCustomValue: true },
      attachTo: document.body,
    })

    const input = wrapper.get<HTMLInputElement>('input[role=combobox]')
    input.element.focus()
    await input.setValue('Ferret')
    input.element.blur()
    await flush()
    input.element.focus()
    input.element.blur()
    await flush()
    expect(wrapper.emitted('change')).toHaveLength(1)
    wrapper.unmount()
  })
})

describe('Autocomplete events', () => {
  const setup = () => {
    const wrapper = mount(Autocomplete, {
      props: { items, label: 'Pet' },
      attachTo: document.body,
    })

    return { wrapper, button: wrapper.get<HTMLButtonElement>('button[aria-haspopup=listbox]') }
  }

  it('emits focus when the trigger button gains focus', async () => {
    const { wrapper, button } = setup()
    button.element.focus()
    await nextTick()
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('focus')![0]![0]).toBeInstanceOf(FocusEvent)
    wrapper.unmount()
  })

  it('emits blur when focus leaves the field', async () => {
    const { wrapper, button } = setup()
    button.element.focus()
    button.element.blur()
    await flush()
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(wrapper.emitted('blur')![0]![0]).toBeInstanceOf(FocusEvent)
    wrapper.unmount()
  })

  it('emits focus and blur with the trigger button’s own focus / blur events', async () => {
    const { wrapper, button } = setup()
    button.element.focus()
    button.element.blur()
    await flush()
    const focus = wrapper.emitted<[FocusEvent]>('focus')![0]![0]
    const blur = wrapper.emitted<[FocusEvent]>('blur')![0]![0]
    expect(focus.type).toBe('focus')
    expect(focus.target).toBe(button.element)
    expect(blur.type).toBe('blur')
    expect(blur.target).toBe(button.element)
    wrapper.unmount()
  })

  it('opening the popover and picking an option emits no blur until focus leaves the field', async () => {
    const { wrapper, button } = setup()
    button.element.focus()
    await key(button.element, 'Enter')
    expect(document.activeElement).toBe(searchInput())
    await key(searchInput()!, 'ArrowDown')
    await key(searchInput()!, 'Enter')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['dog'])
    expect(document.activeElement).toBe(button.element)
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toBeUndefined()

    button.element.blur()
    await flush()
    expect(wrapper.emitted('blur')).toHaveLength(1)
    wrapper.unmount()
  })

  it('emits highlight with the option element and value on arrow-key navigation', async () => {
    const { wrapper } = setup()

    // A keyboard-style click (detail 0) opens on the first option
    await wrapper.get('[data-slot=autocomplete-trigger]').trigger('click')
    await flush()
    await key(searchInput()!, 'ArrowDown')
    const payload = wrapper.emitted('highlight')?.at(-1)?.[0]
    expect(payload).toEqual({ ref: options()[1], value: 'dog' })
    wrapper.unmount()
  })

  it('emits change once on Enter, not while highlighting', async () => {
    const { wrapper } = setup()
    await wrapper.get('[data-slot=autocomplete-trigger]').trigger('click')
    await flush()
    await key(searchInput()!, 'ArrowDown')
    expect(wrapper.emitted('change')).toBeUndefined()
    await key(searchInput()!, 'Enter')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['dog'])
    expect(wrapper.emitted('change')).toHaveLength(1)
    wrapper.unmount()
  })
})

describe('NumberField focus listeners', () => {
  it('calls @focus and @blur when the input gains and loses focus', async () => {
    const onFocus = vi.fn<(event: FocusEvent) => void>()
    const onBlur = vi.fn<(event: FocusEvent) => void>()
    const wrapper = mount(NumberField, {
      props: { label: 'Width' },
      attrs: { onFocus, onBlur },
      attachTo: document.body,
    })

    const input = wrapper.get<HTMLInputElement>('[data-slot=number-field-input]').element
    input.focus()
    input.blur()
    await nextTick()
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })
})

describe('TextField focus listeners', () => {
  it('calls @focus.once on the input only once', () => {
    const onFocusOnce = vi.fn<(event: FocusEvent) => void>()
    const wrapper = mount(TextField, {
      props: { label: 'Name' },
      attrs: { onFocusOnce },
      attachTo: document.body,
    })

    const input = wrapper.get<HTMLInputElement>('input').element
    input.focus()
    input.blur()
    input.focus()
    expect(onFocusOnce).toHaveBeenCalledTimes(1)
    expect(onFocusOnce.mock.calls[0]![0].target).toBe(input)
    wrapper.unmount()
  })
})

describe('InputOtp focus listeners', () => {
  it('calls @focus and @blur when the input gains and loses focus', async () => {
    const onFocus = vi.fn<(event: FocusEvent) => void>()
    const onBlur = vi.fn<(event: FocusEvent) => void>()
    const wrapper = mount(InputOtp, {
      props: { label: 'Code' },
      attrs: { onFocus, onBlur },
      attachTo: document.body,
    })

    const input = wrapper.get<HTMLInputElement>('input').element
    input.focus()
    input.blur()
    await nextTick()
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })
})

describe('Checkbox change', () => {
  it('emits change with an Event when the user toggles it', async () => {
    const wrapper = mount(Checkbox, { props: { label: 'Terms' } })
    await wrapper.get('[data-slot=checkbox-content]').trigger('click')
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')![0]![0]).toBeInstanceOf(Event)
  })

  it('does not emit change for a v-model write', async () => {
    const wrapper = mount(Checkbox, { props: { label: 'Terms', modelValue: false } })
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.emitted('change')).toBeUndefined()
  })
})

describe('Switch change', () => {
  it('emits change with an Event when the user toggles it', async () => {
    const wrapper = mount(Switch, { props: { label: 'Wi-Fi' } })
    await wrapper.get('[data-slot=switch-content]').trigger('click')
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')![0]![0]).toBeInstanceOf(Event)
  })

  it('does not emit change for a v-model write', async () => {
    const wrapper = mount(Switch, { props: { label: 'Wi-Fi', modelValue: false } })
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.emitted('change')).toBeUndefined()
  })
})

describe('DropZone change', () => {
  const pdf = () => new File(['x'], 'a.pdf', { type: 'application/pdf' })

  // A drop event carrying files, built by hand so it doesn't depend on the DOM's DataTransfer support
  const drop = async (element: Element, files: File[]) => {
    const event = new Event('drop', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'dataTransfer', {
      value: {
        types: ['Files'],
        files,
        items: files.map((f) => ({ kind: 'file', type: f.type })),
        dropEffect: 'none',
      },
    })

    element.dispatchEvent(event)
    await nextTick()
  }

  const setup = (props: Record<string, unknown> = {}, initial: File[] = []) => {
    const model = ref<File[]>(initial)
    const wrapper = mount(() =>
      h(DropZone, {
        label: 'Upload',
        ...props,
        modelValue: model.value,
        'onUpdate:modelValue': (files: File[]) => (model.value = files),
      }),
    )

    return { wrapper, zone: wrapper.findComponent(DropZone) }
  }

  it('emits change after add when files are dropped', async () => {
    const { wrapper, zone } = setup()
    await drop(wrapper.get('[data-slot=drop-zone-area]').element, [pdf()])
    expect(zone.emitted('change')).toHaveLength(1)
    expect(zone.emitted('change')![0]![0]).toBeInstanceOf(Event)
  })

  it('emits change when a file is removed', async () => {
    const { wrapper, zone } = setup({ multiple: true }, [pdf()])
    await wrapper.get('[aria-label="Remove a.pdf"]').trigger('click')
    expect(zone.emitted('change')).toHaveLength(1)
  })

  it('does not emit change when every dropped file is rejected', async () => {
    const { wrapper, zone } = setup({ accept: 'image/*' })
    await drop(wrapper.get('[data-slot=drop-zone-area]').element, [pdf()])
    expect(zone.emitted('reject')).toHaveLength(1)
    expect(zone.emitted('change')).toBeUndefined()
  })
})
