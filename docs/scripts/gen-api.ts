import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { createChecker, type PropertyMeta } from 'vue-component-meta'
import type { ApiProp, ComponentApi } from './api-types'

const root = resolve(import.meta.dir, '../..')
const componentsDir = join(root, 'packages/vue/src/components')
const outDir = join(root, 'docs/.vitepress/api')

const checker = createChecker(join(root, 'packages/vue/tsconfig.json'), {
  forceUseTs: true,
  printer: { newLine: 1 },
})

function defaultValue(prop: PropertyMeta): string | undefined {
  if (prop.default !== undefined) return prop.default
  const tag = prop.tags.find((t) => t.name === 'defaultValue' || t.name === 'default')
  return tag?.text?.trim() || undefined
}

function fromNodeModules(prop: PropertyMeta): boolean {
  return prop.declarations.length > 0 && prop.declarations.every((d) => d.file.includes('/node_modules/'))
}

function toProp(prop: PropertyMeta): ApiProp {
  return {
    name: prop.name,
    type: prop.type.replace(/\s*\|\s*undefined$/, ''),
    default: defaultValue(prop),
    description: prop.description,
    required: prop.required,
  }
}

// Only public components: the package entry re-exports each folder's index.ts, which lists that folder's public parts
// (internal parts like ListBoxOption or ToastItem aren't in it).
const entry = await Bun.file(join(componentsDir, '../index.ts')).text()
const isPublic = async (file: string) => {
  const dir = dirname(file)
  if (!entry.includes(`from './components/${dir}'`)) return false
  const index = await Bun.file(join(componentsDir, dir, 'index.ts')).text()
  return index.includes(`from './${basename(file)}'`)
}
const files: string[] = []
for (const f of (await readdir(componentsDir, { recursive: true })).sort()) {
  if (f.endsWith('.vue') && (await isPublic(f))) files.push(f)
}

await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

// Generic components (`generic="T extends ListBoxItem = ListBoxItem"`) print `T` in their types; show the item type instead
function ungeneric(source: string): (type: string) => string {
  const constraint = source.match(/<script setup[^>]*\sgeneric="T extends (\w+)/)?.[1]
  return constraint ? (type) => type.replace(/<T>/g, '').replace(/\bT\b/g, constraint) : (type) => type
}

for (const file of files) {
  const name = basename(file, '.vue')
  const path = join(componentsDir, file)
  const meta = checker.getComponentMeta(path)
  const named = ungeneric(await Bun.file(path).text())
  const api: ComponentApi = {
    props: meta.props
      .filter((p) => !p.global && !(fromNodeModules(p) && !p.description))
      .map((p) => ({ ...toProp(p), type: named(toProp(p).type) })),
    slots: meta.slots.map((s) => ({ name: s.name, type: named(s.type), description: s.description })),
    events: meta.events.map((e) => ({ name: e.name, type: named(e.type), description: e.description })),
  }
  await writeFile(join(outDir, `${name}.json`), `${JSON.stringify(api, null, 2)}\n`)
  console.log(`api: ${name} (${api.props.length} props, ${api.slots.length} slots, ${api.events.length} events)`)
}
