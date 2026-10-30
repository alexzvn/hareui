import type { Component, VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type CodeBlock = typeof theme

/** A highlighted line: one line number, or an inclusive `[from, to]` range of line numbers (1-based). */
export type CodeBlockHighlightRange = number | [from: number, to: number]

/** One run of text in a rendered line. */
export type CodeBlockToken = {
  /** The text of the run. */
  content: string
  /** Inline style of the run: the `--shiki-light` / `--shiki-dark` colors once highlighted. */
  style?: Record<string, string>
}

/** The syntax themes used for each color scheme, by shiki theme name. */
export type CodeBlockThemes = {
  /**
   * Theme used in light mode.
   * @defaultValue 'github-light'
   */
  light?: string
  /**
   * Theme used in dark mode.
   * @defaultValue 'github-dark'
   */
  dark?: string
}

/** Options of the copy button. */
export type CodeBlockCopyOptions = {
  /**
   * Accessible label of the button.
   * @defaultValue 'Copy code'
   */
  label?: string
  /**
   * Accessible label of the button while the copied state shows.
   * @defaultValue 'Copied'
   */
  copiedLabel?: string
  /**
   * How long the copied state shows after a copy, in milliseconds.
   * @defaultValue 1650
   */
  duration?: number
}

/** Props of `CodeBlock`, a block of code with a header, syntax highlighting and a copy button. */
export type CodeBlockProps = {
  /** The code to show and copy. */
  code: string
  /**
   * Language of the code, as a shiki language id (`'ts'`, `'vue'`, `'bash'`, …). Shown in the header
   * when there is no `filename`. `'text'` skips highlighting.
   * @defaultValue 'text'
   */
  lang?: string
  /** File name shown in the header instead of the language. */
  filename?: string
  /** Icon shown before the header label, e.g. the file type's icon. */
  icon?: Component
  /** Lines to highlight: line numbers and inclusive `[from, to]` ranges, 1-based. */
  highlight?: CodeBlockHighlightRange[]
  /**
   * Show a line number before each line.
   * @defaultValue false
   */
  lineNumbers?: boolean
  /**
   * Show the copy button. Pass an object to change its labels or how long the copied state shows.
   * @defaultValue true
   */
  copy?: boolean | CodeBlockCopyOptions
  /** Syntax themes for light and dark mode; unset keys keep their defaults. */
  themes?: CodeBlockThemes
  /**
   * Hide the header row. The copy button then floats over the top-right corner of the code.
   * @defaultValue false
   */
  hideHeader?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<CodeBlock>
}

/** Props of the `copy` slot. */
export type CodeBlockCopySlotProps = {
  /** Whether the code was just copied; resets after `copy.duration`. */
  copied: boolean
  /** Copies the code to the clipboard and shows the copied state. */
  copy: () => Promise<void>
}

/** Props of the `header` slot. */
export type CodeBlockHeaderSlotProps = CodeBlockCopySlotProps & {
  /** The `lang` prop. */
  lang: string
  /** The `filename` prop. */
  filename?: string
}

/** Slots of `CodeBlock`. */
export type CodeBlockSlots = {
  /** Replaces the header label (the icon and the file name or language). */
  header?: (props: CodeBlockHeaderSlotProps) => VNode[]
  /** Replaces the copy button. */
  copy?: (props: CodeBlockCopySlotProps) => VNode[]
}
