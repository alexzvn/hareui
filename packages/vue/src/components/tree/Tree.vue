<template>
  <TreeRoot
    v-slot="{ flattenItems }"
    data-slot="tree"
    :as="as.root"
    :items="items"
    :model-value="selection"
    :multiple="multiple"
    :expanded="expanded"
    :default-expanded="resolvedDefaultExpanded"
    :selection-behavior="selectionBehavior"
    :propagate-select="propagateSelect"
    :bubble-select="bubbleSelect"
    :disabled="disabled"
    :loop="loop"
    :get-key="getItemKey"
    :get-children="getExpandableChildren"
    :class="ui.root()"
    @update:model-value="setSelection"
    @update:expanded="onExpandedUpdate"
  >
    <TreeVirtualizer
      v-if="virtualizeOptions"
      v-slot="{ item: row }"
      :overscan="virtualizeOptions.overscan"
      :estimate-size="virtualizeOptions.estimateSize"
      :text-content="getItemLabel"
      @keydown.capture="onVirtualKeydown($event, flattenItems)"
    >
      <TreeNode
        :item="row.value"
        :index="row.index"
        :set-size="row.bind['aria-setsize']"
        :level="row.level"
      />
    </TreeVirtualizer>
    <template v-else-if="!nested">
      <TreeNode
        v-for="row in flattenItems"
        :key="row._id"
        :item="row.value"
        :index="row.index"
        :set-size="row.bind['aria-setsize']"
        :level="row.level"
      />
    </template>
    <template v-else>
      <TreeNode
        v-for="(item, index) in items"
        :key="getItemKey(item)"
        :item="item"
        :index="index"
        :set-size="items!.length"
        :level="1"
      />
    </template>
    <!-- A tree owns only treeitems and groups, so the empty state is one; Reka doesn't track it, so it takes no focus -->
    <li
      v-if="!items.length && (slots.empty || empty)"
      role="treeitem"
      data-slot="tree-empty"
      :class="ui.empty()"
    >
      <slot name="empty">{{ empty }}</slot>
    </li>
  </TreeRoot>
</template>

<script setup lang="ts" generic="T extends TreeItem = TreeItem, M extends boolean = false">
import { TreeRoot, TreeVirtualizer } from 'reka-ui'
import { computed, provide, shallowRef, useSlots } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { get } from '@/utils/get'
import { resolveAs } from '@/utils/resolveAs'

import { getExpandableChildren, treeContextKey } from './context'
import { ChevronRightIcon, FolderIcon, FolderOpenIcon } from './icons'
import theme from './theme'
import type {
  TreeEmits,
  TreeItem,
  TreeProps,
  TreeSelectEvent,
  TreeSlots,
  TreeToggleEvent,
} from './Tree.types'
import TreeNode from './TreeNode.vue'

const props = withDefaults(defineProps<TreeProps<T, M>>(), {
  labelKey: 'label',
  showGuideLines: true,
  nested: true,
  virtualize: false,
  checkbox: false,
  items: () => [],
})

const emit = defineEmits<TreeEmits<T, M>>()
const slots = useSlots()
defineSlots<TreeSlots<T>>()

const ui = useComponentUI('tree', {
  theme,
  variantProps: () => ({
    color: props.color,
    size: props.size,
    showGuideLines: props.showGuideLines,
  }),
  props,
  classSlot: 'root',
})

const as = computed(() => resolveAs(props.as, { root: 'ul', link: 'button' }))

const getItemLabel = (item: TreeItem) => String(get(item, props.labelKey) ?? '')
const getItemKey = (item: TreeItem) => props.getKey?.(item as T) || getItemLabel(item)

const collectExpanded = (items: TreeItem[]): string[] => {
  return items.flatMap((item) => {
    const own = item.defaultExpanded ? [getItemKey(item)] : []

    return [...own, ...collectExpanded(item.children ?? [])]
  })
}

// Read once by Reka on mount, like any uncontrolled default.
const resolvedDefaultExpanded = props.defaultExpanded ?? collectExpanded(props.items)

// Row heights per size; virtual rows are positioned from this estimate.
const ROW_HEIGHT = { sm: 20, md: 28, lg: 36 } as const

const virtualizeOptions = computed(() => {
  if (!props.virtualize) return undefined

  const options = props.virtualize === true ? {} : props.virtualize

  return {
    overscan: options.overscan,
    estimateSize: options.estimateSize ?? ROW_HEIGHT[props.size ?? 'md'],
  }
})

// Uncontrolled state lives here, so modifier clicks can change the selection; Reka always sees a controlled value
const localSelection = shallowRef(props.defaultValue)
const selection = computed(() => props.modelValue ?? localSelection.value)

