/**
 * Folds per-slot `props.ui` / `props.class` merging into `useComponentUI`, which now layers them itself.
 * Usage: bun tooling/scripts/codemod-component-ui-layers.ts [dir]   (default: packages/vue/src)
 *
 * For every `const ui = useComponentUI(…)` in a .vue/.ts file, each slot call `ui.X(…)` / `ui.value.X(…)` is
 * classified by its `class` option:
 * - `props.ui?.X`, `[props.ui?.X]`                    → `ui.X()`
 * - `[props.ui?.X, props.class]`                      → `ui.X()` and `classSlot: 'X'` (unless X is `base`)
 * - `[extra…, props.ui?.X(, props.class)]`            → `ui.X({ class: extra })`
 * Then `props` (and `classSlot`) are added to the `useComponentUI` options.
 *
 * A receiver is left untouched, and listed, when any of its calls doesn't fit those shapes (extras after
 * `props.ui`, another slot's `ui` key, dynamic slot access), when `props.class` lands on more than one slot or
 * not on every call of its slot, or when the file uses `props.class` but no slot call receives it. Slot calls
 * that merged no `props.ui` before are listed too: once `props` is passed they honour the `ui` prop.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, relative } from 'node:path'

import type * as TS from 'typescript'

const ROOT = join(import.meta.dir, '../..')
const ts: typeof TS = createRequire(join(ROOT, 'packages/vue/package.json'))('typescript')

type Edit = { start: number; end: number; text: string }

/** One slot call: where its argument list sits and what its `class` option layers. */
type SlotCall = {
  slot: string
  argsStart: number
  argsEnd: number
  kind: 'bare' | 'internal' | 'migrated' | 'layered' | 'manual'
  hasClass: boolean
  extras: string[]
}

type Receiver = { name: string; options: TS.ObjectLiteralExpression; offset: number }

const counts = { ui: 0, uiClass: 0, extraUi: 0, extraUiClass: 0, receivers: 0 }
const skipped: string[] = []
const newlyHonoured: string[] = []
const COUNTERS = { Ui: 'ui', UiClass: 'uiClass' } as const
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return walk(path)

    return /\.(vue|ts)$/.test(name) ? [path] : []
  })

const isPropsMember = (node: TS.Node, member: string): node is TS.PropertyAccessExpression =>
  ts.isPropertyAccessExpression(node) &&
  ts.isIdentifier(node.expression) &&
  node.expression.text === 'props' &&
  node.name.text === member

const isPropsUi = (node: TS.Node, slot: string) =>
  ts.isPropertyAccessExpression(node) &&
  node.name.text === slot &&
  isPropsMember(node.expression, 'ui')

const isPropsClass = (node: TS.Node) => isPropsMember(node, 'class')

const mentionsUserClasses = (text: string) => /\bprops\.(ui\b|class\b)/.test(text)

// Index just past the bracket matching the one at `open`, skipping string and template literals.
const matchBracket = (text: string, open: number) => {
  let depth = 0
  for (let i = open; i < text.length; i++) {
    const char = text[i]
    if (char === "'" || char === '"' || char === '`') {
      i = text.indexOf(char, i + 1)
      continue
    }

    if ('([{'.includes(char)) depth++
    if (')]}'.includes(char)) depth--
    if (depth === 0) return i + 1
  }

  return -1
}

const parseExpression = (code: string) => {
  const source = ts.createSourceFile('arg.ts', `(${code})`, ts.ScriptTarget.Latest, true)
  const statement = source.statements[0]
  if (!statement || !ts.isExpressionStatement(statement)) return undefined
  if (!ts.isParenthesizedExpression(statement.expression)) return undefined

  return statement.expression.expression
}

const classifyLayers = (elements: readonly TS.Expression[], slot: string) => {
  const uiIndex = elements.findIndex((element) => isPropsUi(element, slot))
  const classIndex = elements.findIndex(isPropsClass)
  const hasClass = classIndex !== -1
  const extrasEnd = uiIndex === -1 ? classIndex : uiIndex
  const extras = elements.slice(0, extrasEnd)
  const tail = elements.slice(extrasEnd)
  const expectedTail = (uiIndex === -1 ? 0 : 1) + (hasClass ? 1 : 0)
  const isOrdered =
    tail.length === expectedTail && (!hasClass || classIndex === elements.length - 1)
  const isClean = extras.every((extra) => !mentionsUserClasses(extra.getText()))
  // `props.class` without `props.ui` would gain a `ui` layer between the extras and the class.
  const isLayered = uiIndex !== -1 && isOrdered && isClean

  return { isLayered, hasClass, extras: extras.map((extra) => extra.getText()) }
}

