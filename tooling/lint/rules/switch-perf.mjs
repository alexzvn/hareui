// F6: `switch` is allowed only with a preceding `// perf: <reason>` comment and a `default` clause.
const PERF_COMMENT = /^perf:\s*\S/

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require a `// perf: <reason>` comment and a `default` clause on every `switch`',
    },
    messages: {
      missingPerfComment:
        '`switch` needs a preceding `// perf: <reason>` comment; otherwise use an `as const` lookup map or guard clauses.',
      missingDefault:
        '`switch` needs a `default` clause; for a finite union assert exhaustiveness with `x satisfies never`.',
    },
    schema: [],
  },
  create(context) {
    const { sourceCode } = context
    return {
      SwitchStatement(node) {
        const hasPerfComment = sourceCode
          .getCommentsBefore(node)
          .some((comment) => PERF_COMMENT.test(comment.value.trim()))
        if (!hasPerfComment) context.report({ node, messageId: 'missingPerfComment' })
        if (!node.cases.some((switchCase) => switchCase.test === null)) {
          context.report({ node, messageId: 'missingDefault' })
        }
      },
    }
  },
}
