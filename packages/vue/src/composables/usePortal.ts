import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { PortalTarget } from '../config'
import { computed, inject, toValue } from 'vue'
import { hareUIConfigKey } from '../config'

export interface ResolvedPortal {
  /** Teleport target; `'body'` when portalling is on without an explicit target. */
  to: string | HTMLElement
  disabled: boolean
}

/**
 * Resolves an overlay's portal target: the component's own `portal` prop, else the app-wide
 * `createHareUI({ portal })`, else `document.body`.
 */
export function usePortal(portal: MaybeRefOrGetter<PortalTarget | undefined>): ComputedRef<ResolvedPortal> {
  const config = inject(hareUIConfigKey, {})
  return computed(() => {
    const target = toValue(portal) ?? config.portal ?? true
    return { to: typeof target === 'boolean' ? 'body' : target, disabled: target === false }
  })
}
