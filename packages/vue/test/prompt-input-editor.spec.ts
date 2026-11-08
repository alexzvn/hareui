import type { Editor as TiptapEditor } from '@tiptap/core'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import type {
  PromptInputEditorItemSlotProps,
  PromptInputEditorProps,
  PromptInputEditorTrigger,
} from '@/components/prompt-input-editor/PromptInputEditor.types'
import PromptInputEditor from '@/components/prompt-input-editor/PromptInputEditor.vue'
import { getTokens, toDoc } from '@/components/prompt-input-editor/tokens'
import type { PromptInputQueueItem } from '@/components/prompt-input/PromptInput.types'

const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })

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

// ProseMirror reads `Mod` as Cmd on Apple platforms and Ctrl elsewhere
const MOD_KEY = /Mac|iP(hone|[oa]d)/.test(navigator.platform) ? 'metaKey' : 'ctrlKey'

const triggers: PromptInputEditorTrigger[] = [
  {
    char: '@',
    items: [
      { id: 'sam', label: 'sam', description: 'Sam Lee' },
      { id: 'sarah', label: 'sarahjones', description: 'Sarah Jones' },
    ],
  },
  {
    char: '/',
    items: [
      { type: 'section', label: 'Commands', items: [{ id: 'summarize', label: 'summarize' }] },
    ],
  },
]

const SARAH = { char: '@', id: 'sarah', label: 'sarahjones' }
const SUMMARIZE = { char: '/', id: 'summarize', label: 'summarize' }

type MountProps = PromptInputEditorProps & { modelValue?: string; queue?: PromptInputQueueItem[] }

type MountSlots = { item?: (props: PromptInputEditorItemSlotProps) => ReturnType<typeof h> }

const mountEditor = async (props: MountProps = {}, slots: MountSlots = {}) => {
  const wrapper = mount(PromptInputEditor, {
    props: {
      'onUpdate:modelValue': (value: string) => wrapper.setProps({ modelValue: value }),
      ...props,
    },
    slots,
    attachTo: document.body,
  })

  wrappers.push(wrapper)
  await settle()

  return wrapper
}

const getView = (wrapper: Awaited<ReturnType<typeof mountEditor>>) =>
  wrapper.get<HTMLElement & { editor: TiptapEditor }>('.ProseMirror').element

const getMentions = (wrapper: Awaited<ReturnType<typeof mountEditor>>) =>
  wrapper.findAll('.mention').map((mention) => mention.text())

const getOptions = (selector = '[role=option]') =>
  [...document.querySelectorAll(`[data-slot=editor-mention-menu] ${selector}`)].map((option) =>
    option.textContent?.trim(),
  )

const getOptionLabels = () => getOptions('[data-slot=editor-mention-menu-item-label]')

const press = async (wrapper: Awaited<ReturnType<typeof mountEditor>>, init: KeyboardEventInit) => {
  getView(wrapper).dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }),
  )

  await settle()
}

const type = async (wrapper: Awaited<ReturnType<typeof mountEditor>>, text: string) => {
  getView(wrapper).editor.chain().focus('end').insertContent(text).run()
  await settle()
}

describe('prompt-input-editor tokens', () => {
  it('turns a trigger and the label of one of its entries into a token', () => {
    expect(toDoc('Ask @sarahjones\nthen /summarize', triggers)).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Ask ' },
            {
              type: 'mention',
              attrs: { id: 'sarah', label: 'sarahjones', mentionSuggestionChar: '@' },
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'then ' },
            {
              type: 'mention',
              attrs: { id: 'summarize', label: 'summarize', mentionSuggestionChar: '/' },
            },
          ],
        },
      ],
    })
  })

  it('matches the longest label, whole words only, and uses the label as a missing id', () => {
    const people: PromptInputEditorTrigger[] = [
      { char: '@', items: [[{ label: 'Sam' }], [{ label: 'Sam Lee' }]] },
    ]

    const doc = toDoc('@Sam Lee and @Sam, not @Samuel, me@Sam or @Ann', people)

    expect(getTokens(doc)).toEqual([
      { char: '@', id: 'Sam Lee', label: 'Sam Lee' },
      { char: '@', id: 'Sam', label: 'Sam' },
    ])
  })
})

