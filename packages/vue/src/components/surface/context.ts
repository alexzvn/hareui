import type { InjectionKey, Ref } from 'vue'

/** What a `Surface` provides to its descendants, so they can adapt to the surface they sit on. */
export type SurfaceContext = {
  /** The current surface's visual variant. */
  variant: Readonly<Ref<'transparent' | 'default' | 'secondary' | 'tertiary'>>
}

/** Injection key a `Surface` provides its `SurfaceContext` under; `inject` it to read the enclosing surface. */
export const surfaceContextKey: InjectionKey<SurfaceContext> = Symbol('hareui-surface')
