import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'

import ButtonGroup from '@/components/button-group/ButtonGroup.vue'
import Button from '@/components/button/Button.vue'
import Separator from '@/components/separator/Separator.vue'
import ToggleButtonGroup from '@/components/toggle-button-group/ToggleButtonGroup.vue'
import ToggleButton from '@/components/toggle-button/ToggleButton.vue'
import Toolbar from '@/components/toolbar/Toolbar.vue'

import { expectAccessible } from './a11y'

const mounted: { unmount: () => void }[] = []
afterEach(() => mounted.splice(0).forEach((w) => w.unmount()))

const editor = (props: Record<string, unknown> = {}) => {
  const wrapper = mount(Toolbar, {
    props: { 'aria-label': 'Text formatting', ...props },
    attachTo: document.body,
    slots: {
      default: () => [
        h(ToggleButtonGroup, { selectionMode: 'multiple', separator: true }, () =>
          ['bold', 'italic'].map((v) => h(ToggleButton, { value: v, 'aria-label': v }, () => v)),
        ),
        h(Separator),
        h(ButtonGroup, null, () => [
          h(Button, { 'aria-label': 'copy' }, () => 'C'),
          h(Button, { 'aria-label': 'cut', disabled: true }, () => 'X'),
          h(Button, { 'aria-label': 'paste' }, () => 'P'),
        ]),
      ],
    },
  })
  mounted.push(wrapper)
  const button = (label: string) => wrapper.find(`[aria-label="${label}"]`).element as HTMLElement
  return { wrapper, button }
}

const key = async (el: Element, k: string, shiftKey = false) => {
  el.dispatchEvent(
    new KeyboardEvent('keydown', { key: k, shiftKey, bubbles: true, cancelable: true }),
  )
}

