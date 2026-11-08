import type { MaybeRefOrGetter, Ref } from 'vue'
import { ref, toValue } from 'vue'

import { dragMatchesAccept, matchesAccept } from '@/components/drop-zone/utils'

/** Options of `useChatAttachmentInput`. */
export type UseChatAttachmentInputOptions = {
  /** The accepted MIME types and extensions, as in `<input accept>`. Also filters dropped and pasted files. */
  accept?: MaybeRefOrGetter<string | undefined>
  /** Lets the picker select several files; drops and pastes keep only the first file when off. Defaults to `true`. */
  multiple?: MaybeRefOrGetter<boolean | undefined>
  /** Ignores picks, drops and pastes. */
  disabled?: MaybeRefOrGetter<boolean | undefined>
  /** Called with the accepted files of a pick, a drop or a paste. Never called with an empty list. */
  onSelect: (files: File[]) => void
}

/** What `useChatAttachmentInput` returns. */
export type UseChatAttachmentInput = {
  /** Opens the system file picker. */
  open: () => void
  /** Whether files are dragged over the drop zone. */
  isDragging: Readonly<Ref<boolean>>
  /** Drag and drop listeners for the composer: `v-bind="dropzone"`. */
  dropzone: {
    onDragenter: (event: DragEvent) => void
    onDragover: (event: DragEvent) => void
    onDragleave: (event: DragEvent) => void
    onDrop: (event: DragEvent) => void
  }
  /** A `paste` listener that picks up pasted files, such as screenshots. */
  onPaste: (event: ClipboardEvent) => void
}

const hasFiles = (event: DragEvent) => !!event.dataTransfer?.types.includes('Files')

/**
 * Adds files to a chat composer: a file picker, drag and drop onto the composer, and pasted files. Files outside
 * `accept` are dropped; the accepted ones reach `onSelect`.
 */
export const useChatAttachmentInput = (
  options: UseChatAttachmentInputOptions,
): UseChatAttachmentInput => {
  const isDragging = ref(false)

  // `dragenter`/`dragleave` fire for every child the pointer crosses; the depth tells when it left the zone
  let depth = 0

  const isDisabled = () => !!toValue(options.disabled)
  const isMultiple = () => toValue(options.multiple) ?? true

  const select = (list: FileList | File[] | null | undefined) => {
    if (isDisabled() || !list?.length) return

    const accepted = Array.from(list).filter((file) => matchesAccept(file, toValue(options.accept)))
    const files = isMultiple() ? accepted : accepted.slice(0, 1)

    if (files.length) options.onSelect(files)
  }

  let input: HTMLInputElement | undefined

  const open = () => {
    if (isDisabled() || typeof document === 'undefined') return

    input ??= document.createElement('input')
    input.type = 'file'
    input.accept = toValue(options.accept) ?? ''
    input.multiple = isMultiple()
    input.value = ''
    input.onchange = () => select(input?.files)
    input.click()
  }

  const onDragenter = (event: DragEvent) => {
    if (isDisabled() || !hasFiles(event)) return

    event.preventDefault()
    depth += 1
    isDragging.value = dragMatchesAccept(event.dataTransfer?.items, toValue(options.accept))
  }

  const onDragover = (event: DragEvent) => {
    if (isDisabled() || !hasFiles(event)) return

    event.preventDefault()

    if (event.dataTransfer) event.dataTransfer.dropEffect = isDragging.value ? 'copy' : 'none'
  }

  const onDragleave = () => {
    depth = Math.max(0, depth - 1)

    if (depth === 0) isDragging.value = false
  }

  const onDrop = (event: DragEvent) => {
    if (!hasFiles(event)) return

    event.preventDefault()
    depth = 0
    isDragging.value = false
    select(event.dataTransfer?.files)
  }

  const onPaste = (event: ClipboardEvent) => {
    const files = event.clipboardData?.files

    if (!files?.length || isDisabled()) return

    event.preventDefault()
    select(files)
  }

  return { open, isDragging, dropzone: { onDragenter, onDragover, onDragleave, onDrop }, onPaste }
}
