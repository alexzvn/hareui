import gravity from '@iconify-json/gravity-ui/icons.json' with { type: 'json' }
import type { MarkdownEnv, MarkdownRenderer } from 'vitepress'

import buttonTheme from '../../packages/vue/src/components/button/theme'
import { tv } from '../../packages/vue/src/utils/tv'

type RenderRule = NonNullable<MarkdownRenderer['renderer']['rules']['fence']>
type Token = Parameters<RenderRule>[0][number]

interface CodeGroupMeta {
  codeGroup?: { id: string; index: number }
}

interface AnchorState {
  tokens: Token[]
  Token: new (type: string, tag: string, nesting: number) => Token
}

const gravityIcons: Record<string, { body: string }> = gravity.icons
const button = tv(buttonTheme)

export function gravityIcon(name: string, attrs = ''): string {
  const icon = gravityIcons[name]
  if (!icon) throw new Error(`gravity-ui icon not found: ${name}`)
  return `<svg aria-hidden="true" height="1em" role="img" viewBox="0 0 16 16" width="1em" xmlns="http://www.w3.org/2000/svg"${attrs}>${icon.body}</svg>`
}

const COPY_BUTTON_CLASS = button({ variant: 'ghost', size: 'sm', iconOnly: true }).base({
  class: '-mt-0.5 bg-transparent text-muted',
})

const copyButton = `<button aria-label="Copy Text" type="button" data-copy-code="" class="${COPY_BUTTON_CLASS}">${gravityIcon('copy')}</button>`

const LINK_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>'

