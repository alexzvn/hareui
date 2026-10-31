<template>
  <div
    ref="root"
    role="grid"
    data-slot="list-view"
    :data-virtualized="virtualizer ? 'true' : undefined"
    :aria-label="ariaLabel"
    :aria-multiselectable="selection.isMultiple.value ? 'true' : undefined"
    :aria-rowcount="virtualizer ? items.length : undefined"
    :tabindex="isFocusedRowRendered ? -1 : 0"
    :class="ui.base()"
    @focus="onRootFocus"
    @focusin="onFocusin"
    @keydown.capture="onKeydown"
  >
    <div
      v-if="virtualPadding.top > 0"
      role="presentation"
      aria-hidden="true"
      :style="{ height: `${virtualPadding.top}px` }"
    />
    <ListViewItemRow
      v-for="row in rows"
      :key="row.item.value"
      :ref="measureRow"
      :item="row.item"
      :index="row.index"
      :selected="selection.isSelected(row.item.value)"
      :focusable="row.index === focusedIndex"
      :is-link="isLinkItem(row.item)"
      :is-last="row.index === items.length - 1"
      :selection-mode="selectionMode"
      :checkbox-variant="variant === 'secondary' ? 'primary' : 'secondary'"
      :row-index="virtualizer ? row.index + 1 : undefined"
      :ui="ui"
      :slots="itemSlots"
      @press="(event, pointerType) => onPress(row.index, { event, pointerType })"
      @activate="onActivate(row.index)"
      @toggle="onToggle(row.index)"
    />
    <div
      v-if="virtualPadding.bottom > 0"
      role="presentation"
      aria-hidden="true"
      :style="{ height: `${virtualPadding.bottom}px` }"
    />
    <!-- A grid owns only rows, so the empty state is one (RAC GridList) -->
    <div v-if="!items.length" role="row" data-slot="list-view-empty">
      <div role="gridcell" data-slot="list-view-empty-state" :class="ui.emptyState()">
        <slot name="empty">{{ t('emptyState.label') }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends ListViewItem = ListViewItem">
import { useVirtualizer } from '@tanstack/vue-virtual'
import type { VNode } from 'vue'
import { computed, getCurrentInstance, shallowRef, useSlots, useTemplateRef } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'

import type {
  ListViewEmits,
  ListViewItem,
  ListViewItemSlotProps,
  ListViewProps,
  ListViewSlots,
  ListViewValue,
} from './ListView.types'
import ListViewItemRow from './ListViewItem.vue'
import theme from './theme'
import type { ListViewRowBox } from './useListViewKeyboard'
import { useListViewKeyboard } from './useListViewKeyboard'
import type { ListViewSelectionMode } from './useListViewSelection'
import { useListViewSelection } from './useListViewSelection'

const props = withDefaults(defineProps<ListViewProps<T>>(), {
  items: () => [],
  modelValue: undefined,
  defaultValue: undefined,
  selectable: false,
  multiple: false,
  selectionBehavior: 'toggle',
  variant: 'primary',
  virtualize: false,
})

const emit = defineEmits<ListViewEmits>()
defineSlots<ListViewSlots<T>>()

// The row renders the item slots untyped; `ListViewSlots` types them for consumers
const itemSlots = useSlots() as Record<
  string,
  ((props: ListViewItemSlotProps) => VNode[]) | undefined
>

const { t } = useLocale()

const ui = useComponentUI('listView', {
  theme,
  variantProps: () => ({ variant: props.variant }),
  props,
})

const root = useTemplateRef<HTMLElement>('root')

const selectionMode = computed<ListViewSelectionMode>(() => {
  if (!props.selectable) return 'none'

  return props.multiple ? 'multiple' : 'single'
})

const selection = useListViewSelection({
  props,
  mode: () => selectionMode.value,
  items: () => props.items,
  onUpdate: (value) => emit('update:modelValue', value),
})

const isLinkItem = (item: ListViewItem) => item.to !== undefined || item.href !== undefined

// ---- Virtualization ----

const DEFAULT_ESTIMATE_SIZE = 48
const DEFAULT_OVERSCAN = 5

const virtualizer = props.virtualize
  ? useVirtualizer<HTMLElement, HTMLElement>(
      computed(() => {
        const options = typeof props.virtualize === 'object' ? props.virtualize : {}
        const items = props.items

        return {
          count: items.length,
          getScrollElement: () => root.value,
          estimateSize: () => options.estimateSize ?? DEFAULT_ESTIMATE_SIZE,
          overscan: options.overscan ?? DEFAULT_OVERSCAN,
          getItemKey: (index: number) => items[index]?.value ?? index,
        }
      }),
    )
  : undefined

const rows = computed(() => {
  if (!virtualizer) return props.items.map((item, index) => ({ item, index }))

  return virtualizer.value.getVirtualItems().flatMap(({ index }) => {
    const item = props.items[index]

    return item ? [{ item, index }] : []
  })
})

// The rows outside the window are stood in for by two spacers of their measured or estimated height
const virtualPadding = computed(() => {
  const windowed = virtualizer?.value.getVirtualItems() ?? []
  if (!virtualizer || !windowed.length) return { top: 0, bottom: 0 }

  const end = windowed.at(-1)?.end ?? 0

  return {
    top: windowed[0]?.start ?? 0,
    bottom: virtualizer.value.getTotalSize() - end,
  }
})

// Register each rendered row so its real height is measured (and re-measured on resize). Vue calls a function ref
// on every patch; a row the virtualizer already observes under its key is skipped, so it isn't re-laid out.
const measureRow = (instance: unknown) => {
  const el = (instance as { $el?: unknown } | null)?.$el
  if (!virtualizer || !(el instanceof HTMLElement) || !el.isConnected) return

  const v = virtualizer.value
  const key = v.options.getItemKey(v.indexFromElement(el))
  if (v.elementsCache.get(key) === el) return

  v.measureElement(el)
}

// ---- Focus ----

const focusedValue = shallowRef<ListViewValue | null>(null)

// The row that holds the tab stop; -1 once it's gone or disabled, which hands the tab stop back to the list
const focusedIndex = computed(() => {
  const index = props.items.findIndex((item) => item.value === focusedValue.value)

  return props.items[index]?.disabled ? -1 : index
})

const isFocusedRowRendered = computed(() =>
  rows.value.some((row) => row.index === focusedIndex.value),
)

// Only the list's own rows: a list nested in an action cell has rows with the same indices
const getRowElement = (index: number) => {
  const children = Array.from(root.value?.children ?? []) as HTMLElement[]

  return children.find((el) => el.dataset.index === String(index)) ?? null
}

// Waits a few frames for the virtualizer to render a row it scrolled to
const focusWhenRendered = (index: number) => {
  let framesLeft = 10

  const attempt = () => {
    const el = getRowElement(index)
    if (el) return el.focus()
    if (framesLeft-- > 0) requestAnimationFrame(attempt)
  }

  requestAnimationFrame(attempt)
}

const focusIndex = (index: number) => {
  const item = props.items[index]
  if (!item) return

  focusedValue.value = item.value
  const el = getRowElement(index)
  if (el) return el.focus()

  virtualizer?.value.scrollToIndex(index)
  focusWhenRendered(index)
}

const getRowBox = (index: number): ListViewRowBox | undefined => {
  const measured = virtualizer?.value.measurementsCache[index]
  if (measured) return { top: measured.start, height: measured.size }

  const el = getRowElement(index)

  return el ? { top: el.offsetTop, height: el.offsetHeight } : undefined
}

// Tabbing into the list lands on the last focused row, else the first selected one, else the first enabled one
const getEntryIndex = () => {
  if (focusedIndex.value !== -1) return focusedIndex.value

  const enabled = props.items.flatMap((item, index) => (item.disabled ? [] : [index]))
  const selected = enabled.find((index) => selection.isSelected(props.items[index]!.value))

  return selected ?? enabled[0]
}

const onRootFocus = (event: FocusEvent) => {
  const list = event.currentTarget as HTMLElement
  const from = event.relatedTarget as Node | null

  // Shift+Tab from a row focuses the list on its way out; leave it there
  if (event.target !== list || (from && list.contains(from))) return

  const index = getEntryIndex()
  if (index !== undefined) focusIndex(index)
}

const onFocusin = (event: FocusEvent) => {
  const target = event.target as HTMLElement
  if (target.getAttribute('role') !== 'row' || target.parentElement !== root.value) return

  const item = props.items[Number(target.dataset.index)]
  if (item) focusedValue.value = item.value
}

// ---- Actions ----

const instance = getCurrentInstance()

// Rows are actionable when `action` has a listener (RAC `onAction`) or when they link somewhere
const allowsActions = (item: ListViewItem) => !!instance?.vnode.props?.onAction || isLinkItem(item)

// RAC `useSelectableItem`: with `toggle` behaviour a press runs the action while nothing is selected; with
// `replace` it selects, and a double click or Enter runs the action
const hasPrimaryAction = (item: ListViewItem) => {
  if (!allowsActions(item)) return false
  if (!selection.isSelectable.value) return true

  return props.selectionBehavior === 'toggle' && selection.selectedValues.value.length === 0
}

const hasSecondaryAction = (item: ListViewItem) =>
  allowsActions(item) && selection.isSelectable.value && props.selectionBehavior === 'replace'

// Set while a keyboard action clicks a link row, so the click opens the link instead of selecting
let isFollowingLink = false

const runAction = (index: number) => {
  const item = props.items[index]
  if (!item) return

  emit('action', item.value)
  if (!isLinkItem(item)) return

  isFollowingLink = true
  getRowElement(index)?.click()
  isFollowingLink = false
}

// A press either runs the action (a link row then opens its link) or selects; `preventDefault()` keeps the link shut.
// A disabled row ignores presses. As in RAC, a touch or pen tap has no double tap and no modifier keys: it runs a
// `replace` row's action too, and adds or removes the row as Ctrl/Cmd would.
const onPress = (
  index: number,
  { event, pointerType }: { event: MouseEvent; pointerType: string },
) => {
  const item = props.items[index]
  if (isFollowingLink || !item) return

  if (item.disabled) return event.preventDefault()

  const isTouch = pointerType === 'touch' || pointerType === 'pen'
  if (hasPrimaryAction(item) || (isTouch && hasSecondaryAction(item))) {
    return emit('action', item.value)
  }

  event.preventDefault()
  if (!selection.isSelectable.value) return

  selection.select(item.value, isTouch ? { shiftKey: false, ctrlKey: true, metaKey: false } : event)
}

const onActivate = (index: number) => {
  const item = props.items[index]
  if (item && !item.disabled && hasSecondaryAction(item)) runAction(index)
}

const onToggle = (index: number) => {
  const item = props.items[index]
  if (!item) return

  selection.toggle(item.value)
  getRowElement(index)?.focus()
}

const onEnter = (index: number, event: KeyboardEvent) => {
  const item = props.items[index]
  if (!item) return
  if (hasPrimaryAction(item) || hasSecondaryAction(item)) return runAction(index)
  if (selection.isSelectable.value) selection.select(item.value, event)
}

const { onKeydown } = useListViewKeyboard({
  items: () => props.items,
  selection,
  getRoot: () => root.value,
  focusIndex,
  getRowBox,
  onEnter,
})
</script>
