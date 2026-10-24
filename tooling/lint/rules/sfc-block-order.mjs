import fs from 'node:fs'

const cache = new Map()
const RANK = { template: 0, script: 1, style: 2 }

/** Returns top-level SFC block kinds in source order (column-0 tags outside other blocks). */
export const getTopLevelBlocks = (text) => {
  const blocks = []
  const lines = text.split('\n')
  let open = null
  for (const line of lines) {
    if (open) {
      if (line.startsWith(`</${open}>`)) open = null
      continue
    }
    const match = /^<(template|script|style)(?=[\s>])/.exec(line)
    if (!match) continue
    const kind = match[1]
    blocks.push(kind)
    if (!new RegExp(`</${kind}>\\s*$`).test(line)) open = kind
  }
  return blocks
}

const isOrdered = (blocks) => blocks.every((kind, i) => i === 0 || RANK[blocks[i - 1]] <= RANK[kind])

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'SFC blocks must be ordered template → script → style' },
    messages: {
      order: 'SFC block order must be <template> → <script> → <style> (found {{found}}). Run scripts/fix-sfc-block-order.ts.',
    },
    schema: [],
  },
  create(context) {
    const { filename } = context
    if (!filename.endsWith('.vue')) return {}
    return {
      Program(node) {
        if (!cache.has(filename)) cache.set(filename, getTopLevelBlocks(fs.readFileSync(filename, 'utf8')))
        const blocks = cache.get(filename)
        if (isOrdered(blocks)) return
        context.report({
          node,
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
          messageId: 'order',
          data: { found: blocks.join(' → ') },
        })
      },
    }
  },
}
