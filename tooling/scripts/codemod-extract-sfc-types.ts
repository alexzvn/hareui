/**
 * Moves the type-only `<script lang="ts">` block of each SFC into `<Component>.types.ts` (rulebook S2)
 * and rewrites `import type` / `export type` statements that pointed at the `.vue` file.
 *
 * Usage: bun tooling/scripts/codemod-extract-sfc-types.ts packages/vue/src
 *
 * A block is extracted only when it holds nothing but imports and type declarations. Other blocks are
 * listed as skipped and left for a manual split.
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { basename, dirname, join, relative, resolve } from 'node:path'

import type * as TS from 'typescript'

const ts: typeof TS = createRequire(resolve('packages/vue/package.json'))('typescript')
const SCRIPT_BLOCK = /<script lang="ts">\n([\s\S]*?)<\/script>\n\n?/
const SETUP_OPEN = /<script setup lang="ts"[^>]*>\n/

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    const isSkipped = ['node_modules', 'dist', 'cache'].includes(name)
    if (statSync(path).isDirectory()) return isSkipped ? [] : walk(path)

    return [path]
  })

const isTypeOnlyStatement = (node: ts.Statement) =>
  ts.isImportDeclaration(node) ||
  ts.isTypeAliasDeclaration(node) ||
  ts.isInterfaceDeclaration(node) ||
  (ts.isExportDeclaration(node) && node.isTypeOnly)

const hasWord = (text: string, word: string) => new RegExp(`\\b${word}\\b`).test(text)

type Extraction = { typesFile: string; exported: string[] }

const extract = (file: string): Extraction | string | null => {
  const text = readFileSync(file, 'utf8')
  const block = SCRIPT_BLOCK.exec(text)
  if (!block) return null

  const source = ts.createSourceFile(file, block[1], ts.ScriptTarget.Latest, true)
  if (!source.statements.every(isTypeOnlyStatement)) return 'has runtime statements'

  const rest = text.slice(0, block.index) + text.slice(block.index + block[0].length)
  const exported: string[] = []
  const local: string[] = []
  const valueImports: string[] = []

  for (const node of source.statements) {
    if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
      const isExported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      ;(isExported ? exported : local).push(node.name.text)
      continue
    }

    if (ts.isImportDeclaration(node) && !node.importClause?.isTypeOnly) {
      valueImports.push(node.getText(source))
    }
  }

  const leakedLocal = local.filter((name) => hasWord(rest, name))
  if (leakedLocal.length > 0) return `setup uses non-exported types: ${leakedLocal.join(', ')}`

  const component = basename(file, '.vue')
  const typesFile = join(dirname(file), `${component}.types.ts`)
  if (existsSync(typesFile)) return 'types file already exists'

  // Value imports become type imports in the types file; the ones setup still needs move into setup.
  const setup = SETUP_OPEN.exec(rest)
  if (!setup) return 'no <script setup lang="ts">'

  const setupBody = rest.slice(setup.index + setup[0].length)
  const neededValueImports = valueImports.filter((statement) => {
    const names = statement.match(/import\s+([\s\S]*?)\s+from/)?.[1] ?? ''
    const identifiers =
      names.match(/[A-Za-z_$][\w$]*/g)?.filter((n) => n !== 'type' && n !== 'as') ?? []

    return identifiers.some(
      (name) =>
        hasWord(rest, name) &&
        !hasWord(
          setupBody
            .split('\n')
            .filter((l) => l.startsWith('import '))
            .join('\n'),
          name,
        ),
    )
  })

  const typesText = block[1].replace(/^import (?!type )/gm, 'import type ')
  writeFileSync(typesFile, typesText)

  const typeImport = `import type { ${exported.filter((name) => hasWord(rest, name)).join(', ')} } from './${component}.types'\n`
  const usesTypes = exported.some((name) => hasWord(rest, name))
  const injected = (usesTypes ? typeImport : '') + neededValueImports.map((s) => `${s}\n`).join('')
  const updated =
    rest.slice(0, setup.index + setup[0].length) +
    injected +
    rest.slice(setup.index + setup[0].length)
  writeFileSync(file, updated)

  return { typesFile, exported }
}

const rewriteImporters = (roots: string[], moved: Map<string, Set<string>>) => {
  let count = 0
  const files = roots.flatMap(walk).filter((f) => /\.(ts|vue|md)$/.test(f) && !f.endsWith('.d.ts'))
  const pattern = /(import|export) type \{([^}]*)\} from '([^']+\.vue)'/g

  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    const updated = text.replace(
      pattern,
      (statement, keyword, names: string, specifier: string) => {
        const target = specifier.startsWith('@/')
          ? resolve('packages/vue/src', specifier.slice(2))
          : resolve(dirname(file), specifier)
        const movedNames = moved.get(target)
        if (!movedNames) return statement

        const list = names
          .split(',')
          .map((n) => n.trim())
          .filter(Boolean)
        const isAllMoved = list.every((n) => movedNames.has(n.split(/\s+as\s+/)[0]))
        if (!isAllMoved) return statement

        count += 1
        return `${keyword} type {${names}} from '${specifier.replace(/\.vue$/, '.types')}'`
      },
    )
    if (updated !== text) writeFileSync(file, updated)
  }

  return count
}

const [root = 'packages/vue/src'] = process.argv.slice(2)
const moved = new Map<string, Set<string>>()
const skipped: string[] = []

for (const file of walk(root).filter((f) => f.endsWith('.vue'))) {
  const typesFile = file.replace(/\.vue$/, '.types.ts')
  if (existsSync(typesFile)) {
    const typesText = readFileSync(typesFile, 'utf8')
    const declared = [...typesText.matchAll(/export type (\w+)/g)].map((m) => m[1])
    const reexported = [...typesText.matchAll(/export type \{([^}]*)\}/g)].flatMap((m) =>
      m[1]
        .split(',')
        .map(
          (n) =>
            n
              .trim()
              .split(/\s+as\s+/)
              .at(-1) ?? '',
        )
        .filter(Boolean),
    )
    const names = [...declared, ...reexported]
    moved.set(resolve(file), new Set(names))
    continue
  }

  const result = extract(file)
  if (result === null) continue
  if (typeof result === 'string') {
    skipped.push(`${relative('.', file)}: ${result}`)
    continue
  }

  moved.set(resolve(file), new Set(result.exported))
}

const rewritten = rewriteImporters(['packages/vue/src', 'packages/vue/test', 'docs'], moved)
console.log(`extracted ${moved.size}, rewrote ${rewritten} import/export statements`)
console.log(`skipped ${skipped.length}:\n${skipped.join('\n')}`)