const lucide = (cls: string, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide ${cls} size-5 -me-0.5 fill-(--callout-color) text-fd-card" aria-hidden="true">${body}</svg>`

const INFO_ICON = lucide(
  'lucide-info',
  '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>',
)

const CALLOUTS: Record<string, { type: string; icon: string }> = {
  info: { type: 'info', icon: INFO_ICON },
  tip: { type: 'info', icon: INFO_ICON },
  warning: {
    type: 'warning',
    icon: lucide(
      'lucide-triangle-alert',
      '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
    ),
  },
  danger: {
    type: 'error',
    icon: lucide(
      'lucide-circle-x',
      '<circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path>',
    ),
  },
}

const FIGURE_STYLE =
  '--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e'
const MAX_LINES_FOR_LINE_NUMBERS = 20

export function codeFigure(codeInner: string, { vPre = true, extraClass = '' } = {}): string {
  const lines = (codeInner.match(/<span class="line/g) ?? []).length
  const classes = [
    'my-4 bg-fd-card rounded-xl shiki relative border shadow-sm not-prose overflow-hidden text-sm mdx-code-block',
    lines > MAX_LINES_FOR_LINE_NUMBERS ? 'docs-code-block-line-numbers' : '',
    'shiki shiki-themes github-light github-dark',
    codeInner.includes('class="line highlighted') ? 'has-highlighted' : '',
    extraClass,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    `<figure dir="ltr" class="${classes}" style="${FIGURE_STYLE}" tabindex="-1">` +
    `<div class="z-1! empty:hidden absolute top-3 right-2 z-2 backdrop-blur-lg rounded-lg text-fd-muted-foreground">${copyButton}</div>` +
    `<div role="region" tabindex="0" class="text-[0.8125rem] py-3.5 overflow-auto max-h-[600px] fd-scroll-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fd-ring" style="--padding-right: calc(var(--spacing) * 8)">` +
    `<pre class="min-w-full w-max *:flex *:flex-col"${vPre ? ' v-pre=""' : ''}><code>${codeInner}</code></pre>` +
    `</div></figure>`
  )
}

function renderShikiFence(html: string): string {
  const m = html.match(/<pre([^>]*)><code[^>]*>([\s\S]*)<\/code>\s*<\/pre>/)
  if (!m) throw new Error(`unexpected fence output: ${html.slice(0, 200)}`)
  return codeFigure(m[2], { vPre: /\sv-pre(=|\s|$)/.test(m[1]) })
}

const TAB_TRIGGER =
  'inline-flex items-center gap-2 whitespace-nowrap text-fd-muted-foreground border-b border-transparent py-2 text-sm font-medium transition-colors [&_svg]:size-4 hover:text-fd-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-fd-primary data-[state=active]:text-fd-primary'
const TAB_PANEL =
  'p-4 text-[0.9375rem] bg-fd-background rounded-xl outline-none prose-no-margin data-[state=inactive]:hidden [&>figure:only-child]:-m-4 [&>figure:only-child]:border-none'

let tabsCounter = 0

export function markdownConfig(md: MarkdownRenderer): void {
  const fence = md.renderer.rules.fence!
  const codeInline = md.renderer.rules.code_inline!

  md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
    tokens[idx].attrSet('v-pre', '')
    return codeInline(tokens, idx, options, env, self)
  }
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const inGroup = (tokens[idx].meta as CodeGroupMeta | null)?.codeGroup
    const figure = renderShikiFence(fence(tokens, idx, options, env, self))
    if (!inGroup) return figure
    const value = `${inGroup.id}-${inGroup.index}`
    return (
      `<div data-state="${inGroup.index === 0 ? 'active' : 'inactive'}" data-orientation="horizontal" role="tabpanel" aria-labelledby="${value}-trigger" id="${value}-content" tabindex="0" class="${TAB_PANEL}">` +
      figure +
      `</div>`
    )
  }

  md.renderer.rules['container_code-group_open'] = (tokens, idx) => {
    const id = `fd-tabs-${tabsCounter++}`
    const triggers: string[] = []
    for (let i = idx + 1; tokens[i] && tokens[i].type !== 'container_code-group_close'; i++) {
      const t = tokens[i]
      if (t.type !== 'fence') continue
      const index = triggers.length
      const title = t.info.match(/\[(.*?)\]/)?.[1] ?? (t.info.trim().split(/\s/)[0] || 'txt')
      t.meta = {
        ...(t.meta as CodeGroupMeta | null),
        codeGroup: { id, index },
      } satisfies CodeGroupMeta
      const value = `${id}-${index}`
      const active = index === 0
      triggers.push(
        `<button type="button" role="tab" aria-selected="${active}" aria-controls="${value}-content" data-state="${active ? 'active' : 'inactive'}" id="${value}-trigger" class="${TAB_TRIGGER}" tabindex="${active ? 0 : -1}" data-orientation="horizontal">${md.utils.escapeHtml(title)}</button>`,
      )
    }
    return (
      `<div dir="ltr" data-orientation="horizontal" data-fd-tabs="" class="flex flex-col overflow-hidden rounded-xl border bg-fd-secondary my-4">` +
      `<div role="tablist" aria-orientation="horizontal" class="flex gap-3.5 text-fd-secondary-foreground overflow-x-auto px-4 not-prose" data-orientation="horizontal">${triggers.join('')}</div>\n`
    )
  }
  md.renderer.rules['container_code-group_close'] = () => `</div>\n`

  for (const [name, callout] of Object.entries(CALLOUTS)) {
    md.renderer.rules[`container_${name}_open`] = (tokens, idx, _options, env) => {
      const info = tokens[idx].info.trim().slice(name.length).trim()
      const title = info ? `<p class="font-medium my-0!">${md.renderInline(info, env)}</p>` : ''
      return (
        `<div class="flex gap-2 my-4 rounded-xl border p-3 ps-1 text-sm shadow-md bg-surface text-surface-foreground shadow-surface" style="--callout-color: var(--color-fd-${callout.type}, var(--color-fd-muted))">` +
        `<div role="none" class="w-0.5 bg-(--callout-color)/50 rounded-sm"></div>${callout.icon}` +
        `<div class="flex flex-col gap-2 min-w-0 flex-1">${title}<div class="text-fd-muted-foreground prose-no-margin empty:hidden">\n`
      )
    }
    md.renderer.rules[`container_${name}_close`] = () => `</div></div></div>\n`
  }

  // fumadocs `Table` mdx component (dist/mdx.js): heroui global.css styles `.prose-no-margin table`.
  const tableOpen = md.renderer.rules.table_open ?? ((t, i, o, _e, s) => s.renderToken(t, i, o))
  const tableClose = md.renderer.rules.table_close ?? ((t, i, o, _e, s) => s.renderToken(t, i, o))
  md.renderer.rules.table_open = (tokens, idx, options, env, self) =>
    `<div class="relative overflow-auto prose-no-margin my-6">` +
    tableOpen(tokens, idx, options, env, self)
  md.renderer.rules.table_close = (tokens, idx, options, env, self) =>
    tableClose(tokens, idx, options, env, self) + `</div>`
}

export function headingPermalink(
  slug: string,
  _opts: unknown,
  state: AnchorState,
  idx: number,
): void {
  state.tokens[idx].attrJoin('class', 'group/heading flex scroll-m-28 flex-row items-center gap-1')
  const inline = state.tokens[idx + 1]
  const before = new state.Token('html_inline', '', 0)
  before.content = `<a data-card="" href="#${slug}">`
  const after = new state.Token('html_inline', '', 0)
  after.content = `</a><button aria-label="Copy Anchor Link" data-copy-anchor="" class="inline-flex items-center justify-center rounded-md text-sm font-medium duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring hover:bg-fd-accent hover:text-fd-accent-foreground p-1 [&_svg]:size-4 not-prose shrink-0 text-fd-muted-foreground opacity-0 transition-opacity group-hover/heading:opacity-100">${LINK_ICON}</button>`
  inline.children?.unshift(before)
  inline.children?.push(after)
}

// Search text is prose only, like fumadocs' structured data: code blocks are dropped, soft line
// breaks inside a paragraph / list item / cell are joined (one result row per block), and inline
// `<code>` / `<strong>` become markdown so they survive VitePress's tag stripping into the stored
// section text; SearchDialog renders them like fumadocs does.
function inlineMarkdown(html: string): string {
  return html
    .replace(
      /<pre[\s\S]*?<\/pre>|<code[^>]*>([\s\S]*?)<\/code>|<strong>([\s\S]*?)<\/strong>/g,
      (match, code, strong) => {
        if (code !== undefined) return `\`${code}\``
        if (strong !== undefined) return `**${strong}**`
        return ''
      },
    )
    .replace(/<(p|li|td|th)\b[^>]*>[\s\S]*?<\/\1>/g, (block) => block.replace(/\s*\n\s*/g, ' '))
}

export function searchRender(src: string, env: MarkdownEnv, md: MarkdownRenderer): string {
  const html = md.render(src, env)
  if (env.frontmatter?.search === false) return ''
  const title = env.frontmatter?.title
    ? `<h1>${md.utils.escapeHtml(String(env.frontmatter.title))}<a href="#"></a></h1>`
    : ''
  return (
    title +
    inlineMarkdown(
      html.replace(
        /<a data-card="" href="#([^"]*)">([\s\S]*?)<\/a><button aria-label="Copy Anchor Link"[\s\S]*?<\/button>/g,
        '$2<a href="#$1"></a>',
      ),
    )
  )
}
