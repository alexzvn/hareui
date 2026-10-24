const SRC = '/packages/vue/src/'
const COMPOSABLE = /^use[A-Z]/

const getExportedNames = (node) => {
  if (node.declaration) {
    const decl = node.declaration
    if (decl.type === 'VariableDeclaration')
      return decl.declarations.filter((d) => d.id.type === 'Identifier').map((d) => d.id.name)
    return decl.id ? [decl.id.name] : []
  }
  if (node.exportKind === 'type') return []
  return node.specifiers
    .filter((s) => s.exportKind !== 'type')
    .map((s) => (s.exported.type === 'Identifier' ? s.exported.name : s.exported.value))
}

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Composable files export exactly one named `useX` and no default' },
    messages: {
      noDefault: 'Composable files must not have a default export; export `useX` by name.',
      multiple: 'Only one `useX` composable per file (extra: `{{name}}`).',
      missing: 'Composable file must export a `use{{expected}}` composable by name.',
    },
    schema: [],
  },
  create(context) {
    const { filename } = context
    const index = filename.lastIndexOf(SRC)
    if (index === -1) return {}
    const rel = filename.slice(index + SRC.length)
    const base = rel.split('/').pop()
    const isUseFile = /^use[A-Z].*\.ts$/.test(base)
    if (!rel.startsWith('composables/') && !isUseFile) return {}
    const found = []
    return {
      ExportDefaultDeclaration: (node) => context.report({ node, messageId: 'noDefault' }),
      ExportNamedDeclaration(node) {
        for (const name of getExportedNames(node))
          if (COMPOSABLE.test(name)) found.push({ node, name })
      },
      'Program:exit'(program) {
        for (const extra of found.slice(1))
          context.report({ node: extra.node, messageId: 'multiple', data: { name: extra.name } })
        if (found.length === 0 && base.startsWith('use'))
          context.report({ node: program, messageId: 'missing', data: { expected: 'X' } })
      },
    }
  },
}
