import fs from 'node:fs'
import path from 'node:path'

const SRC = '/packages/vue/src/'
const ENTRIES = ['index.ts', 'charts.ts', 'vite.ts']
const MEMBER_TYPES = /(Props|Emits|Slots)$/
const surfaces = new Map()

const resolveModule = (fromFile, spec) => {
  if (!spec.startsWith('.')) return null
  const base = path.resolve(path.dirname(fromFile), spec)
  const candidates = [base, `${base}.ts`, path.join(base, 'index.ts'), `${base}.vue`]
  return candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) ?? null
}

const readSource = (file) => {
  const text = fs.readFileSync(file, 'utf8')
  if (!file.endsWith('.vue')) return text
  return [...text.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n')
}

/** Builds Map<absFile, Set<name | '*'>> of names reachable from the public entries. */
const buildSurface = (srcRoot) => {
  const surface = new Map()
  const add = (file, name) => {
    if (!surface.has(file)) surface.set(file, new Set())
    const names = surface.get(file)
    if (names.has(name) || names.has('*')) return false
    names.add(name)
    return true
  }
  const visit = (file, name) => {
    if (!add(file, name)) return
    const text = readSource(file)
    const exportFrom = /export\s+(type\s+)?(\*(?:\s+as\s+(\w+))?|\{([^}]*)\})\s+from\s+['"]([^'"]+)['"]/g
    for (const match of text.matchAll(exportFrom)) {
      const target = resolveModule(file, match[5])
      if (!target) continue
      if (match[2].startsWith('*')) {
        const ns = match[3]
        if (ns ? name === '*' || name === ns : true) visit(target, '*')
        continue
      }
      for (const raw of match[4].split(',')) {
        const parts = raw.trim().replace(/^type\s+/, '').split(/\s+as\s+/)
        if (!parts[0]) continue
        const exported = parts[1] ?? parts[0]
        if (name === '*' || name === exported) visit(target, parts[0])
      }
    }
  }
  for (const entry of ENTRIES) {
    const file = path.join(srcRoot, entry)
    if (fs.existsSync(file)) visit(file, '*')
  }
  return surface
}

const getSurface = (srcRoot) => {
  if (!surfaces.has(srcRoot)) surfaces.set(srcRoot, buildSurface(srcRoot))
  return surfaces.get(srcRoot)
}

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Public exports of @hareui/vue and members of public Props/Emits/Slots need JSDoc' },
    messages: {
      declaration: 'Public export `{{name}}` needs a JSDoc comment.',
      member: 'Member `{{name}}` of public type `{{type}}` needs a JSDoc comment.',
    },
    schema: [],
  },
  create(context) {
    const { filename } = context
    const index = filename.lastIndexOf(SRC)
    if (index === -1) return {}
    const names = getSurface(filename.slice(0, index + SRC.length - 1)).get(filename)
    if (!names) return {}
    const isPublic = (name) => names.has('*') || names.has(name) || (filename.endsWith('.vue') && MEMBER_TYPES.test(name))
    const hasJsdoc = (node) =>
      context.sourceCode.getCommentsBefore(node).some((c) => c.type === 'Block' && c.value.startsWith('*'))
    const checkMembers = (typeName, members) => {
      for (const member of members) {
        if (member.type !== 'TSPropertySignature' && member.type !== 'TSMethodSignature') continue
        if (hasJsdoc(member)) continue
        const name = member.key.type === 'Identifier' ? member.key.name : context.sourceCode.getText(member.key)
        context.report({ node: member, messageId: 'member', data: { name, type: typeName } })
      }
    }
    const getNames = (decl) => {
      if (decl.type === 'VariableDeclaration')
        return decl.declarations.filter((d) => d.id.type === 'Identifier').map((d) => d.id.name)
      return decl.id ? [decl.id.name] : []
    }
    return {
      ExportNamedDeclaration(node) {
        const decl = node.declaration
        if (!decl) return
        const publicNames = getNames(decl).filter(isPublic)
        if (publicNames.length === 0) return
        if (!hasJsdoc(node))
          context.report({ node, messageId: 'declaration', data: { name: publicNames.join(', ') } })
        if (!decl.id || !MEMBER_TYPES.test(decl.id.name)) return
        if (decl.type === 'TSInterfaceDeclaration') checkMembers(decl.id.name, decl.body.body)
        if (decl.type === 'TSTypeAliasDeclaration' && decl.typeAnnotation.type === 'TSTypeLiteral')
          checkMembers(decl.id.name, decl.typeAnnotation.members)
      },
    }
  },
}
