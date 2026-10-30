/**
 * One-off codemod for rule F1: `const` arrow functions everywhere, no `function` declarations/expressions.
 * Usage: bun tooling/scripts/codemod-arrow-functions.ts [file...]   (default: every file oxlint lints)
 *
 * - `function f(...) {}` → `const f = (...) => {}` (keeps `export`, `async`, generics, JSDoc).
 * - `export default function f` → `const f = ...` + `export default f`.
 * - Function expressions → arrows when they don't use `this`/`arguments`/`new.target`/own name.
 * - Overloads → `const f: { (sig1): R1; (sig2): R2 } = (impl) => {}`, except names in KEEP_OVERLOADS.
 * - Declarations that need their own `this`/`arguments` keep their form plus an oxlint disable comment;
 *   such expressions are kept as-is (prefer-arrow-callback allows them). Constructor mocks
 *   (`spyOn(x, 'Ctor').mockImplementation(function () {})`) are kept with a disable comment.
 * - Generators are exempt.
 * - `const` arrows are not hoisted: definitions whose first evaluation-time use precedes them are moved
 *   directly above that use (transitively through local functions called at that point).
 * For .vue files, every <script> block is transformed in place; the rest is preserved byte-for-byte.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'

import type * as TS from 'typescript'

const ROOT = join(import.meta.dir, '../..')
const ts: typeof TS = createRequire(join(ROOT, 'packages/vue/package.json'))('typescript')

/** `file:name` overloads whose implementation signature can't satisfy the overload set without casts. */
const KEEP_OVERLOADS = new Set<string>([])

const FUNC_STYLE = 'eslint/func-style'
const DISABLE = (rule: string, reason: string) => `// oxlint-disable-next-line ${rule} -- ${reason}`

/** Callees whose function arguments never run synchronously during the call. */
const DEFERRED_CALLEES = new Set([
  'computed',
  'onMounted',
  'onBeforeMount',
  'onUnmounted',
  'onBeforeUnmount',
  'onUpdated',
  'onBeforeUpdate',
  'onActivated',
  'onDeactivated',
  'onErrorCaptured',
  'onScopeDispose',
  'onClickOutside',
  'nextTick',
  'setTimeout',
  'setInterval',
  'requestAnimationFrame',
  'queueMicrotask',
  'addEventListener',
  'removeEventListener',
  'defineAsyncComponent',
  'it',
  'test',
  'bench',
  'beforeEach',
  'afterEach',
  'beforeAll',
  'afterAll',
  'then',
  'catch',
  'finally',
  'mockImplementation',
  'mockImplementationOnce',
  'fn',
  'h',
  'useEventListener',
  'Promise',
])

type Edit = { start: number; end: number; text: string }
/** A script's file and the line its content starts on (non-zero for .vue <script> blocks). */
type Source = { file: string; lineOffset: number }
type Report = {
  converted: number
  exceptions: string[]
  moves: string[]
}

const isFunctionLike = (node: TS.Node) =>
  ts.isFunctionDeclaration(node) ||
  ts.isFunctionExpression(node) ||
  ts.isArrowFunction(node) ||
  ts.isMethodDeclaration(node) ||
  ts.isGetAccessorDeclaration(node) ||
  ts.isSetAccessorDeclaration(node) ||
  ts.isConstructorDeclaration(node)

/** Returns why the function needs its own binding (`this`, `arguments`, `new.target`, `super`), or null. */
const getOwnBindingUse = (fn: TS.FunctionLikeDeclaration): string | null => {
  if (fn.parameters.some((p) => ts.isIdentifier(p.name) && p.name.text === 'this')) return 'this'
  let found: string | null = null
  const visit = (node: TS.Node) => {
    if (found) return
    if (node.kind === ts.SyntaxKind.ThisKeyword) found = 'this'
    if (node.kind === ts.SyntaxKind.SuperKeyword) found = 'super'
    if (ts.isMetaProperty(node) && node.keywordToken === ts.SyntaxKind.NewKeyword)
      found = 'new.target'
    if (ts.isIdentifier(node) && node.text === 'arguments' && isValueReference(node))
      found = 'arguments'
    if (found) return
    if (isFunctionLike(node) && !ts.isArrowFunction(node)) return
    if (ts.isClassLike(node)) return
    ts.forEachChild(node, visit)
  }
  if (fn.body) visit(fn.body)
  return found
}

