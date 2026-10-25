import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'

import ts from 'typescript'
import { createChecker, type PropertyMeta, type PropertyMetaSchema } from 'vue-component-meta'

import type { ApiProp, ApiPropMember, ComponentApi } from './api-types'

const root = resolve(import.meta.dir, '../..')
const componentsDir = join(root, 'packages/vue/src/components')
const outDir = join(root, 'docs/.vitepress/api')

// `schema` expands object types, so nested prop groups can list their members.
const checker = createChecker(join(root, 'packages/vue/tsconfig.json'), {
  forceUseTs: true,
  printer: { newLine: 1 },
  schema: true,
})

const defaultValue = (prop: PropertyMeta): string | undefined => {
  if (prop.default !== undefined) return prop.default
  const tag = prop.tags.find((t) => t.name === 'defaultValue' || t.name === 'default')

  return tag?.text?.trim() || undefined
}

const fromNodeModules = (prop: PropertyMeta): boolean => {
  return (
    prop.declarations.length > 0 &&
    prop.declarations.every((d) => d.file.includes('/node_modules/'))
  )
}

const withoutUndefined = (type: string): string => {
  return type.replace(/\s*\|\s*undefined$/, '')
}

// A named object type such as `PaginationNavButton` or `RichTableFeatures<T>`: its name, without type arguments.
const NAMED_TYPE = /^([A-Z]\w*)(<.+>)?$/

// The object type of a prop typed `Named` or `Named | undefined`.
const getObjectSchema = (schema: PropertyMetaSchema) => {
  if (typeof schema === 'string') return undefined
  if (schema.kind === 'object') return schema
  if (schema.kind !== 'enum') return undefined

  const defined = (schema.schema ?? []).filter((s) => s !== 'undefined')
  const [only] = defined
  const isSingleObject = defined.length === 1 && typeof only !== 'string' && only?.kind === 'object'

  return isSingleObject ? only : undefined
}

// Types declared in `packages/vue/src`. Nested schemas carry no declarations, so a prop's object type is
// matched by name: TanStack, Reka or DOM types like `RegExp` are linked from the prop descriptions instead.
const srcDir = join(root, 'packages/vue/src')
const srcTypeNames = new Set<string>()
for (const f of await readdir(srcDir, { recursive: true })) {
  if (!f.endsWith('.ts')) continue

  const source = await Bun.file(join(srcDir, f)).text()
  for (const match of source.matchAll(/^export type (\w+)/gm)) srcTypeNames.add(match[1]!)
}

// Members of a nested prop group: a named object type declared in `packages/vue/src`. `ui` lists theme slots.
const toMembers = (
  prop: PropertyMeta,
  named: (type: string) => string,
): ApiPropMember[] | undefined => {
  if (prop.name === 'ui') return undefined

  const object = getObjectSchema(prop.schema)
  const typeName = object?.type.match(NAMED_TYPE)?.[1]
  if (!object?.schema || !typeName || !srcTypeNames.has(typeName)) return undefined

  const members = Object.values(object.schema)
  if (members.length === 0) return undefined

  return members.map((member) => ({
    name: member.name,
    type: named(withoutUndefined(member.type)),
    default: defaultValue(member),
    description: member.description,
  }))
}

const toProp = (prop: PropertyMeta, named: (type: string) => string): ApiProp => {
  return {
    name: prop.name,
    type: named(withoutUndefined(prop.type)),
    default: defaultValue(prop),
    description: prop.description,
    required: prop.required,
    members: toMembers(prop, named),
  }
}

// Only public components: the package entries (`index.ts`, and `charts.ts` for the `@hareui/vue/charts` subpath) re-export
// each folder's index.ts, which lists that folder's public parts (internal parts like ListBoxOption or ToastItem aren't in it).
const entry = (
  await Promise.all(
    ['index.ts', 'charts.ts'].map((file) => Bun.file(join(componentsDir, '..', file)).text()),
  )
).join('\n')

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
const stripComments = (source: string): string => {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    ts.LanguageVariant.Standard,
    source,
  )

  let text = source
  for (let kind = scanner.scan(); kind !== ts.SyntaxKind.EndOfFileToken; kind = scanner.scan()) {
    if (
      kind !== ts.SyntaxKind.SingleLineCommentTrivia &&
      kind !== ts.SyntaxKind.MultiLineCommentTrivia
    )
      continue

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
const ungeneric = (source: string): ((type: string) => string) => {
  const constraint = source.match(/<script setup[^>]*\sgeneric="T extends (\w+)/)?.[1]
  return constraint
    ? (type) => type.replace(/<T>/g, '').replace(/\bT\b/g, constraint)
    : (type) => type
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
      .map((p) => toProp(p, named)),
    slots: meta.slots.map((s) => ({
      name: s.name,
      type: named(s.type),
      description: s.description,
    })),
    events: meta.events.map((e) => ({
      name: e.name,
      type: named(e.type),
      description: e.description,
    })),
  }

  // `ui?: ComponentSlots<typeof theme>` prints the whole theme; show the slot keys and publish the theme source instead.
  const ui = api.props.find((p) => p.name === 'ui')
  if (ui && /^import theme from '\.\/theme'$/m.test(source)) {
    const themePath = join(dirname(path), 'theme.ts')
    const theme: { slots: Record<string, unknown> } = (await import(themePath)).default
    ui.type = `{ ${Object.keys(theme.slots)
      .map((k) => `${/^\w+$/.test(k) ? k : `'${k}'`}?: ClassValue`)
      .join('; ')} }`

    ui.description = `${ui.description} Keys are the theme slots; see Theme below.`

    // Chart roots spread the shared `chartSlots`; publish the resolved slots so the page shows every class.
    const themeSource = await Bun.file(themePath).text()
    const published = /^\s*\.\.\.\w+,?$/m.test(themeSource)
      ? `export default ${JSON.stringify(theme, null, 2)
          .replace(/"(\w+)":/g, '$1:')
          .replace(/"/g, "'")}\n`
      : stripComments(themeSource)

    await writeFile(join(outDir, 'theme', `${name}.ts`), published)
  }

  await writeFile(join(outDir, `${name}.json`), `${JSON.stringify(api, null, 2)}\n`)

  console.log(
    `api: ${name} (${api.props.length} props, ${api.slots.length} slots, ${api.events.length} events)`,
  )
}
