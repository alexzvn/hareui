import type { ComponentResolver, Options as ComponentsOptions } from 'unplugin-vue-components/types'
import Components from 'unplugin-vue-components/vite'
import componentNames from 'virtual:hareui-component-names'
import type { Plugin } from 'vite'

import type { HareUIConfig } from './config'
import { hareuiMapWorker } from './viteMapWorker'

export { hareuiMapWorker }

/** Options for `HareUIResolver`, the unplugin-vue-components resolver for HareUI components. */
export type HareUIResolverOptions = {
  /**
   * Prefix of HareUI components in templates. `'H'` resolves `<HButton>` and `<h-button>` to `Button`.
   * Kebab-case (`'h-'`) is accepted and converted to PascalCase.
   * @defaultValue ''
   */
  prefix?: string
  /**
   * Extra template names for HareUI components, as `{ tag: componentName }`. `{ Btn: 'Button' }` resolves
   * `<Btn>` and `<btn>` to `Button`. Keys get no `prefix`; kebab-case keys are converted to PascalCase.
   * An unknown component name throws when the plugin starts.
   */
  aliases?: Record<string, string>
}

/** Options for the `hareui()` Vite plugin; also accepts every `HareUIResolverOptions` key. */
export type HareUIPluginOptions = {
  /**
   * App-wide component theme overrides, same shape as `createHareUI({ ui })`. Applied above the default
   * themes and below `createHareUI({ ui })`. Inlined at build time, so values must be JSON-serializable.
   */
  ui?: HareUIConfig['ui']
  /**
   * Options for [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components); the HareUI
   * resolver is appended to `resolvers`. `false` disables component auto import.
   */
  components?: ComponentsOptions | false
} & HareUIResolverOptions

const components = new Map(Object.entries(componentNames))

const pascalCase = (value: string): string => {
  return value
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

const resolveAlias = ([tag, component]: [string, string]) => {
  const from = components.get(component)
  if (!from)
    throw new Error(
      `[hareui] alias "${tag}" targets "${component}", which is not a HareUI component.`,
    )

  return [pascalCase(tag), { name: component, from }] as const
}

/**
 * unplugin-vue-components resolver for HareUI components, for setups that register unplugin-vue-components themselves.
 * Chart components resolve to `@hareui/vue/charts`.
 */
export const HareUIResolver = (options: HareUIResolverOptions = {}): ComponentResolver => {
  const prefix = pascalCase(options.prefix ?? '')
  const aliases = new Map(Object.entries(options.aliases ?? {}).map(resolveAlias))

  return {
    type: 'component',
    resolve(name) {
      const alias = aliases.get(name)
      if (alias) return alias
      if (!name.startsWith(prefix)) return
      const component = name.slice(prefix.length)
      const from = components.get(component)
      if (from) return { name: component, from }
    },
  }
}

/**
 * Vite plugin: auto-imports HareUI components (optionally prefixed or aliased), applies app-wide theme overrides and
 * serves the maplibre-gl worker to `Map` when `maplibre-gl` is installed.
 */
export const hareui = (options: HareUIPluginOptions = {}): Plugin[] => {
  const plugins: Plugin[] = [hareuiMapWorker()]
  const { ui } = options
  if (ui) {
    // `useComponentUI` reads this global; Vite's `define` also reaches the pre-bundled `@hareui/vue`.
    plugins.push({
      name: 'hareui:ui',
      config: () => ({ define: { __HAREUI_UI__: JSON.stringify(ui) } }),
    })
  }

  if (options.components !== false) {
    const { resolvers = [], ...rest } = options.components ?? {}
    plugins.push(
      Components({
        ...rest,
        resolvers: [
          ...resolvers,
          HareUIResolver({ prefix: options.prefix, aliases: options.aliases }),
        ],
      }),
    )
  }

  return plugins
}

export default hareui
