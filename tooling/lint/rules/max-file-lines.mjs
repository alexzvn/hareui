import fs from 'node:fs'

const DEFAULT_MAX = 600
const cache = new Map()

const SCRIPT_OPEN = /^<script\b[^>]*>/m

/** Trimmed content of the first `<script>` block, or null outside SFCs. */
const getFirstScript = (text) => {
  const match = SCRIPT_OPEN.exec(text)
  if (!match) return null
  const start = match.index + match[0].length
  return text.slice(start, text.indexOf('</script>', start)).trim()
}

/** Physical line count of the whole file on disk (template + script + style for SFCs). */
const readFile = (filename) => {
  if (!cache.has(filename)) {
    const text = fs.readFileSync(filename, 'utf8')
    const newlines = text.split('\n').length - 1
    cache.set(filename, {
      count: text.endsWith('\n') ? newlines : newlines + 1,
      firstScript: filename.endsWith('.vue') ? getFirstScript(text) : null,
    })
  }
  return cache.get(filename)
}

/** SFCs yield one Program per `<script>` block; only the first block reports. */
const isFirstBlock = (file, blockText) =>
  file.firstScript === null || file.firstScript === blockText.trim()

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Keep each file at or below a maximum number of lines' },
    messages: {
      tooLong: 'File has {{count}} lines (max {{max}}). Split it by concern.',
    },
    schema: [
      {
        type: 'object',
        properties: { max: { type: 'integer', minimum: 1 } },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const { filename } = context
    const max = context.options[0]?.max ?? DEFAULT_MAX
    return {
      Program(node) {
        const file = readFile(filename)
        if (file.count <= max) return
        if (!isFirstBlock(file, context.sourceCode.text)) return
        context.report({
          node,
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
          messageId: 'tooLong',
          data: { count: String(file.count), max: String(max) },
        })
      },
    }
  },
}