const classifyCall = (args: string, slot: string): Omit<SlotCall, 'argsStart' | 'argsEnd'> => {
  const manual = { slot, kind: 'manual' as const, hasClass: false, extras: [] }
  if (args.trim() === '') return { ...manual, kind: 'bare' }

  const arg = parseExpression(args)
  if (!arg || !ts.isObjectLiteralExpression(arg)) return manual

  // Already in the layered form (`{ class, override }`), e.g. migrated by hand: nothing to rewrite.
  const keys = arg.properties.map((property) => property.name?.getText())
  const isMigrated =
    keys.includes('override') && keys.every((key) => key === 'class' || key === 'override')
  if (isMigrated && !mentionsUserClasses(args)) return { ...manual, kind: 'migrated' }

  const [property] = arg.properties
  if (keys.length !== 1 || !ts.isPropertyAssignment(property) || keys[0] !== 'class') return manual

  const value = property.initializer
  if (!mentionsUserClasses(value.getText())) return { ...manual, kind: 'internal' }

  const elements = ts.isArrayLiteralExpression(value) ? value.elements : [value]
  const { isLayered, hasClass, extras } = classifyLayers(elements, slot)

  return isLayered ? { slot, kind: 'layered', hasClass, extras } : manual
}

const unsupported = (slot: string, at: number): SlotCall => ({
  slot,
  argsStart: at,
  argsEnd: at,
  kind: 'manual',
  hasClass: false,
  extras: [],
})

