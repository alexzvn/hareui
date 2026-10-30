<template>
  <Primitive
    :as="as"
    data-slot="editor"
    :data-variant="variant"
    :data-disabled="disabled ? 'true' : undefined"
    :class="ui.root()"
  >
    <template v-if="editor">
      <slot :editor="editor" :handlers="handlers" />

      <EditorContent
        role="presentation"
        :editor="editor"
        data-slot="editor-content"
        :class="ui.content()"
      />

      <div v-if="$slots.footer" data-slot="editor-footer" :class="ui.footer()">
        <slot name="footer" :editor="editor" :handlers="handlers" />
      </div>
    </template>
  </Primitive>
</template>

<script setup lang="ts" generic="H extends EditorCustomHandlers = EditorCustomHandlers">
import Code from '@tiptap/extension-code'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import type { PlaceholderOptions } from '@tiptap/extension-placeholder'
import { Markdown } from '@tiptap/markdown'
import type { MarkdownExtensionOptions } from '@tiptap/markdown'
import StarterKit from '@tiptap/starter-kit'
import type { StarterKitOptions } from '@tiptap/starter-kit'
import { EditorContent, mergeAttributes, useEditor } from '@tiptap/vue-3'
import type { Content, Editor as TiptapEditor, EditorOptions } from '@tiptap/vue-3'
import { defu } from 'defu'
import { Primitive } from 'reka-ui'
import { computed, provide, useAttrs, watch } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import { editorHandlersKey } from './context'
import type {
  EditorContentType,
  EditorCustomHandlers,
  EditorEmits,
  EditorHandlers,
  EditorProps,
  EditorSlots,
} from './Editor.types'
import { createEditorHandlers } from './handlers'
import theme from './theme'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<EditorProps<H>>(), {
  as: 'div',
  modelValue: undefined,
  starterKit: true,
  image: true,
  editable: true,
  autofocus: false,
})

const emit = defineEmits<EditorEmits>()
defineSlots<EditorSlots<H>>()

const attrs = useAttrs()

// Plain-text mode: document, paragraph, text, hard break and history stay; every rich-text part is off.
const PLAIN_TEXT: Partial<StarterKitOptions> = {
  blockquote: false,
  bold: false,
  bulletList: false,
  code: false,
  codeBlock: false,
  dropcursor: false,
  gapcursor: false,
  heading: false,
  horizontalRule: false,
  italic: false,
  listItem: false,
  listKeymap: false,
  link: false,
  orderedList: false,
  strike: false,
  underline: false,
  trailingNode: false,
}

// `code` and `horizontalRule` are replaced by the extended versions below.
const STARTER_KIT_DEFAULTS: Partial<StarterKitOptions> = {
  code: false,
  horizontalRule: false,
  dropcursor: { color: 'var(--accent)', width: 2 },
  link: { openOnClick: false },
}

const PLACEHOLDER_DEFAULTS: Partial<PlaceholderOptions> = {
  showOnlyWhenEditable: false,
  showOnlyCurrent: true,
}

const MARKDOWN_DEFAULTS: Partial<MarkdownExtensionOptions> = { markedOptions: { gfm: true } }

const isEditable = computed(() => props.editable && !props.disabled)

const placeholderOptions = computed(() =>
  typeof props.placeholder === 'string' ? { placeholder: props.placeholder } : props.placeholder,
)

type PlaceholderResolver = Exclude<PlaceholderOptions['placeholder'], string>

// The extension calls this whenever it renders, so a new `placeholder` text shows without recreating the editor.
const resolvePlaceholderText: PlaceholderResolver = (context) => {
  const text = placeholderOptions.value?.placeholder ?? ''

  return typeof text === 'function' ? text(context) : text
}

const ui = useComponentUI('editor', {
  theme,
  variantProps: () => ({
    variant: props.variant,
    placeholderMode: placeholderOptions.value?.mode,
    disabled: props.disabled,
  }),
  props,
  classSlot: 'root',
})

// Fallthrough attributes (`aria-label`, `id`, ...) go on the editable element; listeners stay off it.
const editableAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([key]) => !key.startsWith('on') && key !== 'data-slot'),
  ),
)

const editorProps = computed(() =>
  defu(props.editorProps, {
    attributes: {
      autocomplete: 'off',
      autocorrect: 'off',
      autocapitalize: 'off',
      ...editableAttrs.value,
      ...(props.disabled ? { 'aria-disabled': 'true' } : {}),
      ...(props.editable ? {} : { 'aria-readonly': 'true' }),
      class: ui.value.base(),
    },
  } as EditorOptions['editorProps']),
)

