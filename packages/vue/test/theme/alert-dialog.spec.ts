import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import AlertDialog from '@/components/alert-dialog/AlertDialog.vue'

describe('AlertDialog theme', () => {
  it('styles the default icon with the danger status', async () => {
    const wrapper = mount(AlertDialog, {
      props: { defaultOpen: true, title: 'Delete?' },
      slots: { body: () => 'Body' },
    })

    await nextTick()
    const icon = document.querySelector('[data-slot=alert-dialog-icon]')
    expect(icon?.className).toContain('bg-danger-soft')
    wrapper.unmount()
  })
})
