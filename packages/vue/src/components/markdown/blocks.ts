import { getDefaults, Lexer } from 'marked'
import type { Links, Token } from 'marked'

import { autoClose, endsInRawText } from './autoClose'

/** The blocks of a document that render, with the link definitions its reference links resolved against. */
export type MarkdownBlocks = { blocks: Token[]; links: Links }

// Fresh defaults on every call, so options and extensions set on the global `marked` instance don't apply here.
const lex = (value: string) => Lexer.lex(value, getDefaults())

// Code and raw HTML keep their markers literal, so their open syntax stays as written.
const lexStreamed = (value: string) => {
  const closed = autoClose(value)
  if (closed === value) return lex(value)

  const tokens = lex(closed)

  return endsInRawText(tokens) ? lex(value) : tokens
}

const isSameLinks = (links: Links, other: Links) => {
  const keys = Object.keys(links)

  return (
    keys.length === Object.keys(other).length &&
    keys.every(
      (key) => links[key]?.href === other[key]?.href && links[key]?.title === other[key]?.title,
    )
  )
}

const isRendered = (token: Token) => token.type !== 'space' && token.type !== 'def'

// Trailing whitespace never changes how a block renders: the last block gains and loses a newline as the next block
// starts arriving.
const isSameBlock = (token: Token, other: Token) =>
  token.type === other.type && token.raw.trimEnd() === other.raw.trimEnd()

/**
 * Splits markdown into its top-level blocks. While `streaming`, syntax left open on the last line is closed first. A
 * block whose source matches the block at the same position in `previous` keeps that token object, so its rendered
 * block is reused. Reference links resolve against definitions anywhere in the document, so a changed definition
 * renews every block.
 */
export const toBlocks = (
  { value, streaming }: { value: string; streaming: boolean },
  previous?: MarkdownBlocks,
): MarkdownBlocks => {
  const tokens = streaming ? lexStreamed(value) : lex(value)
  const reusable = previous && isSameLinks(previous.links, tokens.links) ? previous.blocks : []
  const blocks = tokens.filter(isRendered).map((token, index) => {
    const old = reusable[index]

    return old && isSameBlock(old, token) ? old : token
  })

  return { blocks, links: tokens.links }
}
