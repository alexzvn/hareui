import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import Drawer from '@/components/drawer/Drawer.vue'

const contentClasses = async (
  placement: 'left' | 'right' | 'top' | 'bottom',
  ui?: { content?: string },
) => {
  mount(Drawer, {
    props: { defaultOpen: true, placement, title: 'T', ui },
    attachTo: document.body,
  })

  await nextTick()

  const content = document.querySelector('[data-slot=drawer-content]')
  expect(content).not.toBeNull()

  return content!.className
}

describe('Drawer theme', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  // drawer.css docks each side modifier to the physical edge in both directions (`rtl:` flips the justification)
  it.each(['left', 'right', 'top', 'bottom'] as const)(
    'gives a %s drawer its placement modifier',
    async (placement) => {
      const classes = (await contentClasses(placement)).split(' ')

      expect(classes).toEqual(
        expect.arrayContaining(['h-drawer__content', `h-drawer__content--${placement}`]),
      )
    },
  )

  it.each(['left', 'right'] as const)(
    'lets ui.content override a %s drawer justification in LTR',
    async (placement) => {
      const classes = (await contentClasses(placement, { content: 'justify-center' })).split(' ')

      expect(classes).toContain('justify-center')
      expect(classes).not.toContain('justify-start')
      expect(classes).not.toContain('justify-end')
      expect(classes.some((c) => c.startsWith('ltr:'))).toBe(false)
    },
  )

  it.each(['top', 'bottom'] as const)(
    'leaves a %s drawer unaffected by direction',
    async (placement) => {
      expect(await contentClasses(placement)).not.toMatch(/(ltr|rtl):/)
    },
  )
})
