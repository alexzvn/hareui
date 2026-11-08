import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import { Extension } from '@tiptap/vue-3'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import type {
  EditorMentionMenuItem,
  EditorMentionMenuProps,
} from '@/components/editor-mention-menu/EditorMentionMenu.types'
import EditorMentionMenu from '@/components/editor-mention-menu/EditorMentionMenu.vue'
import type { EditorProps } from '@/components/editor/Editor.types'
import Editor from '@/components/editor/Editor.vue'

const nextFrame = () => {
  const { promise, resolve } = Promise.withResolvers<void>()
  requestAnimationFrame(() => resolve())

  return promise
}

// The editor's reactive state follows a transaction two animation frames later.
const settle = async () => {
  await nextFrame()
  await nextFrame()
  for (let i = 0; i < 4; i++) await nextTick()
}

const wrappers: { unmount: () => void }[] = []

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount()
  document.body.innerHTML = ''
})

const people: EditorMentionMenuItem[] = [
  { id: 'ada', label: 'Ada Lovelace', description: 'Engineering', avatar: { src: '/ada.png' } },
  { id: 'grace', label: 'Grace Hopper', description: 'Compilers' },
  { label: 'Alan Turing', icon: 'gravity-ui--person' },
]

type MenuProps = Omit<EditorMentionMenuProps, 'editor'>

// Each entry of `menus` is one EditorMentionMenu; `shown` turns them off one by one.
const mountMenus = async (menus: MenuProps[] = [{}], props: Partial<EditorProps> = {}) => {
  const shown = ref(menus.map(() => true))
  let instance: TiptapEditor | undefined

  const Harness = defineComponent({
    setup: () => () =>
      h(
        Editor,
        { ...props, modelValue: '<p></p>', 'aria-label': 'Notes' },
        {
          default: ({ editor }: { editor: TiptapEditor }) => {
            instance = editor

            return menus.flatMap((menu, index) =>
              shown.value[index]
                ? [h(EditorMentionMenu, { key: index, items: people, ...menu, editor })]
                : [],
            )
          },
        },
      ),
  })

  const wrapper = mount(Harness, { attachTo: document.body })
  wrappers.push(wrapper)
  await settle()

  return { shown, editor: () => instance! }
}

const menu = () => document.querySelector<HTMLElement>('[data-slot=editor-mention-menu]')

const optionLabels = () =>
  [
    ...(menu()?.querySelectorAll('[role=option] [data-slot=editor-mention-menu-item-label]') ?? []),
  ].map((label) => label.textContent?.trim())

const type = async (editor: TiptapEditor, text: string) => {
  editor.chain().focus().insertContent(text).run()
  await settle()
}

const pressKey = async (editor: TiptapEditor, key: string) => {
  editor.view.dom.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
  )

  await settle()
}

const paragraph = (editor: TiptapEditor) => editor.getJSON().content?.[0]?.content

