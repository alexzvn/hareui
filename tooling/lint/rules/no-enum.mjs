// T5: no TS `enum` (including `const enum`).
export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow TypeScript enums' },
    messages: {
      noEnum:
        'Avoid `enum`: use a string-literal union, or an `as const` object plus `(typeof X)[keyof typeof X]`.',
    },
    schema: [],
  },
  create(context) {
    return {
      TSEnumDeclaration(node) {
        context.report({ node, messageId: 'noEnum' })
      },
    }
  },
}
