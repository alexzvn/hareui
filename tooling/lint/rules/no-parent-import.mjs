import path from 'node:path'

const MARKER = '/packages/vue/'

/** Locates `packages/vue/src` for files under the library's src or test trees. */
const getSrcRoot = (filename) => {
  const index = filename.lastIndexOf(MARKER)
  if (index === -1) return null
  const rest = filename.slice(index + MARKER.length)
  if (!rest.startsWith('src/') && !rest.startsWith('test/')) return null
  return filename.slice(0, index + MARKER.length) + 'src'
}

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Use the `@/` alias instead of `../` imports inside packages/vue' },
    messages: {
      parent: 'Import `{{source}}` via the `@/` alias instead of a parent-relative path.',
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    const srcRoot = getSrcRoot(context.filename)
    if (!srcRoot) return {}
    const check = (source) => {
      if (!source || source.type !== 'Literal' || typeof source.value !== 'string') return
      if (!source.value.startsWith('../')) return
      const target = path.resolve(path.dirname(context.filename), source.value)
      const relative = path.relative(srcRoot, target)
      const isInside = !relative.startsWith('..') && !path.isAbsolute(relative)
      const quote = context.sourceCode.getText(source)[0]
      context.report({
        node: source,
        messageId: 'parent',
        data: { source: source.value },
        fix: isInside
          ? (fixer) => fixer.replaceText(source, `${quote}@/${relative.split(path.sep).join('/')}${quote}`)
          : undefined,
      })
    }
    return {
      ImportDeclaration: (node) => check(node.source),
      ExportNamedDeclaration: (node) => check(node.source),
      ExportAllDeclaration: (node) => check(node.source),
      ImportExpression: (node) => check(node.source),
    }
  },
}
