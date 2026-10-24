import type { Component } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import AlertDialog from '../src/components/alert-dialog/AlertDialog.vue'
import Autocomplete from '../src/components/autocomplete/Autocomplete.vue'
import ColorPicker from '../src/components/color-picker/ColorPicker.vue'
import ComboBox from '../src/components/combo-box/ComboBox.vue'
import DatePicker from '../src/components/date-picker/DatePicker.vue'
import DateRangePicker from '../src/components/date-range-picker/DateRangePicker.vue'
import Drawer from '../src/components/drawer/Drawer.vue'
import Dropdown from '../src/components/dropdown/Dropdown.vue'
import Modal from '../src/components/modal/Modal.vue'
import Popover from '../src/components/popover/Popover.vue'
import Select from '../src/components/select/Select.vue'
import type { PortalTarget } from '../src/config'
import { createHareUI } from '../src/config'

function withResolvers<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

const items = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]
const trigger = { trigger: () => h('button', 'Open') }

// Every overlay that portals, opened on mount. `slots` gives each the content it needs to render.
const overlays: Array<[string, Component, Record<string, unknown>, Record<string, () => unknown>]> = [
  ['Modal', Modal, { open: true }, { default: () => 'Body' }],
  ['AlertDialog', AlertDialog, { open: true, title: 'Title' }, {}],
  ['Drawer', Drawer, { open: true }, { default: () => 'Body' }],
  ['Popover', Popover, { open: true }, { ...trigger, default: () => 'Body' }],
  ['ColorPicker', ColorPicker, { open: true, defaultValue: '#ff0000' }, {}],
  ['Dropdown', Dropdown, { open: true, items }, trigger],
  ['Select', Select, { open: true, items }, {}],
  ['ComboBox', ComboBox, { open: true, items }, {}],
  ['Autocomplete', Autocomplete, { open: true, items }, {}],
  ['DatePicker', DatePicker, { open: true }, {}],
  ['DateRangePicker', DateRangePicker, { open: true }, {}],
]

const cleanups: Array<() => void> = []
afterEach(() => {
  cleanups.splice(0).forEach(fn => fn())
  document.body.innerHTML = ''
})

function target(id: string) {
  const el = document.createElement('div')
  el.id = id
  document.body.append(el)
  return el
}

async function open(component: Component, props: Record<string, unknown>, slots: Record<string, () => unknown>, portal?: PortalTarget) {
  const host = target('host')
  const wrapper = mount(component, {
    props,
    slots,
    attachTo: host,
    global: { plugins: portal === undefined ? [] : [createHareUI({ portal })] },
  })
  cleanups.push(() => wrapper.unmount())
  for (let i = 0; i < 4; i++) await nextTick()
  return { wrapper, host }
}

describe.each(overlays)('%s portal', (_name, component, props, slots) => {
  it('portals to the app-wide createHareUI({ portal }) target', async () => {
    const global = target('global')
    await open(component, props, slots, global)
    expect(global.childElementCount).toBeGreaterThan(0)
  })

  it('prefers its own portal prop over the app-wide target', async () => {
    const global = target('global')
    const own = target('own')
    await open(component, { ...props, portal: '#own' }, slots, global)
    expect(own.childElementCount).toBeGreaterThan(0)
    expect(global.childElementCount).toBe(0)
  })

  it('renders in place when the app-wide portal is false', async () => {
    const { host } = await open(component, props, slots, false)
    // Reka's focus guards always go to the body; nothing else may leave the host.
    expect([...document.body.children].filter(el => el !== host && !el.hasAttribute('data-reka-focus-guard'))).toEqual([])
    expect(host.querySelector('[role=dialog], [role=alertdialog], [role=listbox], [role=menu], [role=grid]')).not.toBeNull()
  })
})

describe('shadow root', () => {
  it('portals into an element inside a shadow root', async () => {
    const shadow = target('shadow-host').attachShadow({ mode: 'open' })
    const portal = document.createElement('div')
    shadow.append(portal)
    await open(Select, { open: true, items }, {}, portal)
    expect(portal.querySelector('[role=listbox]')).not.toBeNull()
  })

  it('portals Dropdown submenus to the same target as the root menu', async () => {
    const global = target('global')
    const { wrapper } = await open(Dropdown, {
      open: true,
      items: [{ value: 'more', label: 'More', items: [{ value: 'x', label: 'X' }] }],
    }, trigger, global)
    const submenuTrigger = global.querySelector<HTMLElement>('[data-slot=menu-item]')!
    submenuTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    for (let i = 0; i < 4; i++) await nextTick()
    expect(global.querySelectorAll('[role=menu]').length).toBe(2)
    expect(wrapper.element.ownerDocument.body.querySelectorAll(':scope > [role=menu]').length).toBe(0)
  })
})

