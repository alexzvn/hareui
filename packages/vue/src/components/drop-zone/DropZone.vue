<template>
  <div
    ref="root"
    data-slot="drop-zone"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <div
      data-slot="drop-zone-area"
      :data-drop-target="dropTarget ? 'true' : undefined"
      :data-focus-visible="focusVisible ? 'true' : undefined"
      :data-disabled="isDisabled ? 'true' : undefined"
      :class="ui.area({ class: props.ui?.area })"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <button
        :id="id"
        type="button"
        ref="focusTarget"
        data-slot="drop-zone-focus-target"
        :disabled="isDisabled || undefined"
        :aria-label="hasLabel ? undefined : 'Drop zone'"
        :aria-labelledby="hasLabel ? labelId : undefined"
        :aria-describedby="describedBy"
        :aria-invalid="invalid ? 'true' : undefined"
        :class="ui.focusTarget({ class: props.ui?.focusTarget })"
        @click="open"
        @paste="onPaste"
        @focus="onFocus"
        @blur="focusVisible = false"
      />
      <span data-slot="drop-zone-icon" :class="ui.icon({ class: props.ui?.icon })">
        <slot name="icon" v-bind="slotProps">
          <svg
            aria-hidden="true"
            fill="none"
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M4.5 5.25a3.25 3.25 0 0 1 6.398-.811.75.75 0 0 0 .702.563A3 3 0 0 1 11.5 11h-.75a.75.75 0 0 0 0 1.5h.75a4.5 4.5 0 0 0 .687-8.948 4.751 4.751 0 0 0-9.184 1.522A3.751 3.751 0 0 0 3.75 12.5h1.5a.75.75 0 0 0 0-1.5H3.751a2.25 2.25 0 0 1-.003-4.5h.03a.75.75 0 0 0 .747-.843A3 3 0 0 1 4.5 5.25m4.25 3.31.72.72a.75.75 0 1 0 1.06-1.06l-2-2a.75.75 0 0 0-1.06 0l-2 2a.75.75 0 0 0 1.06 1.06l.72-.72v6.69a.75.75 0 0 0 1.5 0z"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>
        </slot>
      </span>
      <span
        v-if="hasLabel"
        :id="labelId"
        data-slot="drop-zone-label"
        :class="ui.label({ class: props.ui?.label })"
      >
        <slot name="label" v-bind="slotProps">{{ label }}</slot>
      </span>
      <span
        v-if="hasDescription"
        :id="descriptionId"
        data-slot="drop-zone-description"
        :class="ui.description({ class: props.ui?.description })"
      >
        <slot name="description" v-bind="slotProps">{{ description }}</slot>
      </span>
      <slot name="trigger" v-bind="slotProps" :open="open">
        <Button
          variant="outline"
          data-slot="drop-zone-trigger"
          :disabled="isDisabled"
          :class="ui.trigger({ class: props.ui?.trigger })"
          @click="open"
        >
          {{ triggerLabel }}
        </Button>
      </slot>
    </div>
    <!-- A mirror for forms and native validation only: the area button is the control, so the input stays out of the accessibility tree. -->
    <input
      :id="`${id}-input`"
      ref="input"
      type="file"
      tabindex="-1"
      aria-hidden="true"
      data-slot="drop-zone-input"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      :required="required"
      :disabled="isDisabled"
      :aria-invalid="invalid ? 'true' : undefined"
      :class="ui.input({ class: props.ui?.input })"
      @change="onInputChange"
      @cancel="syncInput"
      @focus="onInputFocus"
    />
    <FieldError />
    <slot v-if="slots.files" name="files" :files="files" :remove-file="removeFile" />
    <DropZoneFileList v-else>
      <DropZoneFileItem
        v-for="(file, index) in files"
        :key="fileKey(file)"
        :ref="(item) => setItemElement(file, item)"
        :file="file"
        @remove="onItemRemove(file, index)"
      />
    </DropZoneFileList>
  </div>
</template>

<script lang="ts">
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots } from '@/types/tv'

import theme from './theme'

type DropZone = typeof theme

/** A file the DropZone turned away, and why: it doesn't match `accept` (`type`) or exceeds `maxSize` (`size`). */
export type DropZoneRejection = {
  file: File
  reason: 'type' | 'size'
}

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
  class?: any
  /** Per-slot class overrides. The file keys also style the file lists and items inside the drop zone. */
  ui?: ComponentSlots<DropZone>
} & FormFieldProps

