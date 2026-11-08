import type { JSONContent } from '@tiptap/core'
import type { MentionNodeAttrs } from '@tiptap/extension-mention'

import type { EditorMentionMenuItem } from '@/components/editor-mention-menu'

import type { PromptInputEditorToken, PromptInputEditorTrigger } from './PromptInputEditor.types'

type TriggerEntry = PromptInputEditorTrigger['items'][number]

const WORD_CHAR = /[\p{L}\p{N}_]/u

const isWordChar = (char: string | undefined) => char !== undefined && WORD_CHAR.test(char)

const toOptions = (entry: TriggerEntry): EditorMentionMenuItem[] => {
  if (Array.isArray(entry)) return entry
  if (entry.type === 'separator') return []
  if (entry.type === 'section') return entry.items

  return [entry]
}

// Every entry a trigger can insert, longest text first, so `@Sam Lee` wins over `@Sam`.
const getTriggerTokens = (triggers: PromptInputEditorTrigger[]): PromptInputEditorToken[] =>
  triggers
    .flatMap(({ char, items }) =>
      items
        .flatMap(toOptions)
        .filter(({ label }) => label)
        .map(({ id, label }) => ({ char, id: id ?? label, label })),
    )
    .sort((a, b) => b.char.length + b.label.length - (a.char.length + a.label.length))

type TokenFinder = (line: string, index: number) => PromptInputEditorToken | undefined

// A token starts after a non-word character and ends before one, so `me@sarah.dev` stays text.
const createTokenFinder =
  (tokens: PromptInputEditorToken[]): TokenFinder =>
  (line, index) => {
    if (isWordChar(line[index - 1])) return undefined

    return tokens.find(({ char, label }) => {
      const labelStart = index + char.length

      return (
        line.startsWith(char, index) &&
        line.startsWith(label, labelStart) &&
        !isWordChar(line[labelStart + label.length])
      )
    })
  }

const toMention = ({ char, id, label }: PromptInputEditorToken): JSONContent => ({
  type: 'mention',
  attrs: { id, label, mentionSuggestionChar: char },
})

const toLineContent = (line: string, findTokenAt: TokenFinder) => {
  const content: JSONContent[] = []
  let textStart = 0
  let index = 0

  while (index < line.length) {
    const token = findTokenAt(line, index)

    if (!token) {
      index++
      continue
    }

    if (index > textStart) content.push({ type: 'text', text: line.slice(textStart, index) })
    content.push(toMention(token))
    index += token.char.length + token.label.length
    textStart = index
  }

  if (textStart < line.length) content.push({ type: 'text', text: line.slice(textStart) })

  return content
}

/**
 * The editor document of a prompt's text: one paragraph per line, where a trigger character followed by the label of
 * one of its entries becomes a token.
 */
export const toDoc = (text: string, triggers: PromptInputEditorTrigger[]): JSONContent => {
  const findTokenAt = createTokenFinder(getTriggerTokens(triggers))

  return {
    type: 'doc',
    content: text.split('\n').map((line) => ({
      type: 'paragraph',
      content: toLineContent(line, findTokenAt),
    })),
  }
}

/** The tokens of an editor document, in the order they appear. */
export const getTokens = (node: JSONContent): PromptInputEditorToken[] => {
  if (node.type !== 'mention') return (node.content ?? []).flatMap(getTokens)

  const { id, label, mentionSuggestionChar } = (node.attrs ?? {}) as Partial<MentionNodeAttrs>
  const name = label ?? id ?? ''

  return [{ char: mentionSuggestionChar ?? '@', id: id ?? name, label: name }]
}
