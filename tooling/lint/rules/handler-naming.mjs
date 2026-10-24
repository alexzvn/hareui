// N1: event handlers are named `onX`; `handleX` is banned.
const HANDLE_NAME = /^handle([A-Z].*)$/

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Require `onX` instead of `handleX` for handler names' },
    messages: {
      handlerNaming: 'Name handlers `on{{rest}}`, not `{{name}}`.',
    },
    schema: [],
  },
  create(context) {
    const check = (identifier) => {
      if (identifier?.type !== 'Identifier') return
      const match = HANDLE_NAME.exec(identifier.name)
      if (!match) return
      context.report({
        node: identifier,
        messageId: 'handlerNaming',
        data: { name: identifier.name, rest: match[1] },
      })
    }

    return {
      VariableDeclarator(node) {
        check(node.id)
      },
      FunctionDeclaration(node) {
        check(node.id)
      },
      Property(node) {
        if (node.parent.type !== 'ObjectExpression' || node.computed) return
        check(node.key)
      },
      MethodDefinition(node) {
        if (!node.computed) check(node.key)
      },
      PropertyDefinition(node) {
        if (!node.computed) check(node.key)
      },
    }
  },
}