describe('nested dismissable layers in a shadow root', () => {
  // Mounts into a shadow root with overlays portalled next to the app, as in a browser extension panel.
  async function mountInShadow(component: Component, props: Record<string, unknown>, slots: Record<string, () => unknown>) {
    const host = target('shadow-host')
    const shadow = host.attachShadow({ mode: 'open' })
    const app = document.createElement('div')
    const overlays = document.createElement('div')
    const outside = document.createElement('button')
    shadow.append(app, overlays, outside)
    // Reka looks the DialogTitle up with document.getElementById, which can't see into a shadow root, so it warns
    // about the title the Modal does render. Drop only that warning.
    const warn = console.warn
    const spy = vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
      if (!String(args[0]).includes('requires a `DialogTitle`'))
        warn(...args)
    })
    const wrapper = mount(component, { props, slots, attachTo: app, global: { plugins: [createHareUI({ portal: overlays })] } })
    cleanups.push(() => wrapper.unmount(), () => spy.mockRestore())
    await settle()
    return { wrapper, host, overlays, outside }
  }

  // Reka registers its document listeners a task after the content mounts.
  async function settle() {
    for (let i = 0; i < 4; i++) await nextTick()
    const { promise, resolve } = withResolvers<void>()
    setTimeout(resolve, 0)
    await promise
  }

  // happy-dom doesn't retarget: dispatch what a browser's document listener sees for a press on `real` inside the
  // shadow root, i.e. `target` is the shadow host and only `composedPath()` reaches the pressed element.
  async function pressInShadow(host: Element, real: Element) {
    const event = new PointerEvent('pointerdown', { bubbles: true, composed: true, button: 0, pointerType: 'mouse' })
    const path: EventTarget[] = []
    for (let node: Node | null = real; node && node !== host; node = node.parentNode ?? (node as ShadowRoot).host ?? null)
      path.push(node)
    Object.defineProperty(event, 'composedPath', { value: () => [...path, host, document.body, document.documentElement, document, window] })
    host.dispatchEvent(event)
    await settle()
  }

  // The Select opens after the Modal, as from a click, so its layer follows the Modal's in the portal target.
  const SelectInModal = defineComponent({
    props: { selectOpen: Boolean },
    emits: ['modalOpen', 'selectOpen'],
    setup(props, { emit }) {
      return () => h(Modal, { 'open': true, 'onUpdate:open': (v: boolean) => emit('modalOpen', v) }, {
        body: () => h(Select, { 'open': props.selectOpen, items, 'onUpdate:open': (v: boolean) => emit('selectOpen', v) }),
      })
    },
  })

  async function openSelectInModal() {
    const mounted = await mountInShadow(SelectInModal, {}, {})
    await mounted.wrapper.setProps({ selectOpen: true })
    await settle()
    return mounted
  }

  it('a press in a Select opened from a Modal keeps the Modal open', async () => {
    const { wrapper, host, overlays } = await openSelectInModal()
    await pressInShadow(host, overlays.querySelector('[role=option]')!)
    expect(wrapper.emitted('modalOpen')).toBeUndefined()
  })

  it('a press in the Modal still closes the Select opened from it, but not the Modal', async () => {
    const { wrapper, host, overlays } = await openSelectInModal()
    await pressInShadow(host, overlays.querySelector('[role=dialog]')!)
    expect(wrapper.emitted('selectOpen')).toContainEqual([false])
    expect(wrapper.emitted('modalOpen')).toBeUndefined()
  })

  it('a press outside every layer still closes the Modal', async () => {
    const { wrapper, host, outside } = await mountInShadow(SelectInModal, {}, {})
    await pressInShadow(host, outside)
    expect(wrapper.emitted('modalOpen')).toEqual([[false]])
  })

  it('a press in a Dropdown submenu keeps the root menu open', async () => {
    const { wrapper, host, overlays } = await mountInShadow(Dropdown, {
      open: true,
      items: [{ value: 'more', label: 'More', items: [{ value: 'x', label: 'X' }] }],
    }, trigger)
    const submenuTrigger = overlays.querySelector<HTMLElement>('[data-slot=menu-item]')!
    submenuTrigger.focus()
    submenuTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await nextTick()
    const submenu = overlays.querySelectorAll('[role=menu]')[1]!
    await pressInShadow(host, submenu.querySelector('[data-slot=menu-item]')!)
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })
})
