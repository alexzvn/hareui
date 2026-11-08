import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type {
  PromptInputProps,
  PromptInputQueueItem,
} from '@/components/prompt-input/PromptInput.types'
import PromptInput from '@/components/prompt-input/PromptInput.vue'

import { expectAccessible } from './a11y'

type Models = { modelValue?: string; files?: File[]; queue?: PromptInputQueueItem[] }

// Binds `v-model`, `v-model:files` and `v-model:queue` like a parent would; `files` and `queue` count as bound only
// when given
const mountInput = (props: PromptInputProps & Models = {}, attachTo?: HTMLElement) => {
  const wrapper = mount(PromptInput, {
    attachTo,
    props: {
      modelValue: '',
      'onUpdate:modelValue': (modelValue: string) => wrapper.setProps({ modelValue }),
      'onUpdate:files': (files?: File[]) => wrapper.setProps({ files }),
      'onUpdate:queue': (queue?: PromptInputQueueItem[]) => wrapper.setProps({ queue }),
      ...props,
    },
  })

  return wrapper
}

const file = new File(['# Notes'], 'notes.md', { type: 'text/markdown' })

const keydown = (wrapper: ReturnType<typeof mountInput>, init: KeyboardEventInit) => {
  const event = new KeyboardEvent('keydown', {
    key: 'Enter',
    bubbles: true,
    cancelable: true,
    ...init,
  })

  wrapper.find('textarea').element.dispatchEvent(event)

  return event
}

const sendButton = (wrapper: ReturnType<typeof mountInput>) =>
  wrapper.find('[data-slot=prompt-input-send]')

const queueTexts = (wrapper: ReturnType<typeof mountInput>) =>
  wrapper.props('queue')?.map((item: PromptInputQueueItem) => item.text)

