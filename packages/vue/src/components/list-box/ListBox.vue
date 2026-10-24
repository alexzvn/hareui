<template>
  <ListboxRoot
    ref="listboxRoot"
    v-model="selection"
    as-child
    :multiple="multiple"
    :disabled="disabled"
  >
    <ListboxContent
      data-slot="list-box"
      data-layout="stack"
      data-orientation="vertical"
      :data-empty="blocks.length ? undefined : 'true'"
      :aria-multiselectable="multiple ? 'true' : undefined"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
      @keydown.capture="onKeydownCapture"
    >
      <RekaContext />
      <ListboxVirtualizer
        v-if="virtualize"
        v-slot="{ option }"
        :options="flatRows.map((row) => row.item.value)"
        :estimate-size="virtualOptions.estimateSize"
        :overscan="virtualOptions.overscan"
        :text-content="
          (value: ListBoxValue) => {
            const item = rowByValue.get(value)?.item
            return (item?.textValue ?? item?.label ?? String(value)).toLowerCase()
          }
        "
      >
        <ListBoxOption
          v-if="!forwarded.length"
          v-bind="optionProps(rowByValue.get(option as ListBoxValue)!)"
          class="w-full"
          @action="emit('action', option as ListBoxValue)"
          @select="onOptionSelect(rowByValue.get(option as ListBoxValue)!.item, $event)"
        />
        <ListBoxOption
          v-else
          v-bind="optionProps(rowByValue.get(option as ListBoxValue)!)"
          class="w-full"
          @action="emit('action', option as ListBoxValue)"
          @select="onOptionSelect(rowByValue.get(option as ListBoxValue)!.item, $event)"
        >
          <template v-for="name in forwarded" #[name]="state">
            <slot :name="name" v-bind="state as ListBoxItemSlotProps<T>" />
          </template>
        </ListBoxOption>
      </ListboxVirtualizer>
      <template
        v-for="block in virtualize ? [] : blocks"
        :key="block.kind === 'item' ? `i${block.index}` : `b${block.key}`"
      >
        <hr
          v-if="block.kind === 'separator'"
          role="presentation"
          data-slot="separator"
          data-orientation="horizontal"
          :class="ui.separator({ class: props.ui?.separator })"
        />
        <!-- Reka's group always references its label's id; an unlabelled section stays an unnamed group, as in RAC -->
        <component
          :is="sectionLabelled(block.section) ? ListboxGroup : 'section'"
          v-else-if="block.kind === 'section'"
          v-bind="sectionLabelled(block.section) ? { as: 'section' } : { role: 'group' }"
          :class="ui.section({ class: props.ui?.section })"
        >
          <ListboxGroupLabel
            v-if="sectionLabelled(block.section)"
            as="header"
            role="presentation"
            data-slot="header"
            :class="ui.header({ class: props.ui?.header })"
          >
            <slot name="section-label" :section="block.section">
              {{ block.section.label }}
            </slot>
          </ListboxGroupLabel>
          <template v-if="!forwarded.length">
            <ListBoxOption
              v-for="row in block.rows"
              :key="`i${row.index}`"
              v-bind="optionProps(row)"
              @action="emit('action', row.item.value)"
              @select="onOptionSelect(row.item, $event)"
            />
          </template>
          <template v-else>
            <ListBoxOption
              v-for="row in block.rows"
              :key="`i${row.index}`"
              v-bind="optionProps(row)"
              @action="emit('action', row.item.value)"
              @select="onOptionSelect(row.item, $event)"
            >
              <template v-for="name in forwarded" #[name]="state">
                <slot :name="name" v-bind="state as ListBoxItemSlotProps<T>" />
              </template>
            </ListBoxOption>
          </template>
        </component>
        <ListBoxOption
          v-else-if="!forwarded.length"
          v-bind="optionProps(block)"
          @action="emit('action', block.item.value)"
          @select="onOptionSelect(block.item, $event)"
        />
        <ListBoxOption
          v-else
          v-bind="optionProps(block)"
          @action="emit('action', block.item.value)"
          @select="onOptionSelect(block.item, $event)"
        >
          <template v-for="name in forwarded" #[name]="state">
            <slot :name="name" v-bind="state as ListBoxItemSlotProps<T>" />
          </template>
        </ListBoxOption>
      </template>
      <!-- RAC wraps the empty state in an option (a listbox owns only options and groups) -->
      <div v-if="!blocks.length && slots.empty" role="option" style="display: contents">
        <div data-slot="empty-state" :class="ui.emptyState({ class: props.ui?.emptyState })">
          <slot name="empty" />
        </div>
      </div>
      <!-- RAC ListBoxLoadMoreItem: loading row (an unselectable option) + 1px sentinel -->
      <div v-if="loading && slots.loading" role="option" data-slot="list-box-loading">
        <slot name="loading" />
      </div>
      <div
        v-if="loading !== undefined"
        ref="sentinel"
        aria-hidden="true"
        data-slot="list-box-load-more"
        style="position: relative; height: 1px; width: 1px"
      />
    </ListboxContent>
  </ListboxRoot>
