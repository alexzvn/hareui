import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Main from '../src/components/main/Main.vue'
import { expectAccessible } from './a11y'

describe('Main', () => {
  it('renders the main landmark around the page content and passes axe', async () => {
    const wrapper = mount(Main, {
      slots: { default: () => [h('h1', 'Inbox'), h('p', 'No messages.')] },
      attachTo: document.body,
    })
    const main = document.querySelector('main')!
    expect(main).not.toBeNull()
    expect(main.textContent).toContain('Inbox')
    expect(document.querySelectorAll('main, [role=main]')).toHaveLength(1)
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('as swaps the element, so nested layouts can avoid a second main landmark', async () => {
    const wrapper = mount(Main, {
      props: { as: 'div' },
      slots: { default: () => 'Content' },
      attachTo: document.body,
    })
    expect(document.querySelector('main, [role=main]')).toBeNull()
    expect(wrapper.element.tagName).toBe('DIV')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
