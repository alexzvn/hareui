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
    data-slot="editor-mention-menu"
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
            v-if="item.icon && !item.avatar"
            :class="ui.itemIcon()"
            data-slot="editor-mention-menu-item-icon"
          >
            <IconRenderer :icon="item.icon" :class="ui.itemIconSvg()" />
          </span>
          <Avatar
            v-else
            size="sm"
            :fallback="initials(item.label)"
            v-bind="item.avatar"
            :class="ui.itemAvatar()"
          />
        </slot>
        <span :class="ui.itemWrapper()">
          <span :class="ui.itemLabel()" data-slot="editor-mention-menu-item-label">
            <slot name="item-label" v-bind="{ item, highlighted, disabled, ui }">{{
              item.label
            }}</slot>
          </span>
          <span
            v-if="item.description || $slots['item-description']"
            :class="ui.itemDescription()"
            data-slot="editor-mention-menu-item-description"
          >
            <slot name="item-description" v-bind="{ item, highlighted, disabled, ui }">
              {{ item.description }}
            </slot>
          </span>
        </span>
        <slot name="item-trailing" v-bind="{ item, highlighted, disabled, ui }" />
      </slot>
    </template>
  </EditorMenuContent>
</template>

<script setup lang="ts" generic="T extends EditorMentionMenuItem">
import { watch } from 'vue'

import Avatar from '@/components/avatar/Avatar.vue'
import EditorMenuContent from '@/components/editor-suggestion-menu/EditorMenuContent.vue'
import { useEditorMenu } from '@/components/editor-suggestion-menu/useEditorMenu'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'
import { IconRenderer } from '@/utils/icon'
import { warn } from '@/utils/warn'

import type {
  EditorMentionMenuEmits,
  EditorMentionMenuItem,
  EditorMentionMenuProps,
  EditorMentionMenuSlots,
} from './EditorMentionMenu.types'
import theme from './theme'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<EditorMentionMenuProps<T>>(), {
  char: '@',
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

const emit = defineEmits<EditorMentionMenuEmits<T>>()

defineSlots<EditorMentionMenuSlots<T>>()

/** The text typed after the trigger character while the menu is open. */
const searchTerm = defineModel<string>('searchTerm', { default: '' })

const ui = useComponentUI('editorMentionMenu', { theme, variantProps: () => ({}), props })
const { t } = useLocale()

const initials = (label: string) =>
  label
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')

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
  // The trigger and the typed text become the mention, followed by a space to keep typing.
  onSelect: (range, item) => {
    const { id, label } = item

    if (!props.editor.schema.nodes.mention) {
      warn('EditorMentionMenu needs the mention node: leave the Editor `mention` prop on.')
    }

    props.editor
      .chain()
      .focus()
      .insertContentAt(range, [
        { type: 'mention', attrs: { id: id ?? label, label, mentionSuggestionChar: props.char } },
        { type: 'text', text: ' ' },
      ])
      .run()

    emit('select', item)
  },
})

watch(isOpen, (open) => emit('update:open', open))
</script>
