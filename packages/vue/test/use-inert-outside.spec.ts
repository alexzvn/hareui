import { afterEach, describe, expect, it } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'

import { useInertOutside } from '@/composables/useInertOutside'

// An app mounted in a shadow root (e.g. a browser extension panel), with its overlay portaled inside that root.
const mountShadowApp = () => {
  const page = document.body.appendChild(document.createElement('main'))
  const host = document.body.appendChild(document.createElement('div'))
  const shadow = host.attachShadow({ mode: 'open' })
  const app = shadow.appendChild(document.createElement('div'))
  const toasts = shadow.appendChild(document.createElement('div'))
  toasts.setAttribute('aria-live', 'polite')
  const portal = shadow.appendChild(document.createElement('div'))
  const content = portal.appendChild(document.createElement('div'))

  return { page, host, app, toasts, content }
}

describe('useInertOutside', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('keeps an overlay inside a shadow root interactive and makes its surroundings inert', async () => {
    const { page, host, app, toasts, content } = mountShadowApp()
    const isOpen = ref(true)
    const scope = effectScope()
    scope.run(() => useInertOutside(content, isOpen))
    await nextTick()

    expect(host.hasAttribute('inert')).toBe(false)
    expect(content.closest('[inert]')).toBeNull()
    expect(page.hasAttribute('inert')).toBe(true)
    expect(app.hasAttribute('inert')).toBe(true)
    expect(toasts.hasAttribute('inert')).toBe(false)

    isOpen.value = false
    expect([page, app].map((node) => node.hasAttribute('inert'))).toEqual([false, false])
    scope.stop()
  })
})
