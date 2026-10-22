import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import ts from 'typescript'
import { createChecker, type PropertyMeta } from 'vue-component-meta'
import type { ApiProp, ComponentApi } from './api-types'

const root = resolve(import.meta.dir, '../..')
const componentsDir = join(root, 'packages/vue/src/components')
const outDir = join(root, 'docs/.vitepress/api')

const checker = createChecker(join(root, 'packages/vue/tsconfig.json'), {
  forceUseTs: true,
  printer: { newLine: 1 },
})

function defaultValue(prop: PropertyMeta): string | undefined {
  if (prop.default !== undefined) return prop.default
  const tag = prop.tags.find((t) => t.name === 'defaultValue' || t.name === 'default')
  return tag?.text?.trim() || undefined
}

function fromNodeModules(prop: PropertyMeta): boolean {
  return prop.declarations.length > 0 && prop.declarations.every((d) => d.file.includes('/node_modules/'))
}

function toProp(prop: PropertyMeta): ApiProp {
  return {
    name: prop.name,
    type: prop.type.replace(/\s*\|\s*undefined$/, ''),
    default: defaultValue(prop),
    description: prop.description,
    required: prop.required,
  }
}

// Only public components: the package entries (`index.ts`, and `charts.ts` for the `@hareui/vue/charts` subpath) re-export
// each folder's index.ts, which lists that folder's public parts (internal parts like ListBoxOption or ToastItem aren't in it).
const entry = (await Promise.all(['index.ts', 'charts.ts'].map((file) => Bun.file(join(componentsDir, '..', file)).text()))).join('\n')
const isPublic = async (file: string) => {
  const dir = dirname(file)
  if (!entry.includes(`from './components/${dir}'`)) return false
  const index = await Bun.file(join(componentsDir, dir, 'index.ts')).text()
  return index.includes(`from './${basename(file)}'`)
}
const files: string[] = []
for (const f of (await readdir(componentsDir, { recursive: true })).sort()) {
  if (f.endsWith('.vue') && (await isPublic(f))) files.push(f)
}

await rm(outDir, { recursive: true, force: true })
await mkdir(join(outDir, 'theme'), { recursive: true })

// Blank out comments (keeping newlines), then drop lines that held only a comment.
function stripComments(source: string): string {
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, source)
  let text = source
  for (let kind = scanner.scan(); kind !== ts.SyntaxKind.EndOfFileToken; kind = scanner.scan()) {
    if (kind !== ts.SyntaxKind.SingleLineCommentTrivia && kind !== ts.SyntaxKind.MultiLineCommentTrivia) continue
    const start = scanner.getTokenStart()
    const end = scanner.getTokenEnd()
    text = text.slice(0, start) + text.slice(start, end).replace(/[^\n]/g, '\0') + text.slice(end)
  }
  return `${text
    .split('\n')
    .filter((line) => !line.includes('\0') || line.replaceAll('\0', '').trim() !== '')
    .map((line) => line.replaceAll('\0', '').trimEnd())
    .join('\n')
    .trim()}\n`
}

// Generic components (`generic="T extends ListBoxItem = ListBoxItem"`) print `T` in their types; show the item type instead
function ungeneric(source: string): (type: string) => string {
  const constraint = source.match(/<script setup[^>]*\sgeneric="T extends (\w+)/)?.[1]
  return constraint ? (type) => type.replace(/<T>/g, '').replace(/\bT\b/g, constraint) : (type) => type
}

for (const file of files) {
  const name = basename(file, '.vue')
  const path = join(componentsDir, file)
  const source = await Bun.file(path).text()
  const meta = checker.getComponentMeta(path)
  const named = ungeneric(source)
  const api: ComponentApi = {
    props: meta.props
      .filter((p) => !p.global && !(fromNodeModules(p) && !p.description))
      .map((p) => ({ ...toProp(p), type: named(toProp(p).type) })),
    slots: meta.slots.map((s) => ({ name: s.name, type: named(s.type), description: s.description })),
    events: meta.events.map((e) => ({ name: e.name, type: named(e.type), description: e.description })),
  }
  // `ui?: ComponentSlots<typeof theme>` prints the whole theme; show the slot keys and publish the theme source instead.
  const ui = api.props.find((p) => p.name === 'ui')
  if (ui && /^import theme from '\.\/theme'$/m.test(source)) {
    const themePath = join(dirname(path), 'theme.ts')
    const theme: { slots: Record<string, unknown> } = (await import(themePath)).default
    ui.type = `{ ${Object.keys(theme.slots).map((k) => `${/^\w+$/.test(k) ? k : `'${k}'`}?: ClassValue`).join('; ')} }`
    ui.description = `${ui.description} Keys are the theme slots; see Theme below.`
    // Chart roots spread the shared `chartSlots`; publish the resolved slots so the page shows every class.
    const themeSource = await Bun.file(themePath).text()
    const published = /^\s*\.\.\.\w+,?$/m.test(themeSource)
      ? `export default ${JSON.stringify(theme, null, 2).replace(/"(\w+)":/g, '$1:').replace(/"/g, '\'')}\n`
      : stripComments(themeSource)
    await writeFile(join(outDir, 'theme', `${name}.ts`), published)
  }
  await writeFile(join(outDir, `${name}.json`), `${JSON.stringify(api, null, 2)}\n`)
  console.log(`api: ${name} (${api.props.length} props, ${api.slots.length} slots, ${api.events.length} events)`)
}
