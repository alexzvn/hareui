import type { Component } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Markdown = typeof theme

/** An element `Markdown` renders: its key in the `components` and `ui` props. `ui` also takes `tableWrapper`, the
 * element around each table that scrolls it sideways when it is wider than the message. */
export type MarkdownTag = Exclude<keyof Markdown['slots'], 'base' | 'tableWrapper'>

/**
 * Components that replace rendered elements, keyed by tag. An override gets the element's attributes as props
 * (`href` and `title` on `a`; `src`, `alt` and `title` on `img`; `type`, `checked` and `disabled` on `input`; `start`
 * on an `ol` that doesn't start at 1; `style` on an aligned `th` or `td`) and the element's content as its default
 * slot, without the theme classes. `pre` replaces fenced code blocks and gets `code`, `lang` and `meta` (the words
 * after the language in the fence's info string).
 */
export type MarkdownComponents = Partial<Record<MarkdownTag, Component>>

/** Props of `Markdown`. */
export type MarkdownProps = {
  /**
   * The markdown source, in GitHub Flavored Markdown. Raw HTML in it shows as text.
   * @defaultValue ''
   */
  value?: string
  /**
   * Whether `value` is still streaming in. Syntax left open on an unfinished last line (`**bol`, `` `co ``, a link
   * whose URL is still arriving) renders as if it were closed, and the root is marked `aria-busy`.
   * @defaultValue false
   */
  streaming?: boolean
  /** Components that replace rendered elements, keyed by tag. */
  components?: MarkdownComponents
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides, keyed by tag; `base` is the root element. */
  ui?: ComponentSlots<Markdown>
}
