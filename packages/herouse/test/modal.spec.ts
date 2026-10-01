import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Modal from '../src/components/Modal.vue'

function escapeKeydown() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
}

// reka-ui's Presence defers unmounting a closed node until it re-checks
// `getComputedStyle(...).animationName` on the tick after the `present` prop
// flips, which itself happens a tick after the watcher's own internal
// `await nextTick()` - three ticks in total before the dialog leaves the DOM.
async function waitUnmount() {
  await nextTick()
  await nextTick()
  await nextTick()
}

describe('modal', () => {
  it('trigger opens the dialog', async () => {
    const wrapper = mount(Modal, {
      slots: { default: () => h('button', 'Open'), body: () => 'Content' },
    })
    expect(document.querySelector('[data-slot=modal-dialog]')).toBeNull()

    await wrapper.find('button').trigger('click')
    await nextTick()
    expect(document.querySelector('[data-slot=modal-dialog]')).not.toBeNull()

    wrapper.unmount()
  })

  it('Escape closes the dialog', async () => {
    const wrapper = mount(Modal, {
      props: { defaultOpen: true },
      slots: { body: () => 'Content' },
    })
    await nextTick()
    expect(document.querySelector('[data-slot=modal-dialog]')).not.toBeNull()

    escapeKeydown()
    await waitUnmount()
    expect(document.querySelector('[data-slot=modal-dialog]')).toBeNull()

    wrapper.unmount()
  })

  it('dismissible=false keeps the dialog open on Escape', async () => {
    const wrapper = mount(Modal, {
      props: { defaultOpen: true, dismissible: false },
      slots: { body: () => 'Content' },
    })
    await nextTick()
    expect(document.querySelector('[data-slot=modal-dialog]')).not.toBeNull()

    escapeKeydown()
    await nextTick()
    expect(document.querySelector('[data-slot=modal-dialog]')).not.toBeNull()

    wrapper.unmount()
  })

  it('v-model:open stays in sync with external state in both directions', async () => {
    const open = ref(false)
    const Wrapper = {
      setup() {
        return () => h(Modal, {
          open: open.value,
          'onUpdate:open': (value: boolean) => { open.value = value },
        }, { body: () => 'Content' })
      },
    }
    const wrapper = mount(Wrapper)
    expect(document.querySelector('[data-slot=modal-dialog]')).toBeNull()

    open.value = true
    await nextTick()
    expect(document.querySelector('[data-slot=modal-dialog]')).not.toBeNull()

    escapeKeydown()
    await nextTick()
    expect(open.value).toBe(false)
    await waitUnmount()
    expect(document.querySelector('[data-slot=modal-dialog]')).toBeNull()

    wrapper.unmount()
  })
})
