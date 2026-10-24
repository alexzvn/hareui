const TEST = '/packages/vue/test/'

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Class assertions belong only in theme contract specs (test/theme/**)' },
    messages: {
      banned:
        'Assert behavior (roles, ARIA, emits) instead of `{{name}}`; class assertions live in test/theme/.',
    },
    schema: [],
  },
  create(context) {
    const index = context.filename.lastIndexOf(TEST)
    if (index === -1) return {}
    if (context.filename.slice(index + TEST.length).startsWith('theme/')) return {}
    return {
      MemberExpression(node) {
        if (node.computed || node.property.type !== 'Identifier') return
        const { name } = node.property
        const isCall = node.parent?.type === 'CallExpression' && node.parent.callee === node
        if (name === 'classList' || name === 'className' || (name === 'classes' && isCall))
          context.report({ node: node.property, messageId: 'banned', data: { name } })
      },
    }
  },
}
