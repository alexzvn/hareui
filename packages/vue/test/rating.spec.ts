import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, ref } from 'vue'

import type { RatingProps } from '@/components/rating'
import { Rating } from '@/components/rating'

import { expectAccessible } from './a11y'

const steps = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('[role=radio]')

// Per item: 100% when its icon is active, the overlay width when fractional, otherwise 0%
const fills = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('[data-slot=rating-item]').map((item) => {
    const overlay = item.find('[data-slot=rating-fill]')
    if (overlay.exists()) return (overlay.element as HTMLElement).style.width

    return item.get('[data-slot=rating-icon]').attributes('data-active') === 'true' ? '100%' : '0%'
  })

// Reka flags arrow keys on window keydown (cleared on keyup), its roving group moves focus on the next tick, and the
// newly focused radio clicks itself in a timeout while the flag is still set.
const pressArrow = async (key: string) => {
  const radio = document.activeElement as HTMLElement
  radio.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
  await flushPromises()
  await new Promise((resolve) => setTimeout(resolve))
  await flushPromises()
  radio.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }))
  await flushPromises()
}

describe('Rating', () => {
  it('renders a radiogroup with one labelled radio per item', () => {
    const wrapper = mount(Rating, { props: { length: 4 }, attrs: { 'aria-label': 'Score' } })

    expect(wrapper.get('[role=radiogroup]').attributes('aria-label')).toBe('Score')

    expect(steps(wrapper).map((radio) => radio.attributes('aria-label'))).toEqual([
      '1 out of 4',
      '2 out of 4',
      '3 out of 4',
      '4 out of 4',
    ])
  })

  it('clicking an item updates v-model, emits change and fills up to it', async () => {
    const model = ref(0)
    const changes: number[] = []
    const wrapper = mount(
      () =>
        h(Rating, {
          modelValue: model.value,
          'onUpdate:modelValue': (value: number) => (model.value = value),
          onChange: (value: number) => changes.push(value),
        }),
      { attachTo: document.body },
    )

    await steps(wrapper)[2]!.trigger('click')
    expect(model.value).toBe(3)
    expect(changes).toEqual([3])
    expect(steps(wrapper)[2]!.attributes('aria-checked')).toBe('true')
    expect(fills(wrapper)).toEqual(['100%', '100%', '100%', '0%', '0%'])
    wrapper.unmount()
  })

  it('keeps its own value when uncontrolled', async () => {
    const wrapper = mount(Rating, { props: { defaultValue: 2 }, attachTo: document.body })

    expect(steps(wrapper)[1]!.attributes('aria-checked')).toBe('true')
    await steps(wrapper)[3]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[4]])
    expect(steps(wrapper)[3]!.attributes('aria-checked')).toBe('true')
    wrapper.unmount()
  })

  it('pressing the current value again does nothing unless clearable', async () => {
    const wrapper = mount(Rating, { props: { defaultValue: 3 }, attachTo: document.body })

    await steps(wrapper)[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.setProps({ clearable: true })
    await steps(wrapper)[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[0]])
    expect(wrapper.emitted('change')).toEqual([[0]])
    expect(wrapper.find('[aria-checked=true]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('splits each item into one radio per step', async () => {
    const wrapper = mount(Rating, { props: { step: 0.5, length: 3 }, attachTo: document.body })

    expect(steps(wrapper).map((radio) => radio.attributes('aria-label'))).toEqual([
      '0.5 out of 3',
      '1 out of 3',
      '1.5 out of 3',
      '2 out of 3',
      '2.5 out of 3',
      '3 out of 3',
    ])

    await steps(wrapper)[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[1.5]])
    expect(fills(wrapper)).toEqual(['100%', '50%', '0%'])
    wrapper.unmount()
  })

  it('shows any fraction while read only, and ignores presses', async () => {
    const wrapper = mount(Rating, { props: { readonly: true, defaultValue: 3.7 } })

    const root = wrapper.get('[role=radiogroup]')
    expect(root.attributes('aria-readonly')).toBe('true')
    expect(fills(wrapper).map((fill) => Number.parseFloat(fill))).toEqual([100, 100, 100, 70, 0])
    expect(wrapper.findAll('[data-slot=rating-item]')[3]!.attributes('data-partial')).toBe('true')
    expect(steps(wrapper).every((radio) => radio.attributes('disabled') !== undefined)).toBe(true)

    await steps(wrapper)[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('a disabled rating is aria-disabled and ignores presses', async () => {
    const wrapper = mount(Rating, { props: { disabled: true, defaultValue: 1 } })

    expect(wrapper.get('[role=radiogroup]').attributes('aria-disabled')).toBe('true')
    await steps(wrapper)[3]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('previews the hovered value only when hoverable', async () => {
    const wrapper = mount(Rating, { props: { defaultValue: 1 }, attachTo: document.body })

    await steps(wrapper)[3]!.trigger('mouseenter')
    expect(fills(wrapper)).toEqual(['100%', '0%', '0%', '0%', '0%'])

    await wrapper.setProps({ hoverable: true })
    await steps(wrapper)[3]!.trigger('mouseenter')
    expect(fills(wrapper)).toEqual(['100%', '100%', '100%', '100%', '0%'])

    await wrapper.get('[data-slot=rating-items]').trigger('mouseleave')
    expect(fills(wrapper)).toEqual(['100%', '0%', '0%', '0%', '0%'])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('shows the pressed value while the press is held', async () => {
    const wrapper = mount(Rating, { props: { defaultValue: 4 } })

    await steps(wrapper)[0]!.trigger('pointerdown', { button: 0 })
    expect(fills(wrapper)).toEqual(['100%', '0%', '0%', '0%', '0%'])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('drops the press preview when the pointer leaves without releasing', async () => {
    const wrapper = mount(Rating, { props: { defaultValue: 4 } })

    await steps(wrapper)[0]!.trigger('pointerdown', { button: 0 })
    await steps(wrapper)[0]!.trigger('pointerleave')
    expect(fills(wrapper)).toEqual(['100%', '100%', '100%', '100%', '0%'])
  })

  it('arrow keys move and select the value', async () => {
    const wrapper = mount(Rating, { props: { defaultValue: 2 }, attachTo: document.body })

    ;(steps(wrapper)[1]!.element as HTMLElement).focus()
    await flushPromises()
    await pressArrow('ArrowRight')
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
    expect(document.activeElement).toBe(steps(wrapper)[2]!.element)

    await pressArrow('ArrowLeft')
    expect(wrapper.emitted('update:modelValue')).toEqual([[3], [2]])
    wrapper.unmount()
  })

  it('Home and End select the lowest and highest value', async () => {
    const wrapper = mount(Rating, {
      props: { defaultValue: 2, step: 0.5 },
      attachTo: document.body,
    })

    const radios = steps(wrapper)
    ;(radios[3]!.element as HTMLElement).focus()
    await radios[3]!.trigger('keydown', { key: 'End' })
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')).toEqual([[5]])
    expect(document.activeElement).toBe(radios[9]!.element)

    await radios[9]!.trigger('keydown', { key: 'Home' })
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')).toEqual([[5], [0.5]])
    expect(document.activeElement).toBe(radios[0]!.element)

    await radios[0]!.trigger('keydown', { key: 'PageDown' })
    await flushPromises()
    expect(document.activeElement).toBe(radios[0]!.element)
    wrapper.unmount()
  })

  it('renders the item slot with its filled state', () => {
    const wrapper = mount(Rating, {
      props: { length: 3, modelValue: 1.5, step: 0.5 },
      slots: {
        item: ({ index, filled }: { index: number; filled: boolean }) =>
          h('i', { class: 'probe' }, `${index}-${filled}`),
      },
    })

    expect(wrapper.findAll('i').map((el) => el.text())).toEqual([
      '1-true',
      '2-false',
      '2-true',
      '3-false',
    ])
  })

  it('renders a separate icon for empty items', () => {
    const wrapper = mount(Rating, {
      props: {
        length: 2,
        modelValue: 1,
        icon: () => h('b', 'full'),
        emptyIcon: () => h('b', 'empty'),
      },
    })

    const [filled, empty] = wrapper.findAll('[data-slot=rating-icon]')
    expect(filled!.text()).toBe('full')
    expect(empty!.text()).toBe('empty')
  })

  it('renders a string icon as the class of an icon element', () => {
    const wrapper = mount(Rating, { props: { length: 1, modelValue: 1, icon: 'my-star' } })

    expect(wrapper.find('[data-slot=rating-icon] .my-star').exists()).toBe(true)
  })

  it('accepts a custom accessible name per value', () => {
    const wrapper = mount(Rating, {
      props: { length: 2, itemLabel: (value: number) => `${value} hearts` },
    })

    expect(steps(wrapper).map((radio) => radio.attributes('aria-label'))).toEqual([
      '1 hearts',
      '2 hearts',
    ])
  })

  it('labels the group and shows the error only when invalid', async () => {
    const wrapper = mount(Rating, {
      props: { id: 'food', label: 'Food', description: 'Taste', errorMessage: 'Rate it' },
    })

    const root = wrapper.get('[role=radiogroup]')
    expect(root.attributes('aria-labelledby')).toBe('food-label')
    expect(wrapper.get('#food-label').text()).toBe('Food')
    expect(root.attributes('aria-describedby')).toBe('food-description')
    expect(wrapper.find('[data-slot=field-error]').exists()).toBe(false)

    await wrapper.setProps({ invalid: true })
    expect(root.attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('#food-error').text()).toBe('Rate it')
  })

  it('submits its value under `name` inside a form', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    const wrapper = mount(Rating, { props: { name: 'stars', defaultValue: 4 }, attachTo: form })

    await flushPromises()
    expect(new FormData(form).get('stars')).toBe('4')
    wrapper.unmount()
    form.remove()
  })
})

describe('Rating accessibility', () => {
  it.each<[string, RatingProps]>([
    ['idle', {}],
    ['rated', { defaultValue: 3 }],
    ['with half steps', { step: 0.5, defaultValue: 2.5 }],
    ['vertical', { orientation: 'vertical' }],
    ['disabled', { disabled: true, defaultValue: 2 }],
    ['read-only', { readonly: true, defaultValue: 3.4 }],
    ['invalid with an error message', { invalid: true, errorMessage: 'Rate it' }],
  ])('has no axe violations when %s', async (_, props) => {
    const wrapper = mount(Rating, {
      props: { label: 'Service', description: 'How was it?', ...props },
      attachTo: document.body,
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
