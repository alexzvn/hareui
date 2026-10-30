import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import type {
  EditorToolbarItem,
  EditorToolbarProps,
} from '@/components/editor-toolbar/EditorToolbar.types'
import EditorToolbar from '@/components/editor-toolbar/EditorToolbar.vue'
import type { EditorHandler, EditorProps } from '@/components/editor/Editor.types'
import Editor from '@/components/editor/Editor.vue'

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

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

type HarnessOptions = {
  props?: Partial<EditorProps>
  items?: EditorToolbarItem[] | EditorToolbarItem[][]
  toolbar?: Partial<EditorToolbarProps>
  footer?: boolean
}

const mountEditor = async ({ props = {}, items, toolbar, footer = false }: HarnessOptions = {}) => {
  const model = ref(props.modelValue)
  const updates: unknown[] = []
  let instance: TiptapEditor | undefined

  const Harness = defineComponent({
    setup: () => () =>
      h(
        Editor,
        {
          ...props,
          modelValue: model.value,
          'onUpdate:modelValue': (value: unknown) => {
            updates.push(value)
            model.value = value as typeof model.value
          },
        },
        {
          default: ({ editor }: { editor: TiptapEditor }) => {
            instance = editor

            return items ? [h(EditorToolbar, { ...toolbar, editor, items })] : []
          },
          ...(footer
            ? {
                footer: ({ editor }: { editor: TiptapEditor }) => [
                  h('span', `${editor.getText().length} chars`),
                ],
              }
            : {}),
        },
      ),
  })

  const wrapper = mount(Harness, { attachTo: document.body })
  wrappers.push(wrapper)
  await settle()

  return { wrapper, model, updates, editor: () => instance! }
}

const prose = () => document.querySelector<HTMLElement>('.ProseMirror')!

const button = (name: string) =>
  document.querySelector<HTMLButtonElement>(
    `[data-slot=editor-toolbar] button[aria-label="${name}"]`,
  )!

