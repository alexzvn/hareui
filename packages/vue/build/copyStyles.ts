// Copies the stylesheets into dist: `src/styles` and each component's own `<name>.css`, at the same relative paths, so
// `styles/index.css` resolves its `../components/<name>/<name>.css` imports in the published package too.
import { cpSync } from 'node:fs'
import { join } from 'node:path'

const src = join(import.meta.dirname, '../src')
const dist = join(import.meta.dirname, '../dist')

cpSync(join(src, 'styles'), join(dist, 'styles'), { recursive: true })

for (const file of new Bun.Glob('components/*/*.css').scanSync(src))
  cpSync(join(src, file), join(dist, file))
