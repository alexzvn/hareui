// V6: slot calls never merge `props.ui` / `props.class` by hand; `useComponentUI(name, { props })` layers them.
import fs from 'node:fs'

// `ui.slot({ class: [..., props.ui?.slot, props.class] })` in a template expression.
const TEMPLATE_MERGE = /\.\w+\(\{[^{}]*\bclass:[^{}]*\bprops\.(ui|class)\b/g

const isPropsMember = (node) =>
  node?.type === 'MemberExpression' &&
  node.object?.type === 'Identifier' &&
  node.object.name === 'props' &&
  node.property?.type === 'Identifier' &&
  (node.property.name === 'ui' || node.property.name === 'class')

const readsUserClasses = (node) => {
  if (!node || typeof node !== 'object') return false
  if (isPropsMember(node)) return true

  return Object.entries(node).some(
    ([key, value]) => key !== 'parent' && typeof value === 'object' && readsUserClasses(value),
  )
}

const getClassOption = (node) => {
  const [arg] = node.arguments
  if (node.callee.type !== 'MemberExpression' || arg?.type !== 'ObjectExpression') return undefined

  return arg.properties.find(
    (property) =>
      property.type === 'Property' &&
      property.key.type === 'Identifier' &&
      property.key.name === 'class',
  )
}

const lineOf = (text, index) => text.slice(0, index).split('\n').length

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow merging props.ui / props.class into a slot call by hand' },
    messages: {
      manualMerge:
        'Pass `props` to useComponentUI and call `ui.slot()` / `ui.slot({ class, override })`: it layers `props.ui` and `props.class` itself.',
      templateMerge:
        'Template line {{line}}: pass `props` to useComponentUI and call `ui.slot()` / `ui.slot({ class, override })` instead of merging `props.ui` / `props.class`.',
    },
    schema: [],
  },
  create(context) {
    const { filename } = context

    return {
      CallExpression(node) {
        const option = getClassOption(node)
        if (option && readsUserClasses(option.value))
          context.report({ node: option, messageId: 'manualMerge' })
      },
      Program(node) {
        if (!filename.endsWith('.vue')) return

        const text = fs.readFileSync(filename, 'utf8')
        const template = /^<template>[\s\S]*^<\/template>/m.exec(text)
        if (!template) return

        for (const match of template[0].matchAll(TEMPLATE_MERGE)) {
          const line = lineOf(text, template.index + match.index)
          context.report({ node, messageId: 'templateMerge', data: { line: String(line) } })
        }
      },
    }
  },
}
