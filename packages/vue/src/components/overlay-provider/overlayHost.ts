import type { InjectionKey } from 'vue'

/** Provided by an `App` that renders the `OverlayProvider`, so a nested `App` doesn't render each overlay twice. */
export const overlayHostKey: InjectionKey<true> = Symbol('hareui-overlay-host')