/** True when an identifier is a runtime value reference (not a property name, declaration name or type). */
const isValueReference = (id: TS.Identifier) => {
  const parent = id.parent
  if (ts.isPropertyAccessExpression(parent) && parent.name === id) return false
  if (ts.isQualifiedName(parent)) return false
  if (
    (ts.isPropertyAssignment(parent) ||
      ts.isMethodDeclaration(parent) ||
      ts.isPropertyDeclaration(parent) ||
      ts.isPropertySignature(parent) ||
      ts.isGetAccessorDeclaration(parent) ||
      ts.isSetAccessorDeclaration(parent) ||
      ts.isEnumMember(parent)) &&
    parent.name === id
  )
    return false
  if (
    (ts.isVariableDeclaration(parent) ||
      ts.isFunctionDeclaration(parent) ||
      ts.isFunctionExpression(parent) ||
      ts.isClassDeclaration(parent) ||
      ts.isClassExpression(parent) ||
      ts.isParameter(parent) ||
      ts.isBindingElement(parent) ||
      ts.isImportSpecifier(parent) ||
      ts.isImportClause(parent) ||
      ts.isNamespaceImport(parent) ||
      ts.isLabeledStatement(parent) ||
      ts.isTypeAliasDeclaration(parent) ||
      ts.isInterfaceDeclaration(parent) ||
      ts.isTypeParameterDeclaration(parent)) &&
    parent.name === id
  )
    return false
  if (ts.isBindingElement(parent) && parent.propertyName === id) return false
  if (ts.isExportSpecifier(parent) || ts.isImportSpecifier(parent)) return false
  if (ts.isJsxAttribute(parent)) return false
  if ((ts.isBreakStatement(parent) || ts.isContinueStatement(parent)) && parent.label === id)
    return false
  return true
}

const getFunctionKeywordEnd = (node: TS.FunctionLikeDeclaration, sf: TS.SourceFile) => {
  const keyword = node.getChildren(sf).find((c) => c.kind === ts.SyntaxKind.FunctionKeyword)
  if (!keyword) throw new Error('function keyword not found')
  return keyword.end
}

const hasModifier = (node: TS.Node, kind: TS.SyntaxKind) =>
  (ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined)?.some((m) => m.kind === kind) ??
  false

const isAmbient = (node: TS.Node) => {
  if (node.getSourceFile().isDeclarationFile) return true
  for (let n: TS.Node | undefined = node; n; n = n.parent) {
    if (hasModifier(n, ts.SyntaxKind.DeclareKeyword)) return true
  }
  return false
}

/** Parent kinds where an arrow function can replace a function expression without parentheses. */
const isArrowSafePosition = (node: TS.Expression) => {
  const parent = node.parent
  if (ts.isParenthesizedExpression(parent)) return true
  if (ts.isCallExpression(parent) || ts.isNewExpression(parent)) return parent.expression !== node
  if (ts.isVariableDeclaration(parent) || ts.isPropertyAssignment(parent)) return true
  if (ts.isPropertyDeclaration(parent) || ts.isParameter(parent)) return true
  if (ts.isReturnStatement(parent) || ts.isArrayLiteralExpression(parent)) return true
  if (ts.isExportAssignment(parent) || ts.isSpreadElement(parent)) return false
  if (ts.isConditionalExpression(parent)) return parent.condition !== node
  if (ts.isBinaryExpression(parent))
    return parent.right === node && parent.operatorToken.kind === ts.SyntaxKind.EqualsToken
  return false
}

const getHeaderTail = (node: TS.FunctionLikeDeclaration, from: number, sf: TS.SourceFile) =>
  sf.text.slice(from, node.body!.getStart(sf)).trim()

const getLineStart = (text: string, pos: number) => text.lastIndexOf('\n', pos - 1) + 1