describe('Editor', () => {
  it('renders a multiline textbox with the HTML document', async () => {
    await mountEditor({ props: { modelValue: '<p>Hello <strong>world</strong></p>' } })

    const textbox = prose()
    expect(textbox.getAttribute('contenteditable')).toBe('true')
    expect(textbox.getAttribute('role')).toBe('textbox')
    expect(textbox.querySelector('strong')?.textContent).toBe('world')
  })

  it('emits HTML when the document changes and the content type is html', async () => {
    const { editor, updates } = await mountEditor({ props: { modelValue: '<p>Draft</p>' } })

    editor().commands.insertContentAt(editor().state.doc.content.size - 1, ' two')
    await settle()

    expect(updates.at(-1)).toBe('<p>Draft two</p>')
  })

  it('emits a JSON document when the value is an object', async () => {
    const doc = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A' }] }],
    }

    const { editor, updates } = await mountEditor({ props: { modelValue: doc } })

    editor().commands.insertContentAt(2, 'B')
    await settle()

    expect(updates.at(-1)).toMatchObject({ type: 'doc', content: [{ type: 'paragraph' }] })
    expect(editor().getText()).toBe('AB')
  })

  it('reads and writes Markdown with contentType markdown', async () => {
    const { editor, updates } = await mountEditor({
      props: { modelValue: '# Title\n\nSome **bold** text', contentType: 'markdown' },
    })

    expect(prose().querySelector('h1')?.textContent).toBe('Title')
    expect(prose().querySelector('strong')?.textContent).toBe('bold')

    editor().commands.insertContentAt(1, 'New ')
    await settle()

    expect(String(updates.at(-1))).toContain('# New Title')
  })

  it('replaces the document when v-model changes from outside', async () => {
    const { model } = await mountEditor({ props: { modelValue: '<p>First</p>' } })

    model.value = '<p>Second</p>'
    await settle()

    expect(prose().textContent).toBe('Second')
  })

  it('shows the placeholder on an empty document', async () => {
    await mountEditor({ props: { modelValue: '', placeholder: 'Write a note' } })

    const paragraph = prose().querySelector('p')!
    expect(paragraph.getAttribute('data-placeholder')).toBe('Write a note')
  })

  it('becomes read-only when editable is false', async () => {
    await mountEditor({ props: { modelValue: '<p>Locked</p>', editable: false } })

    expect(prose().getAttribute('contenteditable')).toBe('false')
  })

  it('marks the field disabled and blocks editing when disabled', async () => {
    await mountEditor({ props: { modelValue: '<p>Off</p>', disabled: true } })

    expect(prose().getAttribute('contenteditable')).toBe('false')
    expect(prose().getAttribute('aria-disabled')).toBe('true')
    expect(document.querySelector('[data-slot=editor]')?.getAttribute('data-disabled')).toBe('true')
  })

  it('forwards fallthrough attributes to the editable element', async () => {
    const wrapper = mount(Editor, {
      props: { modelValue: '<p>x</p>' },
      attrs: { 'aria-label': 'Release notes' },
      attachTo: document.body,
    })

    wrappers.push(wrapper)
    await settle()

    expect(prose().getAttribute('aria-label')).toBe('Release notes')
  })

  it('keeps a plain-text editor when starterKit is false', async () => {
    await mountEditor({ props: { modelValue: '<p><strong>Bold</strong></p>', starterKit: false } })

    expect(prose().querySelector('strong')).toBeNull()
    expect(prose().textContent).toBe('Bold')
  })

  it('does not echo an outside v-model change back as an update', async () => {
    const { model, updates } = await mountEditor({ props: { modelValue: '<p>First</p>' } })

    model.value = '<p>Second</p>'
    await settle()

    expect(updates).toEqual([])
  })

  it('marks a read-only document with aria-readonly', async () => {
    await mountEditor({ props: { modelValue: '<p>Locked</p>', editable: false } })

    expect(prose().getAttribute('aria-readonly')).toBe('true')
  })

  it('follows disabled when it changes after mount', async () => {
    const wrapper = mount(Editor, { props: { modelValue: '<p>x</p>' }, attachTo: document.body })
    wrappers.push(wrapper)
    await settle()

    await wrapper.setProps({ disabled: true })
    await settle()

    expect(prose().getAttribute('contenteditable')).toBe('false')
    expect(prose().getAttribute('aria-disabled')).toBe('true')

    await wrapper.setProps({ disabled: false })
    await settle()

    expect(prose().getAttribute('contenteditable')).toBe('true')
    expect(prose().hasAttribute('aria-disabled')).toBe(false)
  })

  it('shows a new placeholder text without recreating the editor', async () => {
    const wrapper = mount(Editor, {
      props: { modelValue: '', placeholder: 'Write a note' },
      attachTo: document.body,
    })

    wrappers.push(wrapper)
    await settle()

    await wrapper.setProps({ placeholder: 'Écrire une note' })
    await settle()

    expect(prose().querySelector('p')!.getAttribute('data-placeholder')).toBe('Écrire une note')
  })

  it('renders the footer slot with the editor', async () => {
    await mountEditor({ props: { modelValue: '<p>abc</p>' }, footer: true })

    expect(document.querySelector('[data-slot=editor-footer]')?.textContent).toBe('3 chars')
  })
})

