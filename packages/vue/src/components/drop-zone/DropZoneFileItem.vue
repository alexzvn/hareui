<template>
  <div data-slot="drop-zone-file-item" :data-status="status" :class="cls('fileItem', props.class)">
    <slot name="icon" v-bind="slotProps">
      <svg
        aria-hidden="true"
        data-slot="drop-zone-file-format-icon"
        fill="none"
        height="40"
        viewBox="0 0 32 40"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
        :class="cls('fileFormatIcon')"
      >
        <!-- A sheet with a cut corner; the corner flap is a solid triangle -->
        <path
          d="M7.75 0.75H21.25L31.25 10.75V34.25A5 5 0 0 1 26.25 39.25H7.75A5 5 0 0 1 2.75 34.25V5.75A5 5 0 0 1 7.75 0.75Z"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          stroke-linejoin="round"
          stroke-width="1.5"
        />
        <path
          d="M21.25 0.75V10.75H31.25Z"
          fill="var(--color-border)"
          stroke="var(--color-border)"
          stroke-linejoin="round"
          stroke-width="1.5"
        />
        <foreignObject v-if="format" height="40" width="32" x="0" y="0">
          <div
            data-slot="drop-zone-file-format-icon-badge"
            :data-color="color"
            :class="cls('fileFormatIconBadge')"
          >
            {{ format }}
          </div>
        </foreignObject>
      </svg>
    </slot>
    <div data-slot="drop-zone-file-info" :class="cls('fileInfo')">
      <span data-slot="drop-zone-file-name" :class="cls('fileName')">
        <slot name="name" v-bind="slotProps">{{ name }}</slot>
      </span>
      <span data-slot="drop-zone-file-meta" :class="cls('fileMeta')">
        <slot name="meta" v-bind="slotProps">{{ size }}</slot>
      </span>
      <ProgressBar
        v-if="progress != null"
        :value="progress"
        size="sm"
        :color="progressColor"
        :aria-label="`Upload progress for ${name}`"
        data-slot="drop-zone-file-progress"
        :class="cls('fileProgress')"
      />
      <button
        v-if="retryable && status === 'failed'"
        type="button"
        data-slot="drop-zone-file-retry-trigger"
        :class="cls('fileRetryTrigger')"
        @click="emit('retry')"
      >
        <slot name="retry" v-bind="slotProps">Retry</slot>
      </button>
      <slot v-bind="slotProps" />
    </div>
    <button
      v-if="removable"
      type="button"
      data-slot="drop-zone-file-remove-trigger"
      :aria-label="`Remove ${name}`"
      :class="cls('fileRemoveTrigger')"
      @click="emit('remove')"
    >
      <slot name="remove" v-bind="slotProps">
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
            d="M9 2H7a.5.5 0 0 0-.5.5V3h3v-.5A.5.5 0 0 0 9 2m2 1v-.5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2V3H2.251a.75.75 0 0 0 0 1.5h.312l.317 7.625A3 3 0 0 0 5.878 15h4.245a3 3 0 0 0 2.997-2.875l.318-7.625h.312a.75.75 0 0 0 0-1.5zm.936 1.5H4.064l.315 7.562A1.5 1.5 0 0 0 5.878 13.5h4.245a1.5 1.5 0 0 0 1.498-1.438zm-6.186 2v5a.75.75 0 0 0 1.5 0v-5a.75.75 0 0 0-1.5 0m3.75-.75a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75"
            fill="currentColor"
            fill-rule="evenodd"
          />
        </svg>
      </slot>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

import ProgressBar from '@/components/progress-bar/ProgressBar.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import type { ClassValue } from '@/utils/tv'

import { dropZoneContextKey } from './context'
import type {
  DropZoneFileItemProps,
  DropZoneFileItemSlotProps,
  DropZoneFileItemSlots,
  FileItemSlots,
} from './DropZoneFileItem.types'
import theme from './theme'
import { fileExtension, formatColor, formatFileSize } from './utils'

const props = withDefaults(defineProps<DropZoneFileItemProps>(), { removable: true })

const emit = defineEmits<{
  /** Emitted when the remove button is pressed. */
  remove: []
  /** Emitted when the retry button is pressed. */
  retry: []
}>()

defineSlots<DropZoneFileItemSlots>()

const context = inject(dropZoneContextKey, null)
const ui = useComponentUI('dropZone', theme, () => ({}))

// The surrounding DropZone's `ui` applies first, then this item's own overrides
const cls = (key: keyof FileItemSlots, extra?: ClassValue) =>
  ui.value[key]({ class: [context?.ui.value?.[key], props.ui?.[key], extra] })

const name = computed(() => props.name ?? props.file?.name ?? '')
const extension = computed(() => fileExtension(name.value))
const format = computed(() => props.format ?? extension.value.toUpperCase())
const color = computed(() => props.color ?? formatColor(extension.value))

const size = computed(() => {
  const bytes = props.size ?? props.file?.size
  return bytes == null ? '' : formatFileSize(bytes)
})

const progressColor = computed(() => {
  if (props.status === 'complete') return 'success'
  if (props.status === 'failed') return 'danger'

  return 'accent'
})

const slotProps = computed<DropZoneFileItemSlotProps>(() => ({
  name: name.value,
  size: size.value,
  status: props.status,
  progress: props.progress,
}))
</script>
