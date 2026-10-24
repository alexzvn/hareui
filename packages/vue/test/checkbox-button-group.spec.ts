import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'

import CheckboxButtonGroup from '@/components/checkbox-button-group/CheckboxButtonGroup.vue'
import CheckboxButtonGroupItem from '@/components/checkbox-button-group/CheckboxButtonGroupItem.vue'
import Fieldset from '@/components/fieldset/Fieldset.vue'
import Form from '@/components/form/Form.vue'

import { expectAccessible } from './a11y'

const features = [
  { value: 'security', label: 'Security', description: 'Threat detection' },
  { value: 'storage', label: 'Storage', description: 'Cloud backups' },
  { value: 'analytics', label: 'Analytics', description: 'Usage reports', disabled: true },
]

let wrapper: VueWrapper | undefined
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

// `props` may be a getter so a controlled `modelValue` is read during render and stays reactive
function mountGroup(
  props: Record<string, unknown> | (() => Record<string, unknown>) = {},
  itemSlots: Record<string, any> = {},
) {
  wrapper = mount(
    () =>
      h(CheckboxButtonGroup, typeof props === 'function' ? props() : props, () =>
        features.map((f) => h(CheckboxButtonGroupItem, { key: f.value, ...f }, itemSlots)),
      ),
    { attachTo: document.body },
  )
  return wrapper
}

const items = () => wrapper!.findAll('[data-slot=checkbox-button-group-item]')

describe('CheckboxButtonGroup', () => {
  it('toggling cards adds and removes values from v-model', async () => {
    const model = ref<string[]>([])
    mountGroup(() => ({
      modelValue: model.value,
      'onUpdate:modelValue': (v: string[]) => (model.value = v),
    }))
    await items()[1]!.trigger('click')
    expect(model.value).toEqual(['storage'])
    await nextTick()
    await items()[0]!.trigger('click')
    expect(model.value).toEqual(['storage', 'security'])
    await items()[1]!.trigger('click')
    expect(model.value).toEqual(['security'])
  })

  it('uncontrolled: starts from defaultValue and reflects selection on the card', async () => {
    mountGroup({ defaultValue: ['security'] })
    expect(items()[0]!.attributes('data-selected')).toBe('true')
    expect(items()[0]!.attributes('aria-checked')).toBe('true')
    expect(items()[1]!.attributes('data-selected')).toBeUndefined()
    await items()[1]!.trigger('click')
    await nextTick()
    expect(items()[1]!.attributes('data-selected')).toBe('true')
  })

  it('names each card by its label and describes it by its description', () => {
    mountGroup()
    const card = items()[0]!
    expect(wrapper!.get(`#${card.attributes('aria-labelledby')}`).text()).toBe('Security')
    expect(wrapper!.get(`#${card.attributes('aria-describedby')}`).text()).toBe('Threat detection')
  })

  it('a disabled item cannot be toggled', async () => {
    const model = ref<string[]>([])
    mountGroup({
      modelValue: model.value,
      'onUpdate:modelValue': (v: string[]) => (model.value = v),
    })
    const card = items()[2]!
    expect(card.attributes('data-disabled')).toBe('')
    expect(card.attributes('disabled')).toBeDefined()
    await card.trigger('click')
    expect(model.value).toEqual([])
  })

  it('a disabled group disables every item', async () => {
    mountGroup({ disabled: true })
    for (const card of items()) {
      expect(card.attributes('data-disabled')).toBe('')
      expect(card.attributes('disabled')).toBeDefined()
    }
    expect(wrapper!.get('[data-slot=checkbox-button-group]').attributes('aria-disabled')).toBe(
      'true',
    )
  })

  it('readonly keeps the selection', async () => {
    const onUpdate = (v: string[]) => {
      throw new Error(`unexpected update ${v}`)
    }
    mountGroup({ readonly: true, defaultValue: ['security'], 'onUpdate:modelValue': onUpdate })
    await items()[1]!.trigger('click')
    expect(items()[1]!.attributes('data-selected')).toBeUndefined()
    expect(items()[0]!.attributes('aria-readonly')).toBe('true')
  })

  it('a disabled Fieldset disables every card', async () => {
    const model = ref<string[]>([])
    wrapper = mount(
      () =>
        h(Fieldset, { disabled: true }, () =>
          h(
            CheckboxButtonGroup,
            {
              modelValue: model.value,
              'onUpdate:modelValue': (v: string[] | undefined) => (model.value = v ?? []),
            },
            () =>
              features.map((f) =>
                h(CheckboxButtonGroupItem, { key: f.value, ...f, disabled: false }),
              ),
          ),
        ),
      { attachTo: document.body },
    )
    for (const card of items()) {
      expect(card.attributes('disabled')).toBeDefined()
      await card.trigger('click')
    }
    expect(model.value).toEqual([])
  })
})