describe('EditorMentionMenu', () => {
  it('opens on `@` and filters people by the typed text', async () => {
    const { editor } = await mountMenus()

    await type(editor(), '@')

    expect(menu()?.getAttribute('role')).toBe('listbox')
    expect(optionLabels()).toEqual(['Ada Lovelace', 'Grace Hopper', 'Alan Turing'])

    await type(editor(), 'gr')

    expect(optionLabels()).toEqual(['Grace Hopper'])
  })

  it('shows an avatar, the initials without one, or the icon before the label', async () => {
    const { editor } = await mountMenus()

    await type(editor(), '@')

    const options = menu()!.querySelectorAll('[role=option]')

    expect(options[0]!.querySelector('[data-slot=avatar-fallback]')?.textContent?.trim()).toBe('AL')
    expect(options[0]!.textContent).toContain('Engineering')
    expect(options[1]!.querySelector('[data-slot=avatar-fallback]')?.textContent?.trim()).toBe('GH')
    expect(options[2]!.querySelector('[data-slot=avatar-fallback]')).toBeNull()
    expect(options[2]!.querySelector('[data-slot=editor-mention-menu-item-icon]')).not.toBeNull()
  })

  it('groups people in sections', async () => {
    const { editor } = await mountMenus([
      {
        items: [
          { type: 'section', label: 'Teammates', items: people.slice(0, 2) },
          { type: 'section', label: 'Groups', items: [{ label: 'design-team' }] },
        ],
      },
    ])

    await type(editor(), '@')

    expect(optionLabels()).toEqual(['Ada Lovelace', 'Grace Hopper', 'design-team'])
    expect(menu()?.textContent).toContain('Teammates')
    expect(menu()?.textContent).toContain('Groups')
  })

  it('shows the `empty` slot when no one matches', async () => {
    const { editor } = await mountMenus()

    await type(editor(), '@zz')

    expect(menu()?.querySelector('[data-slot=empty]')?.textContent?.trim()).toBe('No results')
  })

  it('replaces the trigger and the typed text with a mention and a space on Enter', async () => {
    const { editor } = await mountMenus()

    await type(editor(), 'Ask @gr')
    await pressKey(editor(), 'Enter')

    expect(paragraph(editor())).toMatchObject([
      { type: 'text', text: 'Ask ' },
      {
        type: 'mention',
        attrs: { id: 'grace', label: 'Grace Hopper', mentionSuggestionChar: '@' },
      },
      { type: 'text', text: ' ' },
    ])

    expect(editor().getText()).toBe('Ask @Grace Hopper ')
    expect(editor().view.dom.querySelector('.mention')?.textContent).toBe('@Grace Hopper')
    expect(menu()).toBeNull()
  })

  it('uses the label as the id of a person without one', async () => {
    const { editor } = await mountMenus()

    await type(editor(), '@alan')
    menu()!.querySelector<HTMLElement>('[role=option]')!.click()
    await settle()

    expect(paragraph(editor())?.[0]).toMatchObject({
      type: 'mention',
      attrs: { id: 'Alan Turing' },
    })
  })

  it('renders a mention with the trigger character it was typed with', async () => {
    const { editor } = await mountMenus([{ char: '#', items: [{ id: 'design', label: 'design' }] }])

    await type(editor(), '#')
    await pressKey(editor(), 'Enter')

    expect(paragraph(editor())?.[0]).toMatchObject({
      type: 'mention',
      attrs: { mentionSuggestionChar: '#' },
    })

    expect(editor().getText()).toBe('#design ')
  })

  it('gets Enter before the keyboard shortcuts of other extensions', async () => {
    let submits = 0
    const Submit = Extension.create({
      name: 'submit',
      addKeyboardShortcuts: () => ({
        Enter: () => {
          submits++

          return true
        },
      }),
    })

    const { editor } = await mountMenus([{}], { extensions: [Submit] })

    await type(editor(), '@ada')
    await pressKey(editor(), 'Enter')

    expect(paragraph(editor())?.[0]).toMatchObject({ type: 'mention', attrs: { id: 'ada' } })
    expect(submits).toBe(0)

    await pressKey(editor(), 'Enter')

    expect(submits).toBe(1)
  })

  it('leaves the mention node out of the editor with `mention: false`', async () => {
    const { editor } = await mountMenus([], { mention: false })

    expect(editor().schema.nodes.mention).toBeUndefined()
  })

  it('removes only its own plugin when it unmounts, leaving its sibling', async () => {
    const { shown, editor } = await mountMenus([{}, { char: '#' }])
    const plugins = editor().state.plugins.length

    shown.value = [false, true]
    await settle()

    expect(editor().state.plugins).toHaveLength(plugins - 1)

    await type(editor(), '@')

    expect(menu()).toBeNull()

    await type(editor(), ' #')

    expect(optionLabels()).toHaveLength(3)
  })
})