// Every use of the receiver: slot calls are classified; dynamic access (`ui[key]`), a slot passed by reference
// and the receiver passed along (`provide(key, { classes: ui })`) escape the analysis, so they are `manual`.
// Object keys and template attributes named like the receiver (`ui:`, `:ui="…"`) are not uses.
const findCalls = (text: string, name: string): SlotCall[] => {
  // Quoted names (`Props['ui']`) are type keys, not uses of the receiver.
  const pattern = new RegExp(`(?<![\\w.$?'"-])${name}(?![\\w$'"-])`, 'g')
  const calls: SlotCall[] = []
  for (const match of text.matchAll(pattern)) {
    const after = match.index + match[0].length
    const isKey = /^\s*=(?![=>])|^\s*:/.test(text.slice(after, after + 3))
    if (isKey) continue

    // Scripts read `ui.value.slot(…)`; templates auto-unwrap to `ui.slot(…)`, where a slot may be named `value`.
    const rest = text.slice(after)
    const slotCall = /^\.value\.(\w+)\(/.exec(rest) ?? /^\.(\w+)\(/.exec(rest)
    if (!slotCall) {
      calls.push(unsupported(rest.slice(0, 12).trim() || '[reference]', after))
      continue
    }

    const open = after + slotCall[0].length - 1
    const argsStart = open + 1
    const argsEnd = matchBracket(text, open) - 1
    const slot = slotCall[1]
    calls.push({ ...classifyCall(text.slice(argsStart, argsEnd), slot), argsStart, argsEnd })
  }

  return calls
}

const findReceivers = (script: string, offset: number): Receiver[] => {
  const source = ts.createSourceFile('script.ts', script, ts.ScriptTarget.Latest, true)
  const receivers: Receiver[] = []
  const visit = (node: TS.Node) => {
    const isCall =
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      node.initializer.expression.getText() === 'useComponentUI'

    if (isCall) {
      const options = (node.initializer as TS.CallExpression).arguments[1]
      if (options && ts.isObjectLiteralExpression(options))
        receivers.push({ name: (node.name as TS.Identifier).text, options, offset })
    }

    ts.forEachChild(node, visit)
  }

  visit(source)

  return receivers
}

const scriptBlocks = (file: string, text: string) => {
  if (!file.endsWith('.vue')) return [{ script: text, offset: 0 }]

  return [...text.matchAll(/<script\b[^>]*>\n([\s\S]*?)<\/script>/g)].map((match) => ({
    script: match[1],
    offset: match.index + match[0].indexOf('>') + 2,
  }))
}

const describeCall = (file: string, text: string, call: SlotCall) => {
  const line = text.slice(0, call.argsStart).split('\n').length

  return `${file}:${line} ${call.slot}`
}

const planReceiver = (file: string, text: string, receiver: Receiver): Edit[] => {
  const calls = findCalls(text, receiver.name)
  const where = `${file} ${receiver.name}`
  if (!calls.some((call) => call.kind === 'layered' || call.kind === 'manual')) return []

  const manual = calls.filter((call) => call.kind === 'manual')
  if (manual.length > 0) {
    skipped.push(
      `${where}: unsupported calls ${manual.map((c) => describeCall(file, text, c)).join(', ')}`,
    )
    return []
  }

  const classSlots = new Set(calls.filter((call) => call.hasClass).map((call) => call.slot))
  if (classSlots.size > 1) {
    skipped.push(`${where}: props.class on several slots (${[...classSlots].join(', ')})`)
    return []
  }

  const [classSlot] = classSlots
  const isPartial = calls.some((call) => call.slot === classSlot && !call.hasClass)
  if (isPartial) {
    skipped.push(`${where}: props.class on only some ${classSlot} calls`)
    return []
  }

  const hasStrayClass = classSlot === undefined && /\bprops\.class\b/.test(text)
  const hasBaseClass = classSlot === undefined && calls.some((call) => call.slot === 'base')
  if (hasStrayClass && hasBaseClass) {
    skipped.push(`${where}: props.class is applied outside the slot calls`)
    return []
  }

  const propsDeclaration = text.search(/\bconst props\b/)
  if (propsDeclaration === -1 || propsDeclaration > receiver.offset + receiver.options.getStart()) {
    skipped.push(`${where}: no \`props\` declared before useComponentUI`)
    return []
  }

  for (const call of calls) {
    if (call.kind === 'layered' || call.kind === 'migrated') continue

    newlyHonoured.push(describeCall(file, text, call))
  }

  return [...rewriteCalls(calls), optionsEdit(receiver, classSlot)]
}

const rewriteCalls = (calls: SlotCall[]): Edit[] =>
  calls
    .filter((call) => call.kind === 'layered')
    .map((call) => {
      const shape = call.hasClass ? 'UiClass' : 'Ui'
      const counter = call.extras.length > 0 ? (`extra${shape}` as const) : COUNTERS[shape]
      counts[counter]++

      const [only] = call.extras
      const extras = call.extras.length === 1 ? only : `[${call.extras.join(', ')}]`
      const text = call.extras.length === 0 ? '' : `{ class: ${extras} }`

      return { start: call.argsStart, end: call.argsEnd, text }
    })

const optionsEdit = (receiver: Receiver, classSlot: string | undefined): Edit => {
  counts.receivers++
  const { options, offset } = receiver
  const last = options.properties[options.properties.length - 1]
  const extra = classSlot === undefined || classSlot === 'base' ? '' : `, classSlot: '${classSlot}'`
  const at = offset + last.getEnd()

  return { start: at, end: at, text: `, props${extra}` }
}

const applyEdits = (text: string, edits: Edit[]) =>
  edits
    .toSorted((a, b) => b.start - a.start)
    .reduce((out, edit) => out.slice(0, edit.start) + edit.text + out.slice(edit.end), text)

const transform = (path: string) => {
  const file = relative(ROOT, path)
  const text = readFileSync(path, 'utf8')
  const receivers = scriptBlocks(path, text).flatMap(({ script, offset }) =>
    findReceivers(script, offset),
  )

  const edits = receivers.flatMap((receiver) => planReceiver(file, text, receiver))
  if (edits.length > 0 && !isDryRun) writeFileSync(path, applyEdits(text, edits))
}

const dir = join(ROOT, args.find((arg) => !arg.startsWith('--')) ?? 'packages/vue/src')
for (const path of walk(dir)) transform(path)

console.log('rewritten:', counts)
console.log(`\nskipped receivers (${skipped.length}):\n${skipped.join('\n')}`)
console.log(
  `\nslot calls that now honour \`ui\` (${newlyHonoured.length}):\n${newlyHonoured.join('\n')}`,
)
