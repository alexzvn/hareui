// N1: event handlers are named `onX`; `handleX` is banned.
// Only function values are handlers: `handleAttrs` (attributes for a resize handle) is a noun and stays.
const HANDLE_NAME = /^handle([A-Z].*)$/

const isFunction = (node) =>
  node?.type === 'ArrowFunctionExpression' || node?.type === 'FunctionExpression'

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
        if (isFunction(node.init)) check(node.id)
      },
      FunctionDeclaration(node) {
        check(node.id)
      },
      Property(node) {
        if (node.parent.type !== 'ObjectExpression' || node.computed) return
        if (isFunction(node.value)) check(node.key)
      },
      MethodDefinition(node) {
        if (!node.computed) check(node.key)
      },
      PropertyDefinition(node) {
        if (!node.computed && isFunction(node.value)) check(node.key)
      },
    }
  },
}