describe('prompt-input', () => {
  it('submits the text and the files on Enter', () => {
    const wrapper = mountInput({ modelValue: 'Hello', files: [file] })

    expect(keydown(wrapper, {}).defaultPrevented).toBe(true)
    expect(wrapper.emitted('submit')).toEqual([['Hello', [file]]])
  })

  it('adds a line on Shift+Enter', () => {
    const wrapper = mountInput({ modelValue: 'Hello' })

    expect(keydown(wrapper, { shiftKey: true }).defaultPrevented).toBe(false)
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('ignores the Enter that commits an IME composition', () => {
    const wrapper = mountInput({ modelValue: 'こんにちは' })

    // Chrome and Firefox flag it as composing; Safari fires it after `compositionend` with keyCode 229
    expect(keydown(wrapper, { isComposing: true }).defaultPrevented).toBe(false)
    expect(keydown(wrapper, { keyCode: 229 }).defaultPrevented).toBe(false)
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('submits on Ctrl/Cmd+Enter only, when submitOnEnter is false', () => {
    const wrapper = mountInput({ modelValue: 'Hello', submitOnEnter: false })

    expect(keydown(wrapper, {}).defaultPrevented).toBe(false)
    expect(wrapper.emitted('submit')).toBeUndefined()

    keydown(wrapper, { ctrlKey: true })
    keydown(wrapper, { metaKey: true })

    expect(wrapper.emitted('submit')).toHaveLength(2)
  })

  it('keeps blank text from being sent', async () => {
    const wrapper = mountInput({ modelValue: '   ' })

    keydown(wrapper, {})
    await sendButton(wrapper).trigger('click')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(sendButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('sends files without text', async () => {
    const wrapper = mountInput({ files: [file] })

    expect(sendButton(wrapper).attributes('disabled')).toBeUndefined()

    await sendButton(wrapper).trigger('click')

    expect(wrapper.emitted('submit')).toEqual([['', [file]]])
  })

  it('turns the send button into a stop button while a response runs', async () => {
    const wrapper = mountInput()
    const button = () => sendButton(wrapper)

    expect(button().attributes()).toMatchObject({
      'data-status': 'ready',
      'aria-label': 'Send message',
    })

    await wrapper.setProps({ status: 'submitted' })

    expect(button().attributes()).toMatchObject({
      'data-status': 'submitted',
      'aria-label': 'Stop generating',
    })

    expect(button().find('[data-slot=spinner]').exists()).toBe(true)
    expect(button().attributes('disabled')).toBeUndefined()

    await wrapper.setProps({ status: 'streaming' })
    await button().trigger('click')

    expect(button().attributes('data-status')).toBe('streaming')
    expect(wrapper.emitted('stop')).toHaveLength(1)
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('retries from the error state', async () => {
    const wrapper = mountInput({ modelValue: 'Retry this', status: 'error' })

    expect(sendButton(wrapper).attributes()).toMatchObject({
      'data-status': 'error',
      'aria-label': 'Try again',
    })

    await sendButton(wrapper).trigger('click')

    expect(wrapper.emitted('submit')).toEqual([['Retry this', []]])
  })

  it('queues a prompt sent while a response runs', async () => {
    const wrapper = mountInput({
      modelValue: 'Next question',
      files: [file],
      status: 'streaming',
      queue: [],
    })

    // A press would queue the prompt, so the button sends rather than stops
    expect(sendButton(wrapper).attributes()).toMatchObject({
      'data-status': 'ready',
      'aria-label': 'Send message',
    })

    keydown(wrapper, {})
    await wrapper.vm.$nextTick()

    expect(wrapper.props('queue')).toEqual([{ text: 'Next question', files: [file] }])
    expect(wrapper.props('modelValue')).toBe('')
    expect(wrapper.props('files')).toEqual([])
    expect(wrapper.emitted('submit')).toBeUndefined()

    // Nothing left to queue: the button stops the response again
    expect(sendButton(wrapper).attributes('aria-label')).toBe('Stop generating')

    await sendButton(wrapper).trigger('click')

    expect(wrapper.emitted('stop')).toHaveLength(1)
  })

  it('ignores a prompt sent while a response runs without v-model:queue', async () => {
    const wrapper = mountInput({ modelValue: 'Next question', status: 'streaming' })

    keydown(wrapper, {})
    await sendButton(wrapper).trigger('click')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.props('modelValue')).toBe('Next question')
    expect(wrapper.emitted('stop')).toHaveLength(1)
  })

  it('sends, edits and removes queued prompts', async () => {
    const queue = [
      { id: 'a', text: 'First' },
      { id: 'b', text: 'Second' },
      { id: 'c', text: 'Third', files: [file] },
    ]

    const wrapper = mountInput({ modelValue: 'Draft', files: [], status: 'streaming', queue })
    const action = (index: number, name: string) =>
      wrapper
        .findAll('[data-slot=prompt-input-queue-item]')
        [index]!.find(`[data-slot=prompt-input-queue-${name}]`)

    await action(1, 'send').trigger('click')

    expect(wrapper.emitted('send')).toEqual([[queue[1]]])
    expect(queueTexts(wrapper)).toEqual(['Second', 'First', 'Third'])

    await action(2, 'edit').trigger('click')

    expect(wrapper.props('modelValue')).toBe('Third\nDraft')
    expect(wrapper.props('files')).toEqual([file])
    expect(queueTexts(wrapper)).toEqual(['Second', 'First'])

    await action(0, 'remove').trigger('click')

    expect(queueTexts(wrapper)).toEqual(['First'])
  })

  it('shows the attach button and the attachments only with v-model:files', async () => {
    expect(mountInput().find('[data-slot=prompt-input-action]').exists()).toBe(false)

    const wrapper = mountInput({ files: [file] })

    expect(wrapper.find('[data-slot=prompt-input-action]').attributes('aria-label')).toBe(
      'Attach file',
    )

    expect(wrapper.find('[data-slot=chat-attachment-name]').text()).toBe('notes.md')

    await wrapper.find('[data-slot=chat-attachment-remove]').trigger('click')

    expect(wrapper.props('files')).toEqual([])
    expect(wrapper.find('[data-slot=prompt-input-attachments]').exists()).toBe(false)
  })

  it('adds dropped files', async () => {
    const wrapper = mountInput({ files: [], accept: 'text/*' })
    const image = new File(['x'], 'photo.png', { type: 'image/png' })
    const drop = new Event('drop', { bubbles: true, cancelable: true })
    Object.defineProperty(drop, 'dataTransfer', {
      value: { types: ['Files'], files: [file, image], items: [] },
    })

    wrapper.find('[data-slot=prompt-input-shell]').element.dispatchEvent(drop)
    await wrapper.vm.$nextTick()

    expect(wrapper.props('files')).toEqual([file])
  })

  it('expands a compact input on a line break and collapses it once emptied', async () => {
    const wrapper = mountInput({ layout: 'compact' })

    expect(wrapper.attributes('data-expanded')).toBeUndefined()

    await wrapper.setProps({ modelValue: 'One\nTwo' })

    expect(wrapper.attributes('data-expanded')).toBe('true')

    // Shrinking back to one line keeps it expanded, so the layout doesn't jump while typing
    await wrapper.setProps({ modelValue: 'One' })

    expect(wrapper.attributes('data-expanded')).toBe('true')

    await wrapper.setProps({ modelValue: '' })

    expect(wrapper.attributes('data-expanded')).toBeUndefined()
  })

  it('passes input attributes to the textarea', () => {
    const wrapper = mount(PromptInput, {
      attrs: { 'aria-label': 'Ask the assistant', maxlength: 200, id: 'composer' },
    })

    expect(wrapper.find('textarea').attributes()).toMatchObject({
      'aria-label': 'Ask the assistant',
      maxlength: '200',
    })

    expect(wrapper.attributes('id')).toBe('composer')
  })

  it('passes input attributes to the body slot as inputAttrs', () => {
    const wrapper = mount(PromptInput, {
      attrs: { 'aria-label': 'Ask the assistant', maxlength: 200 },
      slots: {
        body: `<template #body="{ inputAttrs }"><input v-bind="inputAttrs" /></template>`,
      },
    })

    expect(wrapper.find('input').attributes()).toMatchObject({
      'aria-label': 'Ask the assistant',
      maxlength: '200',
    })
  })

  it('takes a number or a CSS length as maxHeight', async () => {
    const wrapper = mountInput({ maxHeight: 300 })

    expect(wrapper.attributes('style')).toContain('--prompt-input-max-height: 300px')

    await wrapper.setProps({ maxHeight: '50vh' })

    expect(wrapper.attributes('style')).toContain('--prompt-input-max-height: 50vh')
  })

  it('shows queued prompts with a leading icon', () => {
    const wrapper = mountInput({ queue: [{ text: 'Later' }] })

    expect(wrapper.find('[data-slot=prompt-input-queue-item-icon]').exists()).toBe(true)
  })

  it('has no accessibility violations', async () => {
    // axe audits only elements in the document
    const wrapper = mountInput(
      {
        modelValue: 'Hello',
        files: [file],
        status: 'streaming',
        queue: [{ text: 'Later' }],
      },
      document.body,
    )

    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
