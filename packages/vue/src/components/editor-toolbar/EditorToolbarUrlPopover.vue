<template>
  <Popover
    v-model:open="isOpen"
    arrow
    align="start"
    :portal="portal"
    :ui="{ base: ui.popover, dialog: ui.form }"
  >
    <slot />

    <template #content>
      <Input
        ref="input"
        v-model="url"
        type="url"
        variant="secondary"
        full-width
        :placeholder="field.placeholder"
        :aria-label="field.label"
        data-slot="editor-toolbar-url-input"
        @keydown.enter.prevent="submit"
      />
      <div data-slot="editor-toolbar-url-actions" :class="ui.actions">
        <Button v-if="kind === 'link' && isSet" size="sm" variant="tertiary" @click="apply('')">
          Remove
        </Button>
        <Button size="sm" :disabled="!href" @click="submit">Apply</Button>
      </div>
    </template>
  </Popover>
</template>

<script setup lang="ts">
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import { computed, ref, useTemplateRef, watch } from 'vue'

import Button from '@/components/button/Button.vue'
import Input from '@/components/input/Input.vue'
import Popover from '@/components/popover/Popover.vue'

type UrlKind = 'link' | 'image'

// The mark or node each kind edits, the attribute holding its URL, and the field's labels.
const FIELDS = {
  link: { attribute: 'href', label: 'Link URL', placeholder: 'https://example.com' },
  image: { attribute: 'src', label: 'Image URL', placeholder: 'https://example.com/photo.jpg' },
} as const satisfies Record<UrlKind, { attribute: string; label: string; placeholder: string }>

const props = defineProps<{
  editor: TiptapEditor
  kind: UrlKind
  portal?: HTMLElement
  ui: { popover: string; form: string; actions: string }
}>()

const emit = defineEmits<{
  /** The URL entered; for a link, an empty string removes the link. */
  apply: [url: string]
}>()

const isOpen = ref(false)
const url = ref('')
const isSet = ref(false)

const field = computed(() => FIELDS[props.kind])
const href = computed(() => url.value.trim())

const input = useTemplateRef<{ $el: HTMLInputElement }>('input')

// The field starts with the URL of the link or image at the selection. The popover focuses its dialog as it
// opens, so the field takes focus a frame later, with the URL selected so typing replaces it.
watch(isOpen, (open) => {
  if (!open) return

  isSet.value = props.editor.isActive(props.kind)

  const current: string | undefined = props.editor.getAttributes(props.kind)[field.value.attribute]
  url.value = isSet.value ? (current ?? '') : ''

  requestAnimationFrame(() => {
    input.value?.$el.focus({ preventScroll: true })
    input.value?.$el.select()
  })
})

const apply = (value: string) => {
  isOpen.value = false
  emit('apply', value)
}

const submit = () => {
  if (href.value) apply(href.value)
}
</script>
