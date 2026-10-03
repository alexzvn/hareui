import type { InjectionKey, Plugin } from 'vue'
import type { Themes } from './theme'
import type { ThemeOverride } from './types/tv'
import { reactive } from 'vue'

export interface HareUIConfig {
  /** Per-component theme overrides merged on top of the default themes. */
  ui?: { [K in keyof Themes]?: ThemeOverride<Themes[K]> }
}

export const hareUIConfigKey: InjectionKey<HareUIConfig> = Symbol('hareui-config')

/** Vue plugin providing app-level HareUI configuration. Optional. */
export function createHareUI(config: HareUIConfig = {}): Plugin {
  return {
    install(app) {
      app.provide(hareUIConfigKey, reactive(config) as HareUIConfig)
    },
  }
}
