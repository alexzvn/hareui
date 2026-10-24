// F4: no `else` / `else if`. Branching uses guard clauses, lookup maps, or one ternary.
export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow `else` and `else if` branches' },
    messages: {
      noElse:
        'Avoid `else`/`else if`: use a guard clause (early return), an `as const` lookup map (`Record<Union, Handler>` with `satisfies`), or a single-level ternary.',
    },
    schema: [],
  },
  create(context) {
    return {
      IfStatement(node) {
        if (!node.alternate) return
        context.report({ node: node.alternate, messageId: 'noElse' })
      },
    }
  },
}
