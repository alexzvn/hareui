import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import DashboardGroup from '@/components/dashboard-group/DashboardGroup.vue'
import DashboardPanel from '@/components/dashboard-panel/DashboardPanel.vue'

import { expectAccessible } from './a11y'

const handle = () => document.querySelector<HTMLElement>('[data-slot=dashboard-resize-handle]')!

function mountPanel(
  panel: Record<string, unknown> = {},
  slots: Record<string, (props: never) => unknown> = {},
) {
  return mount(DashboardGroup, {
    props: { persistent: false },
    slots: {
      default: () =>
        h(
          DashboardPanel,
          { id: 'inbox', ...panel },
          { body: () => h('p', 'No messages.'), ...slots },
        ),
    },
    attachTo: document.body,
  })
}

async function key(k: string) {
  handle().dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
  await nextTick()
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('DashboardPanel', () => {
  it('renders no separator unless resizable, and passes axe', async () => {
    const wrapper = mountPanel()
    expect(document.querySelector('[role=separator]')).toBeNull()
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('a resizable panel exposes a named, focusable separator controlling it, and passes axe', async () => {
    const wrapper = mountPanel({ resizable: true, minSize: 20, maxSize: 60, defaultSize: 40 })
    const el = handle()
    expect(el.getAttribute('role')).toBe('separator')
    expect(el.getAttribute('aria-label')).toBe('Resize panel')
    expect(el.getAttribute('aria-orientation')).toBe('vertical')
    expect(el.getAttribute('aria-controls')).toBe('dashboard-panel-inbox')
    expect(document.getElementById(el.getAttribute('aria-controls')!)!.dataset.slot).toBe(
      'dashboard-panel',
    )
    expect([
      el.getAttribute('aria-valuenow'),
      el.getAttribute('aria-valuemin'),
      el.getAttribute('aria-valuemax'),
    ]).toEqual(['40', '20', '60'])
    el.focus()
    expect(document.activeElement).toBe(el)
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('arrow keys, Home and End resize it and aria-valuenow follows', async () => {
    const wrapper = mountPanel({ resizable: true, minSize: 20, maxSize: 60, defaultSize: 40 })
    await key('ArrowRight')
    expect(handle().getAttribute('aria-valuenow')).toBe('41')
    await key('ArrowLeft')
    await key('ArrowLeft')
    expect(handle().getAttribute('aria-valuenow')).toBe('39')
    await key('End')
    expect(handle().getAttribute('aria-valuenow')).toBe('60')
    await key('Home')
    expect(handle().getAttribute('aria-valuenow')).toBe('20')
    wrapper.unmount()
  })

  it('a custom #resize-handle spreading the slot attrs stays an accessible, keyboard-operable separator', async () => {
    const wrapper = mountPanel(
      { resizable: true, minSize: 20, maxSize: 60, defaultSize: 40 },
      {
        'resize-handle': ({
          attrs,
          onKeyDown,
        }: {
          attrs: Record<string, unknown>
          onKeyDown: (e: KeyboardEvent) => void
        }) =>
          h('div', {
            ...attrs,
            role: 'separator',
            'data-slot': 'dashboard-resize-handle',
            onKeydown: onKeyDown,
          }),
      },
    )
    expect(handle().getAttribute('aria-label')).toBe('Resize panel')
    await key('ArrowRight')
    expect(handle().getAttribute('aria-valuenow')).toBe('41')
    await expectAccessible(document.body)
    wrapper.unmount()
  })
})