export type DropZoneSlotProps = {
  /** Whether files are dragged over the area. */
  dropTarget: boolean
  /** Whether the drop zone is disabled. */
  disabled: boolean
}

export type DropZoneFilesSlotProps = {
  /** The selected files. */
  files: File[]
  /** Removes a file from the selection, by index or by reference. */
  removeFile: (file: File | number) => void
}

export type DropZoneSlots = {
  /** The area icon. Replaces the default upload icon. */
  icon?: (props: DropZoneSlotProps) => any
  /** The label content. Replaces the `label` prop. */
  label?: (props: DropZoneSlotProps) => any
  /** The description content. Replaces the `description` prop. */
  description?: (props: DropZoneSlotProps) => any
  /** Replaces the picker button. Call `open` from your own button or link. */
  trigger?: (props: DropZoneSlotProps & { open: () => void }) => any
  /** Rendered below the area. Replaces the built-in file list, e.g. to show upload progress. */
  files?: (props: DropZoneFilesSlotProps) => any
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
}

export type DropZoneEmits = {
  /** Emitted with the new selection when files are added or removed. */
  'update:modelValue': [files: File[]]
  /** Emitted with the files just accepted from a drop, a paste or the picker. */
  add: [files: File[]]
  /** Emitted with the files that didn't match `accept` or exceeded `maxSize`. */
  reject: [rejections: DropZoneRejection[]]
}
</script>

<script setup lang="ts">
import { computed, onMounted, provide, ref, toRef, useTemplateRef, watch } from 'vue'

import Button from '@/components/button/Button.vue'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'

import { dropZoneContextKey } from './context'
import DropZoneFileItem from './DropZoneFileItem.vue'
import DropZoneFileList from './DropZoneFileList.vue'
import { dragMatchesAccept, matchesAccept } from './utils'

// `undefined` defaults keep uncontrolled mode and leave validation in charge of an unset `invalid`
const props = withDefaults(defineProps<DropZoneProps>(), {
  modelValue: undefined,
  invalid: undefined,
  triggerLabel: 'Select files',
})
const emit = defineEmits<DropZoneEmits>()
const slots = defineSlots<DropZoneSlots>()

const ui = useComponentUI('dropZone', theme, () => ({}))
provide(dropZoneContextKey, { ui: toRef(() => props.ui) })

const local = ref<File[]>(props.defaultValue ?? [])
const files = computed(() => props.modelValue ?? local.value)

const root = useTemplateRef<HTMLElement>('root')
const input = useTemplateRef<HTMLInputElement>('input')
const focusTarget = useTemplateRef<HTMLButtonElement>('focusTarget')
const isDisabled = useFieldsetDisabled(() => props.disabled)

const { validation, commitValidation } = useFieldValidation({
  formField: props,
  value: () => files.value,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  onReset: () => setFiles(props.defaultValue ?? []),
})
const invalid = computed(() => validation.value.isInvalid)

const { id, labelId, descriptionId, hasLabel, hasDescription, describedBy, FieldError } =
  useFieldChrome({
    props,
    slots,
    invalid,
    validation,
    disabled: isDisabled,
  })

// Mirrors the selection into the file input, so native form submission and `required` see it
function syncInput() {
  const el = input.value
  if (!el) return
  try {
    const transfer = new DataTransfer()
    for (const file of files.value) transfer.items.add(file)
    el.files = transfer.files
  } catch {
    // No DataTransfer constructor: clear the input so picking the same file again still fires `change`
    el.value = ''
  }
}
watch(files, syncInput, { flush: 'post' })
onMounted(syncInput)

function setFiles(next: File[]) {
  local.value = next
  emit('update:modelValue', next)
}

function addFiles(incoming: File[]) {
  const accepted: File[] = []
  const rejected: DropZoneRejection[] = []
  for (const file of incoming) {
    if (!matchesAccept(file, props.accept)) rejected.push({ file, reason: 'type' })
    else if (props.maxSize != null && file.size > props.maxSize)
      rejected.push({ file, reason: 'size' })
    else accepted.push(file)
  }
  // `add` comes first, so a handler that clears an old rejection message runs before `reject` sets a new one
  if (accepted.length) {
    const added = props.multiple ? accepted : accepted.slice(0, 1)
    setFiles(props.multiple ? [...files.value, ...added] : added)
    emit('add', added)
    commitValidation()
  }
  if (rejected.length) emit('reject', rejected)
  syncInput()
}

