<template>
  <div
    v-bind="rootAttrs"
    :class="ui.base()"
    :style="{ '--prompt-input-max-height': maxHeightValue }"
    data-slot="prompt-input"
    :data-layout="layout"
    :data-variant="variant"
    :data-status="status"
    :data-disabled="disabled || undefined"
    :data-expanded="isExpanded || undefined"
  >
    <div v-if="queue?.length" :class="ui.queue()" data-slot="prompt-input-queue">
      <slot name="queue" :queue :send="sendQueued" :edit="editQueued" :remove="removeQueued">
        <ul :class="ui.queueList()" :aria-label="t('promptInput.queue')">
          <li
            v-for="(item, index) in queue"
            :key="item.id ?? index"
            :class="ui.queueItem()"
            data-slot="prompt-input-queue-item"
          >
            <FileTextIcon :class="ui.queueItemIcon()" data-slot="prompt-input-queue-item-icon" />
            <div :class="ui.queueItemBody()">
              <p :class="ui.queueItemContent()">{{ item.text }}</p>
              <p v-if="item.files?.length" :class="ui.queueItemFiles()">
                <PaperclipIcon class="size-3 shrink-0" />
                <span class="truncate">{{ item.files.map((file) => file.name).join(', ') }}</span>
              </p>
            </div>
            <div :class="ui.queueItemActions()">
              <Button
                variant="ghost"
                size="sm"
                icon-only
                :disabled
                :aria-label="t('promptInput.sendNow')"
                data-slot="prompt-input-queue-send"
                @click="sendQueued(index)"
              >
                <ArrowUpIcon class="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon-only
                :disabled
                :aria-label="t('promptInput.edit')"
                data-slot="prompt-input-queue-edit"
                @click="editQueued(index)"
              >
                <PencilIcon class="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon-only
                :disabled
                :aria-label="t('promptInput.remove')"
                data-slot="prompt-input-queue-remove"
                @click="removeQueued(index)"
              >
                <TrashBinIcon class="size-3.5" />
              </Button>
            </div>
          </li>
        </ul>
      </slot>
    </div>

    <div
      :class="ui.shell()"
      data-slot="prompt-input-shell"
      :data-dragging="isDragging || undefined"
      v-bind="dropzone"
      @paste="onPaste"
      @click="onShellClick"
    >
      <div :class="ui.content()" data-slot="prompt-input-content">
        <div v-if="slots.header" :class="ui.header()" data-slot="prompt-input-header">
          <slot name="header" />
        </div>

        <div v-if="hasFiles" :class="ui.attachments()" data-slot="prompt-input-attachments">
          <slot name="files" :files="files ?? []" :remove="removeFile">
            <ChatAttachmentGroup :files :removable="!disabled" @remove="removeFile" />
          </slot>
        </div>

        <div v-if="slots.body" ref="field" :class="ui.textarea()" data-slot="prompt-input-body">
          <slot
            name="body"
            :submit
            :placeholder="placeholderText"
            :disabled
            :input-attrs="fieldAttrs"
          />
        </div>
        <textarea
          v-else
          ref="field"
          v-model="model"
          v-bind="fieldAttrs"
          :class="ui.textarea()"
          data-slot="prompt-input-textarea"
          rows="1"
          :placeholder="placeholderText"
          :disabled
          @keydown="onKeydown"
        />
      </div>

      <div :class="ui.toolbar()" data-slot="prompt-input-toolbar">
        <div :class="ui.toolbarStart()" data-slot="prompt-input-toolbar-start">
          <slot name="leading" :open>
            <Button
              v-if="files"
              :class="ui.action()"
              variant="tertiary"
              size="sm"
              icon-only
              :disabled
              :aria-label="t('promptInput.attach')"
              data-slot="prompt-input-action"
              @click="open"
            >
              <PaperclipIcon class="size-4" />
            </Button>
          </slot>
        </div>

        <div :class="ui.toolbarEnd()" data-slot="prompt-input-toolbar-end">
          <slot name="trailing" />
          <slot name="submit" :status="sendStatus" :disabled="isSendDisabled" :submit :stop>
            <Button
              :class="ui.send()"
              :variant="sendStatus === 'error' ? 'danger-soft' : 'primary'"
              :size="layout === 'stacked' ? 'md' : 'sm'"
              icon-only
              :disabled="isSendDisabled"
              :aria-label="sendLabel"
              data-slot="prompt-input-send"
              :data-status="sendStatus"
              @click="isStop ? stop() : submit()"
            >
              <Spinner v-if="sendStatus === 'submitted'" color="current" size="sm" />
              <StopFillIcon v-else-if="sendStatus === 'streaming'" class="size-4" />
              <ArrowRotateLeftIcon v-else-if="sendStatus === 'error'" class="size-4" />
              <ArrowUpIcon v-else class="size-4" />
            </Button>
          </slot>
        </div>
      </div>
    </div>

    <div v-if="slots.footer" :class="ui.footer()" data-slot="prompt-input-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useAttrs, useTemplateRef, watch } from 'vue'

