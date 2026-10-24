import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

import { normalizePath, sectionLinks, sidebar, type SidebarLink } from '../.vitepress/sidebar'
import type { ComponentApi } from './api-types'

const SITE_URL = 'https://hareui.alexzvn.me'

const docsRoot = resolve(import.meta.dir, '..')
const distDir = join(docsRoot, '.vitepress/dist')

type Page = {
  section: string
  link: SidebarLink
  url: string
  title: string
  description: string
  body: string
}

const sourceFile = (link: string): string => {
  const path = normalizePath(link)
  return link.endsWith('/') ? join(docsRoot, path, 'index.md') : join(docsRoot, `${path}.md`)
}

const parseFrontmatter = (raw: string): { data: Record<string, string>; body: string } => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return { data: {}, body: raw }
  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (kv && kv[2]) data[kv[1]] = kv[2].replace(/^(['"])(.*)\1$/, '$2')
  }
  return { data, body: raw.slice(match[0].length) }
}

const attr = (tag: string, name: string): string | undefined => {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]
}

const escapeCell = (value: string): string => {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

const code = (value: string | undefined): string => {
  return value ? `\`${escapeCell(value)}\`` : '-'
}

const apiTable = async (component: string, kind: string): Promise<string> => {
  const api: ComponentApi = JSON.parse(
    await readFile(join(docsRoot, '.vitepress/api', `${component}.json`), 'utf8'),
  )
  if (kind === 'props') {
    return [
      '| Prop | Type | Default | Description |',
      '| --- | --- | --- | --- |',
      ...api.props.map(
        (p) =>
          `| ${code(p.name)} | ${code(p.type)} | ${code(p.default)} | ${escapeCell(p.description) || '-'} |`,
      ),
    ].join('\n')
  }
  if (kind === 'slots') {
    return [
      '| Slot | Props | Description |',
      '| --- | --- | --- |',
      ...api.slots.map(
        (s) => `| ${code(s.name)} | ${code(s.type)} | ${escapeCell(s.description) || '-'} |`,
      ),
    ].join('\n')
  }
  return [
    '| Event | Payload | Description |',
    '| --- | --- | --- |',
    ...api.events.map(
      (e) => `| ${code(e.name)} | ${code(e.type)} | ${escapeCell(e.description) || '-'} |`,
    ),
  ].join('\n')
}

const replaceAsync = async (
  input: string,
  re: RegExp,
  fn: (match: string) => Promise<string>,
): Promise<string> => {
  const parts: (string | Promise<string>)[] = []
  let last = 0
  for (const m of input.matchAll(re)) {
    parts.push(input.slice(last, m.index), fn(m[0]))
    last = m.index + m[0].length
  }
  parts.push(input.slice(last))
  return (await Promise.all(parts)).join('')
}

/** Static attrs as strings; `:bound` attrs evaluated as JS literals (trusted repo markdown, no interpolation). */
const tagProps = (tag: string): Record<string, unknown> => {
  const props: Record<string, unknown> = {}
  for (const [, name, value] of tag.matchAll(/\s(:?[\w-]+)="([^"]*)"/g)) {
    if (name!.startsWith(':')) props[name!.slice(1)] = new Function(`return (${value})`)()
    else props[name!] = value
  }
  return props
}

/** Every `--token: value` tooltip string nested in `value`, in declaration order. */
const tokenRows = (value: unknown): [string, string][] => {
  if (typeof value === 'string') {
    const m = /^(--[\w-]+):\s*([\s\S]+)$/.exec(value)
    return m ? [[m[1]!, m[2]!]] : []
  }
  if (Array.isArray(value)) return value.flatMap(tokenRows)
  if (value && typeof value === 'object') return Object.values(value).flatMap(tokenRows)
  return []
}

const colorSectionTable = (tag: string): string => {
  const props = tagProps(tag)
  if ('lightColors' in props || 'darkColors' in props) {
    const dark = new Map(tokenRows(props.darkColors))
    const light = tokenRows(props.lightColors)
    const rows = [
      ...light.map(([v]) => v),
      ...[...dark.keys()].filter((v) => !light.some(([l]) => l === v)),
    ]
    const lightMap = new Map(light)
    return [
      '| Variable | Light | Dark |',
      '| --- | --- | --- |',
      ...rows.map(
        (v) => `| ${code(v)} | ${code(lightMap.get(v)) || '-'} | ${code(dark.get(v)) || '-'} |`,
      ),
    ].join('\n')
  }
  const rows = tokenRows(props)
  if (!rows.length) throw new Error(`Color section without tooltips: ${tag.slice(0, 80)}`)
  return [
    '| Variable | Value |',
    '| --- | --- |',
    ...rows.map(([v, value]) => `| ${code(v)} | ${code(value)} |`),
  ].join('\n')
}

