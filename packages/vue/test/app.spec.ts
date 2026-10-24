import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, inject, provide } from 'vue'

import App from '../src/components/app/App.vue'
import { usePortal } from '../src/composables/usePortal'
import { hareUIConfigKey } from '../src/config'
import { expectAccessible } from './a11y'

const Probe = defineComponent({
  setup() {
    const portal = usePortal(() => undefined)
    const config = inject(hareUIConfigKey, {})
    return () =>
      h('span', {
        'data-to': String(portal.value.to),
        'data-disabled': String(portal.value.disabled),
        'data-ui': config.ui ? 'yes' : 'no',
      })
  },
})

function probe(props: Record<string, unknown>, parentConfig?: object) {
  const Parent = defineComponent({
    setup() {
      if (parentConfig) provide(hareUIConfigKey, parentConfig)
      return () => h(App, { toaster: null, ...props }, () => h(Probe))
    },
  })
  return mount(Parent).get('span')
}

describe('app', () => {
  it('defaults the portal to document.body', () => {
    expect(probe({}).attributes()).toMatchObject({ 'data-to': 'body', 'data-disabled': 'false' })
  })

  it('portal sets the default overlay target for the subtree', () => {
    expect(probe({ portal: '#overlays' }).attributes('data-to')).toBe('#overlays')
    expect(probe({ portal: false }).attributes('data-disabled')).toBe('true')
  })

  it('inherits the portal and ui of createHareUI when its own is unset', () => {
    const el = probe({}, { portal: '#from-config', ui: { button: {} } })
    expect(el.attributes('data-to')).toBe('#from-config')
    expect(el.attributes('data-ui')).toBe('yes')
    expect(probe({ portal: '#own' }, { portal: '#from-config' }).attributes('data-to')).toBe('#own')
  })

  it('renders the app unwrapped next to its toast region, and passes axe', async () => {
    const wrapper = mount(App, {
      slots: {
        default: () => h('main', [h('h1', 'Home'), h('button', { type: 'button' }, 'Save')]),
      },
      attachTo: document.body,
    })
    // Mounted into a container appended to <body>: no wrapper element in between.
    expect(document.querySelector('main')!.parentElement!.parentElement).toBe(document.body)
    await expectAccessible(document.body)
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('passes axe without a toaster', async () => {
    const wrapper = mount(App, {
      props: { toaster: null },
      slots: { default: () => h('main', 'Home') },
      attachTo: document.body,
    })
    await expectAccessible(document.body)
    wrapper.unmount()
    document.body.innerHTML = ''
  })
})
