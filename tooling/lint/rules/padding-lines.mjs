/** Index of the first comment whose start is ≥ `offset` (comments sorted by start). */
const lowerBound = (comments, offset) => {
  let low = 0
  let high = comments.length
  while (low < high) {
    const mid = (low + high) >> 1
    if (comments[mid].range[0] < offset) low = mid + 1
    else high = mid
  }
  return low
}

const isMultiline = (span) => span.startLine !== span.endLine

/** `\n` count ≥ 2 means the whitespace gap holds at least one blank line. */
const hasBlankLine = (text) => text.indexOf('\n') !== text.lastIndexOf('\n')

/** oxfmt owns spacing between imports (`sortImports`) and around ASI-guard `;` empty statements. */
const isExemptPair = (prev, next) =>
  (prev.type === 'ImportDeclaration' && next.type === 'ImportDeclaration') ||
  prev.type === 'EmptyStatement' ||
  next.type === 'EmptyStatement'

const SKIPPED_KEYS = new Set(['parent', 'loc', 'range', 'start', 'end', 'type'])

const collectPatternNames = (pattern, names) => {
  if (!pattern) return
  if (pattern.type === 'Identifier') names.add(pattern.name)
  if (pattern.type === 'RestElement') collectPatternNames(pattern.argument, names)
  if (pattern.type === 'AssignmentPattern') collectPatternNames(pattern.left, names)
  if (pattern.type === 'ArrayPattern') {
    for (const element of pattern.elements) collectPatternNames(element, names)
  }
  if (pattern.type === 'ObjectPattern') {
    for (const property of pattern.properties) {
      collectPatternNames(property.type === 'Property' ? property.value : property, names)
    }
  }
}

const isNonComputedKey = (key, parent) =>
  (key === 'property' && parent.type === 'MemberExpression' && !parent.computed) ||
  (key === 'key' && !parent.computed)

/** True when any identifier inside `node` (excluding property names) is in `names`. */
const referencesAny = (node, names) => {
  for (const key of Object.keys(node)) {
    if (SKIPPED_KEYS.has(key)) continue
    const value = node[key]
    const children = Array.isArray(value) ? value : [value]
    for (const child of children) {
      if (!child || typeof child.type !== 'string') continue
      if (isNonComputedKey(key, node)) continue
      if (child.type === 'Identifier' && names.has(child.name)) return true
      if (referencesAny(child, names)) return true
    }
  }
  return false
}

/** "Compute, then branch on it": a single-line `const`/`let` may hug the multi-line statement using it. */
const isHuggingDeclaration = (prev, next) => {
  if (prev.node.type !== 'VariableDeclaration' || prev.node.kind === 'var') return false
  if (isMultiline(prev) || !isMultiline(next)) return false
  const names = new Set()
  for (const declarator of prev.node.declarations) collectPatternNames(declarator.id, names)
  return referencesAny(next.node, names)
}

/** `doThing(); return` as the whole block needs no blank line. */
const isShortReturnBlock = (next, statements) =>
  next.type === 'ReturnStatement' && statements.length === 2 && statements[1] === next

export default {
  meta: {
    type: 'layout',
    docs: {
      description:
        'Blank line around multi-line statements, before `return` and above comments; no trailing comments',
    },
    messages: {
      multiline: 'Add a blank line between a multi-line statement and its neighbour.',
      return: 'Add a blank line before `return`.',
      comment: 'Add a blank line above this comment.',
      trailing: 'Move this trailing comment onto its own line above the statement.',
    },
    fixable: 'whitespace',
    schema: [],
  },
  create(context) {
    const { sourceCode } = context
    const { text } = sourceCode
    const comments = sourceCode.getAllComments()
    const commentByEnd = new Map(comments.map((comment) => [comment.range[1], comment]))

    /** Walks back from `offset` over whitespace and comments to the end of the previous code. */
    const skipBackward = (start, offset) => {
      let cursor = offset
      while (cursor > start) {
        if (/\s/.test(text[cursor - 1])) cursor--
        else if (commentByEnd.has(cursor)) cursor = commentByEnd.get(cursor).range[0]
        else break
      }
      return cursor
    }

    /**
     * Statement extent. An ASI-guard `;` that oxfmt prints at the start of the next line
     * (`foo()\n;(bar as Baz).run()`) belongs to the previous statement; exclude it.
     */
    const getSpan = (node) => {
      const [start, end] = node.range
      const span = { node, end, startLine: node.loc.start.line, endLine: node.loc.end.line }
      if (text[end - 1] !== ';') return span
      const offset = skipBackward(start, end - 1)
      const newlines = text.slice(offset, end).split('\n').length - 1
      if (newlines === 0) return span
      return { ...span, end: offset, endLine: span.endLine - newlines }
    }

    /** Comments fully inside `[start, end)`. */
    const commentsBetween = (start, end) => {
      const result = []
      for (let i = lowerBound(comments, start); i < comments.length; i++) {
        if (comments[i].range[1] > end) break
        result.push(comments[i])
      }
      return result
    }

    const reportTrailing = (prev, between) => {
      const trailing = between.filter((comment) => comment.loc.start.line === prev.endLine)
      for (const comment of trailing) context.report({ loc: comment.loc, messageId: 'trailing' })
      return trailing
    }

    const getMessageId = ({ prev, next, leading, statements }) => {
      const isPadded = isMultiline(prev) || isMultiline(next)
      if (isPadded && !isHuggingDeclaration(prev, next)) return 'multiline'
      if (next.node.type === 'ReturnStatement' && !isShortReturnBlock(next.node, statements))
        return 'return'
      if (leading.length > 0) return 'comment'
      return null
    }

    const checkPair = (prevNode, nextNode, statements) => {
      const prev = getSpan(prevNode)
      const next = getSpan(nextNode)
      const between = commentsBetween(prev.end, nextNode.range[0])
      const trailing = reportTrailing(prev, between)
      if (isExemptPair(prevNode, nextNode)) return
      const leading = between.slice(trailing.length)
      const messageId = getMessageId({ prev, next, leading, statements })
      if (!messageId) return
      const anchor = trailing.length > 0 ? trailing.at(-1).range[1] : prev.end
      const target = leading.length > 0 ? leading[0] : nextNode
      if (hasBlankLine(text.slice(anchor, target.range[0]))) return
      context.report({
        loc: target.loc,
        messageId,
        fix: (fixer) => fixer.insertTextAfterRange([anchor, anchor], '\n'),
      })
    }

    const checkLast = (lastNode, end) => {
      const last = getSpan(lastNode)
      reportTrailing(last, commentsBetween(last.end, end))
    }

    const checkList = (statements, end) => {
      if (statements.length === 0) return
      for (let i = 1; i < statements.length; i++)
        checkPair(statements[i - 1], statements[i], statements)
      checkLast(statements.at(-1), end)
    }

    return {
      Program: (node) => checkList(node.body, text.length),
      BlockStatement: (node) => checkList(node.body, node.range[1]),
      StaticBlock: (node) => checkList(node.body, node.range[1]),
      SwitchCase: (node) => checkList(node.consequent, node.range[1]),
    }
  },
}
