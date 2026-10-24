import type { InjectionKey, Ref } from 'vue'

import type { ComponentSlots } from '../../types/tv'
import type theme from './theme'

export interface DropZoneContext {
  /** The DropZone's `ui` prop, merged under the file list's and file items' own `ui`. */
  ui: Readonly<Ref<ComponentSlots<typeof theme> | undefined>>
}

export const dropZoneContextKey: InjectionKey<DropZoneContext> = Symbol('hareui-drop-zone')
