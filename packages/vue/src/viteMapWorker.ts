import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'

import type { Plugin } from 'vite'

const WORKER = 'maplibre-gl/dist/maplibre-gl-worker.mjs'

/**
 * Serves maplibre-gl's worker to `Map`. maplibre-gl looks the worker up next to its own module, which pre-bundling in
 * development and chunking in builds both move. The plugin defines `__HAREUI_MAP_WORKER__` as the worker's URL: the
 * file itself while serving, a hashed asset it emits in builds. Does nothing when `maplibre-gl` isn't installed.
 */
export const hareuiMapWorker = (): Plugin => {
  let source: Buffer | undefined
  let fileName = ''

  return {
    name: 'hareui:map-worker',
    config(config, { command }) {
      const root = resolve(config.root ?? process.cwd())
      let file: string
      try {
        file = createRequire(join(root, 'package.json')).resolve(WORKER)
      } catch {
        return undefined
      }

      const base = (config.base ?? '/').replace(/\/?$/, '/')
      if (command === 'serve') {
        const path = file.replaceAll('\\', '/')

        return {
          define: {
            __HAREUI_MAP_WORKER__: JSON.stringify(
              `${base}@fs${path.startsWith('/') ? '' : '/'}${path}`,
            ),
          },
        }
      }

      source = readFileSync(file)
      const hash = createHash('sha256').update(source).digest('hex').slice(0, 8)
      fileName = `${config.build?.assetsDir ?? 'assets'}/maplibre-gl-worker-${hash}.mjs`

      return { define: { __HAREUI_MAP_WORKER__: JSON.stringify(`${base}${fileName}`) } }
    },
    generateBundle() {
      // Server bundles never start the worker.
      if (!source || this.environment?.config.consumer === 'server') return

      this.emitFile({ type: 'asset', fileName, source })
    },
  }
}