describe('prompt-input-editor', () => {
  it('shows the v-model text before tiptap fires its create timer', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout'] })

    const wrapper = mount(PromptInputEditor, {
      props: { modelValue: 'Hello' },
      attachTo: document.body,
    })

    wrappers.push(wrapper)
    for (let i = 0; i < 4; i++) await nextTick()
    vi.useRealTimers()

    expect(getView(wrapper).textContent).toBe('Hello')
  })

  it('keeps v-model as plain text, with tokens as their character and label', async () => {
    const wrapper = await mountEditor()
    const { editor } = getView(wrapper)

    editor.commands.insertContent([
      { type: 'text', text: 'Ask ' },
      { type: 'mention', attrs: { id: 'sarah', label: 'sarahjones', mentionSuggestionChar: '@' } },
      { type: 'text', text: ' to review' },
    ])

    await settle()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Ask @sarahjones to review'])
    expect(getMentions(wrapper)).toEqual(['@sarahjones'])
  })

  it('starts from the model and follows changes made outside', async () => {
    const wrapper = await mountEditor({ modelValue: 'First line\nSecond line' })
    const { editor } = getView(wrapper)

    expect(editor.getText({ blockSeparator: '\n' })).toBe('First line\nSecond line')

    await wrapper.setProps({ modelValue: '' })
    await settle()

    expect(editor.isEmpty).toBe(true)
  })

  it('shows the tokens of a prefilled v-model and gives the same text back', async () => {
    const wrapper = await mountEditor({ modelValue: 'Ask @sarahjones\nthen /summarize', triggers })

    expect(getMentions(wrapper)).toEqual(['@sarahjones', '/summarize'])

    await type(wrapper, ' it')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      'Ask @sarahjones\nthen /summarize it',
    ])
  })

  it('turns text put back through v-model into tokens, as when a queued prompt is edited', async () => {
    const wrapper = await mountEditor({ triggers })

    await wrapper.setProps({ modelValue: 'Ask @sarahjones to /summarize' })
    await settle()

    expect(getMentions(wrapper)).toEqual(['@sarahjones', '/summarize'])
  })

  it('sends the tokens in order as the third argument of submit', async () => {
    const wrapper = await mountEditor({ modelValue: 'Ask @sarahjones to /summarize', triggers })

    await press(wrapper, { key: 'Enter' })

    expect(wrapper.emitted('submit')).toEqual([
      ['Ask @sarahjones to /summarize', [], [SARAH, SUMMARIZE]],
    ])
  })

  it('opens each trigger menu with its own filter fields, limit and search callback', async () => {
    const onSearch = vi.fn<(searchTerm: string) => void>()
    const people = { ...triggers[0]!, filterFields: ['label', 'description'], limit: 1, onSearch }
    const wrapper = await mountEditor({ triggers: [people] })

    await type(wrapper, '@')

    expect(getOptionLabels()).toEqual(['sam'])

    await type(wrapper, 'Jones')

    expect(getOptionLabels()).toEqual(['sarahjones'])
    expect(onSearch).toHaveBeenLastCalledWith('Jones')
  })

  it('renders menu entries through the item slot, with the trigger character', async () => {
    const item = ({ item, char }: PromptInputEditorItemSlotProps) =>
      h('span', `${char}${item.label}`)

    const wrapper = await mountEditor({ triggers }, { item })

    await type(wrapper, '/')

    expect(getOptions()).toEqual(['/summarize'])
  })

  it('sends a token picked from a menu', async () => {
    const wrapper = await mountEditor({ triggers })

    await type(wrapper, 'Ask @sarah')
    await press(wrapper, { key: 'Enter' })
    await press(wrapper, { key: 'Enter' })

    expect(wrapper.emitted('submit')).toEqual([['Ask @sarahjones ', [], [SARAH]]])
  })

  it('sends on Enter but not on Shift+Enter', async () => {
    const wrapper = await mountEditor({ modelValue: 'Hello' })

    getView(wrapper).editor.commands.focus('end')
    await press(wrapper, { key: 'Enter', shiftKey: true })
    expect(wrapper.emitted('submit')).toBeUndefined()

    await press(wrapper, { key: 'Enter' })
    expect(wrapper.emitted('submit')).toEqual([['Hello\n', [], []]])
  })

  it('does not send on the Enter that confirms an IME composition', async () => {
    const wrapper = await mountEditor({ modelValue: 'Hello' })
    const view = getView(wrapper)

    view.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
    await press(wrapper, { key: 'Enter', isComposing: true, keyCode: 229 })

    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('sends on Ctrl/Cmd+Enter instead when submitOnEnter is false', async () => {
    const wrapper = await mountEditor({ modelValue: 'Hello', submitOnEnter: false })

    await press(wrapper, { key: 'Enter' })
    expect(wrapper.emitted('submit')).toBeUndefined()

    await press(wrapper, { key: 'Enter', [MOD_KEY]: true })
    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('queues the prompt while a response runs when v-model:queue is bound', async () => {
    const wrapper = await mountEditor({ modelValue: 'Next', status: 'streaming', queue: [] })

    await press(wrapper, { key: 'Enter' })

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.emitted('update:queue')?.at(-1)).toEqual([[{ text: 'Next' }]])
    expect(getView(wrapper).editor.isEmpty).toBe(true)
  })
})