import { Button } from '@/components/button'
import { ChatAttachmentGroup, useChatAttachmentInput } from '@/components/chat-attachment'
import { Spinner } from '@/components/spinner'
import { splitInputAttrs } from '@/components/text-field/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'

import {
  ArrowRotateLeftIcon,
  ArrowUpIcon,
  FileTextIcon,
  PaperclipIcon,
  PencilIcon,
  StopFillIcon,
  TrashBinIcon,
} from './icons'
import type {
  PromptInputEmits,
  PromptInputExposed,
  PromptInputProps,
  PromptInputQueueItem,
  PromptInputSlots,
} from './PromptInput.types'
import theme from './theme'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PromptInputProps>(), {
  status: 'ready',
  submitOnEnter: true,
  multiple: true,
  maxHeight: 240,
  layout: 'stacked',
  variant: 'primary',
  size: 'md',
  queueActions: 'hover',
})

const emit = defineEmits<PromptInputEmits>()
const slots = defineSlots<PromptInputSlots>()

const model = defineModel<string>({ default: '' })

// Unbound, `files` and `queue` stay `undefined`: no attach button without `v-model:files`, and no queue without
// `v-model:queue`, where a prompt sent while a response runs is ignored
const files = defineModel<File[]>('files')
const queue = defineModel<PromptInputQueueItem[]>('queue')

const { t } = useLocale()

// `aria-label`, `maxlength` and the other input attributes go to the textarea, or the input of the `body` slot, and the
// rest to the root. Nothing else describes the input, so `aria-describedby` goes along.
const attrs = useAttrs()
const splitAttrs = computed(() => splitInputAttrs(attrs))
const rootAttrs = computed(() => splitAttrs.value.root)

const fieldAttrs = computed<Record<string, unknown>>(() => ({
  'aria-label': t('promptInput.label'),
  ...splitAttrs.value.input,
  'aria-describedby': attrs['aria-describedby'],
}))

const field = useTemplateRef<HTMLElement>('field')
const isExpanded = ref(false)

const hasFiles = computed(() => !!files.value?.length)
const hasPrompt = computed(() => !!model.value.trim() || hasFiles.value)
const isRunning = computed(() => props.status === 'submitted' || props.status === 'streaming')

// While a response runs, a prompt goes to the queue when one is bound; otherwise the button stops the response
const canQueue = computed(() => isRunning.value && !!queue.value && hasPrompt.value)
const isStop = computed(() => isRunning.value && !canQueue.value)
const sendStatus = computed(() => (canQueue.value ? 'ready' : props.status))
const isSendDisabled = computed(() => props.disabled || (!isRunning.value && !hasPrompt.value))
const placeholderText = computed(() => props.placeholder ?? t('promptInput.placeholder'))

const maxHeightValue = computed(() =>
  typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight,
)

const sendLabel = computed(() => {
  if (isStop.value) return t('promptInput.stop')
  if (sendStatus.value === 'error') return t('promptInput.retry')

  return t('promptInput.send')
})

