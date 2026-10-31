<template>
  <div
    ref="root"
    data-slot="drop-zone"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :class="ui.base()"
  >
    <div
      data-slot="drop-zone-area"
      :data-drop-target="isDropTarget ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-disabled="isDisabled ? 'true' : undefined"
      :class="ui.area()"
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
        :aria-label="hasLabel ? undefined : t('dropZone.label')"
        :aria-labelledby="hasLabel ? labelId : undefined"
        :aria-describedby="describedBy"
        :aria-invalid="invalid ? 'true' : undefined"
        :class="ui.focusTarget()"
        @click="open"
        @paste="onPaste"
        @focus="onFocus"
        @blur="isFocusVisible = false"
      />
      <span data-slot="drop-zone-icon" :class="ui.icon()">
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
      <span v-if="hasLabel" :id="labelId" data-slot="drop-zone-label" :class="ui.label()">
        <slot name="label" v-bind="slotProps">{{ label }}</slot>
      </span>
      <span
        v-if="hasDescription"
        :id="descriptionId"
        data-slot="drop-zone-description"
        :class="ui.description()"
      >
        <slot name="description" v-bind="slotProps">{{ description }}</slot>
      </span>
      <slot name="trigger" v-bind="slotProps" :open="open">
        <Button
          variant="outline"
          data-slot="drop-zone-trigger"
          :disabled="isDisabled"
          :class="ui.trigger()"
          @click="open"
        >
          {{ triggerLabel ?? t('dropZone.trigger') }}
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
      :class="ui.input()"
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

<script setup lang="ts">
import { computed, onMounted, provide, ref, toRef, useTemplateRef, watch } from 'vue'

import Button from '@/components/button/Button.vue'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { useLocale } from '@/composables/useLocale'

import { dropZoneContextKey } from './context'
import type {
  DropZoneRejection,
  DropZoneProps,
  DropZoneSlotProps,
  DropZoneSlots,
  DropZoneEmits,
} from './DropZone.types'
import DropZoneFileItem from './DropZoneFileItem.vue'
import DropZoneFileList from './DropZoneFileList.vue'
import theme from './theme'
import { dragMatchesAccept, matchesAccept } from './utils'

// `undefined` defaults keep uncontrolled mode and leave validation in charge of an unset `invalid`
const { t } = useLocale()

const props = withDefaults(defineProps<DropZoneProps>(), {
  modelValue: undefined,
  invalid: undefined,
  triggerLabel: undefined,
})

const emit = defineEmits<DropZoneEmits>()
const slots = defineSlots<DropZoneSlots>()

const ui = useComponentUI('dropZone', { theme, variantProps: () => ({}), props })
provide(dropZoneContextKey, { ui: toRef(() => props.ui) })

const local = ref<File[]>(props.defaultValue ?? [])
const files = computed(() => props.modelValue ?? local.value)

const root = useTemplateRef<HTMLElement>('root')
const input = useTemplateRef<HTMLInputElement>('input')
const focusTarget = useTemplateRef<HTMLButtonElement>('focusTarget')
const isDisabled = useFieldsetDisabled(() => props.disabled)

const { validation, invalid, commitValidation } = useFieldValidation({
  formField: props,
  value: () => files.value,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  onReset: () => setFiles(props.defaultValue ?? []),
})

const { id, labelId, descriptionId, hasLabel, hasDescription, describedBy, FieldError } =
  useFieldChrome({
    props,
    slots,
    invalid,
    validation,
    disabled: isDisabled,
  })

