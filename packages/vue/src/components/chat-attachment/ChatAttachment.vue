<template>
  <div
    data-slot="chat-attachment"
    :data-variant="resolvedVariant"
    :data-media-type="mediaKind"
    :data-status="status"
    :title="resolvedVariant === 'media' ? fileName : undefined"
    :class="ui.base()"
  >
    <div data-slot="chat-attachment-preview" :class="ui.preview()">
      <slot name="preview" :url="previewUrl" :type="fileType" :variant="resolvedVariant">
        <template v-if="resolvedVariant === 'media' && previewUrl">
          <video
            v-if="mediaKind === 'video'"
            data-slot="chat-attachment-preview-video"
            :src="previewUrl"
            muted
            playsinline
            preload="metadata"
            :class="ui.image()"
          />
          <img
            v-else
            data-slot="chat-attachment-preview-image"
            :src="previewUrl"
            :alt="fileName"
            :class="ui.image()"
          />
        </template>
        <Spinner
          v-else-if="isUploading"
          data-slot="chat-attachment-spinner"
          size="sm"
          color="current"
          :class="ui.spinner()"
        />
        <span v-else data-slot="chat-attachment-icon" :class="ui.icon()">
          <IconRenderer :icon="icon ?? FORMAT_ICONS[fileKind]" />
        </span>
      </slot>
    </div>
    <div data-slot="chat-attachment-info" :class="ui.info()">
      <slot name="info" :name="fileName" :description="fileDescription">
        <span data-slot="chat-attachment-name" :class="ui.name()">
          <TextShimmer v-if="isUploading" :text="fileName" :class="ui.shimmer()" :ui="SHIMMER_UI" />
          <template v-else>{{ fileName }}</template>
        </span>
        <span v-if="fileDescription" data-slot="chat-attachment-size" :class="ui.size()">{{
          fileDescription
        }}</span>
      </slot>
    </div>
    <div
      v-if="status === 'uploading' && resolvedVariant === 'media'"
      data-slot="chat-attachment-overlay"
      :class="ui.overlay()"
    >
      <Spinner size="sm" />
    </div>
    <button
      v-if="removable"
      type="button"
      data-slot="chat-attachment-remove"
      :aria-label="t('chatAttachment.remove', { filename: fileName })"
      :class="ui.remove()"
      @click="emit('remove', $event)"
    >
      <XmarkIcon :class="ui.removeIcon()" />
    </button>
    <span aria-live="polite" :class="ui.live()">{{ statusText }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { computed, shallowRef, watchEffect } from 'vue'

import { fileExtension, formatFileSize } from '@/components/drop-zone/utils'
import Spinner from '@/components/spinner/Spinner.vue'
import TextShimmer from '@/components/text-shimmer/TextShimmer.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'
import { IconRenderer } from '@/utils/icon'

import type {
  ChatAttachmentEmits,
  ChatAttachmentProps,
  ChatAttachmentSlots,
} from './ChatAttachment.types'
import type { FileKind } from './fileKind'
import { resolveFileKind } from './fileKind'
import {
  FileCodeIcon,
  FileDocumentIcon,
  FileIcon,
  FilePdfIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileZipperIcon,
  FilmstripIcon,
  MusicNoteIcon,
  PictureIcon,
  XmarkIcon,
} from './icons'
import theme from './theme'

const props = withDefaults(defineProps<ChatAttachmentProps>(), { status: 'idle' })
const emit = defineEmits<ChatAttachmentEmits>()
defineSlots<ChatAttachmentSlots>()

const FORMAT_ICONS = {
  image: PictureIcon,
  video: FilmstripIcon,
  audio: MusicNoteIcon,
  pdf: FilePdfIcon,
  document: FileDocumentIcon,
  spreadsheet: FileSpreadsheetIcon,
  archive: FileZipperIcon,
  code: FileCodeIcon,
  text: FileTextIcon,
  file: FileIcon,
} satisfies Record<FileKind, Component>

// Both copies of the shimmered name truncate alike, so the highlight lines up with the visible text
const SHIMMER_UI = { text: 'truncate', highlight: 'truncate' }

const { t } = useLocale()

const fileName = computed(() => props.name ?? props.file?.name ?? props.part?.filename ?? '')
const fileType = computed(() => props.type || props.file?.type || props.part?.mediaType || '')
const fileKind = computed(() => resolveFileKind(fileType.value, fileName.value))
const mediaKind = computed(() => fileType.value.split('/')[0] || undefined)
const isPreviewable = computed(() => mediaKind.value === 'image' || mediaKind.value === 'video')

// A `File` has no URL: preview it through an object URL, released when the file changes or the preview unmounts
const objectUrl = shallowRef<string>()

watchEffect((onCleanup) => {
  if (props.url || !props.file || !isPreviewable.value) {
    objectUrl.value = undefined

    return
  }

  const url = URL.createObjectURL(props.file)

  objectUrl.value = url
  onCleanup(() => URL.revokeObjectURL(url))
})

const previewUrl = computed(() => props.url ?? props.part?.url ?? objectUrl.value)

const resolvedVariant = computed(
  () => props.variant ?? (isPreviewable.value && previewUrl.value ? 'media' : 'file'),
)

// A thumbnail dims behind the overlay's spinner instead
const isUploading = computed(() => props.status === 'uploading' && resolvedVariant.value === 'file')

const fileDescription = computed(() => {
  if (props.description !== undefined) return props.description

  const bytes = props.bytes ?? props.file?.size

  if (bytes !== undefined) return formatFileSize(bytes)

  return fileExtension(fileName.value).toUpperCase()
})

const statusText = computed(() =>
  props.status === 'idle' ? '' : t(`chatAttachment.${props.status}`),
)

const ui = useComponentUI('chatAttachment', {
  theme,
  variantProps: () => ({ variant: resolvedVariant.value, status: props.status }),
  props,
})
</script>
