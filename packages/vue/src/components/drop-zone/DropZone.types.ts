import type { VNode } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type DropZone = typeof theme

/** A file the DropZone turned away, and why: it doesn't match `accept` (`type`) or exceeds `maxSize` (`size`). */
export type DropZoneRejection = {
  file: File
  reason: 'type' | 'size'
}

/** Props of `DropZone`: a file drop area with a picker button, accept/size filtering, form validation and a built-in file list. */
export type DropZoneProps = {
  /** The selected files. Bind with `v-model`. */
  modelValue?: File[]
  /**
   * The initial files when uncontrolled.
   * @defaultValue []
   */
  defaultValue?: File[]
  /** Accepted file types: MIME types and extensions, comma separated (`image/*,.pdf`). Other files are rejected. */
  accept?: string
  /**
   * Whether several files can be added. New files are appended; otherwise the first one replaces the selection.
   * @defaultValue false
   */
  multiple?: boolean
  /** The largest accepted file size, in bytes. Larger files are rejected. */
  maxSize?: number
  /** The main text of the drop area. */
  label?: string
  /** Secondary text below the label, e.g. the accepted formats and size limit. */
  description?: string
  /**
   * The text of the button that opens the file picker.
   * @defaultValue 'Select files'
   */
  triggerLabel?: string
  /** Error message rendered below the area while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * Whether the drop zone is disabled: no drops, no picker.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the drop zone is invalid. Sets `aria-invalid` and `data-invalid`. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether at least one file is required before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the files. Return an error message (or several) when invalid. */
  validate?: ValidateFn<File[]>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the file input, used when submitting an HTML form. */
  name?: string
  /** The id of the area's focusable button; the file input gets `<id>-input`. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. The file keys also style the file lists and items inside the drop zone. */
  ui?: ComponentSlots<DropZone>
} & FormFieldProps

/** Props passed to the `icon`, `label`, `description` and `trigger` slots. */
export type DropZoneSlotProps = {
  /** Whether files are dragged over the area. */
  dropTarget: boolean
  /** Whether the drop zone is disabled. */
  disabled: boolean
}

/** Props passed to the `files` slot. */
export type DropZoneFilesSlotProps = {
  /** The selected files. */
  files: File[]
  /** Removes a file from the selection, by index or by reference. */
  removeFile: (file: File | number) => void
}

/** Slots of `DropZone`. */
export type DropZoneSlots = {
  /** The area icon. Replaces the default upload icon. */
  icon?: (props: DropZoneSlotProps) => VNode[]
  /** The label content. Replaces the `label` prop. */
  label?: (props: DropZoneSlotProps) => VNode[]
  /** The description content. Replaces the `description` prop. */
  description?: (props: DropZoneSlotProps) => VNode[]
  /** Replaces the picker button. Call `open` from your own button or link. */
  trigger?: (props: DropZoneSlotProps & { open: () => void }) => VNode[]
  /** Rendered below the area. Replaces the built-in file list, e.g. to show upload progress. */
  files?: (props: DropZoneFilesSlotProps) => VNode[]
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
}

/** Events emitted by `DropZone`. */
export type DropZoneEmits = {
  /** Emitted with the new selection when files are added or removed. */
  'update:modelValue': [files: File[]]
  /** Emitted with the files just accepted from a drop, a paste or the picker. */
  add: [files: File[]]
  /** Emitted with the files that didn't match `accept` or exceeded `maxSize`. */
  reject: [rejections: DropZoneRejection[]]
}
