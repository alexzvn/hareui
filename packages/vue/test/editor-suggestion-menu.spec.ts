import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import { Extension } from '@tiptap/vue-3'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import type {
  EditorMenuEntry,
  EditorSuggestionMenuItem,
} from '@/components/editor-suggestion-menu/EditorSuggestionMenu.types'
import EditorSuggestionMenu from '@/components/editor-suggestion-menu/EditorSuggestionMenu.vue'
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

const items: EditorMenuEntry<EditorSuggestionMenuItem>[] = [
  {
    type: 'section',
    label: 'Style',
    items: [
      { kind: 'paragraph', label: 'Text' },
      { kind: 'heading', level: 1, label: 'Heading 1' },
      { kind: 'heading', level: 2, label: 'Heading 2' },
    ],
  },
  { type: 'separator' },
  { kind: 'bulletList', label: 'Bullet list' },
  { kind: 'blockquote', label: 'Quote', description: 'Capture a quote' },
]

type MenuProps = {
  char?: string
  items?: EditorMenuEntry<EditorSuggestionMenuItem>[] | EditorSuggestionMenuItem[][]
  portal?: boolean
  loading?: boolean
  onSelect?: (item: EditorSuggestionMenuItem) => void
  'onUpdate:open'?: (open: boolean) => void
}

