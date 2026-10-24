import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * One standalone page per demo (`docs/demos/<name>.vue` → `/preview/<name>`), iframed by ComponentPreview at a device
 * or dragged width and linked by its "Open in new tab" button. `layout`, `align` and `minHeight` mirror how the docs
 * page shows the demo: `contain` demos fill the viewport (`page`), the others are laid out like the preview box
 * (`centered`), so the box swaps between its inline render and the frame without a jump.
 */
type Usage = {
  layout: 'page' | 'centered'
  align: string
  minHeight: string
}
export default {
  paths() {
    const root = fileURLToPath(new URL('../', import.meta.url))
    const usage = new Map<string, Usage>()
    for (const file of readdirSync(join(root, 'docs'), { recursive: true, encoding: 'utf8' })) {
      if (!file.endsWith('.md')) continue
      for (const [tag] of readFileSync(join(root, 'docs', file), 'utf8').matchAll(
        /<ComponentPreview\b[^>]*>/g,
      )) {
        const name = /\sname="([^"]+)"/.exec(tag)?.[1]
        if (!name || usage.has(name)) continue
        usage.set(name, {
          layout: /\scontain\b/.test(tag) ? 'page' : 'centered',
          align: /\salign="(\w+)"/.exec(tag)?.[1] ?? 'center',
          minHeight: /\sminHeight="([^"]+)"/.exec(tag)?.[1] ?? '',
        })
      }
    }
    return readdirSync(join(root, 'demos'), { recursive: true, encoding: 'utf8' })
      .filter((file) => file.endsWith('.vue'))
      .map((file) => file.slice(0, -'.vue'.length).replaceAll('\\', '/'))
      .sort()
      .map((name) => ({
        params: {
          name,
          ...(usage.get(name) ?? { layout: 'centered', align: 'center', minHeight: '' }),
        },
      }))
  },
}
