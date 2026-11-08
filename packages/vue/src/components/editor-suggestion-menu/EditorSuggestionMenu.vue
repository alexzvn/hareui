<template>
  <EditorMenuContent
    v-bind="$attrs"
    :editor="editor"
    :open="isOpen"
    :groups="groups"
    :highlighted-index="highlightedIndex"
    :client-rect="clientRect"
    :search-term="searchTerm"
    :loading="loading"
    :side="side"
    :align="align"
    :side-offset="sideOffset"
    :portal="portal"
    :ui="ui"
    data-slot="editor-suggestion-menu"
    @select="select"
    @highlight="highlight"
  >
    <template #section-label="{ section }">
      <slot name="section-label" :section="section">{{ section.label }}</slot>
    </template>
    <template #empty="{ searchTerm: term }">
      <slot name="empty" :search-term="term">{{ t('editorMenu.noResults') }}</slot>
    </template>
    <template #item="{ item, highlighted, disabled }">
      <slot name="item" v-bind="{ item, highlighted, disabled, ui }">
        <slot name="item-leading" v-bind="{ item, highlighted, disabled, ui }">
          <span
            v-if="item.icon"
            :class="ui.itemIcon()"
            data-slot="editor-suggestion-menu-item-icon"
          >
            <IconRenderer :icon="item.icon" :class="ui.itemIconSvg()" />
          </span>
        </slot>
        <span :class="ui.itemWrapper()">
          <span :class="ui.itemLabel()" data-slot="editor-suggestion-menu-item-label">
            <slot name="item-label" v-bind="{ item, highlighted, disabled, ui }">{{
              item.label
            }}</slot>
          </span>
          <span
            v-if="item.description || $slots['item-description']"
            :class="ui.itemDescription()"
            data-slot="editor-suggestion-menu-item-description"
          >
            <slot name="item-description" v-bind="{ item, highlighted, disabled, ui }">
              {{ item.description }}
            </slot>
          </span>
        </span>
        <slot name="item-trailing" v-bind="{ item, highlighted, disabled, ui }">
          <Kbd v-if="item.kbd" variant="light" :keys="item.kbd.keys" :class="ui.itemKbd()">
            <template v-if="item.kbd.content">{{ item.kbd.content }}</template>
          </Kbd>
        </slot>
      </slot>
    </template>
  </EditorMenuContent>
</template>

<script setup lang="ts" generic="T extends EditorSuggestionMenuItem">
import { computed, inject, watch } from 'vue'

import { editorHandlersKey } from '@/components/editor/context'
import type { EditorCommand } from '@/components/editor/Editor.types'
import { createEditorHandlers } from '@/components/editor/handlers'
import Kbd from '@/components/kbd/Kbd.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'
import { IconRenderer } from '@/utils/icon'

import EditorMenuContent from './EditorMenuContent.vue'
import type {
  EditorSuggestionMenuItem,
  EditorSuggestionMenuEmits,
  EditorSuggestionMenuProps,
  EditorSuggestionMenuSlots,
} from './EditorSuggestionMenu.types'
import theme from './theme'
import { useEditorMenu } from './useEditorMenu'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<EditorSuggestionMenuProps<T>>(), {
  char: '/',
  filterFields: () => ['label'],
  limit: 42,
  ignoreFilter: false,
  loading: false,
  startOfLine: false,
  allowSpaces: false,
  side: 'bottom',
  align: 'start',
  sideOffset: 8,
  portal: undefined,
})

const emit = defineEmits<EditorSuggestionMenuEmits<T>>()

defineSlots<EditorSuggestionMenuSlots<T>>()

/** The text typed after the trigger character while the menu is open. */
const searchTerm = defineModel<string>('searchTerm', { default: '' })

const ui = useComponentUI('editorSuggestionMenu', { theme, variantProps: () => ({}), props })
const { t } = useLocale()

const handlers = inject(
  editorHandlersKey,
  computed(() => createEditorHandlers()),
)

const runItem = (item: T) => {
  if (item.onSelect) return item.onSelect(props.editor)
  if (!item.kind) return

  handlers.value[item.kind]?.execute(props.editor, item as EditorCommand).run()
}

const { isOpen, groups, highlightedIndex, clientRect, select, highlight } = useEditorMenu<T>({
  editor: props.editor,
  char: props.char,
  items: () => props.items,
  filterFields: () => props.filterFields,
  limit: () => props.limit,
  ignoreFilter: () => props.ignoreFilter,
  startOfLine: props.startOfLine,
  allowSpaces: props.allowSpaces,
  decorationClass: ui.value.trigger(),
  query: searchTerm,
  // The typed command (`/head`) is removed first, then the item's command runs where it stood.
  onSelect: (range, item) => {
    props.editor.chain().focus().deleteRange(range).run()

    runItem(item)
    emit('select', item)
  },
})

watch(isOpen, (open) => emit('update:open', open))
</script>
