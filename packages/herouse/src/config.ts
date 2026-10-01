import type { InjectionKey, Plugin } from 'vue'
import type { Themes } from './theme'
import type { ThemeOverride } from './types/tv'
import { reactive } from 'vue'

export interface HeroUseConfig {
  /** Per-component theme overrides merged on top of the default themes. */
  ui?: { [K in keyof Themes]?: ThemeOverride<Themes[K]> }
}

export const heroUseConfigKey: InjectionKey<HeroUseConfig> = Symbol('herouse-config')

/** Vue plugin providing app-level herouse configuration. Optional. */
export function createHeroUse(config: HeroUseConfig = {}): Plugin {
  return {
    install(app) {
      app.provide(heroUseConfigKey, reactive(config) as HeroUseConfig)
    },
  }
}