</template>

<script lang="ts">
import type { ComponentSlots } from '@/types/tv'

import theme from './theme'

type ListBox = typeof theme

export type ListBoxValue = string | number

export type ListBoxItem = {
  /** Unique value; bound to `v-model` when selected and passed to `action`. */
  value: ListBoxValue
  /** The item label. */
  label?: string
  /** Help text rendered below the label. */
  description?: string
  /** Text used for type-ahead. Defaults to `label`. */
  textValue?: string
  /** Whether the item is disabled. */
  disabled?: boolean
  /**
   * Visual variant of the item.
   * @defaultValue 'default'
   */
  variant?: 'default' | 'danger'
  /** Additional classes merged into the item element. */
  class?: any
}

export type ListBoxSection<T extends ListBoxItem = ListBoxItem> = {
  type: 'section'
  /** Section heading, rendered as a `<header>`. */
  label?: string
  items: T[]
}

export type ListBoxSeparator = {
  type: 'separator'
}

export type ListBoxEntry<T extends ListBoxItem = ListBoxItem> =
  | T
  | ListBoxSection<T>
  | ListBoxSeparator

export type ListBoxProps<T extends ListBoxItem = ListBoxItem> = {
  /**
   * Items, sections (`{ type: 'section', label, items }`) and separators (`{ type: 'separator' }`).
   * Extra fields on the items are kept and typed in the item slots.
   */
  items?: ListBoxEntry<T>[]
  /**
   * How many items can be selected. With `'none'` items only emit `action`.
   * @defaultValue 'single'
   */
  selectionMode?: 'none' | 'single' | 'multiple'
  /** The initial selection when uncontrolled (no `v-model`). */
  defaultValue?: ListBoxValue | ListBoxValue[] | null
  /**
   * Whether to render the checkmark indicator in selectable items.
   * @defaultValue true
   */
  indicator?: boolean
  /**
   * Whether the whole list is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether hovering an option with the mouse focuses it, so the keyboard continues from there (RAC
   * `shouldFocusOnHover`, as in Select's popover).
   * @defaultValue false
   */
  highlightOnHover?: boolean
  /**
   * What Escape does: `'clearSelection'` clears a non-empty selection, `'none'` leaves it (and the key) to the
   * surrounding component, e.g. a popover that closes on Escape.
   * @defaultValue 'clearSelection'
   */
  escapeKeyBehavior?: 'clearSelection' | 'none'
  /**
   * Render only the visible rows (Reka `ListboxVirtualizer`). Needs a scrolling root (e.g. `class="h-[400px] overflow-y-auto"`)
   * and flat `items` (sections and separators are skipped). Pass `{ estimateSize, overscan }` to tune.
   * @defaultValue false
   */
  virtualize?: boolean | { estimateSize?: number; overscan?: number }
  /**
   * Async collections (RAC `ListBoxLoadMoreItem`): when set, a sentinel after the last item emits `load-more`
   * whenever it scrolls into view while `loading` is false; while `loading` is true the `#loading` slot is shown there.
   */
  loading?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ListBox>
}

export type ListBoxItemSlotProps<T extends ListBoxItem = ListBoxItem> = {
  item: T
  index: number
  selected: boolean
  disabled: boolean
}