describe('EditorToolbar', () => {
  it('renders a toolbar with groups split by separators', async () => {
    await mountEditor({
      props: { modelValue: '<p>Text</p>' },
      items: [[{ kind: 'mark', mark: 'bold' }], [{ kind: 'undo' }]],
    })

    const toolbar = document.querySelector('[role=toolbar]')!
    expect(toolbar.querySelectorAll('[role=group]')).toHaveLength(2)
    expect(toolbar.querySelectorAll('[role=separator]')).toHaveLength(1)
  })

  it('names command buttons after their command', async () => {
    await mountEditor({
      props: { modelValue: '<p>Text</p>' },
      items: [{ kind: 'heading', level: 2 }, { kind: 'bulletList' }],
    })

    expect(button('Heading 2')).toBeTruthy()
    expect(button('Bullet list')).toBeTruthy()
  })

  it('toggles a mark on the selection and shows it pressed', async () => {
    const { editor, updates } = await mountEditor({
      props: { modelValue: '<p>Hello</p>' },
      items: [{ kind: 'mark', mark: 'bold' }],
    })

    editor().commands.setTextSelection({ from: 1, to: 6 })
    await settle()
    button('Bold').click()
    await settle()

    expect(updates.at(-1)).toBe('<p><strong>Hello</strong></p>')
    expect(button('Bold').getAttribute('aria-pressed')).toBe('true')
  })

  it('turns the current block into a heading', async () => {
    const { updates } = await mountEditor({
      props: { modelValue: '<p>Title</p>' },
      items: [{ kind: 'heading', level: 1 }],
    })

    button('Heading 1').click()
    await settle()

    expect(updates.at(-1)).toMatch(/^<h1>Title<\/h1>/)
  })

  it('disables undo until there is history', async () => {
    const { editor } = await mountEditor({
      props: { modelValue: '<p>Text</p>' },
      items: [{ kind: 'undo' }, { kind: 'redo' }],
    })

    expect(button('Undo').disabled).toBe(true)

    editor().commands.insertContent('!')
    await settle()

    expect(button('Undo').disabled).toBe(false)
    expect(button('Redo').disabled).toBe(true)
  })

  it('disables every item when the editor is read-only', async () => {
    await mountEditor({
      props: { modelValue: '<p>Text</p>', editable: false },
      items: [{ kind: 'mark', mark: 'italic' }, { kind: 'blockquote' }],
    })

    expect(button('Italic').disabled).toBe(true)
    expect(button('Quote').disabled).toBe(true)
  })

  it('runs onClick of items without a command', async () => {
    const onClick = vi.fn<(event: MouseEvent) => void>()
    await mountEditor({
      props: { modelValue: '<p>Text</p>' },
      items: [{ label: 'Save', onClick }],
    })

    const save = [...document.querySelectorAll('button')].find((el) => el.textContent === 'Save')!
    save.click()

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('runs custom handlers passed to the editor', async () => {
    const execute = vi.fn<EditorHandler['execute']>((editor) =>
      editor.chain().focus().insertContent('★'),
    )

    const handlers = {
      star: { canExecute: () => true, execute, isActive: () => false },
    }

    const { editor } = await mountEditor({
      props: { modelValue: '<p>A</p>', handlers },
      items: [{ kind: 'star', 'aria-label': 'Star' }],
    })

    button('Star').click()
    await settle()

    expect(execute).toHaveBeenCalledOnce()
    expect(editor().getText()).toContain('★')
  })

  it('runs a command from a dropdown and checks the active entry', async () => {
    const { updates } = await mountEditor({
      props: { modelValue: '<p>Title</p>' },
      items: [
        {
          'aria-label': 'Text style',
          items: [
            { kind: 'paragraph' },
            { kind: 'heading', level: 1 },
            { kind: 'heading', level: 2 },
          ],
        },
      ],
    })

    const trigger = button('Text style')
    trigger.focus()
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await settle()

    const entries = [...document.querySelectorAll<HTMLElement>('[data-slot=menu-item]')]
    const paragraph = entries.find((el) => el.textContent?.includes('Paragraph'))!
    expect(paragraph.getAttribute('aria-checked')).toBe('true')

    entries.find((el) => el.textContent?.includes('Heading 2'))!.click()
    await settle()

    expect(updates.at(-1)).toMatch(/^<h2>Title<\/h2>/)
  })

  describe('URL popover', () => {
    const urlInput = () =>
      document.querySelector<HTMLInputElement>('[data-slot=editor-toolbar-url-input]')

    const actionButton = (name: string) =>
      [...document.querySelectorAll<HTMLButtonElement>('[data-slot=popover] button')].find(
        (el) => el.textContent?.trim() === name,
      )

    const openPopover = async (
      kind: 'link' | 'image',
      { modelValue, select }: { modelValue: string; select: (editor: TiptapEditor) => void },
    ) => {
      const harness = await mountEditor({ props: { modelValue }, items: [{ kind }] })
      select(harness.editor())
      await settle()
      button(kind === 'link' ? 'Link' : 'Image').click()
      await settle()

      return harness
    }

    const openLinkPopover = (modelValue: string, selection: { from: number; to: number }) =>
      openPopover('link', {
        modelValue,
        select: (editor) => editor.commands.setTextSelection(selection),
      })

    const typeUrl = async (url: string) => {
      urlInput()!.value = url
      urlInput()!.dispatchEvent(new Event('input'))
      await nextTick()
    }

    const pressKey = async (key: string) => {
      urlInput()!.dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
      )

      await settle()
    }

    it('opens with the URL field focused', async () => {
      await openLinkPopover('<p>Hello</p>', { from: 1, to: 6 })

      expect(document.activeElement).toBe(urlInput())
    })

    it('links the selection to the URL on Apply', async () => {
      const { updates } = await openLinkPopover('<p>Hello</p>', { from: 1, to: 6 })

      await typeUrl('https://example.com')
      actionButton('Apply')!.click()
      await settle()

      expect(updates.at(-1)).toMatch(/<a [^>]*href="https:\/\/example\.com"[^>]*>Hello<\/a>/)
      expect(urlInput()).toBeNull()
    })

    it('applies the URL on Enter', async () => {
      const { updates } = await openLinkPopover('<p>Hello</p>', { from: 1, to: 6 })

      await typeUrl('https://example.com')
      await pressKey('Enter')

      expect(updates.at(-1)).toMatch(/href="https:\/\/example\.com"/)
    })

    it('closes on Escape without linking', async () => {
      const { updates } = await openLinkPopover('<p>Hello</p>', { from: 1, to: 6 })

      await typeUrl('https://example.com')
      await pressKey('Escape')

      expect(urlInput()).toBeNull()
      expect(updates).toEqual([])
    })

    it('starts with the URL of the link at the caret', async () => {
      await openLinkPopover('<p><a href="https://old.test">Hello</a></p>', { from: 3, to: 3 })

      expect(urlInput()!.value).toBe('https://old.test')
    })

    it('replaces the URL of the link at the caret', async () => {
      const { updates } = await openLinkPopover('<p><a href="https://old.test">Hello</a></p>', {
        from: 3,
        to: 3,
      })

      await typeUrl('https://new.test')
      actionButton('Apply')!.click()
      await settle()

      expect(updates.at(-1)).toMatch(/<a [^>]*href="https:\/\/new\.test"[^>]*>Hello<\/a>/)
    })

    it('removes the link at the caret on Remove', async () => {
      const { updates } = await openLinkPopover('<p><a href="https://old.test">Hello</a></p>', {
        from: 3,
        to: 3,
      })

      actionButton('Remove')!.click()
      await settle()

      expect(updates.at(-1)).toBe('<p>Hello</p>')
    })

    it('offers no Remove when the selection is not on a link', async () => {
      await openLinkPopover('<p>Hello</p>', { from: 1, to: 6 })

      expect(actionButton('Remove')).toBeUndefined()
    })

    it('inserts an image from the URL on Apply', async () => {
      const { updates } = await openPopover('image', {
        modelValue: '<p>Hello</p>',
        select: (editor) => editor.commands.setTextSelection(6),
      })

      await typeUrl('https://example.com/photo.png')
      await pressKey('Enter')

      expect(updates.at(-1)).toMatch(/<img [^>]*src="https:\/\/example\.com\/photo\.png"/)
    })

    it('replaces the selected image with the new URL', async () => {
      const { updates } = await openPopover('image', {
        modelValue: '<img src="https://old.test/a.png">',
        select: (editor) => editor.commands.setNodeSelection(0),
      })

      expect(urlInput()!.value).toBe('https://old.test/a.png')

      await typeUrl('https://new.test/b.png')
      await pressKey('Enter')

      expect(updates.at(-1)).toMatch(/src="https:\/\/new\.test\/b\.png"/)
      expect(updates.at(-1)).not.toMatch(/old\.test/)
    })

    it('offers no Remove for images', async () => {
      await openPopover('image', {
        modelValue: '<p>Hello</p>',
        select: (editor) => editor.commands.setTextSelection(6),
      })

      expect(actionButton('Remove')).toBeUndefined()
    })

    it('keeps a bubble toolbar open while its URL field has focus', async () => {
      const { editor, updates } = await mountEditor({
        props: { modelValue: '<p>Hello</p>' },
        items: [{ kind: 'link' }],
        toolbar: { layout: 'bubble', updateDelay: 0 },
      })

      prose().focus()
      editor().commands.setTextSelection({ from: 1, to: 6 })
      await settle()

      const menu = document.querySelector('[data-slot=editor-toolbar-menu]')

      expect(menu?.isConnected).toBe(true)

      button('Link').click()
      await settle()

      expect(document.activeElement).toBe(urlInput())
      expect(menu?.isConnected).toBe(true)

      await typeUrl('https://example.com')
      actionButton('Apply')!.click()
      await settle()

      expect(updates.at(-1)).toMatch(/<a [^>]*href="https:\/\/example\.com"[^>]*>Hello<\/a>/)
      expect(urlInput()).toBeNull()
    })
  })

  it('renders a named item slot instead of the button', async () => {
    const Harness = defineComponent({
      setup: () => () =>
        h(
          Editor,
          { modelValue: '<p>x</p>' },
          {
            default: ({ editor }: { editor: TiptapEditor }) => [
              h(
                EditorToolbar,
                { editor, items: [{ slot: 'custom', label: 'Custom' }] },
                { custom: () => [h('em', { 'data-testid': 'custom' }, 'mine')] },
              ),
            ],
          },
        ),
    })

    const wrapper = mount(Harness, { attachTo: document.body })
    wrappers.push(wrapper)
    await settle()

    expect(document.querySelector('[data-testid=custom]')?.textContent).toBe('mine')
  })
})
