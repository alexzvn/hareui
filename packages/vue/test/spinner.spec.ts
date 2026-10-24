import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { VNode } from 'vue'
import { defineComponent, h } from 'vue'

import type { SpinnerProps } from '@/components/spinner/Spinner.vue'
import Spinner from '@/components/spinner/Spinner.vue'

import { expectAccessible } from './a11y'

const mountAll = (children: () => VNode[]) =>
  mount(
    defineComponent(() => () => h('div', children())),
    { attachTo: document.body },
  )

describe('Spinner', () => {
  it('is accessible at every size and color', async () => {
    const wrapper = mountAll(() => [
      h(Spinner),
      h(Spinner, { size: 'sm', color: 'danger' }),
      h(Spinner, { size: 'lg', color: 'current' }),
    ])

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is a status named "Loading" with its icon hidden, and the name can be localized', async () => {
    const wrapper = mount(Spinner, { attachTo: document.body })
    expect(wrapper.attributes()).toMatchObject({ role: 'status', 'aria-label': 'Loading' })
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')

    // aria-label is a fallthrough attr, not a declared prop; setProps forwards it all the same.
    const localized: Partial<SpinnerProps> & { 'aria-label': string } = {
      'aria-label': 'Chargement',
    }

    await wrapper.setProps(localized)
    expect(wrapper.attributes('aria-label')).toBe('Chargement')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('each instance references its own gradients', () => {
    const wrapper = mountAll(() => [h(Spinner), h(Spinner)])
    const ids = wrapper.findAll('linearGradient').map((g) => g.attributes('id'))
    expect(new Set(ids).size).toBe(4)

    for (const path of wrapper.findAll('path[fill^="url("]'))
      expect(ids).toContain(path.attributes('fill')!.slice(5, -1))

    wrapper.unmount()
  })

  it('is not focusable', () => {
    const wrapper = mount(Spinner)
    expect(wrapper.attributes('tabindex')).toBeUndefined()
    wrapper.unmount()
  })
})
