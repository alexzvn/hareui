import type { InjectionKey, Plugin } from 'vue'
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
   * Default portal target for every overlay whose own `portal` prop is unset. Use an element inside a
   * shadow root to keep overlays in it.
   * @defaultValue true
   */
  portal?: PortalTarget
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
    },
  }
}