// Each entry of `menus` is one EditorSuggestionMenu; `shown` turns them off one by one.
const mountMenus = async (
  menus: MenuProps[] = [{}],
  {
    props = {},
    modelValue = '<p></p>',
  }: { props?: Partial<EditorProps>; modelValue?: string } = {},
) => {
  const shown = ref(menus.map(() => true))
  let instance: TiptapEditor | undefined

  const Harness = defineComponent({
    setup: () => () =>
      h(
        Editor,
        { ...props, modelValue, 'aria-label': 'Notes' },
        {
          default: ({ editor }: { editor: TiptapEditor }) => {
            instance = editor

            return menus.flatMap((menu, index) =>
              shown.value[index]
                ? [h(EditorSuggestionMenu, { key: index, items, ...menu, editor })]
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

const menu = () => document.querySelector<HTMLElement>('[data-slot=editor-suggestion-menu]')

const optionLabels = () =>
  [
    ...(menu()?.querySelectorAll('[role=option] [data-slot=editor-suggestion-menu-item-label]') ??
      []),
  ].map((label) => label.textContent?.trim())

const highlighted = () =>
  menu()
    ?.querySelector(
      '[role=option][aria-selected=true] [data-slot=editor-suggestion-menu-item-label]',
    )
    ?.textContent?.trim()

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

describe('EditorSuggestionMenu', () => {
  it('opens on the trigger character with every group, section headings and separators', async () => {
    const { editor } = await mountMenus()

    expect(menu()).toBeNull()

    await type(editor(), '/')

    expect(menu()?.getAttribute('role')).toBe('listbox')
    expect(optionLabels()).toEqual(['Text', 'Heading 1', 'Heading 2', 'Bullet list', 'Quote'])
    expect(menu()?.textContent).toContain('Style')
    expect(menu()?.querySelectorAll('[role=separator]')).toHaveLength(1)
    expect(highlighted()).toBe('Text')

    const group = menu()!.querySelector('[role=group]')!
    const heading = document.getElementById(group.getAttribute('aria-labelledby')!)

    expect(heading?.textContent?.trim()).toBe('Style')
  })

  it('takes nested arrays as groups', async () => {
    const { editor } = await mountMenus([
      {
        items: [
          [{ kind: 'paragraph', label: 'Text' }],
          [{ kind: 'bulletList', label: 'Bullet list' }],
        ],
      },
    ])

    await type(editor(), '/')

    expect(optionLabels()).toEqual(['Text', 'Bullet list'])
    expect(menu()?.querySelectorAll('[role=group]')).toHaveLength(2)
    expect(menu()?.querySelectorAll('[role=separator]')).toHaveLength(1)
  })

  it('renders the menu outside the editor, whose field clips its content', async () => {
    const { editor } = await mountMenus()

    await type(editor(), '/')

    expect(menu()).not.toBeNull()
    expect(document.querySelector('[data-slot=editor]')!.contains(menu())).toBe(false)
  })

  it('renders the menu in place with `portal` off', async () => {
    const { editor } = await mountMenus([{ portal: false }])

    await type(editor(), '/')

    expect(document.querySelector('[data-slot=editor]')!.contains(menu())).toBe(true)
  })

  it('filters by the text typed after the trigger, keeping the group heading', async () => {
    const { editor } = await mountMenus()

    await type(editor(), '/head')

    expect(optionLabels()).toEqual(['Heading 1', 'Heading 2'])
    expect(menu()?.textContent).toContain('Style')
    expect(menu()?.querySelectorAll('[role=separator]')).toHaveLength(0)
  })

  it('ranks exact matches first, then matches at the start, then matches anywhere', async () => {
    const { editor } = await mountMenus([
      {
        items: [
          [
            { kind: 'codeBlock', label: 'Inline code block' },
            { kind: 'codeBlock', label: 'Code block' },
            { kind: 'mark', mark: 'code', label: 'Code' },
          ],
        ],
      },
    ])

    await type(editor(), '/code')

    expect(optionLabels()).toEqual(['Code', 'Code block', 'Inline code block'])
  })

  it('also matches labels with their spaces, dashes and underscores removed', async () => {
    const { editor } = await mountMenus()

    await type(editor(), '/bulletl')

    expect(optionLabels()).toEqual(['Bullet list'])
  })

  it('stays open with a "No results" row when nothing matches', async () => {
    const { editor } = await mountMenus()

    await type(editor(), '/zzz')

    expect(optionLabels()).toEqual([])
    expect(menu()?.querySelector('[data-slot=empty]')?.textContent?.trim()).toBe('No results')
  })

  it('shows a spinner row instead of the items while `loading`', async () => {
    const { editor } = await mountMenus([{ loading: true }])

    await type(editor(), '/')

    expect(optionLabels()).toEqual([])
    expect(menu()?.querySelector('[data-slot=loading]')).not.toBeNull()
    expect(menu()?.getAttribute('aria-busy')).toBe('true')
  })

  it('wires the editor to the listbox while open', async () => {
    const { editor } = await mountMenus()
    const dom = editor().view.dom

    await type(editor(), '/')

    expect(dom.getAttribute('aria-expanded')).toBe('true')
    expect(dom.getAttribute('aria-controls')).toBe(menu()!.id)
    expect(dom.getAttribute('aria-autocomplete')).toBe('list')

    const activeOption = () => document.getElementById(dom.getAttribute('aria-activedescendant')!)

    expect(activeOption()?.textContent).toContain('Text')

    await pressKey(editor(), 'ArrowDown')

    expect(activeOption()?.textContent).toContain('Heading 1')

    await pressKey(editor(), 'Escape')

    expect(dom.hasAttribute('aria-expanded')).toBe(false)
    expect(dom.hasAttribute('aria-activedescendant')).toBe(false)
  })

  it("runs an item's own `onSelect` and emits `select` and `update:open`", async () => {
    const picked: string[] = []
    const open: boolean[] = []
    const { editor } = await mountMenus([
      {
        items: [
          {
            label: 'Today',
            onSelect: (instance) => instance.chain().insertContent('Friday').run(),
          },
        ],
        onSelect: (item) => picked.push(item.label),
        'onUpdate:open': (value) => open.push(value),
      },
    ])

    await type(editor(), '/tod')
    await pressKey(editor(), 'Enter')

    expect(editor().getText()).toBe('Friday')
    expect(picked).toEqual(['Today'])
    expect(open).toEqual([true, false])
  })

  it("shows an item's `kbd` at the end of its row", async () => {
    const { editor } = await mountMenus([
      { items: [{ kind: 'bulletList', label: 'Bullet list', kbd: { content: '-' } }] },
    ])

    await type(editor(), '/')

    expect(menu()?.querySelector('kbd')?.textContent?.trim()).toBe('-')
  })

  it('moves the highlight with the arrow keys, wrapping around', async () => {
    const { editor } = await mountMenus()

    await type(editor(), '/head')
    await pressKey(editor(), 'ArrowDown')

    expect(highlighted()).toBe('Heading 2')

    await pressKey(editor(), 'ArrowDown')

    expect(highlighted()).toBe('Heading 1')

    await pressKey(editor(), 'ArrowUp')

    expect(highlighted()).toBe('Heading 2')
  })

  it('runs the highlighted command on Enter in place of the typed text', async () => {
    const { editor } = await mountMenus()

    await type(editor(), '/head')
    await pressKey(editor(), 'ArrowDown')
    await pressKey(editor(), 'Enter')

    // The editor keeps an empty paragraph after a last block of another type.
    expect(editor().getHTML()).toBe('<h2></h2><p></p>')
    expect(menu()).toBeNull()
  })

  it('runs a command on click', async () => {
    const { editor } = await mountMenus()

    await type(editor(), '/quo')
    menu()!.querySelector<HTMLElement>('[role=option]')!.click()
    await settle()

    expect(editor().getHTML()).toBe('<blockquote><p></p></blockquote><p></p>')
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

    const { editor } = await mountMenus([{}], { props: { extensions: [Submit] } })

    await type(editor(), '/quo')
    await pressKey(editor(), 'Enter')

    expect(editor().getHTML()).toBe('<blockquote><p></p></blockquote><p></p>')
    expect(submits).toBe(0)

    await type(editor(), '/zzz')
    await pressKey(editor(), 'Enter')

    expect(submits).toBe(1)
  })

  it('closes on Escape and keeps the typed text', async () => {
    const { editor } = await mountMenus()

    await type(editor(), '/he')
    await pressKey(editor(), 'Escape')

    expect(menu()).toBeNull()
    expect(editor().getText()).toBe('/he')
  })

  it('removes only its own plugin when it unmounts', async () => {
    const { shown, editor } = await mountMenus([{}, { char: '#' }])
    const plugins = editor().state.plugins.length

    shown.value = [false, true]
    await settle()

    expect(editor().state.plugins).toHaveLength(plugins - 1)

    await type(editor(), '/')

    expect(menu()).toBeNull()

    await type(editor(), ' #')

    expect(optionLabels()).toHaveLength(5)
  })
})