function removeFile(file: File | number) {
  const index = typeof file === 'number' ? file : files.value.indexOf(file)
  if (index < 0 || index >= files.value.length) return
  setFiles(files.value.filter((_, i) => i !== index))
  commitValidation()
}

// The built-in items by file, to move focus off an item that is going away
const itemElements = new Map<File, Element>()
function setItemElement(file: File, item: unknown) {
  const el = item && typeof item === 'object' && '$el' in item ? item.$el : undefined
  if (el instanceof Element) itemElements.set(file, el)
  else itemElements.delete(file)
}

// Removing the item that holds focus would drop focus to the page: it moves to the next file's remove button,
// else the previous one's, else the area button
function onItemRemove(file: File, index: number) {
  // Read before removing: a bound `v-model` only updates `files` on the parent's next render
  const neighbour = files.value[index + 1] ?? files.value[index - 1]
  const hadFocus = itemElements.get(file)?.contains(document.activeElement) ?? false
  removeFile(file)
  if (!hadFocus) return
  const next =
    neighbour &&
    itemElements
      .get(neighbour)
      ?.querySelector<HTMLElement>('[data-slot=drop-zone-file-remove-trigger]')
  ;(next ?? focusTarget.value)?.focus()
}

// Clearing first makes the picker fire `change` even when the same file is picked again; a cancelled picker restores it
function open() {
  if (isDisabled.value || !input.value) return
  input.value.value = ''
  input.value.click()
}

// The file input is hidden, so focus sent to it (e.g. by a failed form submission) moves to the area's button
function onInputFocus() {
  focusTarget.value?.focus({ focusVisible: true } as FocusOptions)
  focusVisible.value = true
}

function onInputChange(event: Event) {
  // Validation is committed by `addFiles`; the form doesn't need the raw picker event
  event.stopPropagation()
  addFiles(Array.from(input.value?.files ?? []))
}

// File keys stay stable across selections, so the list animates only the files that come and go
const keys = new WeakMap<File, number>()
let nextKey = 0
function fileKey(file: File) {
  if (!keys.has(file)) keys.set(file, nextKey++)
  return keys.get(file)!
}

// Drag state. `dragenter` / `dragleave` fire for every child, so a counter tells when the drag really leaves.
const dropTarget = ref(false)
let dragDepth = 0
const hasFiles = (event: DragEvent) =>
  !!event.dataTransfer && Array.from(event.dataTransfer.types).includes('Files')

function onDragEnter(event: DragEvent) {
  if (isDisabled.value || !hasFiles(event)) return
  event.preventDefault()
  dragDepth++
  dropTarget.value = dragMatchesAccept(event.dataTransfer?.items, props.accept)
}

// A disabled area still cancels `dragover`, with no drop effect, so a stray drop doesn't make the browser open the file
function onDragOver(event: DragEvent) {
  if (!hasFiles(event)) return
  event.preventDefault()
  const allowed = !isDisabled.value && dragMatchesAccept(event.dataTransfer?.items, props.accept)
  if (event.dataTransfer) event.dataTransfer.dropEffect = allowed ? 'copy' : 'none'
  dropTarget.value = allowed
}

function onDragLeave() {
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) dropTarget.value = false
}

function onDrop(event: DragEvent) {
  dragDepth = 0
  dropTarget.value = false
  if (!hasFiles(event)) return
  event.preventDefault()
  if (!isDisabled.value) addFiles(Array.from(event.dataTransfer?.files ?? []))
}

function onPaste(event: ClipboardEvent) {
  const pasted = Array.from(event.clipboardData?.files ?? [])
  if (isDisabled.value || !pasted.length) return
  event.preventDefault()
  addFiles(pasted)
}

// Mirrors React Aria's `data-focus-visible`: keyboard focus on the area's hidden button rings the whole area
const focusVisible = ref(false)
function onFocus(event: FocusEvent) {
  try {
    focusVisible.value = (event.target as Element).matches(':focus-visible')
  } catch {
    focusVisible.value = true
  }
}

const slotProps = computed<DropZoneSlotProps>(() => ({
  dropTarget: dropTarget.value,
  disabled: isDisabled.value,
}))

defineExpose({
  /** Opens the file picker. */
  open,
  /** Removes a file from the selection, by index or by reference. */
  removeFile,
})
</script>
