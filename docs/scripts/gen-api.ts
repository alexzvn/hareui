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

const CLOSERS: Record<string, string> = { '<': '>', '(': ')', '[': ']', '{': '}' }

const isQuote = (char: string): boolean => char === '"' || char === "'" || char === '`'

// The index after the string literal starting at `start`.
const skipString = (type: string, start: number): number => {
  for (let i = start + 1; i < type.length; i++) {
    if (type[i] === '\\') {
      i++
      continue
    }

    if (type[i] === type[start]) return i + 1
  }

  return type.length
}

// The index of the bracket that closes the one at `open`, skipping string literals and the `>` of `=>`; -1 if unbalanced.
const closingIndex = (type: string, open: number): number => {
  const expected: string[] = []
  for (let i = open; i < type.length; i++) {
    const char = type[i]!
    if (isQuote(char)) {
      i = skipString(type, i) - 1
      continue
    }

    const closer = CLOSERS[char]
    if (closer) {
      expected.push(closer)
      continue
    }

    const isArrow = char === '>' && type[i - 1] === '='
    if (char !== expected.at(-1) || isArrow) continue

    expected.pop()
    if (expected.length === 0) return i
  }

  return -1
}

// Theme types print their whole theme as the type argument (`ComponentUI<{ slots: { root: string; … }; variants: … }>`);
// the name alone says what they hold.
const THEME_TYPE = /\b(?:ComponentUI|ComponentSlots|ComponentVariants|ThemeOverride)</g

const collapseThemeTypes = (type: string): string => {
  let collapsed = ''
  let from = 0
  for (const match of type.matchAll(THEME_TYPE)) {
    if (match.index < from) continue

    const open = match.index + match[0].length - 1
    const close = closingIndex(type, open)
    if (close === -1) continue

    collapsed += type.slice(from, open)
    from = close + 1
  }

  return collapsed + type.slice(from)
}

// Object literals inside a type read as `{ … }`; a type that is one object literal (slot props) keeps its member names.
const collapseObjects = (type: string): string => {
  const whole = type.startsWith('{') && closingIndex(type, 0) === type.length - 1
  let collapsed = ''
  let from = whole ? 1 : 0
  for (let i = from; i < type.length - (whole ? 1 : 0); i++) {
    const char = type[i]!
    if (isQuote(char)) {
      i = skipString(type, i) - 1
      continue
    }

    if (char !== '{') continue

    const close = closingIndex(type, i)
    if (close === -1) break

    collapsed += `${type.slice(from, i)}{ … }`
    from = close + 1
    i = close
  }

  return whole ? `{${collapsed}${type.slice(from)}` : collapsed + type.slice(from)
}

// Types up to this length print as-is; longer ones are shortened so a table cell stays readable.
const MAX_TYPE_LENGTH = 120

// A printed type, shortened when it runs long: theme types by name, then the type as declared in the source (e.g.
// `BubbleMenuPluginProps['options']` instead of its expansion) when that is shorter, then nested objects as `{ … }`.
const shorten = (printed: string, declared?: string): string => {
  const type = collapseThemeTypes(printed)
  if (type.length <= MAX_TYPE_LENGTH) return type

  const source = declared === undefined ? type : collapseThemeTypes(declared)
  const shorter = source.length < type.length ? source : type

  return shorter.length <= MAX_TYPE_LENGTH ? shorter : collapseObjects(shorter)
}

// The members of a declared type: a type literal, or the type literals of an intersection.
const typeLiteralMembers = (type: ts.TypeNode): readonly ts.TypeElement[] => {
  if (ts.isTypeLiteralNode(type)) return type.members
  if (ts.isParenthesizedTypeNode(type)) return typeLiteralMembers(type.type)
  if (ts.isIntersectionTypeNode(type)) return type.types.flatMap(typeLiteralMembers)

  return []
}

