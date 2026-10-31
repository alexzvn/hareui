import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, markRaw } from 'vue'

import Button from '@/components/button/Button.vue'
import Form from '@/components/form/Form.vue'

import { expectAccessible } from './a11y'

const Star = markRaw(defineComponent(() => () => h('svg', { 'data-test': 'star' })))

// A minimal vue-router RouterLink: it renders nothing itself and hands the link state to its slot. Like vue-router's
// `custom` mode, a single slot node becomes its root, so attributes fall through to it.
const routerStub = (navigate: (to: unknown) => void) =>
  defineComponent({
    props: { to: { type: [String, Object], required: true }, custom: Boolean, replace: Boolean },
    setup(props, { slots }) {
      return () => {
        const nodes = slots.default?.({
          href: `/app${props.to}`,
          isActive: props.to === '/current',
          isExactActive: props.to === '/current',
          navigate: () => navigate(props.to),
        })

        return nodes?.length === 1 ? nodes[0] : nodes
      }
    },
  })

describe('Button', () => {
  it('pending shows a spinner, sets aria-busy and swallows clicks while staying focusable', async () => {
    const onClick = vi.fn<(event: MouseEvent) => void>()
    const wrapper = mount(Button, {
      props: { pending: true },
      attrs: { onClick },
      slots: { default: 'Save' },
    })

    expect(wrapper.find('[data-slot=spinner]').exists()).toBe(true)
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeUndefined()
    await wrapper.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('#leading replaces the pending spinner', () => {
    const wrapper = mount(Button, {
      props: { pending: true },
      slots: { leading: () => h('i', { id: 'icon' }) },
    })

    expect(wrapper.find('#icon').exists()).toBe(true)
    expect(wrapper.find('[data-slot=spinner]').exists()).toBe(false)
  })

  it('disabled sets the native disabled attribute', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('as="a" renders a link that is aria-disabled, unfocusable and click-inert when disabled', async () => {
    const onClick = vi.fn<(event: MouseEvent) => void>()
    const wrapper = mount(Button, {
      props: { as: 'a', disabled: true },
      attrs: { href: '#x', onClick },
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('-1')
    expect(wrapper.attributes('type')).toBeUndefined()
    await wrapper.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('fires click when enabled', async () => {
    const onClick = vi.fn<(event: MouseEvent) => void>()
    const wrapper = mount(Button, { attrs: { onClick } })
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it.each([
    ['with a text label', {}, { default: 'Save' }, {}],
    [
      'icon-only with aria-label',
      { iconOnly: true },
      { default: () => h('svg', { 'aria-hidden': 'true' }) },
      { 'aria-label': 'Settings' },
    ],
    ['disabled', { disabled: true }, { default: 'Save' }, {}],
    ['pending', { pending: true }, { default: 'Save' }, {}],
    ['as a link', { as: 'a' }, { default: 'Docs' }, { href: '/docs' }],
    ['as a disabled link', { as: 'a', disabled: true }, { default: 'Docs' }, { href: '/docs' }],
  ])('is accessible %s', async (_, props, slots, attrs) => {
    const wrapper = mount(Button, { props, slots, attrs, attachTo: document.body })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('pending keeps the button focusable and exposes it as disabled; disabled leaves the tab order', () => {
    const wrapper = mount(
      {
        render: () =>
          h('div', [
            h(Button, { id: 'pending', pending: true }, () => 'Save'),
            h(Button, { id: 'disabled', disabled: true }, () => 'Save'),
          ]),
      },
      { attachTo: document.body },
    )

    const pending = wrapper.get('#pending').element as HTMLButtonElement
    pending.focus()
    expect(document.activeElement).toBe(pending)
    expect(pending.getAttribute('aria-disabled')).toBe('true')
    const disabled = wrapper.get('#disabled').element as HTMLButtonElement
    disabled.focus()
    expect(document.activeElement).not.toBe(disabled)
    wrapper.unmount()
  })

  it('as="div" is a tabbable, named button activated once by Enter (keydown) and Space (keyup)', async () => {
    const onClick = vi.fn<(event: MouseEvent) => void>()

    // Attached: happy-dom's `element.click()` doesn't dispatch on detached nodes.
    const wrapper = mount(Button, {
      props: { as: 'div' },
      attrs: { onClick },
      slots: { default: 'Open' },
      attachTo: document.body,
    })

    // Vue drops events stamped in the same millisecond its listeners were attached; real key presses never are.
    const tick = Promise.withResolvers<void>()
    setTimeout(tick.resolve, 2)
    await tick.promise
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.text()).toBe('Open')
    expect(wrapper.attributes('tabindex')).toBe('0')
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    wrapper.element.dispatchEvent(enter)
    expect(enter.defaultPrevented).toBe(true)
    await wrapper.trigger('keyup', { key: 'Enter' })
    expect(onClick).toHaveBeenCalledOnce()
    const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
    wrapper.element.dispatchEvent(space)
    expect(space.defaultPrevented).toBe(true)
    expect(onClick).toHaveBeenCalledOnce()
    await wrapper.trigger('keyup', { key: ' ' })
    expect(onClick).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('as="div" disabled leaves the tab order and ignores Enter, Space and clicks', async () => {
    const onClick = vi.fn<(event: MouseEvent) => void>()
    const wrapper = mount(Button, {
      props: { as: 'div', disabled: true },
      attrs: { onClick },
      slots: { default: 'Open' },
      attachTo: document.body,
    })

    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('-1')
    await wrapper.trigger('keydown', { key: 'Enter' })
    await wrapper.trigger('keydown', { key: ' ' })
    await wrapper.trigger('keyup', { key: ' ' })
    await wrapper.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it.each([
    ['enabled', {}],
    ['disabled', { disabled: true }],
  ])('as="div" %s passes axe', async (_, props) => {
    const wrapper = mount(Button, {
      props: { as: 'div', ...props },
      slots: { default: 'Open' },
      attachTo: document.body,
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})

describe('Button content props', () => {
  it('renders label, leading icon and trailing icon in order', () => {
    const wrapper = mount(Button, {
      props: { label: 'Save', leadingIcon: Star, trailingIcon: 'i-arrow' },
    })

    const order = [...wrapper.element.children].map((el) => el.getAttribute('data-slot'))
    expect(order).toEqual(['button-leading-icon', 'button-label', 'button-trailing-icon'])
    expect(wrapper.get('[data-slot=button-label]').text()).toBe('Save')
    expect(wrapper.get('[data-slot=button-leading-icon]').attributes('aria-hidden')).toBe('true')
  })

  it('renders the avatar in the leading position', () => {
    const wrapper = mount(Button, { props: { label: 'Mira', avatar: { fallback: 'MO' } } })
    expect(wrapper.element.firstElementChild!.getAttribute('data-slot')).toBe('button-avatar')
    expect(wrapper.get('[data-slot=button-avatar]').text()).toBe('MO')
  })

  it('a leading icon wins over the avatar', () => {
    const wrapper = mount(Button, { props: { leadingIcon: Star, avatar: { fallback: 'MO' } } })
    expect(wrapper.find('[data-slot=button-leading-icon]').exists()).toBe(true)
    expect(wrapper.find('[data-slot=button-avatar]').exists()).toBe(false)
  })

  it('slots win over label, leadingIcon and trailingIcon', () => {
    const wrapper = mount(Button, {
      props: { label: 'Prop', leadingIcon: Star, trailingIcon: Star },
      slots: {
        default: 'Slot',
        leading: () => h('i', { id: 'lead' }),
        trailing: () => h('i', { id: 'trail' }),
      },
    })

    expect(wrapper.text()).toBe('Slot')
    expect(wrapper.find('#lead').exists()).toBe(true)
    expect(wrapper.find('#trail').exists()).toBe(true)
    expect(wrapper.find('[data-slot=button-label]').exists()).toBe(false)
    expect(wrapper.find('[data-test=star]').exists()).toBe(false)
  })

  it('the pending spinner replaces the leading icon', () => {
    const wrapper = mount(Button, { props: { label: 'Save', leadingIcon: Star, pending: true } })
    expect(wrapper.find('[data-slot=spinner]').exists()).toBe(true)
    expect(wrapper.find('[data-slot=button-leading-icon]').exists()).toBe(false)
  })

  it('an icon without a label is an icon-only button named by aria-label, with axe passing', async () => {
    const wrapper = mount(Button, {
      props: { leadingIcon: Star },
      attrs: { 'aria-label': 'Favorite' },
      attachTo: document.body,
    })

    expect(wrapper.text()).toBe('')
    expect(wrapper.attributes('aria-label')).toBe('Favorite')
    expect(wrapper.get('[data-slot=button-leading-icon]').attributes('aria-hidden')).toBe('true')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})

describe('Button loadingAuto', () => {
  it('is pending while the click promise runs, then clears once it resolves', async () => {
    const { promise, resolve } = Promise.withResolvers<void>()
    const wrapper = mount(Button, { props: { loadingAuto: true, onClick: () => promise } })

    await wrapper.trigger('click')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('[data-slot=spinner]').exists()).toBe(true)
    resolve()
    await flushPromises()
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
    expect(wrapper.find('[data-slot=spinner]').exists()).toBe(false)
  })

  it('clears pending when the click promise rejects, passing the error to the app', async () => {
    const { promise, reject } = Promise.withResolvers<void>()
    const errorHandler = vi.fn<(error: unknown) => void>()
    const wrapper = mount(Button, {
      props: { loadingAuto: true, onClick: () => promise },
      global: { config: { errorHandler } },
    })

    await wrapper.trigger('click')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    const error = new Error('offline')
    reject(error)
    await flushPromises()
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
    expect(errorHandler).toHaveBeenCalledWith(error, expect.anything(), expect.anything())
  })

  it('ignores clicks while the click promise runs', async () => {
    const { promise, resolve } = Promise.withResolvers<void>()
    const onClick = vi.fn<() => Promise<void>>(() => promise)
    const wrapper = mount(Button, { props: { loadingAuto: true, onClick } })

    await wrapper.trigger('click')
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
    resolve()
    await flushPromises()
  })

  it('without loadingAuto a click promise leaves the button idle', async () => {
    const wrapper = mount(Button, { props: { onClick: () => new Promise(() => {}) } })
    await wrapper.trigger('click')
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })

  it('clears pending when the click handler throws synchronously, passing the error to the app', async () => {
    const error = new Error('offline')
    const errorHandler = vi.fn<(error: unknown) => void>()
    const wrapper = mount(Button, {
      props: {
        loadingAuto: true,
        onClick: () => {
          throw error
        },
      },
      global: { config: { errorHandler } },
    })

    await wrapper.trigger('click')
    await flushPromises()
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
    expect(errorHandler).toHaveBeenCalledWith(error, expect.anything(), expect.anything())
  })

  it('unmounting while the click promise runs is safe', async () => {
    const { promise, resolve } = Promise.withResolvers<void>()
    const errorHandler = vi.fn<(error: unknown) => void>()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const wrapper = mount(Button, {
      props: { loadingAuto: true, onClick: () => promise },
      global: { config: { errorHandler } },
    })

    await wrapper.trigger('click')
    wrapper.unmount()
    resolve()
    await flushPromises()
    expect(errorHandler).not.toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it('a submit button is pending while its Form submits, and stays focusable', async () => {
    const { promise, resolve } = Promise.withResolvers<void>()
    const wrapper = mount(
      () =>
        h(Form, { state: {}, onSubmit: () => promise }, () =>
          h(Button, { type: 'submit', loadingAuto: true }, () => 'Save'),
        ),
      { attachTo: document.body },
    )

    const button = () => wrapper.get('button')
    expect(button().attributes('aria-busy')).toBeUndefined()
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(button().attributes('aria-busy')).toBe('true')
    expect(button().attributes('disabled')).toBeUndefined()
    ;(button().element as HTMLButtonElement).focus()
    expect(document.activeElement).toBe(button().element)
    resolve()
    await flushPromises()
    expect(button().attributes('aria-busy')).toBeUndefined()
    wrapper.unmount()
  })

  it('a submit button without loadingAuto is not pending while its Form submits', async () => {
    const { promise, resolve } = Promise.withResolvers<void>()
    const wrapper = mount(() =>
      h(Form, { state: {}, onSubmit: () => promise }, () =>
        h(Button, { type: 'submit' }, () => 'Save'),
      ),
    )

    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(wrapper.get('button').attributes('aria-busy')).toBeUndefined()
    resolve()
    await flushPromises()
  })
})

describe('Button as a link', () => {
  it('href renders an anchor with link semantics', () => {
    const wrapper = mount(Button, { props: { href: '/docs', label: 'Docs' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/docs')
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('type')).toBeUndefined()
    expect(wrapper.attributes('data-slot')).toBe('button')
  })

  it('to without a router renders a plain anchor', () => {
    const wrapper = mount(Button, { props: { to: '/docs' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/docs')
  })

  it('to goes through RouterLink when the app registers it', async () => {
    const navigate = vi.fn<(to: unknown) => void>()
    const onClick = vi.fn<(event: MouseEvent) => void>()
    const wrapper = mount(Button, {
      props: { to: '/current', onClick },
      global: { components: { RouterLink: routerStub(navigate) } },
    })

    expect(wrapper.attributes('href')).toBe('/app/current')
    expect(wrapper.attributes('data-active')).toBe('true')
    await wrapper.trigger('click')
    expect(navigate).toHaveBeenCalledWith('/current')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('a disabled link has no href, is aria-disabled, leaves the tab order and ignores clicks', async () => {
    const onClick = vi.fn<(event: MouseEvent) => void>()
    const wrapper = mount(Button, { props: { href: '/docs', disabled: true, onClick } })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('-1')
    await wrapper.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('a disabled link stays off the router', () => {
    const wrapper = mount(Button, {
      props: { to: '/current', disabled: true },
      global: { components: { RouterLink: routerStub(vi.fn<(to: unknown) => void>()) } },
    })

    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('a pending link swallows clicks and is aria-busy', async () => {
    const onClick = vi.fn<(event: MouseEvent) => void>()
    const wrapper = mount(Button, { props: { href: '/docs', pending: true, onClick } })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    await wrapper.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it.each([
    ['enabled', {}],
    ['disabled', { disabled: true }],
  ])('a %s link passes axe', async (_, props) => {
    const wrapper = mount(Button, {
      props: { href: '/docs', label: 'Docs', ...props },
      attachTo: document.body,
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
