import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import ToggleButton from '../src/components/toggle-button/ToggleButton.vue'
import ToggleButtonGroup from '../src/components/toggle-button-group/ToggleButtonGroup.vue'

describe('ToggleButtonGroup', () => {
  // behaviour-final-check T2: RAC's toggle button group only moves focus with the arrow keys
  it('Home / End do not move focus to the first / last button', async () => {
    const wrapper = mount(ToggleButtonGroup, {
      props: { selectionMode: 'multiple' },
      slots: { default: () => ['bold', 'italic', 'underline'].map(id => h(ToggleButton, { id }, () => id)) },
      attachTo: document.body,
    })
    await flushPromises()
    const middle = wrapper.get('#italic').element as HTMLElement
    middle.focus()
    for (const key of ['Home', 'End']) {
      middle.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
      await flushPromises()
      expect(document.activeElement).toBe(middle)
    }
    middle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }))
    await flushPromises()
    expect(document.activeElement).toBe(wrapper.get('#underline').element)
    wrapper.unmount()
  })
})