// A member's type as written: a prop's or emit's type, or the props parameter of a slot function.
const memberTypeNode = (member: ts.TypeElement, kind: string): ts.TypeNode | undefined => {
  if (ts.isMethodSignature(member)) return kind === 'slots' ? member.parameters[0]?.type : undefined
  if (!ts.isPropertySignature(member) || !member.type) return undefined
  if (kind !== 'slots') return member.type

  return ts.isFunctionTypeNode(member.type) ? member.type.parameters[0]?.type : undefined
}

const printer = ts.createPrinter({ removeComments: true })

// `[name, type]` for each member of a declared type, its type printed on one line without comments.
const memberTypes = (
  members: readonly ts.TypeElement[],
  { source, kind }: { source: ts.SourceFile; kind: string },
): [string, string][] => {
  return members.flatMap((member): [string, string][] => {
    const node = memberTypeNode(member, kind)
    const name = member.name
    if (!node || !name || !(ts.isIdentifier(name) || ts.isStringLiteral(name))) return []

    const printed = printer.printNode(ts.EmitHint.Unspecified, node, source)

    return [[name.text, printed.replace(/\s+/g, ' ')]]
  })
}

// The member types of the `<Name>Props`, `<Name>Slots` and `<Name>Emits` types declared beside a component, keyed
// `props:name`, `slots:name` or `events:name`.
const declaredTypes = async (dir: string, name: string): Promise<Map<string, string>> => {
  const kinds: Record<string, string> = { Props: 'props', Slots: 'slots', Emits: 'events' }
  const types = new Map<string, string>()
  for (const file of await readdir(dir)) {
    if (!file.endsWith('.ts')) continue

    const text = await Bun.file(join(dir, file)).text()
    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)
    for (const statement of source.statements) {
      if (!ts.isTypeAliasDeclaration(statement) && !ts.isInterfaceDeclaration(statement)) continue

      const suffix = statement.name.text.slice(name.length)
      const kind = statement.name.text.startsWith(name) ? kinds[suffix] : undefined
      if (!kind) continue

      const members = ts.isInterfaceDeclaration(statement)
        ? statement.members
        : typeLiteralMembers(statement.type)

      for (const [key, type] of memberTypes(members, { source, kind })) {
        types.set(`${kind}:${key}`, type)
      }
    }
  }

  return types
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

// Prints a type for a table cell: without a trailing `| undefined`, shortened (using the type declared under `key`,
// e.g. `props:options`, when there is one), and with generics resolved.
type FormatType = (type: string, key?: string) => string

// Members of a nested prop group: a named object type declared in `packages/vue/src`. `ui` lists theme slots.
const toMembers = (prop: PropertyMeta, format: FormatType): ApiPropMember[] | undefined => {
  if (prop.name === 'ui') return undefined

  const object = getObjectSchema(prop.schema)
  const typeName = object?.type.match(NAMED_TYPE)?.[1]
  if (!object?.schema || !typeName || !srcTypeNames.has(typeName)) return undefined

  const members = Object.values(object.schema)
  if (members.length === 0) return undefined

  return members.map((member) => ({
    name: member.name,
    type: format(member.type),
    default: defaultValue(member),
    description: member.description,
  }))
}

const toProp = (prop: PropertyMeta, format: FormatType): ApiProp => {
  return {
    name: prop.name,
    type: format(prop.type, `props:${prop.name}`),
    default: defaultValue(prop),
    description: prop.description,
    required: prop.required,
    members: toMembers(prop, format),
  }
}