// Strings are HTML and objects JSON unless `contentType` says otherwise.
const contentType = computed<EditorContentType>(
  () => props.contentType ?? (typeof props.modelValue === 'string' ? 'html' : 'json'),
)

const starterKitOptions = computed(() => {
  const options = typeof props.starterKit === 'object' ? props.starterKit : {}

  return defu(options, props.starterKit === false ? PLAIN_TEXT : {}, STARTER_KIT_DEFAULTS)
})

const imageOptions = computed(() => (typeof props.image === 'object' ? props.image : {}))

// Inline code accepts other marks (bold code, linked code) instead of excluding them all.
const InlineCode = Code.extend({ excludes: 'code' })

// The rule is wrapped in a block, so it can be selected and styled with vertical room around it.
const WrappedHorizontalRule = HorizontalRule.extend({
  renderHTML() {
    return ['div', mergeAttributes(this.options.HTMLAttributes, { 'data-type': this.name }), ['hr']]
  },
})

const createExtensions = () => {
  const isRichText = props.starterKit !== false
  const placeholder = placeholderOptions.value

  return [
    contentType.value === 'markdown' && Markdown.configure(defu(props.markdown, MARKDOWN_DEFAULTS)),
    StarterKit.configure(starterKitOptions.value),
    isRichText && InlineCode,
    isRichText && WrappedHorizontalRule,
    props.image !== false && Image.configure(imageOptions.value),
    placeholder &&
      Placeholder.configure(
        defu({ placeholder: resolvePlaceholderText }, placeholder, PLACEHOLDER_DEFAULTS),
      ),
    ...(props.extensions ?? []),
  ].filter((extension) => !!extension)
}

// Typed by the methods used: `onUpdate` passes the core editor, not the Vue wrapper `useEditor` returns.
const VALUE_READERS: Record<
  EditorContentType,
  (instance: Pick<TiptapEditor, 'getHTML' | 'getJSON' | 'getMarkdown'>) => Content
> = {
  html: (instance) => instance.getHTML(),
  json: (instance) => instance.getJSON(),
  markdown: (instance) => instance.getMarkdown(),
}

const serialize = (value: Content) =>
  contentType.value === 'json' && typeof value === 'object' ? JSON.stringify(value) : String(value)

const editor = useEditor({
  content: props.modelValue,
  contentType: contentType.value,
  extensions: createExtensions(),
  editable: isEditable.value,
  autofocus: props.autofocus,
  editorProps: editorProps.value,
  onCreate: ({ editor: instance }) => {
    // Renders the placeholder decorations right away instead of on the first focus.
    if (props.placeholder) instance.view.dispatch(instance.state.tr)
  },
  onUpdate: ({ editor: instance, transaction, appendedTransactions }) => {
    const isDocChanged =
      transaction.docChanged || appendedTransactions.some((appended) => appended.docChanged)

    if (!isDocChanged) return

    emit('update:modelValue', VALUE_READERS[contentType.value](instance))
  },
})

watch(
  () => props.modelValue,
  (value) => {
    const instance = editor.value
    if (!instance || value === undefined || value === null) return

    const current = serialize(VALUE_READERS[contentType.value](instance))
    if (current === serialize(value)) return

    // The parent already holds this value, so it isn't emitted back. The caret stays where it was when the new
    // document is long enough.
    const { from } = instance.state.selection
    instance.commands.setContent(value, { contentType: contentType.value, emitUpdate: false })
    if (from <= instance.state.doc.content.size) instance.commands.setTextSelection(from)
  },
)

watch(isEditable, (value) => {
  const instance = editor.value
  if (!instance) return

  instance.setEditable(value, false)

  // An empty transaction refreshes the reactive editor state, so toolbars re-read `isEditable`.
  instance.view.dispatch(instance.state.tr)
})

watch(
  () => placeholderOptions.value?.placeholder,
  () => {
    const instance = editor.value
    if (instance) instance.view.dispatch(instance.state.tr)
  },
)

watch(editorProps, (value) => {
  editor.value?.setOptions({ editorProps: value })
})

const handlers = computed(
  () => ({ ...createEditorHandlers(), ...props.handlers }) as EditorHandlers<H>,
)

provide(editorHandlersKey, handlers)

defineExpose({ editor })
</script>
