import { PluginKey } from '@tiptap/pm/state'
import type { Plugin } from '@tiptap/pm/state'
import Suggestion from '@tiptap/suggestion'
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
import type { Range, Editor as TiptapEditor } from '@tiptap/vue-3'
import { useFilter } from 'reka-ui'
import type { MaybeRefOrGetter, Ref } from 'vue'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, toValue, useId, watch } from 'vue'

import { get } from '@/utils/get'

import type { EditorMenuEntry, EditorMenuSection } from './EditorSuggestionMenu.types'

/** The fields every menu item may have. */
export type EditorMenuItemBase = {
  type?: undefined
  label?: string
  disabled?: boolean
}

/** A rendered item: `index` is its position among the items Enter can pick, `-1` when it can't be picked. */
export type EditorMenuOptionEntry<T> = { item: T; index: number }

/** A rendered group: a section, a nested array or a run of items between separators. */
export type EditorMenuGroup<T> = {
  section?: EditorMenuSection<T>
  options: EditorMenuOptionEntry<T>[]
}

type EditorMenuOptions<T> = {
  editor: TiptapEditor
  char: string
  items: MaybeRefOrGetter<EditorMenuEntry<T>[] | T[][] | undefined>
  filterFields: MaybeRefOrGetter<string[]>
  limit: MaybeRefOrGetter<number>
  ignoreFilter: MaybeRefOrGetter<boolean>
  startOfLine?: boolean
  allowSpaces?: boolean
  /** Classes of the inline decoration over the trigger and the typed text. */
  decorationClass: string
  /** Holds the text typed after the trigger while the menu is active. */
  query: Ref<string>
  /** Runs the picked item; `range` covers the trigger and the text typed after it. */
  onSelect: (range: Range, item: T) => void
}

/** Splits `items` into groups: nested arrays, sections, and the runs of items between separators. */
const toGroups = <T extends EditorMenuItemBase>(
  items: EditorMenuEntry<T>[] | T[][],
): { section?: EditorMenuSection<T>; items: T[] }[] => {
  if (items.some(Array.isArray)) return (items as T[][]).map((group) => ({ items: group }))

  const groups: { section?: EditorMenuSection<T>; items: T[] }[] = []
  let run: T[] = []
  const closeRun = () => {
    if (run.length) groups.push({ items: run })
    run = []
  }

  for (const entry of items as EditorMenuEntry<T>[]) {
    if (!entry.type) {
      run.push(entry as T)
      continue
    }

    closeRun()
    if (entry.type === 'section') groups.push({ section: entry, items: entry.items })
  }

  closeRun()

  return groups
}

const hasModifier = (event: KeyboardEvent) =>
  event.shiftKey || event.altKey || event.ctrlKey || event.metaKey

/**
 * A tiptap suggestion plugin bound to a menu: filters `items` by the text typed after `char`, tracks the highlighted
 * option and picks it on Enter or Tab. The plugin goes first in the editor's list, so while options show, the menu
 * gets Enter, Tab, the arrow keys and Escape before any keyboard shortcut. Only this menu's own plugin is removed on
 * unmount.
 */