/** `vi.spyOn(target, 'Constructor').mockImplementation(function () {})`: arrows can't be `new`ed. */
const isConstructorMock = (node: TS.FunctionExpression) => {
  const call = node.parent
  if (!ts.isCallExpression(call) || !ts.isPropertyAccessExpression(call.expression)) return false
  if (!/^mockImplementation(Once)?$/.test(call.expression.name.text)) return false
  const spy = call.expression.expression
  if (!ts.isCallExpression(spy) || !ts.isPropertyAccessExpression(spy.expression)) return false
  if (spy.expression.name.text !== 'spyOn') return false
  const member = spy.arguments[1]
  return member !== undefined && ts.isStringLiteral(member) && /^[A-Z]/.test(member.text)
}

const isSelfReferencing = (node: TS.FunctionExpression) => {
  if (!node.name) return false
  const name = node.name.text
  let found = false
  const visit = (n: TS.Node) => {
    if (found) return
    if (ts.isIdentifier(n) && n.text === name && isValueReference(n)) found = true
    ts.forEachChild(n, visit)
  }
  visit(node.body)
  return found
}

/** Collects one round of non-overlapping conversion edits. */
const collectConversions = (sf: TS.SourceFile, file: string) => {
  const edits: Edit[] = []
  const overloads = new Map<string, TS.FunctionDeclaration[]>()
  const visit = (node: TS.Node) => {
    if (ts.isFunctionDeclaration(node) && !node.asteriskToken && !isAmbient(node)) {
      const key = `${node.parent.pos}:${node.name?.text ?? ''}`
      if (!node.body) {
        overloads.set(key, [...(overloads.get(key) ?? []), node])
      } else {
        convertDeclaration(node, overloads.get(key) ?? [])
        overloads.delete(key)
      }
    }
    if (ts.isFunctionExpression(node) && !node.asteriskToken) convertExpression(node)
    ts.forEachChild(node, visit)
  }

  const addDisable = (node: TS.Node, rule: string, reason: string) => {
    const start = node.getStart(sf, true)
    const lineStart = getLineStart(sf.text, start)
    const previous = sf.text.slice(getLineStart(sf.text, lineStart - 1), lineStart)
    if (previous.includes(rule)) return
    const indent = sf.text.slice(lineStart, start).match(/^\s*/)![0]
    edits.push({ start: lineStart, end: lineStart, text: `${indent}${DISABLE(rule, reason)}\n` })
  }

  const convertDeclaration = (
    node: TS.FunctionDeclaration,
    signatures: TS.FunctionDeclaration[],
  ) => {
    const name = node.name?.text
    const ownBinding = getOwnBindingUse(node)
    if (ownBinding) {
      addDisable(signatures[0] ?? node, FUNC_STYLE, `uses own \`${ownBinding}\``)
      return
    }
    if (signatures.length > 0 && KEEP_OVERLOADS.has(`${file}:${name}`)) {
      addDisable(signatures[0], FUNC_STYLE, 'overloads')
      return
    }
    const isExported = hasModifier(node, ts.SyntaxKind.ExportKeyword)
    const isDefault = hasModifier(node, ts.SyntaxKind.DefaultKeyword)
    const asyncPrefix = hasModifier(node, ts.SyntaxKind.AsyncKeyword) ? 'async ' : ''
    const tailFrom = node.name ? node.name.end : getFunctionKeywordEnd(node, sf)
    const tail = getHeaderTail(node, tailFrom, sf)
    const arrowHead = `${asyncPrefix}${tail} => `
    const annotation =
      signatures.length > 0
        ? `: {\n${signatures.map((s) => `  ${sf.text.slice(s.name!.end, s.end).trim().replace(/;$/, '')}`).join('\n')}\n}`
        : getAssertsAnnotation(node, sf)
    for (const s of signatures) {
      edits.push({ start: s.getStart(sf, true), end: s.end, text: '' })
    }
    const start = node.getStart(sf)
    const bodyStart = node.body!.getStart(sf)
    if (isDefault && !name) {
      edits.push({ start, end: bodyStart, text: `export default ${arrowHead}` })
    } else if (isDefault) {
      edits.push({ start, end: bodyStart, text: `const ${name}${annotation} = ${arrowHead}` })
      edits.push({ start: node.end, end: node.end, text: `\n\nexport default ${name}` })
    } else {
      const exportPrefix = isExported ? 'export ' : ''
      edits.push({
        start,
        end: bodyStart,
        text: `${exportPrefix}const ${name}${annotation} = ${arrowHead}`,
      })
    }
  }

  const convertExpression = (node: TS.FunctionExpression) => {
    if (getOwnBindingUse(node) || isSelfReferencing(node)) return
    if (isConstructorMock(node)) {
      addDisable(node, 'eslint/prefer-arrow-callback', 'constructor mock, invoked with `new`')
      return
    }
    const asyncPrefix = hasModifier(node, ts.SyntaxKind.AsyncKeyword) ? 'async ' : ''
    const tailFrom = node.name ? node.name.end : getFunctionKeywordEnd(node, sf)
    const head = `${asyncPrefix}${getHeaderTail(node, tailFrom, sf)} => `
    const isSafe = isArrowSafePosition(node)
    edits.push({
      start: node.getStart(sf),
      end: node.body.getStart(sf),
      text: isSafe ? head : `(${head}`,
    })
    if (!isSafe) edits.push({ start: node.end, end: node.end, text: ')' })
  }

  visit(sf)
  return dropOverlapping(edits)
}

