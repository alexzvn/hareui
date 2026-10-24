import type { InjectionKey, Ref } from 'vue'

export type SurfaceContext = {
  /** The current surface's visual variant. */
  variant: Readonly<Ref<'transparent' | 'default' | 'secondary' | 'tertiary'>>
}

export const surfaceContextKey: InjectionKey<SurfaceContext> = Symbol('hareui-surface')
