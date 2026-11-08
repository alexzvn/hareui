import editorSuggestionMenu from '@/components/editor-suggestion-menu/theme'

// The EditorSuggestionMenu panel and rows, plus a 36px avatar that an item shows instead of its icon well.
export default {
  slots: {
    ...editorSuggestionMenu.slots,
    itemAvatar: 'size-9 shrink-0',
  },
}