describe('CheckboxButtonGroupItem extra content', () => {
  it('describes the card with the default slot content', () => {
    mountGroup({}, { default: () => h('span', '2 GB included') })
    const card = items()[0]!
    const extra = card.get('[data-slot=checkbox-button-group-item-extra]')
    expect(extra.text()).toBe('2 GB included')
    expect(card.attributes('aria-describedby')!.split(' ')).toContain(extra.attributes('id'))
  })

  it('renders no extra wrapper without default slot content', () => {
    mountGroup()
    expect(wrapper!.find('[data-slot=checkbox-button-group-item-extra]').exists()).toBe(false)
  })
})

describe('CheckboxButtonGroupItem indicator', () => {
  it('renders the default checkbox control by default', () => {
    mountGroup()
    const indicator = items()[0]!.get('[data-slot=checkbox-button-group-indicator]')
    expect(indicator.attributes('data-custom')).toBeUndefined()
    expect(indicator.find('[data-slot=checkbox-default-indicator--checkmark]').exists()).toBe(true)
  })

  it('#indicator replaces the control with a custom icon and receives the selected state', async () => {
    mountGroup(
      { defaultValue: ['security'] },
      { indicator: ({ selected }: { selected: boolean }) => (selected ? 'on' : 'off') },
    )
    const indicator = items()[0]!.get('[data-slot=checkbox-button-group-indicator]')
    expect(indicator.attributes('data-custom')).toBe('true')
    expect(indicator.text()).toBe('on')
    expect(items()[1]!.get('[data-slot=checkbox-button-group-indicator]').text()).toBe('off')
  })

  it('indicator=false renders no indicator', () => {
    wrapper = mount(() =>
      h(CheckboxButtonGroup, null, () =>
        h(CheckboxButtonGroupItem, { value: 'a', label: 'A', indicator: false }),
      ),
    )
    expect(wrapper.find('[data-slot=checkbox-button-group-indicator]').exists()).toBe(false)
  })

  it('default slot adds content after the title and description and receives the state', async () => {
    wrapper = mount(() =>
      h(CheckboxButtonGroup, { defaultValue: ['a'] }, () =>
        h(
          CheckboxButtonGroupItem,
          { value: 'a', label: 'Title', description: 'Desc' },
          {
            default: ({ selected }: { selected: boolean }) =>
              h('b', selected ? 'picked' : 'not picked'),
          },
        ),
      ),
    )
    const text = wrapper.get('[data-slot=checkbox-button-group-item-text]')
    expect(text.element.textContent).toBe('TitleDescpicked')
  })

  it('#label and #description replace the props and keep the card named and described', () => {
    wrapper = mount(() =>
      h(CheckboxButtonGroup, null, () =>
        h(
          CheckboxButtonGroupItem,
          { value: 'a' },
          {
            label: () => 'Slot title',
            description: () => 'Slot desc',
          },
        ),
      ),
    )
    const card = wrapper.get('[data-slot=checkbox-button-group-item]')
    expect(wrapper.get(`#${card.attributes('aria-labelledby')}`).text()).toBe('Slot title')
    expect(wrapper.get(`#${card.attributes('aria-describedby')}`).text()).toBe('Slot desc')
  })

  it('renders the icon next to the text', () => {
    wrapper = mount(() =>
      h(CheckboxButtonGroup, null, () =>
        h(CheckboxButtonGroupItem, { value: 'a', label: 'A', icon: 'i-test-icon' }),
      ),
    )
    const content = wrapper.get('[data-slot=checkbox-button-group-item-content]')
    expect(content.find('[data-slot=checkbox-button-group-item-icon] .i-test-icon').exists()).toBe(
      true,
    )
    expect(content.get('[data-slot=checkbox-button-group-item-text]').text()).toBe('A')
  })
})

