// DOM/ARIA/SVG attribute names, v-model idioms, and verb prefixes (`getRowId`/`getSubRows` are callbacks, not a noun group).
const EXEMPT = new Set([
  'aria',
  'stroke',
  'fill',
  'on',
  'data',
  'default',
  'model',
  'get',
  'resolve',
  'create',
  'use',
  'to',
  'is',
  'has',
  'should',
  'can',
  'render',
  'allow',
  'show',
  'hide',
  'disable',
  'enable',
  'validate',
])

const getPrefix = (key) => {
  const match = /^([a-z]+)[A-Z]/.exec(key)
  return match ? match[1] : null
}

const lowerFirst = (s) => s[0].toLowerCase() + s.slice(1)

// Slot props describe state handed to slots, not the component's public input.
const isPropsType = (name) => name.endsWith('Props') && !name.endsWith('SlotProps')

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Props sharing a camelCase prefix must be grouped into one nested object prop',
    },
    messages: { group: 'Group {{keys}} into `{{prefix}}: { {{rest}} }`.' },
    schema: [],
  },
  create(context) {
    const check = (members) => {
      const groups = new Map()
      for (const member of members) {
        if (member.type !== 'TSPropertySignature' || member.key.type !== 'Identifier') continue
        const prefix = getPrefix(member.key.name)
        if (!prefix || EXEMPT.has(prefix)) continue
        if (!groups.has(prefix)) groups.set(prefix, [])
        groups.get(prefix).push(member)
      }
      for (const [prefix, list] of groups) {
        if (list.length < 2) continue
        const names = list.map((m) => m.key.name)
        context.report({
          node: list[0],
          messageId: 'group',
          data: {
            prefix,
            keys: names.map((n) => `\`${n}\``).join(', '),
            rest: names.map((n) => lowerFirst(n.slice(prefix.length))).join(', '),
          },
        })
      }
    }
    return {
      TSInterfaceDeclaration(node) {
        if (isPropsType(node.id.name)) check(node.body.body)
      },
      TSTypeAliasDeclaration(node) {
        if (isPropsType(node.id.name) && node.typeAnnotation.type === 'TSTypeLiteral')
          check(node.typeAnnotation.members)
      },
      CallExpression(node) {
        if (node.callee.type !== 'Identifier' || node.callee.name !== 'defineProps') return
        const params = (node.typeArguments ?? node.typeParameters)?.params ?? []
        for (const param of params) if (param.type === 'TSTypeLiteral') check(param.members)
      },
    }
  },
}