/** Assertion functions declared as `const` need an explicit type annotation (TS2775). */
const getAssertsAnnotation = (node: TS.FunctionDeclaration, sf: TS.SourceFile) => {
  if (!node.type || !ts.isTypePredicateNode(node.type) || !node.type.assertsModifier) return ''
  const typeParams = node.typeParameters
    ? `<${node.typeParameters.map((p) => p.getText(sf)).join(', ')}>`
    : ''
  const params = node.parameters.map((p) => {
    const copy = p.getText(sf).replace(/\s*=[\s\S]*$/, '')
    return p.initializer && !p.questionToken ? copy.replace(/^(\.\.\.)?(\w+)/, '$1$2?') : copy
  })
  return `: ${typeParams}(${params.join(', ')}) => ${node.type.getText(sf)}`
}

/** Keeps edits that don't overlap an earlier-starting replacement; the rest are applied next round. */
const dropOverlapping = (edits: Edit[]) => {
  const sorted = [...edits].sort((a, b) => a.start - b.start || a.end - b.end)
  const kept: Edit[] = []
  let reachedEnd = -1
  for (const edit of sorted) {
    if (edit.start < reachedEnd) continue
    kept.push(edit)
    reachedEnd = Math.max(reachedEnd, edit.end)
  }
  return kept
}

const applyEdits = (text: string, edits: Edit[]) => {
  let result = text
  for (const edit of [...edits].sort((a, b) => b.start - a.start || b.end - a.end)) {
    result = result.slice(0, edit.start) + edit.text + result.slice(edit.end)
  }
  return result
}

// ---------------------------------------------------------------------------------------------
// Hoisting repair
// ---------------------------------------------------------------------------------------------

const getCalleeName = (call: TS.CallExpression | TS.NewExpression): string | null => {
  let callee: TS.Expression = call.expression
  while (true) {
    if (ts.isPropertyAccessExpression(callee)) return callee.name.text
    if (ts.isCallExpression(callee)) {
      callee = callee.expression
      continue
    }
    if (ts.isIdentifier(callee)) return callee.text
    return null
  }
}

const getRootCalleeName = (call: TS.CallExpression | TS.NewExpression): string | null => {
  let callee: TS.Expression = call.expression
  while (ts.isPropertyAccessExpression(callee) || ts.isCallExpression(callee)) {
    callee = callee.expression
  }
  return ts.isIdentifier(callee) ? callee.text : null
}

const hasImmediateOption = (call: TS.CallExpression) =>
  call.arguments.some(
    (arg) =>
      ts.isObjectLiteralExpression(arg) &&
      arg.properties.some(
        (p) =>
          ts.isPropertyAssignment(p) &&
          ts.isIdentifier(p.name) &&
          p.name.text === 'immediate' &&
          p.initializer.kind !== ts.SyntaxKind.FalseKeyword,
      ),
  )

