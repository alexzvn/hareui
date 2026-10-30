import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import type {
  StepperExposed,
  StepperItem,
  StepperItemSlotProps,
} from '@/components/stepper/Stepper.types'
import Stepper from '@/components/stepper/Stepper.vue'

import { expectAccessible } from './a11y'

const items: StepperItem[] = [
  { title: 'Plan', description: 'Pick the dates', content: 'Plan body' },
  { title: 'Book', description: 'Reserve seats', content: 'Book body' },
  { title: 'Pack', description: 'Fill the bag', content: 'Pack body' },
]

type MountSlots = Record<string, string | ((props: StepperItemSlotProps) => unknown)>

const mountStepper = (props: Record<string, unknown> = {}, slots: MountSlots = {}) =>
  mount(Stepper, { props: { items, ...props }, slots, attachTo: document.body })

const buttons = (wrapper: ReturnType<typeof mountStepper>) => wrapper.findAll('button')

const states = (wrapper: Pick<VueWrapper, 'findAll'>) =>
  wrapper.findAll('[data-slot=stepper-indicator]').map((el) => el.attributes('data-state'))

afterEach(() => {
  document.body.innerHTML = ''
})

describe('Stepper', () => {
  it('renders one button per step inside a list, labelled by its title and described by its description', () => {
    const wrapper = mountStepper()

    expect(wrapper.findAll('ol > li')).toHaveLength(3)

    const first = buttons(wrapper)[0]!
    const labelId = first.attributes('aria-labelledby')
    const descriptionId = first.attributes('aria-describedby')

    expect(document.getElementById(labelId!)?.textContent?.trim()).toBe('Plan')
    expect(document.getElementById(descriptionId!)?.textContent?.trim()).toBe('Pick the dates')
  })

  it('marks steps before the current one completed, the current one active and later ones inactive', () => {
    const wrapper = mountStepper({ defaultValue: 1 })

    expect(states(wrapper)).toEqual(['completed', 'active', 'inactive'])
    expect(wrapper.findAll('[data-slot=stepper-check]')).toHaveLength(1)
    expect(wrapper.findAll('[data-slot=stepper-indicator]')[2]!.text()).toBe('3')
  })

  it('marks every step completed when the value is past the last step', () => {
    const wrapper = mountStepper({ modelValue: 3 })

    expect(states(wrapper)).toEqual(['completed', 'completed', 'completed'])
    expect(wrapper.find('[data-slot=stepper-content]').exists()).toBe(false)
  })

  it('shows the active step content', () => {
    const wrapper = mountStepper({ defaultValue: 1 })

    expect(wrapper.find('[data-slot=stepper-content]').text()).toBe('Book body')
  })

  it('emits the index of a clicked step', async () => {
    const wrapper = mountStepper()

    await buttons(wrapper)[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
  })

  it('moves to a clicked step when uncontrolled', async () => {
    const wrapper = mountStepper()

    await buttons(wrapper)[1]!.trigger('click')

    expect(states(wrapper)).toEqual(['completed', 'active', 'inactive'])
  })

  it('keeps the current step while a step is pressed', async () => {
    const wrapper = mountStepper({ defaultValue: 1 })

    await buttons(wrapper)[0]!.trigger('mousedown', { button: 0 })

    expect(states(wrapper)).toEqual(['completed', 'active', 'inactive'])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('emits item values when items have a value', async () => {
    const valued = [
      { value: 'plan', title: 'Plan' },
      { value: 'book', title: 'Book' },
    ]

    const wrapper = mountStepper({ items: valued, modelValue: 'plan' })

    await buttons(wrapper)[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['book']])
  })

  it('reads the value from valueKey', async () => {
    const keyed = [
      { id: 'a', title: 'A' },
      { id: 'b', title: 'B' },
    ]

    const wrapper = mountStepper({ items: keyed, valueKey: 'id', modelValue: 'b' })

    expect(states(wrapper)).toEqual(['completed', 'active'])
  })

  it('follows v-model', async () => {
    const step = ref(0)
    const Host = defineComponent(
      () => () =>
        h(Stepper, {
          items,
          modelValue: step.value,
          'onUpdate:modelValue': (value: string | number) => (step.value = value as number),
        }),
    )

    const wrapper = mount(Host, { attachTo: document.body })

    step.value = 2
    await nextTick()

    expect(states(wrapper)).toEqual(['completed', 'completed', 'active'])
  })

  it('only lets the steps up to the next one be selected when linear', () => {
    const wrapper = mountStepper()

    expect(buttons(wrapper).map((b) => b.attributes('disabled'))).toEqual([
      undefined,
      undefined,
      '',
    ])
  })

  it('lets any step be selected when not linear', async () => {
    const wrapper = mountStepper({ linear: false })

    await buttons(wrapper)[2]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
  })

  it('disables every step when disabled', () => {
    const wrapper = mountStepper({ disabled: true })

    expect(buttons(wrapper).every((b) => b.attributes('disabled') === '')).toBe(true)
  })

  it('disables a step whose item is disabled', () => {
    const wrapper = mountStepper({ items: [items[0], { ...items[1], disabled: true }, items[2]] })

    expect(buttons(wrapper)[1]!.attributes('disabled')).toBe('')
  })

  it('selects the focused step with Enter', async () => {
    const wrapper = mountStepper({ linear: false })

    await buttons(wrapper)[1]!.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
  })

  it('selects the focused step when Space is released, not while it is held', async () => {
    const wrapper = mountStepper({ linear: false })
    const step = buttons(wrapper)[1]!

    await step.trigger('keydown', { key: ' ' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(step.attributes('data-pressed')).toBe('true')

    await step.trigger('keyup', { key: ' ' })

    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
    expect(step.attributes('data-pressed')).toBeUndefined()
  })

  it('cancels a held Space when the step loses focus', async () => {
    const wrapper = mountStepper({ linear: false })
    const step = buttons(wrapper)[1]!

    await step.trigger('keydown', { key: ' ' })
    await step.trigger('blur')
    await step.trigger('keyup', { key: ' ' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('moves focus to the next step with the arrow keys', async () => {
    const wrapper = mountStepper({ linear: false })
    const [first, second] = buttons(wrapper)

    first!.element.focus()
    await first!.trigger('keydown', { key: 'ArrowRight' })

    expect(document.activeElement).toBe(second!.element)
  })

  it('moves forward with the exposed next() and emits the step moved to', async () => {
    const wrapper = mountStepper()
    const stepper = wrapper.vm as unknown as StepperExposed

    stepper.next()
    await nextTick()

    expect(wrapper.emitted('next')).toEqual([[items[1]]])
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
  })

  it('moves back with the exposed prev() and emits the step moved to', async () => {
    const wrapper = mountStepper({ defaultValue: 2 })
    const stepper = wrapper.vm as unknown as StepperExposed

    stepper.prev()
    await nextTick()

    expect(wrapper.emitted('prev')).toEqual([[items[1]]])
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
  })

  it('ignores next() on the last step and prev() on the first', async () => {
    const last = mountStepper({ defaultValue: 2 })
    const first = mountStepper()

    ;(last.vm as unknown as StepperExposed).next()
    ;(first.vm as unknown as StepperExposed).prev()
    await nextTick()

    expect(last.emitted('update:modelValue')).toBeUndefined()
    expect(first.emitted('update:modelValue')).toBeUndefined()
  })

  it('exposes whether a next and a previous step exist', () => {
    const first = mountStepper().vm as unknown as StepperExposed
    const middle = mountStepper({ defaultValue: 1 }).vm as unknown as StepperExposed
    const last = mountStepper({ defaultValue: 2 }).vm as unknown as StepperExposed

    expect([first.hasPrev, first.hasNext]).toEqual([false, true])
    expect([middle.hasPrev, middle.hasNext]).toEqual([true, true])
    expect([last.hasPrev, last.hasNext]).toEqual([true, false])
  })

  it('renders an item icon instead of the number and the check', () => {
    const Icon = defineComponent(() => () => h('svg', { 'data-test': 'icon' }))
    const wrapper = mountStepper({
      defaultValue: 1,
      items: items.map((item) => ({ ...item, icon: Icon })),
    })

    expect(wrapper.findAll('[data-test=icon]')).toHaveLength(3)
    expect(wrapper.find('[data-slot=stepper-check]').exists()).toBe(false)
  })

  it('marks the steps complete since mount settled, and not the ones completed afterwards', async () => {
    const wrapper = mountStepper({ defaultValue: 1 })
    const settled = () =>
      wrapper
        .findAll('[data-slot=stepper-indicator]')
        .map((el) => el.attributes('data-settled') === 'true')

    expect(settled()).toEqual([true, false, false])

    await buttons(wrapper)[2]!.trigger('click')
    expect(settled()).toEqual([true, false, false])

    await buttons(wrapper)[0]!.trigger('click')
    await buttons(wrapper)[1]!.trigger('click')
    expect(settled()).toEqual([false, false, false])
  })

  it('renders the indicator, title, description and content slots with the step state', () => {
    const wrapper = mountStepper(
      { defaultValue: 1 },
      {
        indicator: ({ index, state }: { index: number; state: string }) => `${index}:${state}`,
        title: ({ item }: { item: StepperItem }) => `T ${item.title}`,
        description: ({ index }: { index: number }) => `D ${index}`,
        content: ({ item }: { item: StepperItem }) => `C ${item.title}`,
      },
    )

    expect(wrapper.findAll('[data-slot=stepper-indicator]').map((el) => el.text())).toEqual([
      '0:completed',
      '1:active',
      '2:inactive',
    ])

    expect(wrapper.findAll('[data-slot=stepper-title]')[0]!.text()).toBe('T Plan')
    expect(wrapper.findAll('[data-slot=stepper-description]')[2]!.text()).toBe('D 2')
    expect(wrapper.find('[data-slot=stepper-content]').text()).toBe('C Book')
  })

  it('prefers a step own slots over the shared ones', () => {
    const slotted = [items[0], { ...items[1], slot: 'book' }]
    const wrapper = mountStepper(
      { items: slotted, defaultValue: 1 },
      {
        title: () => 'shared',
        'book-title': () => 'own title',
        'book-description': () => 'own description',
        book: () => 'own content',
      },
    )

    const titles = wrapper.findAll('[data-slot=stepper-title]').map((el) => el.text())

    expect(titles).toEqual(['shared', 'own title'])
    expect(wrapper.findAll('[data-slot=stepper-description]')[1]!.text()).toBe('own description')
    expect(wrapper.find('[data-slot=stepper-content]').text()).toBe('own content')
  })

  it('replaces the title and description with the wrapper slot', () => {
    const wrapper = mountStepper(
      {},
      { wrapper: ({ item }: { item: StepperItem }) => `W ${item.title}` },
    )

    expect(wrapper.findAll('[data-slot=stepper-wrapper]')[0]!.text()).toBe('W Plan')
    expect(wrapper.find('[data-slot=stepper-title]').exists()).toBe(false)
  })

  it('drops the label references when the wrapper slot replaces the title and description', () => {
    const wrapper = mountStepper(
      {},
      { wrapper: ({ item }: { item: StepperItem }) => `W ${item.title}` },
    )

    const first = buttons(wrapper)[0]!

    expect(first.attributes('aria-labelledby')).toBeUndefined()
    expect(first.attributes('aria-describedby')).toBeUndefined()
  })

  it('omits the label references when a step has no title or description', () => {
    const wrapper = mountStepper({ items: [{}, {}] })

    expect(buttons(wrapper)[0]!.attributes('aria-labelledby')).toBeUndefined()
    expect(wrapper.find('[data-slot=stepper-wrapper]').exists()).toBe(false)
  })

  it('fills the separator from the item progress', () => {
    const wrapper = mountStepper({ items: [{ ...items[0], progress: 0.4 }, items[1]] })
    const fill = wrapper.find('[data-slot=stepper-separator-fill]').element as HTMLElement

    expect(fill.style.getPropertyValue('--stepper-separator-progress')).toBe('0.4')
  })

  it('renders no separator after the last step', () => {
    const wrapper = mountStepper()

    expect(wrapper.findAll('[data-slot=stepper-separator]')).toHaveLength(2)
  })

  it('passes axe horizontally, vertically and disabled', async () => {
    for (const props of [{ defaultValue: 1 }, { orientation: 'vertical' }, { disabled: true }]) {
      const wrapper = mountStepper(props)

      await expectAccessible(wrapper.element)
      wrapper.unmount()
    }
  })
})