export type ListBoxSlots<T extends ListBoxItem = ListBoxItem> = {
  /** Whole content of each item. Replaces leading, label, description, trailing and indicator. */
  item?: (props: ListBoxItemSlotProps<T>) => any
  /** Content before the item text (avatar, icon). */
  'item-leading'?: (props: ListBoxItemSlotProps<T>) => any
  /** The label of each item. Replaces `item.label`. */
  'item-label'?: (props: ListBoxItemSlotProps<T>) => any
  /** The description of each item. Replaces `item.description`. */
  'item-description'?: (props: ListBoxItemSlotProps<T>) => any
  /** Content after the item text (shortcut, badge). */
  'item-trailing'?: (props: ListBoxItemSlotProps<T>) => any
  /** Indicator content. Defaults to an animated checkmark. */
  indicator?: (props: ListBoxItemSlotProps<T>) => any
  /** Section heading. Replaces `section.label`. */
  'section-label'?: (props: { section: ListBoxSection<T> }) => any
  /** Rendered when `items` is empty. */
  empty?: () => any
  /** Shown after the last item while `loading` is true (e.g. a Spinner). */
  loading?: () => any
}

export type ListBoxEmits = {
  /** An item was activated (click, Enter or Space) while `selectionMode` is `'none'`. */
  action: [value: ListBoxValue]
  /** The end of the list scrolled into view while `loading` is false. Fetch the next page. */
  loadMore: []
}
</script>

<script setup lang="ts" generic="T extends ListBoxItem = ListBoxItem">
import {
  injectListboxRootContext,
  ListboxContent,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxRoot,
  ListboxVirtualizer,
} from 'reka-ui'
import {
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  provide,
  ref,
  useTemplateRef,
  watch,
} from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { keyboardModalityKey, useKeyboardModality } from '@/composables/useKeyboardModality'
import { useSelectionManager } from '@/composables/useSelectionManager'

import ListBoxOption from './ListBoxOption.vue'
import { useTypeahead } from './useTypeahead'

// `loading: undefined` keeps an absent boolean prop from becoming `false`, so the sentinel only renders for async lists
const props = withDefaults(defineProps<ListBoxProps<T>>(), {
  selectionMode: 'single',
  indicator: true,
  defaultValue: undefined,
  loading: undefined,
  escapeKeyBehavior: 'clearSelection',
})
const emit = defineEmits<ListBoxEmits>()
const slots = defineSlots<ListBoxSlots<T>>()
const modelValue = defineModel<ListBoxValue | ListBoxValue[] | null>()

const ui = useComponentUI('listBox', theme, () => ({}))

// Options read the interaction modality; a standalone ListBox tracks its own (Select provides one from before the open)
if (!inject(keyboardModalityKey, null)) provide(keyboardModalityKey, useKeyboardModality())

// Load-more sentinel: observed against the nearest scroll container (IntersectionObserver clips by ancestors)
const sentinel = useTemplateRef<HTMLElement>('sentinel')
const sentinelVisible = ref(false)
let observer: IntersectionObserver | undefined
watch(sentinel, (el) => {
  observer?.disconnect()
  if (!el) return
  observer = new IntersectionObserver(([entry]) => {
    sentinelVisible.value = !!entry?.isIntersecting
  })
  observer.observe(el)
})
onBeforeUnmount(() => observer?.disconnect())
// Re-check after each page arrives: the sentinel may still be in view
watch([sentinelVisible, () => props.loading, () => props.items?.length], () => {
  if (sentinelVisible.value && props.loading === false) emit('loadMore')
})

// Flat running indices so item slots get a stable `index` across sections
type Row = {
  kind: 'item'
  item: T
  index: number
}
type Block =
  | Row
  | { kind: 'section'; section: ListBoxSection<T>; rows: Row[]; key: number }
  | { kind: 'separator'; key: number }
const blocks = computed<Block[]>(() => {
  let index = 0
  return (props.items ?? []).map((entry, key): Block => {
    if ('type' in entry && entry.type === 'section')
      return {
        kind: 'section',
        section: entry,
        rows: entry.items.map((item) => ({ kind: 'item', item, index: index++ })),
        key,
      }
    if ('type' in entry && entry.type === 'separator') return { kind: 'separator', key }
    return { kind: 'item', item: entry as T, index: index++ }
  })
})

// Virtualized mode renders flat item rows by value
const flatRows = computed(() => blocks.value.filter((b): b is Row => b.kind === 'item'))
const rowByValue = computed(() => new Map(flatRows.value.map((row) => [row.item.value, row])))
const virtualOptions = computed(() =>
  typeof props.virtualize === 'object' ? props.virtualize : {},
)