describe('CheckboxButtonGroup keyboard', () => {
  it('every enabled card is its own tab stop; disabled cards are skipped', () => {
    mountGroup()
    const cards = items()
    expect(cards.every((c) => c.element.tagName === 'BUTTON')).toBe(true)
    expect(cards.some((c) => c.attributes('tabindex') === '-1')).toBe(false)
    expect((cards[2]!.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('Enter does not toggle and submits the enclosing form', async () => {
    let submitted = 0
    const form = document.createElement('form')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      submitted++
    })
    document.body.append(form)
    const onUpdate = (v: string[] | undefined) => {
      throw new Error(`unexpected update ${v}`)
    }
    wrapper = mount(
      () =>
        h(CheckboxButtonGroup, { 'onUpdate:modelValue': onUpdate }, () =>
          h(CheckboxButtonGroupItem, { value: 'a', label: 'A' }),
        ),
      { attachTo: form },
    )
    await wrapper.get('[data-slot=checkbox-button-group-item]').trigger('keydown', { key: 'Enter' })
    expect(submitted).toBe(1)
    expect(wrapper.get('[data-slot=checkbox-button-group-item]').attributes('aria-checked')).toBe(
      'false',
    )
    wrapper.unmount()
    wrapper = undefined
    form.remove()
  })
})

describe('CheckboxButtonGroup form integration', () => {
  const error = () => document.querySelector('[data-slot="field-error"]')?.textContent?.trim()

  it('required blocks submission and shows the error until an item is selected', async () => {
    wrapper = mount(
      () =>
        h(Form, null, () =>
          h(
            CheckboxButtonGroup,
            { name: 'features', required: true, errorMessage: 'Pick at least one' },
            () => features.map((f) => h(CheckboxButtonGroupItem, { key: f.value, ...f })),
          ),
        ),
      { attachTo: document.body },
    )
    await flushPromises()
    expect(wrapper.get('form').element.checkValidity()).toBe(false)
    await flushPromises()
    expect(error()).toBe('Pick at least one')
    expect(wrapper.get('[data-slot=checkbox-button-group]').attributes('data-invalid')).toBe('true')
    await items()[0]!.trigger('click')
    await flushPromises()
    expect(error()).toBeUndefined()
    expect(wrapper.get('form').element.checkValidity()).toBe(true)
  })

  it('submits the selected values under the group name', async () => {
    wrapper = mount(
      () =>
        h(
          'form',
          null,
          h(CheckboxButtonGroup, { name: 'features', defaultValue: ['security', 'storage'] }, () =>
            features.map((f) => h(CheckboxButtonGroupItem, { key: f.value, ...f })),
          ),
        ),
      { attachTo: document.body },
    )
    await flushPromises()
    const data = new FormData(wrapper.get('form').element as HTMLFormElement)
    expect([data.get('features[0]'), data.get('features[1]')]).toEqual(['security', 'storage'])
  })

  it('form reset restores defaultValue and clears the error', async () => {
    wrapper = mount(
      () =>
        h(Form, null, () =>
          h(
            CheckboxButtonGroup,
            {
              name: 'features',
              required: true,
              errorMessage: 'Pick at least one',
              defaultValue: ['storage'],
            },
            () => features.map((f) => h(CheckboxButtonGroupItem, { key: f.value, ...f })),
          ),
        ),
      { attachTo: document.body },
    )
    await items()[1]!.trigger('click')
    await flushPromises()
    expect(error()).toBe('Pick at least one')
    await items()[0]!.trigger('click')
    wrapper.get('form').element.reset()
    await flushPromises()
    expect(items().map((c) => c.attributes('aria-checked'))).toEqual(['false', 'true', 'false'])
    expect(error()).toBeUndefined()
  })

  it('validate() receives the selected values in aria mode', async () => {
    wrapper = mount(
      () =>
        h(Form, { validationBehavior: 'aria' }, () =>
          h(
            CheckboxButtonGroup,
            {
              name: 'features',
              validate: (v: string[]) => (v.length > 1 ? 'Pick one at most' : null),
            },
            () => features.map((f) => h(CheckboxButtonGroupItem, { key: f.value, ...f })),
          ),
        ),
      { attachTo: document.body },
    )
    await items()[0]!.trigger('click')
    expect(error()).toBeUndefined()
    await items()[1]!.trigger('click')
    await nextTick()
    expect(error()).toBe('Pick one at most')
  })
})

// A native button toggles on Space unless a handler cancelled the key; happy-dom has no activation behaviour, so
// the press helper performs it when the keys get through.
async function pressSpace(el: Element) {
  const down = new KeyboardEvent('keydown', {
    key: ' ',
    code: 'Space',
    bubbles: true,
    cancelable: true,
  })
  const up = new KeyboardEvent('keyup', {
    key: ' ',
    code: 'Space',
    bubbles: true,
    cancelable: true,
  })
  el.dispatchEvent(down)
  el.dispatchEvent(up)
  if (
    el instanceof HTMLButtonElement &&
    !el.disabled &&
    !down.defaultPrevented &&
    !up.defaultPrevented
  )
    el.click()
  await nextTick()
}

describe('CheckboxButtonGroup accessibility', () => {
  it.each([
    ['idle', {}],
    ['with a selection', { defaultValue: ['security'] }],
    ['described', { description: 'Add-ons for your plan' }],
    ['disabled', { disabled: true, defaultValue: ['storage'] }],
    ['read-only', { readonly: true, defaultValue: ['security'] }],
    ['required', { required: true }],
    ['invalid with an error message', { invalid: true, errorMessage: 'Pick at least one' }],
  ])('has no axe violations when %s', async (_, props) => {
    mountGroup({ label: 'Features', ...props })
    await expectAccessible(wrapper)
  })

  it('has no axe violations with icons, extra content and custom indicators', async () => {
    mountGroup(
      { label: 'Features', defaultValue: ['security'] },
      {
        icon: () => h('svg', { viewBox: '0 0 24 24' }),
        indicator: ({ selected }: { selected: boolean }) => h('svg', { 'data-on': selected }),
        default: () => h('span', '2 GB included'),
      },
    )
    await expectAccessible(wrapper)
  })

  it('has no axe violations inside a form, with its hidden inputs', async () => {
    wrapper = mount(
      () =>
        h(
          'form',
          null,
          h(
            CheckboxButtonGroup,
            { label: 'Features', name: 'features', defaultValue: ['security'] },
            () => features.map((f) => h(CheckboxButtonGroupItem, { key: f.value, ...f })),
          ),
        ),
      { attachTo: document.body },
    )
    await flushPromises()
    await expectAccessible(wrapper)
  })

  it('the group is named by its label and every card hears the group description and error', () => {
    mountGroup({
      id: 'features',
      label: 'Features',
      description: 'Add-ons for your plan',
      invalid: true,
      errorMessage: 'Pick at least one',
    })
    const group = wrapper!.get('[role=group]')
    expect(document.getElementById(group.attributes('aria-labelledby')!)?.textContent).toBe(
      'Features',
    )
    const card = items()[0]!
    const text = card
      .attributes('aria-describedby')!
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent?.trim())
    expect(text).toEqual(['Threat detection', 'Add-ons for your plan', 'Pick at least one'])
    expect(
      items().every(
        (c) => c.attributes('role') === 'checkbox' && c.attributes('aria-invalid') === 'true',
      ),
    ).toBe(true)
  })

  it('aria-checked reflects the selection; the indicator and icon are hidden from assistive tech', async () => {
    mountGroup({ defaultValue: ['storage'] }, { icon: () => h('svg') })
    expect(items().map((c) => c.attributes('aria-checked'))).toEqual(['false', 'true', 'false'])
    expect(
      items()[0]!.get('[data-slot=checkbox-button-group-indicator]').attributes('aria-hidden'),
    ).toBe('true')
    expect(
      items()[0]!.get('[data-slot=checkbox-button-group-item-icon]').attributes('aria-hidden'),
    ).toBe('true')
  })

  it('Space toggles the focused card and keeps focus on it', async () => {
    const model = ref<string[]>([])
    mountGroup(() => ({
      modelValue: model.value,
      'onUpdate:modelValue': (v: string[]) => (model.value = v),
    }))
    const card = items()[1]!.element as HTMLButtonElement
    card.focus()
    await pressSpace(card)
    expect(model.value).toEqual(['storage'])
    expect(card.getAttribute('aria-checked')).toBe('true')
    await pressSpace(card)
    expect(model.value).toEqual([])
    expect(document.activeElement).toBe(card)
  })

  it('a read-only card stays focusable but Space does not change it', async () => {
    mountGroup({
      readonly: true,
      'onUpdate:modelValue': () => {
        throw new Error('unexpected update')
      },
    })
    const card = items()[0]!.element as HTMLButtonElement
    card.focus()
    expect(document.activeElement).toBe(card)
    await pressSpace(card)
    expect(card.getAttribute('aria-checked')).toBe('false')
  })

  it('arrow keys do not move focus between cards (no roving focus)', async () => {
    mountGroup()
    const card = items()[0]!
    ;(card.element as HTMLElement).focus()
    await card.trigger('keydown', { key: 'ArrowRight' })
    await flushPromises()
    expect(document.activeElement).toBe(card.element)
  })
})
