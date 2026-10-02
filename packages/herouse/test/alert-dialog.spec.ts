import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import AlertDialog from '../src/components/AlertDialog.vue'

function escapeKeydown() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
}

// Reka's Presence needs three ticks before a closed dialog leaves the DOM (see modal.spec.ts).
async function waitUnmount() {
  await nextTick()
  await nextTick()
  await nextTick()
}

const dialog = () => document.querySelector<HTMLElement>('[data-slot=alert-dialog-dialog]')

describe('alertDialog', () => {
  it('renders role="alertdialog" with the default danger icon', async () => {
    const wrapper = mount(AlertDialog, { props: { defaultOpen: true, title: 'Delete?' }, slots: { body: () => 'Body' } })
    await nextTick()
    expect(dialog()?.getAttribute('role')).toBe('alertdialog')
    const icon = document.querySelector('[data-slot=alert-dialog-icon]')
    expect(icon?.className).toContain('bg-danger-soft')
    expect(icon?.querySelector('[data-slot=alert-dialog-default-icon]')).not.toBeNull()
    wrapper.unmount()
  })

  it('escape does not close by default, but does with keyboardDismissible', async () => {
    const closed = mount(AlertDialog, { props: { defaultOpen: true }, slots: { body: () => 'Body' } })
    await nextTick()
    escapeKeydown()
    await waitUnmount()
    expect(dialog()).not.toBeNull()
    closed.unmount()
    await waitUnmount()

    const dismissible = mount(AlertDialog, { props: { defaultOpen: true, keyboardDismissible: true }, slots: { body: () => 'Body' } })
    await nextTick()
    escapeKeydown()
    await waitUnmount()
    expect(dialog()).toBeNull()
    dismissible.unmount()
  })

  it('footer close() closes the dialog', async () => {
    const wrapper = mount(AlertDialog, {
      props: { defaultOpen: true },
      slots: { footer: ({ close }: { close: () => void }) => h('button', { id: 'confirm', onClick: close }, 'Confirm') },
    })
    await nextTick()
    document.querySelector<HTMLButtonElement>('#confirm')!.click()
    await waitUnmount()
    expect(dialog()).toBeNull()
    wrapper.unmount()
  })
})
