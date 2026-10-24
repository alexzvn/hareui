// N2: boolean variables are named `is/has/should/can` + PascalCase; `isNot*` / `hasNo*` are banned.
// Detection is deliberately conservative: only values that are boolean by syntax or by an explicit
// `boolean` type are checked. Props, `defineModel` and `toRef(props, ...)` keep their public names.
const BOOLEAN_PREFIX = /^(is|has|should|can)[A-Z0-9]/
const NEGATED_PREFIX = /^(isNot|hasNo)[A-Z]/
const COMPARISON_OPERATORS = new Set([
  '===',
  '!==',
  '==',
  '!=',
  '<',
  '>',
  '<=',
  '>=',
  'in',
  'instanceof',
])
const REF_FACTORIES = new Set(['ref', 'shallowRef'])
const REF_TYPES = new Set(['Ref', 'ShallowRef', 'ComputedRef', 'WritableComputedRef'])
const EXEMPT_FACTORIES = new Set(['defineModel', 'defineProps', 'withDefaults'])

const typeParams = (node) => (node.typeArguments ?? node.typeParameters)?.params ?? []

const calleeName = (node) =>
  node?.type === 'CallExpression' && node.callee.type === 'Identifier'
    ? node.callee.name
    : undefined

const isBooleanType = (type) => type?.type === 'TSBooleanKeyword'

const isBooleanRefType = (type) =>
  type?.type === 'TSTypeReference' &&
  type.typeName.type === 'Identifier' &&
  REF_TYPES.has(type.typeName.name) &&
  isBooleanType(typeParams(type)[0])

const isBooleanExpression = (node) => {
  if (!node) return false
  if (node.type === 'Literal') return typeof node.value === 'boolean'
  if (node.type === 'UnaryExpression') return node.operator === '!'
  if (node.type === 'BinaryExpression') return COMPARISON_OPERATORS.has(node.operator)
  if (node.type === 'LogicalExpression') {
    return isBooleanExpression(node.left) && isBooleanExpression(node.right)
  }
  return false
}

const isBooleanInit = (init) => {
  if (isBooleanExpression(init)) return true
  const name = calleeName(init)
  if (!name) return false
  if (REF_FACTORIES.has(name)) {
    return isBooleanType(typeParams(init)[0]) || isBooleanExpression(init.arguments[0])
  }
  if (name !== 'computed') return false
  if (isBooleanType(typeParams(init)[0])) return true
  const getter = init.arguments[0]
  return (
    getter?.type === 'ArrowFunctionExpression' &&
    getter.expression &&
    isBooleanExpression(getter.body)
  )
}

const isExemptInit = (init) => {
  const name = calleeName(init)
  if (EXEMPT_FACTORIES.has(name)) return true
  return (
    name === 'toRef' &&
    init.arguments[0]?.type === 'Identifier' &&
    init.arguments[0].name === 'props'
  )
}

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Require `is/has/should/can` prefixes on boolean variables' },
    messages: {
      booleanPrefix:
        'Boolean `{{name}}` must start with `is`, `has`, `should` or `can` followed by PascalCase.',
      negatedPrefix:
        '`{{name}}` is a negated boolean name; name the positive state and negate at use.',
    },
    schema: [],
  },
  create(context) {
    return {
      VariableDeclarator(node) {
        if (node.id.type !== 'Identifier') return
        if (node.parent.kind !== 'const' && node.parent.kind !== 'let') return
        const { name } = node.id
        if (NEGATED_PREFIX.test(name)) {
          context.report({ node: node.id, messageId: 'negatedPrefix', data: { name } })
          return
        }
        if (BOOLEAN_PREFIX.test(name) || isExemptInit(node.init)) return
        const annotation = node.id.typeAnnotation?.typeAnnotation
        const isBoolean =
          isBooleanType(annotation) || isBooleanRefType(annotation) || isBooleanInit(node.init)
        if (!isBoolean) return
        context.report({ node: node.id, messageId: 'booleanPrefix', data: { name } })
      },
    }
  },
}
