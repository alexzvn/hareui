import { dragHandlePluginDefaultKey } from '@tiptap/extension-drag-handle'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { NodeSelection } from '@tiptap/pm/state'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import type { VNode } from 'vue'

import type {
  EditorDragHandleBlock,
  EditorDragHandleProps,
} from '@/components/editor-drag-handle/EditorDragHandle.types'
import EditorDragHandle from '@/components/editor-drag-handle/EditorDragHandle.vue'
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

type HarnessOptions = {
  props?: Omit<EditorDragHandleProps, 'editor'>
  handle?: (props: { select: () => EditorDragHandleBlock | undefined }) => VNode[]
}

const mountHandle = async ({ props = {}, handle }: HarnessOptions = {}) => {
  const isShown = ref(true)
  const hovered: EditorDragHandleBlock[] = []
  const selected: EditorDragHandleBlock[] = []
  let instance: TiptapEditor | undefined

  const Harness = defineComponent({
    setup: () => () =>
      h(
        Editor,
        { modelValue: '<p>One</p><p>Two</p>', 'aria-label': 'Notes' },
        {
          default: ({ editor }: { editor: TiptapEditor }) => {
            instance = editor

            if (!isShown.value) return []

            return [
              h(
                EditorDragHandle,
                {
                  ...props,
                  editor,
                  onHover: (block: EditorDragHandleBlock) => hovered.push(block),
                  onSelect: (block: EditorDragHandleBlock) => selected.push(block),
                },
                handle ? { default: handle } : undefined,
              ),
            ]
          },
        },
      ),
  })

  const wrapper = mount(Harness, { attachTo: document.body })
  wrappers.push(wrapper)
  await settle()

  const editor = () => instance!
  const dragHandle = () => wrapper.findComponent({ name: 'DragHandleVue' })

  // Stands in for the pointer moving onto a block, which needs a real layout to hit-test.
  const hover = (pos: number) =>
    dragHandle().props('onNodeChange')({
      editor: editor(),
      node: editor().state.doc.nodeAt(pos) as ProseMirrorNode,
      pos,
    })

  return { isShown, hovered, selected, editor, hover, dragHandle }
}

const button = () => document.querySelector<HTMLElement>('[data-slot=editor-drag-handle-button]')

describe('EditorDragHandle', () => {
  it('renders a grip button named for screen readers', async () => {
    await mountHandle()

    expect(document.querySelector('[data-slot=editor-drag-handle]')?.contains(button())).toBe(true)
    expect(button()?.getAttribute('aria-label')).toBe('Drag to move, click to select')
    expect(button()?.querySelector('svg')).not.toBeNull()
  })

  it('takes its accessible name from `label`', async () => {
    await mountHandle({ props: { label: 'Move block' } })

    expect(button()?.getAttribute('aria-label')).toBe('Move block')
  })

  it('emits the block under the pointer', async () => {
    const { hovered, hover } = await mountHandle()

    hover(5)

    expect(hovered).toEqual([
      { node: { type: 'paragraph', content: [{ type: 'text', text: 'Two' }] }, pos: 5 },
    ])
  })

  it('selects the hovered block on click and emits it', async () => {
    const { selected, editor, hover } = await mountHandle()

    hover(5)
    button()!.click()
    await settle()

    const { selection } = editor().state

    expect(selection).toBeInstanceOf(NodeSelection)
    expect(selection.from).toBe(5)
    expect((selection as NodeSelection).node.textContent).toBe('Two')

    expect(selected).toEqual([
      { node: { type: 'paragraph', content: [{ type: 'text', text: 'Two' }] }, pos: 5 },
    ])
  })

  it('focuses the editor on click, so the keyboard acts on the selected block', async () => {
    const { hover } = await mountHandle()

    hover(5)
    button()!.click()
    await settle()

    expect(document.activeElement).toBe(document.querySelector('.ProseMirror'))
  })

  it('places the handle `sideOffset` pixels before the block', async () => {
    const { dragHandle } = await mountHandle({ props: { sideOffset: 20 } })

    const [offsetMiddleware] = dragHandle().props('computePositionConfig').middleware

    expect(offsetMiddleware).toMatchObject({ name: 'offset', options: 20 })
  })

  it('passes `nested` to the drag handle plugin', async () => {
    const { dragHandle } = await mountHandle({ props: { nested: true } })

    expect(dragHandle().props('nested')).toBe(true)
  })

  it('does nothing on click before a block is hovered', async () => {
    const { selected, editor } = await mountHandle()
    const before = editor().state.selection

    button()!.click()
    await settle()

    expect(editor().state.selection.eq(before)).toBe(true)
    expect(selected).toEqual([])
  })

  it('hands `select` to a custom handle', async () => {
    const results: (EditorDragHandleBlock | undefined)[] = []
    const { hover } = await mountHandle({
      handle: ({ select }) => [
        h('button', { 'data-test': 'grip', onClick: () => results.push(select()) }, 'Grip'),
      ],
    })

    expect(button()).toBeNull()

    hover(0)
    document.querySelector<HTMLElement>('[data-test=grip]')!.click()

    expect(results).toEqual([
      { node: { type: 'paragraph', content: [{ type: 'text', text: 'One' }] }, pos: 0 },
    ])
  })

  it('removes its plugin when it unmounts', async () => {
    const { isShown, editor } = await mountHandle()

    expect(dragHandlePluginDefaultKey.get(editor().state)).toBeDefined()

    isShown.value = false
    await settle()

    expect(dragHandlePluginDefaultKey.get(editor().state)).toBeUndefined()
    expect(document.querySelector('[data-slot=editor-drag-handle]')).toBeNull()
  })
})