/** Whether a nested function runs while its enclosing expression is being evaluated. */
const runsEagerly = (fn: TS.Node) => {
  let node = fn
  while (ts.isParenthesizedExpression(node.parent)) node = node.parent
  const parent = node.parent
  if (ts.isCallExpression(parent) && parent.expression === node) return true
  if (!(ts.isCallExpression(parent) || ts.isNewExpression(parent))) return false
  const name = getCalleeName(parent)
  const root = getRootCalleeName(parent)
  if (name === 'watch' && ts.isCallExpression(parent)) return hasImmediateOption(parent)
  if (name && DEFERRED_CALLEES.has(name)) return false
  if (root && DEFERRED_CALLEES.has(root) && root !== 'Promise') return false
  return true
}

/** Names referenced while `node` is evaluated (nested functions only when they run eagerly). */
const getEagerRefs = (node: TS.Node, refs = new Set<string>()) => {
  const visit = (n: TS.Node) => {
    if (ts.isTypeNode(n) && !ts.isExpressionWithTypeArguments(n)) return
    if (ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n)) return
    if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) return
    if (ts.isIdentifier(n)) {
      if (isValueReference(n)) refs.add(n.text)
      return
    }
    if (ts.isShorthandPropertyAssignment(n)) {
      refs.add(n.name.text)
      return
    }
    if (n !== node && (ts.isArrowFunction(n) || ts.isFunctionExpression(n))) {
      if (runsEagerly(n)) ts.forEachChild(n, visit)
      return
    }
    if (n !== node && (ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n))) return
    if (ts.isGetAccessorDeclaration(n) || ts.isSetAccessorDeclaration(n)) return
    if (ts.isConstructorDeclaration(n)) return
    if (ts.isPropertyDeclaration(n) && !hasModifier(n, ts.SyntaxKind.StaticKeyword)) return
    ts.forEachChild(n, visit)
  }
  visit(node)
  return refs
}

/** `const name = <arrow | function>` declared directly in a statement. */
const getFunctionDecls = (statement: TS.Statement) => {
  const decls = new Map<string, TS.Node>()
  if (ts.isFunctionDeclaration(statement) && statement.name && statement.body) {
    decls.set(statement.name.text, statement)
  }
  if (!ts.isVariableStatement(statement)) return decls
  for (const d of statement.declarationList.declarations) {
    const init = d.initializer
    if (!ts.isIdentifier(d.name) || !init) continue
    if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) decls.set(d.name.text, init)
  }
  return decls
}

const isConstArrowStatement = (statement: TS.Statement) =>
  ts.isVariableStatement(statement) &&
  statement.declarationList.declarations.length === 1 &&
  statement.declarationList.declarations[0].initializer !== undefined &&
  ts.isArrowFunction(statement.declarationList.declarations[0].initializer)

/** Finds converted functions used at evaluation time before their definition in one statement list. */
const findHoistViolations = (statements: readonly TS.Statement[], converted: Set<string>) => {
  const index = new Map<string, number>()
  const bodies = new Map<string, TS.Node>()
  statements.forEach((s, i) => {
    for (const [name, fn] of getFunctionDecls(s)) {
      index.set(name, i)
      bodies.set(name, fn)
    }
  })
  const bodyRefs = new Map<string, Set<string>>()
  const getBodyRefs = (name: string) => {
    if (!bodyRefs.has(name)) bodyRefs.set(name, getEagerRefs(bodies.get(name)!))
    return bodyRefs.get(name)!
  }
  /** target statement index for each statement index to move */
  const moves = new Map<number, number>()
  statements.forEach((s, j) => {
    const needed = getEagerRefs(s)
    const queue = [...needed]
    while (queue.length > 0) {
      const name = queue.pop()!
      if (!bodies.has(name)) continue
      for (const ref of getBodyRefs(name)) {
        if (needed.has(ref)) continue
        needed.add(ref)
        queue.push(ref)
      }
    }
    for (const name of needed) {
      const k = index.get(name)
      if (k === undefined || k <= j || !converted.has(name)) continue
      if (!isConstArrowStatement(statements[k])) continue
      if (!moves.has(k) || moves.get(k)! > j) moves.set(k, j)
    }
  })
  return moves
}

