import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import type { Plugin } from 'vite'

const VIRTUAL_ID = 'virtual:hareui-component-names'
const RESOLVED_ID = `\0${VIRTUAL_ID}`
const srcDir = fileURLToPath(new URL('../src/', import.meta.url))

/** Package entries and the import path they are published under. */
const entries = {
  'index.ts': '@hareui/vue',
  'charts.ts': '@hareui/vue/charts',
  'carousel.ts': '@hareui/vue/carousel',
  'code-block.ts': '@hareui/vue/code-block',
  'command-palette.ts': '@hareui/vue/command-palette',
  'editor.ts': '@hareui/vue/editor',
}

/**
 * Component name → import path, for the components each entry re-exports
 * (`export * from './components/<dir>'` → `export { default as Name }`).
 */
export const componentNames = (): Record<string, string> => {
  const names: Record<string, string> = {}
  for (const [file, from] of Object.entries(entries)) {
    const entry = readFileSync(`${srcDir}${file}`, 'utf8')
    for (const [, dir] of entry.matchAll(/^export \* from '\.\/components\/([\w-]+)'$/gm)) {
      const source = readFileSync(`${srcDir}components/${dir}/index.ts`, 'utf8')
      for (const [, name] of source.matchAll(/^export \{ default as (\w+)\b/gm)) names[name!] = from
    }
  }

  return Object.fromEntries(Object.entries(names).sort(([a], [b]) => a.localeCompare(b)))
}

/** Serves `virtual:hareui-component-names` (the name → import path map) to the Vite plugin entry at build/test time. */
export const componentNamesPlugin = (): Plugin => {
  return {
    name: 'hareui:component-names',
    resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),
    load: (id) =>
      id === RESOLVED_ID ? `export default ${JSON.stringify(componentNames())}` : undefined,
  }
}
