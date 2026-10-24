// V3: template element/component refs use Vue 3.5 `useTemplateRef('name')`, not `ref<HTMLElement>()`.
const REF_FACTORIES = new Set(['ref', 'shallowRef'])
const ELEMENT_TYPE = /Element$/
const COMPONENT_TYPES = new Set(['ComponentPublicInstance', 'InstanceType'])

const typeName = (name) => (name.type === 'TSQualifiedName' ? name.right.name : name.name)

const isTemplateRefType = (type) => {
  if (!type) return false
  if (type.type === 'TSUnionType') return type.types.some(isTemplateRefType)
  if (type.type !== 'TSTypeReference') return false
  const name = typeName(type.typeName)
  return ELEMENT_TYPE.test(name) || COMPONENT_TYPES.has(name)
}

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Require `useTemplateRef` for template element and component refs' },
    messages: {
      useTemplateRef:
        "Use `useTemplateRef('name')` (Vue 3.5) for element/component refs instead of `{{factory}}<...>()`.",
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== 'Identifier' || !REF_FACTORIES.has(node.callee.name)) return
        const [type] = (node.typeArguments ?? node.typeParameters)?.params ?? []
        if (!isTemplateRefType(type)) return
        context.report({ node, messageId: 'useTemplateRef', data: { factory: node.callee.name } })
      },
    }
  },
}