const getStatementLists = (sf: TS.SourceFile) => {
  const lists: (readonly TS.Statement[])[] = []
  const visit = (node: TS.Node) => {
    if (ts.isSourceFile(node) || ts.isBlock(node) || ts.isModuleBlock(node)) {
      lists.push(node.statements)
    }
    if (ts.isCaseClause(node) || ts.isDefaultClause(node)) lists.push(node.statements)
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return lists
}

/** Start of the statement including its leading comments, at line start. */
const getMovableStart = (statement: TS.Statement, sf: TS.SourceFile) => {
  const ranges = ts.getLeadingCommentRanges(sf.text, statement.getFullStart()) ?? []
  const first = ranges.find((r) => !sf.text.slice(r.pos, r.end).includes('#region'))
  return getLineStart(sf.text, first?.pos ?? statement.getStart(sf))
}

const repairHoisting = (
  code: string,
  kind: TS.ScriptKind,
  converted: Set<string>,
  file: string,
  report: Report,
) => {
  let text = code
  for (let round = 0; round < 20; round++) {
    const sf = ts.createSourceFile('x.ts', text, ts.ScriptTarget.Latest, true, kind)
    const edits: Edit[] = []
    for (const statements of getStatementLists(sf)) {
      const moves = findHoistViolations(statements, converted)
      if (moves.size === 0) continue
      const byTarget = new Map<number, number[]>()
      for (const [k, j] of moves) byTarget.set(j, [...(byTarget.get(j) ?? []), k])
      for (const [j, ks] of byTarget) {
        const target = statements[j]
        const insertAt = getMovableStart(target, sf)
        const blocks: string[] = []
        for (const k of ks.sort((a, b) => a - b)) {
          const statement = statements[k]
          const start = getMovableStart(statement, sf)
          let end = statement.end
          if (text[end] === '\n') end++
          blocks.push(text.slice(start, statement.end))
          edits.push({ start, end, text: '' })
          const name = [...getFunctionDecls(statement).keys()][0]
          const targetLine = text.slice(target.getStart(sf)).split('\n')[0].trim()
          report.moves.push(`${file}: \`${name}\` moved above \`${targetLine}\``)
        }
        edits.push({ start: insertAt, end: insertAt, text: `${blocks.join('\n\n')}\n\n` })
      }
    }
    if (edits.length === 0) return text
    text = applyEdits(text, edits).replace(/\n{3,}/g, '\n\n')
  }
  throw new Error(`${file}: hoisting repair did not converge`)
}

// ---------------------------------------------------------------------------------------------
// Driver
// ---------------------------------------------------------------------------------------------

const getConvertedNames = (sf: TS.SourceFile) => {
  const names = new Set<string>()
  const visit = (node: TS.Node) => {
    if (ts.isFunctionDeclaration(node) && node.name && node.body && !node.asteriskToken) {
      names.add(node.name.text)
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return names
}

/** Non-generator `function` declarations/expressions with a body. */
const getFunctionNodes = (sf: TS.SourceFile) => {
  const nodes: (TS.FunctionDeclaration | TS.FunctionExpression)[] = []
  const visit = (node: TS.Node) => {
    const isFunction = ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)
    if (isFunction && node.body && !node.asteriskToken && !isAmbient(node)) nodes.push(node)
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return nodes
}

const getKeepReason = (node: TS.FunctionDeclaration | TS.FunctionExpression) => {
  const ownBinding = getOwnBindingUse(node)
  if (ownBinding) return `uses own \`${ownBinding}\``
  if (ts.isFunctionExpression(node) && isSelfReferencing(node)) return 'references its own name'
  if (ts.isFunctionExpression(node) && isConstructorMock(node)) return 'constructor mock'
  return 'overloads'
}

const transformScript = (code: string, kind: TS.ScriptKind, source: Source, report: Report) => {
  const parse = (text: string) =>
    ts.createSourceFile('x.ts', text, ts.ScriptTarget.Latest, true, kind)
  const original = parse(code)
  const converted = getConvertedNames(original)
  let text = code
  for (let round = 0; round < 10; round++) {
    const edits = collectConversions(parse(text), source.file)
    if (edits.length === 0) break
    text = applyEdits(text, edits)
  }
  if (text === code) return code
  text = repairHoisting(text, kind, converted, source.file, report)
  const fileName = kind === ts.ScriptKind.TSX || kind === ts.ScriptKind.JSX ? 'x.tsx' : 'x.ts'
  const diagnostics =
    ts.transpileModule(text, { fileName, reportDiagnostics: true }).diagnostics ?? []
  if (diagnostics.length > 0) {
    const message = ts.flattenDiagnosticMessageText(diagnostics[0].messageText, '\n')
    throw new Error(`${source.file}: output does not parse: ${message}`)
  }
  const final = parse(text)
  const remaining = getFunctionNodes(final)
  report.converted += getFunctionNodes(original).length - remaining.length
  for (const node of remaining) {
    const line = source.lineOffset + final.getLineAndCharacterOfPosition(node.getStart(final)).line
    const name = node.name?.text ?? 'function expression'
    report.exceptions.push(`${source.file}:${line + 1} ${name}: ${getKeepReason(node)}`)
  }
  return text
}

const getScriptKind = (lang: string | undefined) => {
  if (lang === 'ts') return ts.ScriptKind.TS
  if (lang === 'tsx') return ts.ScriptKind.TSX
  if (lang === 'jsx') return ts.ScriptKind.JSX
  return ts.ScriptKind.JS
}

const transformFile = (file: string, report: Report) => {
  const text = readFileSync(join(ROOT, file), 'utf8')
  if (!file.endsWith('.vue')) {
    const kind = /\.(m|c)?tsx?$/.test(file)
      ? file.endsWith('x')
        ? ts.ScriptKind.TSX
        : ts.ScriptKind.TS
      : ts.ScriptKind.JS
    return transformScript(text, kind, { file, lineOffset: 0 }, report)
  }
  return text.replace(
    /^(<script\b([^>]*)>)([\s\S]*?)(^<\/script>)/gm,
    (_, open: string, attrs: string, content: string, close: string, offset: number) => {
      const lang = /\blang=["'](\w+)["']/.exec(attrs)?.[1]
      const lineOffset = text.slice(0, offset + open.length).split('\n').length - 1
      const source = { file, lineOffset }
      return open + transformScript(content, getScriptKind(lang), source, report) + close
    },
  )
}

const getLintedFiles = () =>
  execFileSync('git', ['ls-files', 'packages', 'docs'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n')
    .filter((f) => /\.(vue|[cm]?[jt]sx?)$/.test(f))
    .filter((f) => !f.endsWith('.d.ts'))
    .filter(
      (f) =>
        !f.startsWith('packages/herouse/') &&
        !f.includes('/dist/') &&
        !f.startsWith('docs/.vitepress/cache/') &&
        !f.startsWith('docs/.vitepress/api/') &&
        f !== 'docs/.vitepress/theme/fumadocs/typography.mjs',
    )

const main = () => {
  const args = process.argv.slice(2)
  const isDryRun = args.includes('--dry')
  const paths = args.filter((a) => a !== '--dry')
  const files = paths.length > 0 ? paths : getLintedFiles()
  const report: Report = { converted: 0, exceptions: [], moves: [] }
  const changed: string[] = []
  for (const file of files) {
    const before = readFileSync(join(ROOT, file), 'utf8')
    const after = transformFile(file, report)
    if (after === before) continue
    if (!isDryRun) writeFileSync(join(ROOT, file), after)
    changed.push(file)
  }
  console.log(`converted: ${report.converted} in ${changed.length} files`)
  console.log(`exceptions (${report.exceptions.length}):\n  ${report.exceptions.join('\n  ')}`)
  console.log(`moves (${report.moves.length}):\n  ${report.moves.join('\n  ')}`)
  console.log(`changed files:\n${changed.join('\n')}`)
}

main()
