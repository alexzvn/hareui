import type { VNode } from 'vue'

/** Props of `ChatAttachmentInput`, a drop zone around a composer that picks, drops and pastes files. */
export type ChatAttachmentInputProps = {
  /** The accepted MIME types and extensions, as in `<input accept>`. Also filters dropped and pasted files. */
  accept?: string
  /**
   * Lets the picker select several files; drops and pastes keep only the first file when off.
   * @defaultValue true
   */
  multiple?: boolean
  /**
   * Ignores picks, drops and pastes.
   * @defaultValue false
   */
  disabled?: boolean
}

/** Slots of `ChatAttachmentInput`. */
export type ChatAttachmentInputSlots = {
  /** The composer. `open` shows the file picker; `isDragging` is true while accepted files are dragged over it. */
  default?: (props: { open: () => void; isDragging: boolean }) => VNode[]
}

/** Events emitted by `ChatAttachmentInput`. */
export type ChatAttachmentInputEmits = {
  /** Emitted with the accepted files of a pick, a drop or a paste. */
  select: [files: File[]]
}