const setSelection = (value: TreeProps<T, M>['modelValue']) => {
  localSelection.value = value
  emit('update:modelValue', value!)
}

const expandedKeys = shallowRef(props.expanded ?? resolvedDefaultExpanded)

const onExpandedUpdate = (keys: string[]) => {
  expandedKeys.value = keys
  emit('update:expanded', keys)
}

// The rows in view order: every item whose ancestors are all expanded
const collectVisible = (items: TreeItem[]): TreeItem[] => {
  const expanded = props.expanded ?? expandedKeys.value

  return items.flatMap((item) => {
    const children = getExpandableChildren(item)
    const isOpen = children && expanded.includes(getItemKey(item))

    return [item, ...(isOpen ? collectVisible(children) : [])]
  })
}

// The row a Shift-click range starts from
const anchorKey = shallowRef<string>()

// With `selectionBehavior: 'replace'` a plain click selects one row; Ctrl/Cmd-click adds or removes a row and
// Shift-click selects the rows between the last clicked one and this one
const selectWithModifiers = (event: TreeSelectEvent, item: TreeItem) => {
  const click = event.detail.originalEvent
  const key = getItemKey(item)

  const isModified =
    click instanceof MouseEvent && (click.shiftKey || click.metaKey || click.ctrlKey)

  if (!props.multiple || props.selectionBehavior !== 'replace' || !isModified) {
    anchorKey.value = key
    return
  }

  event.preventDefault()
  const current = (selection.value ?? []) as TreeItem[]
  const rows = collectVisible(props.items)
  const anchorIndex = rows.findIndex((row) => getItemKey(row) === anchorKey.value)

  if (click.shiftKey && anchorIndex !== -1) {
    const index = rows.findIndex((row) => getItemKey(row) === key)
    const [from, to] = anchorIndex < index ? [anchorIndex, index] : [index, anchorIndex]
    const range = rows.slice(from, to + 1).filter((row) => !row.disabled)
    setSelection(range as TreeProps<T, M>['modelValue'])

    return
  }

  anchorKey.value = key
  const isSelected = current.some((selected) => getItemKey(selected) === key)
  const next = isSelected
    ? current.filter((selected) => getItemKey(selected) !== key)
    : [...current, item]

  setSelection(next as TreeProps<T, M>['modelValue'])
}

const EDGE_KEYS = ['Home', 'End']

// Rows outside the viewport aren't rendered, so Home and End scroll to the first or last row and focus it once it
// renders; the focused row keeps the tab stop
const onVirtualKeydown = (event: KeyboardEvent, rows: { value: TreeItem }[]) => {
  const target = event.target as HTMLElement
  const isModified = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
  if (!EDGE_KEYS.includes(event.key) || isModified || target.getAttribute('role') !== 'treeitem')
    return

  const enabled = rows.flatMap((row, index) => (row.value.disabled ? [] : [index]))
  const index = event.key === 'Home' ? enabled[0] : enabled.at(-1)
  const scroller = (event.currentTarget as HTMLElement).parentElement
  if (index === undefined || !scroller) return

  event.preventDefault()
  event.stopPropagation()
  scroller.scrollTop = event.key === 'Home' ? 0 : scroller.scrollHeight
  focusRow(scroller, index)
}

// Waits a few frames for the virtualizer to render the row after a scroll
const focusRow = (scroller: HTMLElement, index: number) => {
  let framesLeft = 10
  const attempt = () => {
    const row = scroller.querySelector<HTMLElement>(`[data-index="${index}"]`)
    if (row) return row.focus()
    if (framesLeft-- > 0) requestAnimationFrame(attempt)
  }

  requestAnimationFrame(attempt)
}

provide(treeContextKey, {
  ui: () => ui.value,
  slots,
  linkAs: () => as.value.link,
  isNested: () => props.nested && !props.virtualize,
  isDisabled: () => props.disabled,
  hasCheckbox: () => props.checkbox,
  icons: () => ({
    indicator: props.indicatorIcon ?? ChevronRightIcon,
    expanded: props.expandedIcon ?? FolderOpenIcon,
    collapsed: props.collapsedIcon ?? FolderIcon,
  }),
  getKey: getItemKey,
  getLabel: getItemLabel,
  onSelect: (event, item) => {
    if (item.onSelect) item.onSelect(event)
    if (!item.onSelect) emit('select', event as TreeSelectEvent<T>, item as T)
    if (!event.defaultPrevented) selectWithModifiers(event, item)
  },
  onToggle: (event, item) => {
    if (item.onToggle) return item.onToggle(event)

    emit('toggle', event as TreeToggleEvent<T>, item as T)
  },
})
</script>
