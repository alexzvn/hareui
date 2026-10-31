<template>
  <LinkResolver v-slot="link" :link="item" :button="!isLink" fallback="div">
    <div
      role="row"
      data-slot="list-view-item"
      :data-index="index"
      :data-href="link.attrs.href"
      :aria-rowindex="rowIndex"
      :aria-label="item.label"
      :aria-selected="hasCheckbox && !item.disabled ? (selected ? 'true' : 'false') : undefined"
      :aria-disabled="item.disabled ? 'true' : undefined"
      :data-selected="selected ? 'true' : undefined"
      :data-disabled="item.disabled ? 'true' : undefined"
      :data-first="index === 0 ? 'true' : undefined"
      :data-last="isLast ? 'true' : undefined"
      :data-selection-mode="hasCheckbox ? selectionMode : undefined"
      :tabindex="item.disabled ? undefined : tabindex"
      :class="ui.item({ override: item.class })"
      @pointerdown="onPointerdown"
      @click="onClick($event, link.attrs)"
      @dblclick="onDblclick"
    >
      <div role="gridcell" aria-colindex="1" style="display: contents">
        <div v-if="hasCheckbox" data-slot="list-view-selection-cell" :class="ui.selectionCell()">
          <Checkbox
            :model-value="selected"
            :disabled="item.disabled"
            :variant="checkboxVariant"
            :aria-label="t('listView.select', { label: item.label })"
            tabindex="-1"
            @update:model-value="emit('toggle')"
          />
        </div>
        <div data-slot="list-view-item-content" :class="ui.content()">
          <component :is="getSlot()" v-if="getSlot()" v-bind="scope" />
          <template v-else>
            <component :is="getSlot('leading')" v-if="getSlot('leading')" v-bind="scope" />
            <IconRenderer
              v-else-if="item.icon"
              :icon="item.icon"
              data-slot="list-view-item-icon"
              :class="ui.icon()"
            />
            <div data-slot="list-view-item-text" :class="ui.text()">
              <span data-slot="list-view-item-label" :class="ui.label()">
                <component :is="getSlot('label')" v-if="getSlot('label')" v-bind="scope" />
                <template v-else>{{ item.label }}</template>
              </span>
              <span
                v-if="item.description || getSlot('description')"
                data-slot="list-view-item-description"
                :class="ui.description()"
              >
                <component
                  :is="getSlot('description')"
                  v-if="getSlot('description')"
                  v-bind="scope"
                />
                <template v-else>{{ item.description }}</template>
              </span>
            </div>
          </template>
        </div>
        <div v-if="getSlot('action')" data-slot="list-view-item-action" :class="ui.action()">
          <component :is="getSlot('action')" v-bind="scope" />
        </div>
      </div>
    </div>
  </LinkResolver>
</template>

<script setup lang="ts">
// Internal: one row of a ListView. The row is the focusable `row`; a single `gridcell` (`display: contents`) holds
// the checkbox, the content and the action slot, as in RAC's GridList. A link row stays a `div` (an `a` can't be a
// `row`) and opens its link like RAC's `openLink`: through the router when it handles the link, else by clicking a
// detached anchor with the same `href`, `target`, `rel` and `download`, so the browser applies its usual rules.
import type { VNode } from 'vue'
import { computed } from 'vue'

import Checkbox from '@/components/checkbox/Checkbox.vue'
import { useLocale } from '@/composables/useLocale'
import { IconRenderer } from '@/utils/icon'
import { LinkResolver } from '@/utils/link'
import { resolveSlotName } from '@/utils/slotName'

import type { ListViewItem, ListViewItemSlotProps, ListViewUI } from './ListView.types'
import type { ListViewSelectionMode } from './useListViewSelection'

const props = defineProps<{
  item: ListViewItem
  index: number
  selected: boolean
  /** Whether the row is the list's tab stop. */
  focusable: boolean
  /** Whether the item has `to` or `href`. */
  isLink: boolean
  isLast: boolean
  /** Derived from the list's `selectable` and `multiple`. */
  selectionMode: ListViewSelectionMode
  checkboxVariant: 'primary' | 'secondary'
  /** 1-based `aria-rowindex`, set when virtualized (only some rows are in the DOM). */
  rowIndex?: number
  ui: ListViewUI
  slots: Record<string, ((props: ListViewItemSlotProps) => VNode[]) | undefined>
}>()

const emit = defineEmits<{
  /**
   * The row was clicked with a mouse, touch or pen (the pointer that last went down on it); `preventDefault()` keeps
   * a link row from opening its link.
   */
  press: [event: MouseEvent, pointerType: string]
  /** The row was double-clicked with a mouse. */
  activate: []
  /** The checkbox was toggled. */
  toggle: []
}>()

const { t } = useLocale()

const hasCheckbox = computed(() => props.selectionMode !== 'none')
const tabindex = computed(() => (props.focusable ? 0 : -1))

const scope = computed<ListViewItemSlotProps>(() => ({
  item: props.item,
  index: props.index,
  selected: props.selected,
  disabled: !!props.item.disabled,
  ui: props.ui,
}))

// `#item`, `#item-leading`, … or, for an item with a `slot` field, `#{slot}`, `#{slot}-leading`, …
const getSlot = (part?: 'leading' | 'label' | 'description' | 'action') =>
  props.slots[resolveSlotName({ slot: props.item.slot, suffix: part })]

// The selection cell belongs to its checkbox: a click on the checkbox's padding is forwarded to it
const INTERACTIVE = [
  'a[href], button, input, select, textarea',
  '[role=button], [role=checkbox], [role=switch], [role=menuitem]',
  '[data-slot=list-view-selection-cell]',
].join(', ')

// A click on a control in the row (the checkbox, the action slot) belongs to that control
const isFromControl = (event: MouseEvent) => {
  const row = event.currentTarget as HTMLElement
  const control = (event.target as Element).closest(INTERACTIVE)

  return !!control && control !== row && row.contains(control)
}

const openAnchor = (event: MouseEvent, attrs: Record<string, unknown>) => {
  const anchor = document.createElement('a')
  anchor.href = String(attrs.href)
  if (typeof attrs.target === 'string') anchor.target = attrs.target
  if (typeof attrs.rel === 'string') anchor.rel = attrs.rel

  if (attrs.download !== undefined && attrs.download !== false) {
    anchor.download = attrs.download === true ? '' : String(attrs.download)
  }

  const { ctrlKey, metaKey, shiftKey, altKey } = event

  anchor.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ctrlKey,
      metaKey,
      shiftKey,
      altKey,
    }),
  )
}

// The router navigates a plain press; a modified one (new tab or window) goes to the browser, as on an anchor
const followLink = (event: MouseEvent, attrs: Record<string, unknown>) => {
  const navigate = attrs.onClick as ((event: MouseEvent) => void) | undefined
  const isModified = event.ctrlKey || event.metaKey || event.shiftKey || event.altKey
  if (navigate && !isModified) return navigate(event)
  if (typeof attrs.href === 'string') openAnchor(event, attrs)
}

// A click carries no reliable pointer type, so it is read from the `pointerdown` that started it
let pointerType = 'mouse'

const onPointerdown = (event: PointerEvent) => {
  pointerType = event.pointerType || 'mouse'
}

// A double tap is two taps, each already handled as a press
const onDblclick = () => {
  if (pointerType === 'mouse') emit('activate')
}

const onClick = (event: MouseEvent, linkAttrs: Record<string, unknown>) => {
  if (isFromControl(event)) return

  emit('press', event, pointerType)
  if (event.defaultPrevented || !props.isLink) return

  followLink(event, linkAttrs)
}
</script>
