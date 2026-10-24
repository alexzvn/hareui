import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

export type DropZoneFileListProps = {
  /** Additional classes merged into the list element. */
  class?: ClassValue
  /** Per-slot class overrides. Merged after the surrounding DropZone's `ui`. */
  ui?: Pick<ComponentSlots<typeof theme>, 'fileList'>
}

export type DropZoneFileListSlots = {
  /** The `DropZoneFileItem`s. Give each a unique `key` so they animate in and out. */
  default?: () => VNode[]
}
