import type { ComputedRef } from 'vue'
import type { Themes } from '../theme'
import type { ComponentUI, ThemeShape } from '../types/tv'
import { computed, inject } from 'vue'
import { heroUseConfigKey } from '../config'
import { tv } from '../utils/tv'

/**
 * Builds the slot class functions for a component: default theme, extended by the
 * app config (`createHeroUse({ ui })`), resolved for the current variant props.
 */
export function useComponentUI<T extends ThemeShape>(
  name: keyof Themes,
  theme: T,
  variantProps: () => Record<string, unknown>,
): ComputedRef<ComponentUI<T>> {
  const config = inject(heroUseConfigKey, {})
  return computed(() => tv({ extend: theme, ...(config.ui?.[name] ?? {}) } as any)(variantProps()) as unknown as ComponentUI<T>)
}
