import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'
import type { DropZoneFileColor } from './utils'

/** Upload state of a file item. */
export type DropZoneFileStatus = 'uploading' | 'complete' | 'failed'

/** The DropZone theme slots a file item renders. */
export type FileItemSlots = Pick<
  ComponentSlots<typeof theme>,
  | 'fileItem'
  | 'fileFormatIcon'
  | 'fileFormatIconBadge'
  | 'fileInfo'
  | 'fileName'
  | 'fileMeta'
  | 'fileProgress'
  | 'fileRetryTrigger'
  | 'fileRemoveTrigger'
>

/** Props of `DropZoneFileItem`: one file row with a format icon, name, size, optional progress bar and remove/retry buttons. */
export type DropZoneFileItemProps = {
  /** The file to show. Fills in `name` and `size`. */
  file?: File
  /** The file name. Defaults to the name of `file`. */
  name?: string
  /** The file size in bytes, shown in the meta line. Defaults to the size of `file`. */
  size?: number
  /** The badge text on the file icon, e.g. `PDF`. Defaults to the extension of `name`. */
  format?: string
  /** The badge color on the file icon. Defaults to a color picked from the extension, `gray` for unknown ones. */
  color?: DropZoneFileColor
  /** The upload state. `failed` turns the border red; with `progress`, `complete` and `failed` color the bar. */
  status?: DropZoneFileStatus
  /** Upload progress from 0 to 100. Renders a progress bar when set. */
  progress?: number
  /**
   * Whether to show the remove button.
   * @defaultValue true
   */
  removable?: boolean
  /**
   * Whether to show a retry button while `status` is `failed`.
   * @defaultValue false
   */
  retryable?: boolean
  /** Additional classes merged into the item element. */
  class?: ClassValue
  /** Per-slot class overrides. Merged after the surrounding DropZone's `ui`. */
  ui?: FileItemSlots
}

/** Props passed to every `DropZoneFileItem` slot. */
export type DropZoneFileItemSlotProps = {
  /** The file name. */
  name: string
  /** The formatted file size (`2.4 MB`); empty when the size is unknown. */
  size: string
  /** The upload state. */
  status: DropZoneFileStatus | undefined
  /** The upload progress. */
  progress: number | undefined
}

/** Slots of `DropZoneFileItem`. */
export type DropZoneFileItemSlots = {
  /** Replaces the file format icon. */
  icon?: (props: DropZoneFileItemSlotProps) => VNode[]
  /** Replaces the file name. */
  name?: (props: DropZoneFileItemSlotProps) => VNode[]
  /** Replaces the meta line content (the formatted size by default). */
  meta?: (props: DropZoneFileItemSlotProps) => VNode[]
  /** Extra content below the meta line and progress bar, e.g. an error message or a retry button. */
  default?: (props: DropZoneFileItemSlotProps) => VNode[]
  /** Replaces the retry button label. */
  retry?: (props: DropZoneFileItemSlotProps) => VNode[]
  /** Replaces the remove button icon. */
  remove?: (props: DropZoneFileItemSlotProps) => VNode[]
}