// Mirrors the selection into the file input, so native form submission and `required` see it
const syncInput = () => {
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

const setFiles = (next: File[]) => {
  local.value = next
  emit('update:modelValue', next)
}

const resolveRejection = (file: File): DropZoneRejection['reason'] | undefined => {
  if (!matchesAccept(file, props.accept)) return 'type'
  if (props.maxSize != null && file.size > props.maxSize) return 'size'

  return undefined
}

const addFiles = (incoming: File[]) => {
  const accepted: File[] = []
  const rejected: DropZoneRejection[] = []
  for (const file of incoming) {
    const reason = resolveRejection(file)
    if (reason) {
      rejected.push({ file, reason })
      continue
    }

    accepted.push(file)
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

const removeFile = (file: File | number) => {
  const index = typeof file === 'number' ? file : files.value.indexOf(file)
  if (index < 0 || index >= files.value.length) return
  setFiles(files.value.filter((_, i) => i !== index))
  commitValidation()
}

// The built-in items by file, to move focus off an item that is going away
const itemElements = new Map<File, Element>()
const setItemElement = (file: File, item: unknown) => {
  const el = item && typeof item === 'object' && '$el' in item ? item.$el : undefined
  if (el instanceof Element) {
    itemElements.set(file, el)
    return
  }

  itemElements.delete(file)
}

// Removing the item that holds focus would drop focus to the page: it moves to the next file's remove button,
// else the previous one's, else the area button
const onItemRemove = (file: File, index: number) => {
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
const open = () => {
  if (isDisabled.value || !input.value) return
  input.value.value = ''
  input.value.click()
}

// The file input is hidden, so focus sent to it (e.g. by a failed form submission) moves to the area's button
const onInputFocus = () => {
  focusTarget.value?.focus({ focusVisible: true } as FocusOptions)
  isFocusVisible.value = true
}

const onInputChange = (event: Event) => {
  // Validation is committed by `addFiles`; the form doesn't need the raw picker event
  event.stopPropagation()
  addFiles(Array.from(input.value?.files ?? []))
}

// File keys stay stable across selections, so the list animates only the files that come and go
const keys = new WeakMap<File, number>()
let nextKey = 0
const fileKey = (file: File) => {
  if (!keys.has(file)) keys.set(file, nextKey++)
  return keys.get(file)!
}

// Drag state. `dragenter` / `dragleave` fire for every child, so a counter tells when the drag really leaves.
const isDropTarget = ref(false)
let dragDepth = 0

const hasFiles = (event: DragEvent) =>
  !!event.dataTransfer && Array.from(event.dataTransfer.types).includes('Files')

const onDragEnter = (event: DragEvent) => {
  if (isDisabled.value || !hasFiles(event)) return
  event.preventDefault()
  dragDepth++
  isDropTarget.value = dragMatchesAccept(event.dataTransfer?.items, props.accept)
}

// A disabled area still cancels `dragover`, with no drop effect, so a stray drop doesn't make the browser open the file
const onDragOver = (event: DragEvent) => {
  if (!hasFiles(event)) return
  event.preventDefault()
  const allowed = !isDisabled.value && dragMatchesAccept(event.dataTransfer?.items, props.accept)
  if (event.dataTransfer) event.dataTransfer.dropEffect = allowed ? 'copy' : 'none'
  isDropTarget.value = allowed
}

const onDragLeave = () => {
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) isDropTarget.value = false
}

const onDrop = (event: DragEvent) => {
  dragDepth = 0
  isDropTarget.value = false
  if (!hasFiles(event)) return
  event.preventDefault()
  if (!isDisabled.value) addFiles(Array.from(event.dataTransfer?.files ?? []))
}

const onPaste = (event: ClipboardEvent) => {
  const pasted = Array.from(event.clipboardData?.files ?? [])
  if (isDisabled.value || !pasted.length) return
  event.preventDefault()
  addFiles(pasted)
}

// Mirrors React Aria's `data-focus-visible`: keyboard focus on the area's hidden button rings the whole area
const isFocusVisible = ref(false)
const onFocus = (event: FocusEvent) => {
  try {
    isFocusVisible.value = (event.target as Element).matches(':focus-visible')
  } catch {
    isFocusVisible.value = true
  }
}

const slotProps = computed<DropZoneSlotProps>(() => ({
  dropTarget: isDropTarget.value,
  disabled: isDisabled.value,
}))

defineExpose({
  /** Opens the file picker. */
  open,
  /** Removes a file from the selection, by index or by reference. */
  removeFile,
})
</script>