const selectable = computed(() => props.selectionMode !== 'none')
const multiple = computed(() => props.selectionMode === 'multiple')
// `v-model` wins when bound; otherwise the selection lives here, seeded from `defaultValue`
type Selection = ListBoxValue | ListBoxValue[] | undefined
const uncontrolled = ref<Selection>(props.defaultValue ?? (multiple.value ? [] : undefined))
const selection = computed<Selection>({
  get: () => (modelValue.value !== undefined ? modelValue.value : uncontrolled.value) ?? undefined,
  set: (value) => {
    uncontrolled.value = value
    modelValue.value = value ?? null
  },
})
// O(1) membership per option render (a multiple selection can be large)
const selectedSet = computed(() =>
  Array.isArray(selection.value) ? new Set(selection.value) : undefined,
)
function isSelected(item: ListBoxItem) {
  const current = selection.value
  if (!selectable.value || current == null) return false
  return selectedSet.value ? selectedSet.value.has(item.value) : current === item.value
}

// Item-level slots are forwarded to ListBoxOption. Forwarding makes every option re-render with the list,
// so options render slot-less when there is nothing to forward.
const itemSlots = [
  'item',
  'item-leading',
  'item-label',
  'item-description',
  'item-trailing',
  'indicator',
] as const
const forwarded = computed(() => itemSlots.filter((name) => slots[name]))
const sectionLabelled = (section: ListBoxSection<T>) => !!(section.label || slots['section-label'])

function optionProps(row: Row) {
  return {
    item: row.item,
    index: row.index,
    selected: isSelected(row.item),
    selectable: selectable.value,
    selectionMode: props.selectionMode,
    indicator: props.indicator,
    listDisabled: props.disabled,
    focusOnHover: props.highlightOnHover,
    classes: ui.value,
    ui: props.ui,
  }
}

/* ---------------- Keyboard and selection model (RAC `useSelectableList`) ----------------
 * Reka's listbox has no anchor / Shift ranges, selects all on Meta/Ctrl+A by highlighting the last item,
 * ignores Escape, maps PageUp/PageDown inverted, feeds every key (ArrowDown, Shift…) into its typeahead buffer
 * and selects on Space mid-search. A capture-phase handler on the list takes those keys first; plain
 * arrows, Home/End, Enter and Space stay with Reka.
 */
type RekaListbox = ReturnType<typeof injectListboxRootContext>
let reka: RekaListbox | undefined
// Renderless child: the Reka root context is only injectable below ListboxRoot
const RekaContext = defineComponent({
  setup() {
    reka = injectListboxRootContext()
    return () => null
  },
})

const enabledValue = (value: ListBoxValue) => {
  const item = rowByValue.value.get(value)?.item
  return !!item && !item.disabled && !props.disabled
}
const manager = useSelectionManager<ListBoxValue>({
  mode: () => props.selectionMode,
  keys: () => flatRows.value.map((row) => row.item.value),
  isDisabled: (value) => !enabledValue(value),
  selected: () => {
    const current = selection.value
    return current == null ? [] : Array.isArray(current) ? current : [current]
  },
  setSelected: (values) => {
    markUserAction()
    selection.value = multiple.value ? values : values[0]
  },
  keepOnEscape: () => props.escapeKeyBehavior === 'none',
})

// Reka re-highlights and focuses the first selected option whenever the model changes outside its own
// handlers. Its keyboard handler flags a change as user-made for 1 ms; a modifier-only key does nothing else.
function markUserAction() {
  reka?.onKeydownTypeAhead(new KeyboardEvent('keydown', { key: 'Alt', altKey: true }))
}

type RekaItem = { ref: HTMLElement; value: unknown }
/** The enabled option elements, in DOM order. */
function enabledOptions(items: RekaItem[] = listboxRoot.value?.getItems() ?? []): HTMLElement[] {
  return (reka ? items.map((item) => item.ref) : []).filter((el) => el.dataset.disabled !== '')
}
const valueOf = (el: HTMLElement) =>
  listboxRoot.value?.getItems().find((item) => item.ref === el)?.value as ListBoxValue | undefined

function highlight(el: HTMLElement | undefined) {
  if (el) reka?.changeHighlight(el)
}

