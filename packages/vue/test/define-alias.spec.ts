import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import Button from '@/components/button/Button.vue'
import Select from '@/components/select/Select.vue'
import Switch from '@/components/switch/Switch.vue'
import { defineAlias } from '@/utils/defineAlias'

// Renders the props it receives, so a test can read what the preset passed down.
const Probe = defineComponent({
  props: {
    variant: String,
    fullWidth: { type: Boolean, default: undefined },
    ui: Object,
    class: [String, Array],
  },
  setup: (props) => () => h('output', JSON.stringify(props)),
})

const probed = (wrapper: { text: () => string }): unknown => JSON.parse(wrapper.text())

describe('defineAlias', () => {
  it('renders the component with the preset props, which instance props override', () => {
    const DangerButton = defineAlias(Button, { props: { variant: 'danger' } })
    const danger = mount(Button, { props: { variant: 'danger' }, slots: { default: 'Delete' } })
    const primary = mount(Button, { props: { variant: 'primary' }, slots: { default: 'Delete' } })

    expect(mount(DangerButton, { slots: { default: 'Delete' } }).html()).toBe(danger.html())

    expect(
      mount(DangerButton, { props: { variant: 'primary' }, slots: { default: 'Delete' } }).html(),
    ).toBe(primary.html())
  })

  it('lets a kebab-case instance prop override a camelCase preset prop', () => {
    const WideProbe = defineAlias(Probe, { props: { variant: 'danger', fullWidth: true } })

    expect(probed(mount(WideProbe))).toMatchObject({ variant: 'danger', fullWidth: true })

    expect(probed(mount(WideProbe, { props: { 'full-width': false } }))).toMatchObject({
      variant: 'danger',
      fullWidth: false,
    })
  })

  it('merges the instance ui over the preset ui per slot and appends the instance class', () => {
    const LoudProbe = defineAlias(Probe, {
      ui: { base: 'uppercase', label: 'tracking-wide' },
      class: 'shadow-lg',
    })

    const wrapper = mount(LoudProbe, {
      props: { ui: { base: 'lowercase', spinner: 'size-3' }, class: 'w-40' },
    })

    expect(probed(wrapper)).toMatchObject({
      ui: {
        base: ['uppercase', 'lowercase'],
        label: ['tracking-wide', null],
        spinner: [null, 'size-3'],
      },
      class: 'shadow-lg w-40',
    })
  })

  it('keeps the preset ui when the instance passes none', () => {
    const LoudProbe = defineAlias(Probe, { ui: { base: 'uppercase' } })

    expect(probed(mount(LoudProbe))).toMatchObject({ ui: { base: 'uppercase' } })
  })

  it('forwards scoped slots', () => {
    const PendingButton = defineAlias(Button, { props: { pending: true } })
    const wrapper = mount(PendingButton, {
      slots: { default: ({ pending }: { pending: boolean }) => (pending ? 'Saving' : 'Save') },
    })

    expect(wrapper.text()).toBe('Saving')
  })

  it("replaces the preset listener with the instance's, so loadingAuto awaits the instance's promise", async () => {
    const onPresetClick = vi.fn<() => void>()
    const onClick = vi.fn<() => void>()
    const TrackedButton = defineAlias(Button, { props: { onClick: onPresetClick } })
    const wrapper = mount(TrackedButton, { attrs: { onClick } })

    await wrapper.get('button').trigger('click')

    expect(onPresetClick).not.toHaveBeenCalled()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('supports v-model', async () => {
    const LabeledSwitch = defineAlias(Switch, { props: { label: 'Wi-Fi' } })
    const isChecked = ref(false)
    const wrapper = mount(() =>
      h(LabeledSwitch, {
        modelValue: isChecked.value,
        'onUpdate:modelValue': (value: boolean) => (isChecked.value = value),
      }),
    )

    await wrapper.get('[data-slot=switch-content]').trigger('click')

    expect(isChecked.value).toBe(true)
    expect(wrapper.get('[data-slot=switch-content]').attributes('aria-checked')).toBe('true')
  })

  it('exposes the wrapped component API to template refs', () => {
    const Counter = defineComponent({
      setup(_, { expose }) {
        expose({ reset: () => 'reset' })
        return () => h('div')
      },
    })

    const ResettableCounter = defineAlias(Counter)
    const counter = ref<{ reset: () => string }>()
    mount(defineComponent(() => () => h(ResettableCounter, { ref: counter })))

    expect(counter.value?.reset()).toBe('reset')
  })
})

describe('defineAlias types', () => {
  it('types the preset from the wrapped component, generic components included', () => {
    // @ts-expect-error `variant` accepts Button variants only
    defineAlias(Button, { props: { variant: 'loud' } })

    // @ts-expect-error `ui` accepts Button slots only
    defineAlias(Button, { ui: { track: 'h-2' } })

    const PlainSelect = defineAlias(Select, {
      props: { placeholder: 'Pick one' },
      ui: { trigger: 'w-60' },
    })

    expect(PlainSelect).toBeTypeOf('object')
  })
})