describe('Toolbar', () => {
  it('passes its orientation to ToggleButtonGroups and ButtonGroups and the perpendicular one to Separators', () => {
    const { wrapper } = editor({ orientation: 'vertical' })
    expect(wrapper.attributes()).toMatchObject({ role: 'toolbar', 'aria-orientation': 'vertical' })
    const group = wrapper.find('[data-slot=toggle-button-group]')
    expect(group.attributes('data-orientation')).toBe('vertical')
    // A multiple-selection group inside is `role="group"`, which doesn't support aria-orientation.
    expect(group.attributes('aria-orientation')).toBeUndefined()
    const separator = wrapper.find('[data-slot=separator]')
    expect(separator.attributes('data-orientation')).toBe('horizontal')
    expect(separator.classes()).toEqual(expect.arrayContaining(['w-1/2', 'justify-self-center']))
    expect(wrapper.find('[data-slot=button-group]').classes()).toEqual(
      expect.arrayContaining(['justify-start', 'flex-col']),
    )
  })

  it('lets an explicit orientation and classes on children win over the toolbar', () => {
    const wrapper = mount(Toolbar, {
      slots: {
        default: () => [
          h(Separator, { orientation: 'horizontal', class: 'w-4' }),
          h(ToggleButtonGroup, { orientation: 'vertical' }, () =>
            h(ToggleButton, { value: 'a' }, () => 'a'),
          ),
        ],
      },
    })
    const separator = wrapper.find('[data-slot=separator]')
    expect(separator.attributes('data-orientation')).toBe('horizontal')
    expect(separator.classes()).toContain('w-4')
    expect(separator.classes()).not.toContain('w-1/2')
    expect(wrapper.find('[data-slot=toggle-button-group]').attributes('aria-orientation')).toBe(
      'vertical',
    )
  })

  it('a multiple-selection group inside is a plain group of tab stops; single selection stays a radiogroup', () => {
    const { wrapper } = editor()
    const group = wrapper.find('[data-slot=toggle-button-group]')
    expect(group.attributes('role')).toBe('group')
    expect(group.attributes('tabindex')).toBeUndefined()
    expect(
      wrapper.findAll('[data-slot=toggle-button]').map((b) => b.attributes('tabindex')),
    ).toEqual([undefined, undefined])
    const single = mount(Toolbar, {
      slots: {
        default: () => h(ToggleButtonGroup, null, () => h(ToggleButton, { value: 'a' }, () => 'a')),
      },
    })
    expect(single.find('[data-slot=toggle-button-group]').attributes('role')).toBe('radiogroup')
  })

  it('arrow keys move focus across all controls, skip disabled ones and do not wrap', async () => {
    const { button } = editor()
    button('bold').focus()
    await key(button('bold'), 'ArrowRight')
    expect(document.activeElement).toBe(button('italic'))
    await key(button('italic'), 'ArrowRight')
    expect(document.activeElement).toBe(button('copy'))
    await key(button('copy'), 'ArrowRight')
    expect(document.activeElement).toBe(button('paste'))
    await key(button('paste'), 'ArrowRight')
    expect(document.activeElement).toBe(button('paste'))
    await key(button('paste'), 'ArrowDown')
    expect(document.activeElement).toBe(button('paste'))
    await key(button('paste'), 'ArrowLeft')
    expect(document.activeElement).toBe(button('copy'))
  })

  it('vertical toolbars use ArrowUp/ArrowDown', async () => {
    const { button } = editor({ orientation: 'vertical' })
    button('bold').focus()
    await key(button('bold'), 'ArrowRight')
    expect(document.activeElement).toBe(button('bold'))
    await key(button('bold'), 'ArrowDown')
    expect(document.activeElement).toBe(button('italic'))
    await key(button('italic'), 'ArrowUp')
    expect(document.activeElement).toBe(button('bold'))
  })

  it('handled arrow keys do not reach the focused control', async () => {
    const { button } = editor()
    let reached = false
    button('bold').addEventListener('keydown', () => (reached = true))
    button('bold').focus()
    await key(button('bold'), 'ArrowRight')
    expect(reached).toBe(false)
  })

  it('tab leaves from the edge and focus returns to the last focused control on re-entry', async () => {
    const { button } = editor()
    const outside = document.createElement('button')
    document.body.append(outside)
    button('italic').focus()
    await key(button('italic'), 'Tab')
    expect(document.activeElement).toBe(button('paste'))
    outside.focus()
    button('bold').focus()
    expect(document.activeElement).toBe(button('italic'))
    outside.remove()
  })

  it('a nested toolbar is a group and leaves keys to the outer toolbar', async () => {
    const wrapper = mount(Toolbar, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(Button, { 'aria-label': 'a' }, () => 'a'),
          h(Toolbar, { orientation: 'vertical' }, () =>
            h(Button, { 'aria-label': 'b' }, () => 'b'),
          ),
        ],
      },
    })
    mounted.push(wrapper)
    const inner = wrapper.findAll('[data-slot=toolbar]')[1]!
    expect(inner.attributes('role')).toBe('group')
    const b = wrapper.find('[aria-label=b]').element as HTMLElement
    b.focus()
    await key(b, 'ArrowLeft')
    expect(document.activeElement).toBe(wrapper.find('[aria-label=a]').element)
  })

  it.each([
    ['horizontal', {}],
    ['vertical', { orientation: 'vertical' }],
    ['attached', { attached: true }],
  ])(
    'is accessible: %s, labelled, with groups, a separator and a disabled control',
    async (_, props) => {
      const { wrapper } = editor(props)
      expect(wrapper.attributes('aria-label')).toBe('Text formatting')
      await expectAccessible(wrapper)
    },
  )

  it('is accessible with a nested toolbar and a single-selection group inside', async () => {
    const wrapper = mount(Toolbar, {
      attachTo: document.body,
      attrs: { 'aria-label': 'Editor' },
      slots: {
        default: () => [
          h(ToggleButtonGroup, { 'aria-label': 'Alignment', defaultValue: ['l'] }, () =>
            ['l', 'r'].map((v) => h(ToggleButton, { value: v }, () => v)),
          ),
          h(Toolbar, { 'aria-label': 'History' }, () => [
            h(Button, () => 'Undo'),
            h(Button, () => 'Redo'),
          ]),
        ],
      },
    })
    mounted.push(wrapper)
    await expectAccessible(wrapper)
  })

  it('Shift+Tab leaves from the first control and arrows stop at the first control', async () => {
    const { button } = editor()
    button('paste').focus()
    await key(button('paste'), 'Tab', true)
    expect(document.activeElement).toBe(button('bold'))
    await key(button('bold'), 'ArrowLeft')
    expect(document.activeElement).toBe(button('bold'))
  })
})
