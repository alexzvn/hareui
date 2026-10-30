/**
 * One-off fixer for rule V1: reorders top-level SFC blocks to template → script(s) → style(s).
 * Usage: bun tooling/scripts/fix-sfc-block-order.ts <dir|file>...
 * Also rewrites ```vue fences inside .md files.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

type Kind = 'template' | 'script' | 'style'
const RANK: Record<Kind, number> = { template: 0, script: 1, style: 2 }
const SKIP = new Set(['node_modules', 'dist', '.git'])

/**
 * Splits SFC text into top-level blocks; top-level HTML comments travel with the block they precede.
 * Returns null when there is other non-blank text outside blocks.
 */
const splitBlocks = (text: string) => {
  const lines = text.split('\n')
  const blocks: { kind: Kind; text: string }[] = []
  let current: { kind: Kind; lines: string[] } | null = null
  let leading: string[] = []
  let isInComment = false
  for (const line of lines) {
    if (current) {
      current.lines.push(line)
      if (!line.startsWith(`</${current.kind}>`)) continue
      blocks.push({ kind: current.kind, text: current.lines.join('\n') })
      current = null
      continue
    }
    if (isInComment || line.startsWith('<!--')) {
      leading.push(line)
      isInComment = !line.includes('-->')
      continue
    }
    const match = /^<(template|script|style)(?=[\s>]|$)/.exec(line)
    if (!match) {
      if (line.trim() !== '') return null
      continue
    }
    const kind = match[1] as Kind
    const opening = [...leading, line]
    leading = []
    if (new RegExp(`</${kind}>\\s*$`).test(line)) {
      blocks.push({ kind, text: opening.join('\n') })
      continue
    }
    current = { kind, lines: opening }
  }
  return current || leading.length > 0 ? null : blocks
}

const reorder = (text: string) => {
  const blocks = splitBlocks(text)
  if (!blocks || blocks.length === 0) return text
  const isOrdered = blocks.every((b, i) => i === 0 || RANK[blocks[i - 1].kind] <= RANK[b.kind])
  if (isOrdered) return text
  const sorted = [...blocks].sort((a, b) => RANK[a.kind] - RANK[b.kind])
  const trailing = text.endsWith('\n') ? '\n' : ''
  return sorted.map((b) => b.text).join('\n\n') + trailing
}

const reorderMarkdown = (text: string) =>
  text.replace(
    /^(```vue[^\n]*\n)([\s\S]*?\n)(```)$/gm,
    (_, open: string, body: string, close: string) => {
      const hasBlocks = /^<(template|script)(?=[\s>]|$)/m.test(body)
      return open + (hasBlocks ? reorder(body) : body) + close
    },
  )

const walk = (path: string): string[] => {
  if (!statSync(path).isDirectory()) return [path]
  return readdirSync(path)
    .filter((name) => !SKIP.has(name))
    .flatMap((name) => walk(join(path, name)))
}

const files = process.argv.slice(2).flatMap(walk)
let changed = 0
for (const file of files) {
  const isVue = file.endsWith('.vue')
  const isDocsMd = file.endsWith('.md') && /(^|\/)docs\//.test(file)
  if (!isVue && !isDocsMd) continue
  const before = readFileSync(file, 'utf8')
  const after = isVue ? reorder(before) : reorderMarkdown(before)
  if (after === before) continue
  writeFileSync(file, after)
  changed++
}
console.log(`fix-sfc-block-order: ${changed} file(s) changed`)
