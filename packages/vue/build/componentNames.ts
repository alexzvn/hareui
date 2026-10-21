import type { Plugin } from 'vite'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const VIRTUAL_ID = 'virtual:hareui-component-names'
const RESOLVED_ID = `\0${VIRTUAL_ID}`
const srcDir = fileURLToPath(new URL('../src/', import.meta.url))

/** Names of the components exported from `src/index.ts` (`export * from './components/<dir>'` → `export { default as Name }`). */
export function componentNames(): string[] {
  const index = readFileSync(`${srcDir}index.ts`, 'utf8')
  const names: string[] = []
  for (const [, dir] of index.matchAll(/^export \* from '\.\/components\/([\w-]+)'$/gm)) {
    const source = readFileSync(`${srcDir}components/${dir}/index.ts`, 'utf8')
    for (const [, name] of source.matchAll(/^export \{ default as (\w+)\b/gm))
      names.push(name!)
  }
  return names.sort()
}

/** Serves `virtual:hareui-component-names` (the component name list) to the Vite plugin entry at build/test time. */
export function componentNamesPlugin(): Plugin {
  return {
    name: 'hareui:component-names',
    resolveId: id => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),
    load: id => (id === RESOLVED_ID ? `export default ${JSON.stringify(componentNames())}` : undefined),
  }
}
