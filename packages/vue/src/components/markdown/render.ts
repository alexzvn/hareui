import type { MarkedToken, Token, Tokens } from 'marked'
import { defineComponent, h } from 'vue'
import type { PropType, VNodeArrayChildren, VNodeChild } from 'vue'

import CodeBlock from '@/components/code-block/CodeBlock.vue'

import type { MarkdownComponents, MarkdownTag } from './Markdown.types'
import { decodeEntities, toSafeUrl } from './sanitize'

/** What every block renders with: the resolved classes of each tag and the components that replace tags. */
export type RenderContext = {
  classes: Partial<Record<MarkdownTag | 'tableWrapper', string>>
  components: MarkdownComponents
}

const isSameRecord = (record: Record<string, unknown>, other: Record<string, unknown>) => {
  const keys = Object.keys(record)

  return (
    keys.length === Object.keys(other).length && keys.every((key) => record[key] === other[key])
  )
}

/** Whether two contexts render alike: the same class for every tag and the same override components. */
export const isSameContext = (context: RenderContext, other: RenderContext) =>
  isSameRecord(context.classes, other.classes) && isSameRecord(context.components, other.components)

type Children = () => VNodeArrayChildren

type ElementOptions = {
  tag: MarkdownTag
  attrs?: Record<string, unknown>
  children?: Children
}

type Renderer<T extends Token = Token> = (context: RenderContext, token: T) => VNodeChild

type Renderers = { [Type in MarkedToken['type']]: Renderer<Extract<MarkedToken, { type: Type }>> }

const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const

// A fence's info string: the language, then the rest (`ts title="app.ts"` → `ts`, `title="app.ts"`).
const INFO_STRING = /^(\S*)\s*([\s\S]*)$/

const FINAL_NEWLINE = /\n$/

// An override gets the attributes as props and the content as its default slot, without the theme classes.
const createElement = (context: RenderContext, { tag, attrs = {}, children }: ElementOptions) => {
  const override = context.components[tag]
  if (override) return h(override, attrs, children && { default: children })

  return h(tag, { ...attrs, class: context.classes[tag] || undefined }, children?.())
}

const renderTokens = (context: RenderContext, tokens: Token[]): VNodeArrayChildren =>
  tokens.map((token) => renderToken(context, token))

const childrenOf =
  (context: RenderContext, tokens: Token[]): Children =>
  () =>
    renderTokens(context, tokens)

// An image's alt text: its description with the markup taken out.
const toPlainText = (tokens: Token[]): string =>
  tokens
    .map((token): string => {
      if ('tokens' in token && token.tokens) return toPlainText(token.tokens)
      if (token.type === 'text') return token.escaped ? token.text : decodeEntities(token.text)

      return 'text' in token ? token.text : ''
    })
    .join('')

const toTitle = (title?: string | null) => (title ? decodeEntities(title) : undefined)

const renderRow = (
  context: RenderContext,
  { cells, tag }: { cells: Tokens.TableCell[]; tag: 'th' | 'td' },
) =>
  createElement(context, {
    tag: 'tr',
    children: () =>
      cells.map((cell) =>
        createElement(context, {
          tag,
          attrs: { style: cell.align ? { textAlign: cell.align } : undefined },
          children: childrenOf(context, cell.tokens),
        }),
      ),
  })

// Fenced and indented code render as CodeBlock, or as the `pre` override with the code, its language and the rest of
// the info string.
const renderCode: Renderer<Tokens.Code> = (context, token) => {
  const [, lang = '', meta = ''] = INFO_STRING.exec(decodeEntities(token.lang ?? '')) ?? []
  const code = token.text.replace(FINAL_NEWLINE, '')
  const override = context.components.pre
  if (override) return h(override, { code, lang, meta })

  return h(CodeBlock, { code, lang: lang || undefined, class: context.classes.pre || undefined })
}

