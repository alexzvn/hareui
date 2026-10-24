import type { ComponentResolver, Options as ComponentsOptions } from 'unplugin-vue-components/types'
import Components from 'unplugin-vue-components/vite'
import componentNames from 'virtual:hareui-component-names'
import type { Plugin } from 'vite'

import type { HareUIConfig } from './config'

export interface HareUIResolverOptions {
  /**
   * Prefix of HareUI components in templates. `'H'` resolves `<HButton>` and `<h-button>` to `Button`.
   * Kebab-case (`'h-'`) is accepted and converted to PascalCase.
   * @defaultValue ''
   */
  prefix?: string
}

export interface HareUIPluginOptions extends HareUIResolverOptions {
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
}

const components = new Map(Object.entries(componentNames))

function pascalCase(value: string): string {
  return value
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/**
 * unplugin-vue-components resolver for HareUI components, for setups that register unplugin-vue-components themselves.
 * Chart components resolve to `@hareui/vue/charts`.
 */
export function HareUIResolver(options: HareUIResolverOptions = {}): ComponentResolver {
  const prefix = pascalCase(options.prefix ?? '')
  return {
    type: 'component',
    resolve(name) {
      if (!name.startsWith(prefix)) return
      const component = name.slice(prefix.length)
      const from = components.get(component)
      if (from) return { name: component, from }
    },
  }
}

/** Vite plugin: auto-imports HareUI components (optionally prefixed) and applies app-wide theme overrides. */
export function hareui(options: HareUIPluginOptions = {}): Plugin[] {
  const plugins: Plugin[] = []
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
        resolvers: [...resolvers, HareUIResolver({ prefix: options.prefix })],
      }),
    )
  }
  return plugins
}

export default hareui
