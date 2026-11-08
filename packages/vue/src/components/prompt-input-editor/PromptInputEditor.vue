<template>
  <PromptInput
    ref="input"
    v-bind="promptInputProps"
    v-model="model"
    v-model:files="files"
    v-model:queue="queue"
    @submit="onSubmit"
    @stop="emit('stop')"
    @send="emit('send', $event)"
  >
    <template v-if="slots.queue" #queue="slotProps">
      <slot name="queue" v-bind="slotProps" />
    </template>
    <template v-if="slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="slots.files" #files="slotProps">
      <slot name="files" v-bind="slotProps" />
    </template>
    <template v-if="slots.leading" #leading="slotProps">
      <slot name="leading" v-bind="slotProps" />
    </template>
    <template v-if="slots.trailing" #trailing>
      <slot name="trailing" />
    </template>
    <template v-if="slots.submit" #submit="slotProps">
      <slot name="submit" v-bind="slotProps" />
    </template>
    <template v-if="slots.footer" #footer>
      <slot name="footer" />
    </template>
    <template #body="{ placeholder, disabled, inputAttrs }">
      <Editor
        v-bind="inputAttrs"
        :model-value="initialContent"
        :starter-kit="false"
        :image="false"
        :placeholder="placeholder"
        :disabled="disabled"
        :extensions="extensions"
        :ui="editorUi"
      >
        <template #default="{ editor: instance }">
          <EditorMentionMenu
            v-for="trigger in triggers"
            :key="trigger.char"
            :editor="instance"
            :char="trigger.char"
            :items="trigger.items"
            :filter-fields="trigger.filterFields"
            :limit="trigger.limit"
            :ignore-filter="trigger.ignoreFilter"
            :loading="trigger.loading"
            :ui="menuUi"
            @update:search-term="trigger.onSearch?.($event)"
          >
            <template v-if="slots.item" #item="itemProps">
              <slot name="item" v-bind="itemProps" :char="trigger.char" />
            </template>
          </EditorMentionMenu>
        </template>
      </Editor>
    </template>
  </PromptInput>
</template>

<script setup lang="ts">
import type { Editor as TiptapEditor } from '@tiptap/core'
import { Extension } from '@tiptap/vue-3'
import { computed, shallowRef, useTemplateRef, watch } from 'vue'

import { Editor } from '@/components/editor'
import { EditorMentionMenu } from '@/components/editor-mention-menu'
import { PromptInput } from '@/components/prompt-input'
import type { PromptInputExposed, PromptInputQueueItem } from '@/components/prompt-input'
import { useComponentUI } from '@/composables/useComponentUI'

import type {
  PromptInputEditorEmits,
  PromptInputEditorExposed,
  PromptInputEditorProps,
  PromptInputEditorSlots,
} from './PromptInputEditor.types'
import theme from './theme'
import { getTokens, toDoc } from './tokens'

const props = withDefaults(defineProps<PromptInputEditorProps>(), {
  placeholder: undefined,
  status: 'ready',
  submitOnEnter: true,
  accept: undefined,
  multiple: true,
  maxHeight: 240,
  layout: undefined,
  variant: undefined,
  size: undefined,
  triggers: () => [],
})

const emit = defineEmits<PromptInputEditorEmits>()
const slots = defineSlots<PromptInputEditorSlots>()

const model = defineModel<string>({ default: '' })
const files = defineModel<File[]>('files')
const queue = defineModel<PromptInputQueueItem[]>('queue')

const input = useTemplateRef<PromptInputExposed>('input')
const editor = shallowRef<TiptapEditor>()

const ui = useComponentUI('promptInputEditor', { theme, variantProps: () => ({}), props: {} })

const promptInputProps = computed(() => {
  const { triggers: _triggers, ...rest } = props

  return rest
})

const editorUi = computed(() => ({
  root: ui.value.root(),
  content: ui.value.content(),
  base: ui.value.base(),
}))

const menuUi = computed(() => ({ trigger: ui.value.trigger() }))

// Lines become paragraphs and `@label` becomes a token when `label` is an entry of the `@` trigger, so text set
// through the model (a draft, an edited queued prompt, a failed prompt put back) keeps its tokens.
const toTokenDoc = (text: string) => toDoc(text, props.triggers)

// Read when the editor is created, so the text shows on first render. Later changes go through the `model` watch.
const initialContent = toTokenDoc(model.value)

// Tokens read as their character and label (`@Sarah`), paragraphs and hard breaks as new lines
const getText = (instance: TiptapEditor) => instance.getText({ blockSeparator: '\n' })

const PromptInputKeymap = Extension.create({
  name: 'promptInputKeymap',
  onCreate() {
    editor.value = this.editor

    // Catches up with a model changed between setup and `create`, which tiptap fires on a timer after mount
    if (getText(this.editor) !== model.value)
      this.editor.commands.setContent(toTokenDoc(model.value), { emitUpdate: false })
  },
  onDestroy() {
    editor.value = undefined
  },
  onUpdate() {
    model.value = getText(this.editor)
  },
  // An open token menu handles Enter first, so these only run while no menu is open
  addKeyboardShortcuts() {
    const submit = () => {
      // Enter that confirms an IME composition must not send
      if (this.editor.view.composing) return false

      input.value?.submit()

      return true
    }

    return {
      Enter: () => props.submitOnEnter && submit(),
      'Mod-Enter': () => !props.submitOnEnter && submit(),
    }
  },
})

const extensions = [PromptInputKeymap]

watch(model, (text) => {
  const instance = editor.value

  if (!instance || getText(instance) === text) return

  instance.commands.setContent(toTokenDoc(text), { emitUpdate: false })
})

const onSubmit = (text: string, sentFiles: File[]) => {
  const doc = editor.value?.getJSON() ?? toTokenDoc(text)

  emit('submit', text, sentFiles, getTokens(doc))
}

defineExpose<PromptInputEditorExposed>({
  focus: () => input.value?.focus(),
  open: () => input.value?.open(),
  submit: () => input.value?.submit(),
})
</script>