// RAC `getKeyPageBelow/Above`: a page is the scroll container's height; an unscrollable list pages to its ends
function scrollParent(el: HTMLElement | null): HTMLElement | undefined {
  for (; el && el !== document.body; el = el.parentElement) {
    const overflow = getComputedStyle(el).overflowY
    if (el.scrollHeight > el.clientHeight && (overflow === 'auto' || overflow === 'scroll'))
      return el
  }
}
function pageTarget(
  options: HTMLElement[],
  from: HTMLElement | undefined,
  list: HTMLElement,
  down: boolean,
) {
  const scroller = scrollParent(list)
  if (!scroller || !from) return down ? options.at(-1) : options[0]
  const page = scroller.clientHeight - from.offsetHeight
  const top = from.getBoundingClientRect().top
  const offset = (el: HTMLElement) => el.getBoundingClientRect().top - top
  return down
    ? options.filter((el) => offset(el) >= 0 && offset(el) <= page).at(-1)
    : options.find((el) => offset(el) <= 0 && -offset(el) <= page)
}

// RAC `useTypeSelect`: searched from the focused option onwards (inclusive); Space continues a non-empty search
// instead of selecting
const typeahead = useTypeahead({ start: 'current', space: true })
function onTypeahead(event: KeyboardEvent, focused: HTMLElement | undefined): boolean {
  const handled = typeahead.onKeydown(
    event,
    () => {
      // One (DOM-querying) `getItems()` per key, not one per option checked
      const items = listboxRoot.value?.getItems() ?? []
      const valueByEl = new Map(items.map((item) => [item.ref, item.value as ListBoxValue]))
      return {
        items: enabledOptions(items),
        text: (el: HTMLElement) => {
          const value = valueByEl.get(el)
          const item = value === undefined ? undefined : rowByValue.value.get(value)?.item
          return (item?.textValue ?? item?.label ?? el.textContent ?? '').trim()
        },
        isCurrent: (el) => el === focused,
      }
    },
    highlight,
  )
  if (handled) {
    event.stopPropagation()
    if (event.key === ' ') event.preventDefault()
  }
  return handled
}

function onKeydownCapture(event: KeyboardEvent) {
  if (!reka || props.disabled || event.isComposing) return
  const list = event.currentTarget as HTMLElement
  const focused = (event.target as Element).closest?.<HTMLElement>('[role=option]') ?? undefined
  // The keyboard continues from the focused option, even after Reka dropped its highlight (pointer leave)
  if (
    !props.virtualize &&
    focused &&
    list.contains(focused) &&
    reka.highlightedElement.value !== focused
  )
    reka.highlightedElement.value = focused
  // Escape clears the selection, Meta/Ctrl+A selects every enabled option and keeps focus
  if (selectable.value && manager.onKeydown(event)) return
  // Reka's virtualizer pages and searches over the unrendered rows itself
  if (props.virtualize) return
  if (onTypeahead(event, focused)) return

  const options = enabledOptions()
  const index = focused ? options.indexOf(focused) : -1
  let target: HTMLElement | undefined
  if (event.key === 'PageDown' || event.key === 'PageUp')
    target = pageTarget(options, focused, list, event.key === 'PageDown')
  else if (event.shiftKey && multiple.value && !event.altKey) {
    if (event.key === 'ArrowDown') target = options[index + 1] ?? focused
    else if (event.key === 'ArrowUp')
      target = index === -1 ? options.at(-1) : (options[index - 1] ?? focused)
    else if (event.key === 'Home') target = options[0]
    else if (event.key === 'End') target = options.at(-1)
  }
  if (!target) return
  event.preventDefault()
  event.stopPropagation()
  highlight(target)
  const value = valueOf(target)
  if (event.shiftKey && multiple.value && value !== undefined)
    manager.extend(value, focused && valueOf(focused))
}

// Shift+click / Shift+Space extend the range from the anchor; any other press toggles through Reka
function onOptionSelect(item: ListBoxItem, event: CustomEvent<{ originalEvent?: Event }>) {
  if (!selectable.value) return
  const original = event.detail?.originalEvent as MouseEvent | KeyboardEvent | undefined
  if (multiple.value && original?.shiftKey) {
    event.preventDefault()
    manager.extend(item.value)
    return
  }
  if (!isSelected(item)) manager.setAnchor(item.value)
}

// Reka highlights the first option on focus entry; RAC focuses the first selected key instead (Select opens this way)
const listboxRoot = useTemplateRef<{
  highlightSelected: () => Promise<void>
  getItems: () => RekaItem[]
}>('listboxRoot')
defineExpose({
  /** Highlight and focus the first selected option, or the first option when nothing is selected. */
  highlightSelected: () => listboxRoot.value?.highlightSelected(),
})
</script>