// Only public components: the package entries (`index.ts` plus the subpath entries such as `charts.ts` for
// `@hareui/vue/charts`) re-export each folder's index.ts, which lists that folder's public parts (internal parts like
// ListBoxOption or ToastItem aren't in it).
const entry = (
  await Promise.all(
    ['index.ts', 'charts.ts', 'carousel.ts', 'code-block.ts'].map((file) =>
      Bun.file(join(componentsDir, '..', file)).text(),
    ),
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

// Generic components (`generic="T extends ListBoxItem = ListBoxItem"`) print `T` in their types; show the item type instead
const ungeneric = (source: string): ((type: string) => string) => {
  const constraint = source.match(/<script setup[^>]*\sgeneric="T extends (\w+)/)?.[1]
  return constraint
    ? (type) => type.replace(/<T>/g, '').replace(/\bT\b/g, constraint)
    : (type) => type
}

// The `createHareUI({ ui })` key of each component folder's theme, as `themes.ts` names it (e.g. `commandPalette`).
const themeKeys = new Map(
  [
    ...(await Bun.file(join(componentsDir, 'themes.ts')).text()).matchAll(
      /default as (\w+)\s*\}\s*from '\.\/([\w-]+)\/theme'/g,
    ),
  ].map(([, key, dir]) => [dir, key]),
)

// A theme value as TypeScript source: plain keys unquoted, strings single-quoted, short lists on one line.
const toCode = (value: unknown, indent: string): string => {
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  if (typeof value !== 'object' || value === null) return String(value)

  const inner = `${indent}  `
  if (Array.isArray(value)) {
    const items = value.map((item) => toCode(item, inner))
    const line = `[${items.join(', ')}]`
    if (line.length <= 80 && !line.includes('\n')) return line

    return `[\n${items.map((item) => `${inner}${item},`).join('\n')}\n${indent}]`
  }

  const entries = Object.entries(value)
  if (entries.length === 0) return '{}'

  const key = (name: string) => (/^[A-Za-z_$][\w$]*$/.test(name) ? name : toCode(name, inner))

  return `{\n${entries.map(([name, v]) => `${inner}${key(name)}: ${toCode(v, inner)},`).join('\n')}\n${indent}}`
}

// The Theme section: the default theme in the shape `createHareUI({ ui })` takes, as a plugin module `main.ts` passes
// to `app.use`. Overrides add to the defaults, so readers copy only the keys they change.
const themeSnippet = (key: string, theme: unknown): string =>
  [
    "import { createHareUI } from '@hareui/vue'",
    '',
    'export default createHareUI({',
    '  ui: {',
    `    ${key}: ${toCode(theme, '    ')},`,
    '  },',
    '})',
    '',
  ].join('\n')

for (const file of files) {
  const name = basename(file, '.vue')
  const path = join(componentsDir, file)
  const source = await Bun.file(path).text()
  const meta = checker.getComponentMeta(path)
  const named = ungeneric(source)
  const declared = await declaredTypes(dirname(path), name)

  const format: FormatType = (type, key) => {
    return named(shorten(withoutUndefined(type), key === undefined ? undefined : declared.get(key)))
  }

  const api: ComponentApi = {
    props: meta.props
      .filter((p) => !p.global && !(fromNodeModules(p) && !p.description))
      .map((p) => toProp(p, format)),
    slots: meta.slots.map((s) => ({
      name: s.name,
      type: format(s.type, `slots:${s.name}`),
      description: s.description,
    })),
    events: meta.events.map((e) => ({
      name: e.name,
      type: format(e.type, `events:${e.name}`),
      description: e.description,
    })),
  }

  // `ui?: ComponentSlots<typeof theme>` prints the whole theme; the Theme section shows the theme instead.
  const ui = api.props.find((p) => p.name === 'ui')
  if (ui && /^import theme from '\.\/theme'$/m.test(source)) {
    const key = themeKeys.get(dirname(file))
    if (key === undefined)
      throw new Error(`gen-api: ${dirname(file)}/theme.ts is not exported from themes.ts`)

    // Evaluated, so spread shared slots (e.g. chart roots' `chartSlots`) show every class.
    const theme: unknown = (await import(join(dirname(path), 'theme.ts'))).default
    ui.type = '{ [slot]?: ClassValue }'
    ui.description = 'Classes for each theme slot; see [Theme](#theme).'

    await writeFile(join(outDir, 'theme', `${name}.ts`), themeSnippet(key, theme))
  }

  await writeFile(join(outDir, `${name}.json`), `${JSON.stringify(api, null, 2)}\n`)

  console.log(
    `api: ${name} (${api.props.length} props, ${api.slots.length} slots, ${api.events.length} events)`,
  )
}