const toMarkdown = async (body: string): Promise<string> => {
  let out = body
    .replace(/<script\b[\s\S]*?<\/script>\n?/g, '')
    .replace(/<style\b[\s\S]*?<\/style>\n?/g, '')
  out = await replaceAsync(out, /<ComponentPreview\b[^>]*\/>/g, async (tag) => {
    const name = attr(tag, 'name')
    if (!name) throw new Error(`ComponentPreview without name: ${tag}`)
    const src = await readFile(join(docsRoot, 'demos', `${name}.vue`), 'utf8')
    return `\`\`\`vue\n${src.trimEnd()}\n\`\`\``
  })
  out = await replaceAsync(out, /<ApiTable\b[^>]*\/>/g, async (tag) => {
    const component = attr(tag, 'component')
    const kind = attr(tag, 'kind')
    if (!component || !kind) throw new Error(`ApiTable missing attributes: ${tag}`)
    return apiTable(component, kind)
  })
  out = out.replace(/<ColorSection\w+\b[\s\S]*?\/>/g, colorSectionTable)
  out = out.replace(/<CollapsibleCode\b[\s\S]*?\/>/g, (tag) => {
    const { lang = '', code: src } = tagProps(tag) as { lang?: string; code?: string }
    if (typeof src !== 'string')
      throw new Error(`CollapsibleCode without :code: ${tag.slice(0, 80)}`)
    return `\`\`\`${lang}\n${src.trimEnd()}\n\`\`\``
  })
  out = out.replace(/<FaqItem\b[^>]*>/g, (tag) => `**${attr(tag, 'question')}**`)
  const fences: string[] = []
  out = out.replace(
    /^(```|~~~)[\s\S]*?^\1\s*$/gm,
    (fence) => `\u0000${fences.push(fence) - 1}\u0000`,
  )
  out = out.replace(/<\/?[A-Z][\w.]*\b[^>]*>/g, '')
  out = out.replace(/\u0000(\d+)\u0000/g, (_, i) => fences[Number(i)])
  return out.replace(/\n{3,}/g, '\n\n').trim()
}

const pages: Page[] = []
for (const section of sidebar) {
  const links = sectionLinks(section)
  for (const link of links) {
    const raw = await readFile(sourceFile(link.link), 'utf8').catch(
      (error: NodeJS.ErrnoException) => {
        if (error.code === 'ENOENT') return undefined
        throw error
      },
    )
    if (raw === undefined) {
      console.warn(`llms: skipping ${link.link} (no source page yet)`)
      continue
    }
    const { data, body } = parseFrontmatter(raw)
    pages.push({
      section: section.text,
      link,
      url: `${SITE_URL}${link.link}${link.link.endsWith('/') ? 'index' : ''}.md`,
      title: data.title ?? link.text,
      description: data.description ?? '',
      body: await toMarkdown(body),
    })
  }
}

const description =
  'HareUI is a Vue 3 port of HeroUI v3: beautiful, fast and modern UI components built on Reka UI, Tailwind CSS v4 and tailwind-variants, with Nuxt UI-style slots, a `ui` prop for per-element classes and app-level theme overrides.'

const index = [
  '# HareUI',
  '',
  `> ${description}`,
  '',
  ...sidebar.flatMap((section) => {
    const items = pages.filter((p) => p.section === section.text)
    return items.length
      ? [
          `## ${section.text}`,
          '',
          ...items.map((p) => `- [${p.title}](${p.url}): ${p.description}`),
          '',
        ]
      : []
  }),
].join('\n')

const full = pages
  .map((p) =>
    [
      `<page url="${p.url}">`,
      `# ${p.title}`,
      '',
      '**Category**: vue',
      `**URL**: ${p.url}`,
      '',
      `> ${p.description}`,
      '',
      p.body,
      '</page>',
    ].join('\n'),
  )
  .join('\n\n')

for (const p of pages) {
  const file = join(distDir, new URL(p.url).pathname)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, `# ${p.title}\n\n> ${p.description}\n\n${p.body}\n`)
}
await writeFile(join(distDir, 'llms.txt'), `${index.trimEnd()}\n`)
await writeFile(join(distDir, 'llms-full.txt'), `${full}\n`)
console.log(`llms: ${pages.length} pages → llms.txt, llms-full.txt`)