export const useEditorMenu = <T extends EditorMenuItemBase>(options: EditorMenuOptions<T>) => {
  const { editor, query } = options
  const { startsWith, contains } = useFilter({ sensitivity: 'base' })

  const isActive = ref(false)
  const highlightedIndex = ref(0)
  const clientRect = shallowRef<(() => DOMRect | null) | null>(null)
  let command: ((item: T) => void) | undefined

  // 0: the whole value, 1: its start, 2: anywhere in it.
  const score = (value: string, text: string) => {
    if (startsWith(value, text)) return value.length === text.length ? 0 : 1

    return contains(value, text) ? 2 : undefined
  }

  const fieldValues = (item: T) =>
    toValue(options.filterFields).flatMap((field) => {
      const value = get(item, field)

      return value == null ? [] : [value].flat().map(String)
    })

  const rank = (item: T, text: string) => {
    const ranks = fieldValues(item)
      .flatMap((value) => [score(value, text), score(value.replace(/[\s_-]/g, ''), text)])
      .filter((result) => result !== undefined)

    return ranks.length ? Math.min(...ranks) : undefined
  }

  const filterGroup = (group: T[], text: string): T[] => {
    if (!text || toValue(options.ignoreFilter)) return group

    const ranked = group
      .map((item) => ({ item, rank: rank(item, text) }))
      .filter((entry): entry is { item: T; rank: number } => entry.rank !== undefined)
      .sort((a, b) => a.rank - b.rank)

    return ranked.map((entry) => entry.item)
  }

  const groups = computed((): EditorMenuGroup<T>[] => {
    let remaining = toValue(options.limit)
    let index = 0

    const toEntry = (item: T): EditorMenuOptionEntry<T>[] => {
      if (remaining <= 0) return []
      remaining--

      return [{ item, index: item.disabled ? -1 : index++ }]
    }

    return toGroups(toValue(options.items) ?? [])
      .map(({ section, items }) => ({
        section,
        options: filterGroup(items, query.value).flatMap(toEntry),
      }))
      .filter((group) => group.options.length > 0)
  })

  const enabledOptions = computed(() =>
    groups.value
      .flatMap((group) => group.options)
      .filter((entry) => entry.index >= 0)
      .map((entry) => entry.item),
  )

  // The menu stays open while the suggestion is active, showing its empty or loading row when there are no items.
  const isOpen = computed(() => isActive.value)

  watch(query, () => {
    highlightedIndex.value = 0
  })

  watch(
    () => enabledOptions.value.length,
    (count) => {
      if (highlightedIndex.value >= count) highlightedIndex.value = Math.max(count - 1, 0)
    },
  )

  const select = (index: number) => {
    const item = enabledOptions.value[index]
    if (item && command) command(item)
  }

  const highlight = (index: number) => {
    if (index >= 0 && index < enabledOptions.value.length) highlightedIndex.value = index
  }

  const move = (step: number) => {
    const count = enabledOptions.value.length
    if (count) highlightedIndex.value = (highlightedIndex.value + step + count) % count
  }

  const onKeyDown = ({ event }: SuggestionKeyDownProps) => {
    if (!isOpen.value || event.isComposing) return false

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      move(event.key === 'ArrowDown' ? 1 : -1)

      return true
    }

    if (event.key === 'Enter' || event.key === 'Tab') {
      if (!enabledOptions.value.length || hasModifier(event)) return false
      select(highlightedIndex.value)

      return true
    }

    // The plugin closes the menu itself after Escape.
    return event.key === 'Escape'
  }

  const sync = (props: SuggestionProps<T, T>) => {
    isActive.value = true
    query.value = props.query
    clientRect.value = props.clientRect ?? null
    command = props.command
  }

  // Each menu gets its own plugin key, so menus never clash.
  const pluginKey = new PluginKey(`editorMenu-${useId()}`)

  const plugin: Plugin = Suggestion<T, T>({
    editor,
    char: options.char,
    startOfLine: options.startOfLine,
    allowSpaces: options.allowSpaces,
    decorationClass: options.decorationClass,
    pluginKey,
    command: ({ range, props }) => options.onSelect(range, props),
    render: () => ({
      onStart: (props) => {
        highlightedIndex.value = 0
        sync(props)
      },
      onUpdate: sync,
      onKeyDown,
      onExit: () => {
        isActive.value = false
        query.value = ''
        clientRect.value = null
        command = undefined
      },
    }),
  })

  const close = () => {
    if (!isActive.value || editor.isDestroyed) return
    editor.view.dispatch(editor.state.tr.setMeta(pluginKey, { exit: true }))
  }

  // Picking an option keeps the editor focused (the menu cancels `mousedown`), so a blur means focus left the editor,
  // unless a button outside, like a toolbar's insert button, gave it back and opened the menu.
  const onBlur = () => setTimeout(() => !editor.isDestroyed && !editor.view.hasFocus() && close())

  // Mounting the view resets the editor's plugins, so the menu adds its plugin again.
  const register = () => {
    editor.registerPlugin(plugin, (own, plugins) => [own, ...plugins])
  }

  onMounted(() => {
    editor.on('mount', register)
    editor.on('blur', onBlur)
    if (!editor.isDestroyed) register()
  })

  onBeforeUnmount(() => {
    editor.off('mount', register)
    editor.off('blur', onBlur)
    if (editor.isDestroyed) return

    // `unregisterPlugin` matches keys by prefix, which would also remove a sibling menu named `menu$1` or `menu$10`,
    // and setting the view's state directly leaves the Vue editor's cached `state` behind, so the next transaction
    // brings the plugin back. `registerPlugin`'s merge callback drops just this plugin and updates both.
    editor.registerPlugin(plugin, (own, plugins) =>
      plugins.filter((candidate) => candidate !== own),
    )
  })

  return { isOpen, groups, highlightedIndex, clientRect, select, highlight }
}