const RENDERERS = {
  space: () => null,
  def: () => null,
  heading: (context, token) =>
    createElement(context, {
      tag: HEADINGS[token.depth - 1] ?? 'h6',
      children: childrenOf(context, token.tokens),
    }),
  paragraph: (context, token) =>
    createElement(context, { tag: 'p', children: childrenOf(context, token.tokens) }),
  // Tight list items hold their inline content in a block-level text token.
  text: (context, token) => {
    if (token.tokens) return renderTokens(context, token.tokens)

    return token.escaped ? token.text : decodeEntities(token.text)
  },
  escape: (_context, token) => token.text,
  // Raw HTML shows as the text it is written as.
  html: (context, token) =>
    token.block ? createElement(context, { tag: 'p', children: () => [token.text] }) : token.text,
  blockquote: (context, token) =>
    createElement(context, { tag: 'blockquote', children: childrenOf(context, token.tokens) }),
  list: (context, token) =>
    createElement(context, {
      tag: token.ordered ? 'ol' : 'ul',
      attrs: {
        start: typeof token.start === 'number' && token.start !== 1 ? token.start : undefined,
      },
      children: () => token.items.map((item) => renderToken(context, item)),
    }),
  list_item: (context, token) =>
    createElement(context, { tag: 'li', children: childrenOf(context, token.tokens) }),
  checkbox: (context, token) =>
    createElement(context, {
      tag: 'input',
      attrs: { type: 'checkbox', checked: token.checked, disabled: true },
    }),
  // The wrapper scrolls a table wider than the message; it is a plain element, not a tag `components` can replace.
  table: (context, token) =>
    h('div', { 'data-slot': 'markdown-table', class: context.classes.tableWrapper || undefined }, [
      createElement(context, {
        tag: 'table',
        children: () => [
          createElement(context, {
            tag: 'thead',
            children: () => [renderRow(context, { cells: token.header, tag: 'th' })],
          }),
          token.rows.length > 0
            ? createElement(context, {
                tag: 'tbody',
                children: () => token.rows.map((cells) => renderRow(context, { cells, tag: 'td' })),
              })
            : null,
        ],
      }),
    ]),
  hr: (context) => createElement(context, { tag: 'hr' }),
  code: renderCode,
  codespan: (context, token) =>
    createElement(context, { tag: 'code', children: () => [token.text] }),
  strong: (context, token) =>
    createElement(context, { tag: 'strong', children: childrenOf(context, token.tokens) }),
  em: (context, token) =>
    createElement(context, { tag: 'em', children: childrenOf(context, token.tokens) }),
  del: (context, token) =>
    createElement(context, { tag: 'del', children: childrenOf(context, token.tokens) }),
  br: () => h('br'),
  link: (context, token) =>
    createElement(context, {
      tag: 'a',
      attrs: { href: toSafeUrl(token.href), title: toTitle(token.title) },
      children: childrenOf(context, token.tokens),
    }),
  image: (context, token) =>
    createElement(context, {
      tag: 'img',
      attrs: {
        src: toSafeUrl(token.href),
        alt: toPlainText(token.tokens),
        title: toTitle(token.title),
      },
    }),
} satisfies Renderers

// Tokens of a type no renderer knows (from extensions on a custom lexer) render nothing.
const renderToken: Renderer = (context, token) => {
  const render = RENDERERS[token.type as MarkedToken['type']] as Renderer | undefined

  return render?.(context, token)
}

/**
 * One top-level block. Each block is its own component, so when the document changes, a block whose token and context
 * are unchanged skips re-rendering.
 */
export const MarkdownBlock = defineComponent({
  name: 'MarkdownBlock',
  props: {
    /** The block's token. */
    token: { type: Object as PropType<Token>, required: true },
    /** The classes and component overrides the block renders with. */
    context: { type: Object as PropType<RenderContext>, required: true },
  },
  setup(props) {
    return () => renderToken(props.context, props.token)
  },
})
