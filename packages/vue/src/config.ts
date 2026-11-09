import type { Component, InjectionKey, Plugin } from 'vue'
import { markRaw, reactive } from 'vue'

import type { Themes } from './components/themes'
import type { ThemeOverride } from './types/tv'

/** Overlay portal target: `true` = `document.body`, a selector or element = that target, `false` = render in place. */
export type PortalTarget = boolean | string | HTMLElement

/** App-level configuration passed to `createHareUI()`. */
export type HareUIConfig = {
  /** Per-component theme overrides merged on top of the default themes. */
  ui?: { [K in keyof Themes]?: ThemeOverride<Themes[K]> }
  /**
   * Renders components headless: their default theme and every `ui` override (Vite plugin and `ui` above) are
   * dropped, while the `ui` / `class` props, data attributes and behavior stay. `true` strips every component;
   * an array strips only the listed theme keys (the keys of `ui`). Per component, not inherited: `['select']`
   * keeps the theme of the `ListBox` inside a `Select`.
   * @defaultValue false
   */
  unstyled?: boolean | Array<keyof Themes>
  /**
   * Components registered globally under the given names (`app.component(name, component)`), e.g. presets made
   * with `defineAlias`.
   */
  components?: Record<string, Component>
  /**
   * Default portal target for every overlay whose own `portal` prop is unset. Use an element inside a
   * shadow root to keep overlays in it.
   * @defaultValue true
   */
  portal?: PortalTarget
  /** Options of `Map` from `@hareui/vue/map`. */
  map?: {
    /**
     * URL of maplibre-gl's worker (`maplibre-gl/dist/maplibre-gl-worker.mjs`), for bundlers other than Vite. The
     * `hareui()` Vite plugin sets it already.
     */
    workerUrl?: string
  }
}

/** Injection key of the app-level `HareUIConfig` provided by `createHareUI()`. */
export const hareUIConfigKey: InjectionKey<HareUIConfig> = Symbol('hareui-config')

/** Vue plugin providing app-level HareUI configuration. Optional. */
export const createHareUI = (config: HareUIConfig = {}): Plugin => {
  return {
    install(app) {
      // A proxied element is not a DOM Node, so Teleport could not insert into it.
      if (typeof config.portal === 'object') markRaw(config.portal)
      app.provide(hareUIConfigKey, reactive(config) as HareUIConfig)

      for (const [name, component] of Object.entries(config.components ?? {}))
        app.component(name, component)
    },
  }
}