const ui = useComponentUI('promptInput', {
  theme,
  variantProps: () => ({
    variant: props.variant,
    size: props.size,
    layout: props.layout,
    expanded: isExpanded.value,
    queueActions: props.queueActions,
    disabled: props.disabled,
  }),
  props,
})

const { open, isDragging, dropzone, onPaste } = useChatAttachmentInput({
  accept: () => props.accept,
  multiple: () => props.multiple,
  disabled: () => props.disabled || !files.value,
  onSelect: (selected) => {
    files.value = props.multiple ? [...(files.value ?? []), ...selected] : selected
  },
})

// The textarea, or the editable element of the `body` slot
const focus = () => {
  const el = field.value
  const target = el?.querySelector<HTMLElement>('[contenteditable="true"]') ?? el
  target?.focus()
}

const submit = () => {
  if (props.disabled || !hasPrompt.value) return

  if (!isRunning.value) {
    emit('submit', model.value, files.value ?? [])
    return
  }

  if (!queue.value) return

  const item: PromptInputQueueItem = { text: model.value }
  if (files.value?.length) item.files = files.value
  queue.value = [...queue.value, item]
  model.value = ''
  if (files.value) files.value = []
}

const stop = () => emit('stop')

const removeFile = (index: number) => {
  if (files.value) files.value = files.value.filter((_, i) => i !== index)
}

const removeQueued = (index: number) => {
  if (queue.value) queue.value = queue.value.filter((_, i) => i !== index)
}

const sendQueued = (index: number) => {
  const current = queue.value ?? []
  const item = current[index]
  if (!item) return

  queue.value = [item, ...current.filter((_, i) => i !== index)]
  emit('send', item)
  focus()
}

// The queued prompt goes back into the input, ahead of the draft. Its files follow when `v-model:files` is bound
// and `multiple` leaves room for them.
const editQueued = (index: number) => {
  const item = queue.value?.[index]
  if (!item) return

  model.value = [item.text, model.value].filter(Boolean).join('\n')

  const queuedFiles = item.files ?? []
  if (queuedFiles.length && files.value && (props.multiple || !files.value.length)) {
    files.value = [...queuedFiles, ...files.value]
  }

  removeQueued(index)
  focus()
}

// Safari fires the Enter that commits an IME composition after `compositionend`, with `isComposing` already false
// and `keyCode` 229
const isComposing = (event: KeyboardEvent) => event.isComposing || event.keyCode === 229

const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Enter' || isComposing(event)) return
  if (props.submitOnEnter ? event.shiftKey : !(event.ctrlKey || event.metaKey)) return

  event.preventDefault()
  submit()
}

// Controls and the toolbar keep their own clicks
const OWN_CLICK = 'a, button, input, textarea, [contenteditable], [data-slot=prompt-input-toolbar]'

// A click on the composer's empty space focuses the input, as on a native field
const onShellClick = (event: MouseEvent) => {
  if (props.disabled || (event.target as Element).closest(OWN_CLICK)) return

  focus()
}

// The textarea grows with its content; past `maxHeight`, which the theme applies as `max-height`, it scrolls
const resize = () => {
  const el = field.value
  if (!(el instanceof HTMLTextAreaElement)) return

  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

// Whether the text runs past one line: its height, padding aside, beyond one and a half lines
const wraps = (el: HTMLElement) => {
  const style = getComputedStyle(el)
  const padding = Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom)

  return el.scrollHeight - padding > Number.parseFloat(style.lineHeight) * 1.5
}

// Single-row layouts expand once the text wraps or files are attached, and collapse only when emptied
const shouldExpand = () => {
  if (props.layout === 'stacked') return false
  if (hasFiles.value) return true
  if (!model.value) return false
  if (isExpanded.value || model.value.includes('\n')) return true

  return !!field.value && wraps(field.value)
}

const sync = () => {
  resize()
  isExpanded.value = shouldExpand()
}

watch(
  [model, hasFiles, isExpanded, () => props.layout, () => props.size, () => props.maxHeight],
  sync,
  { flush: 'post' },
)

onMounted(() => {
  sync()
  if (props.autofocus) focus()
})

defineExpose<PromptInputExposed>({ focus, open, submit })
</script>
