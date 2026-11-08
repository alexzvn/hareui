import { injectMapContext } from './context'
import type { UseMapReturn } from './types'

/**
 * The enclosing `Map`: its maplibre-gl instance once created, whether it has drawn, and camera moves. Call it in a
 * component inside `Map`'s default slot; it throws anywhere else.
 */
export const useMap = (): UseMapReturn => injectMapContext('useMap').api
