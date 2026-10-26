// V4: never destructure a reactive object; destructuring drops reactivity. Use `toRefs`.
const REACTIVE_FACTORIES = new Set(['reactive', 'shallowReactive', 'readonly'])

const isReactiveCall = (node) =>
  node?.type === 'CallExpression' &&
  node.callee.type === 'Identifier' &&
  REACTIVE_FACTORIES.has(node.callee.name)

const isPattern = (node) => node.type === 'ObjectPattern' || node.type === 'ArrayPattern'

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow destructuring reactive objects' },
    messages: {
      noReactiveDestructure:
        'Destructuring a reactive object loses reactivity; use `toRefs(state)` or read `state.key`.',
    },
    schema: [],
  },
  create(context) {
    const reactiveNames = new Set()
    const identifierDestructures = []

    return {
      VariableDeclarator(node) {
        if (node.id.type === 'Identifier' && isReactiveCall(node.init)) {
          reactiveNames.add(node.id.name)
          return
        }
        if (!isPattern(node.id)) return
        if (isReactiveCall(node.init)) {
          context.report({ node: node.id, messageId: 'noReactiveDestructure' })
          return
        }
        if (node.init?.type === 'Identifier') identifierDestructures.push(node)
      },
      'Program:exit'() {
        for (const node of identifierDestructures) {
          if (!reactiveNames.has(node.init.name)) continue
          context.report({ node: node.id, messageId: 'noReactiveDestructure' })
        }
      },
    }
  },
}
