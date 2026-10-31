<template>
  <div data-slot="tag-group" :class="ui.base()">
    <FieldLabel :id="labelId" as="span" />
    <div
      ref="list"
      role="grid"
      data-slot="tag-group-list"
      :aria-multiselectable="selectionMode === 'multiple' ? 'true' : undefined"
      :aria-label="props['aria-label']"
      :aria-labelledby="hasLabel ? labelId : undefined"
      :aria-describedby="describedBy"
      :data-empty="items.length ? undefined : 'true'"
      :tabindex="items.length ? undefined : 0"
      :class="ui.list()"
      @keydown="onListKeydown"
      @focusin="onListFocusIn"
    >
      <!-- Slot-less branch: conditional slot templates make the tags' slots dynamic, re-rendering every tag on each group render -->
      <template v-if="slots.item || slots.removeButton">
        <TagGroupTag
          v-for="(item, index) in items"
          :key="item.id"
          :item="item"
          :index="index"
          :selected="isSelected(item.id)"
          :disabled="isItemDisabled(item)"
          :tabindex="tabindexFor(item)"
          :selection-mode="selectionMode"
          :removable="removable"
          :classes="tagUi"
          @press="onPress(item, $event)"
          @remove="removeOne(item)"
        >
          <template v-if="slots.item" #default="state">
            <slot
              name="item"
              v-bind="state as { item: T; index: number; selected: boolean; disabled: boolean }"
            />
          </template>
          <template v-if="slots.removeButton" #removeButton="state">
            <slot name="removeButton" v-bind="state as { item: T; index: number }" />
          </template>
        </TagGroupTag>
      </template>
      <template v-else>
        <TagGroupTag
          v-for="(item, index) in items"
          :key="item.id"
          :item="item"
          :index="index"
          :selected="isSelected(item.id)"
          :disabled="isItemDisabled(item)"
          :tabindex="tabindexFor(item)"
          :selection-mode="selectionMode"
          :removable="removable"
          :classes="tagUi"
          @press="onPress(item, $event)"
          @remove="removeOne(item)"
        />
      </template>
      <!-- As RAC GridList: the empty state sits in a layout-less row/cell, so the grid keeps its required children -->
      <div v-if="!items.length && $slots.empty" role="row" style="display: contents">
        <div role="gridcell" style="display: contents">
          <slot name="empty" />
        </div>
      </div>
    </div>
    <FieldDescription />
    <FieldError />
  </div>
</template>

<script setup lang="ts" generic="T extends TagGroupItem = TagGroupItem">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useSelectionManager } from '@/composables/useSelectionManager'

import type { TagGroupEmits, TagGroupItem, TagGroupProps, TagGroupSlots } from './TagGroup.types'
import TagGroupTag from './TagGroupTag.vue'
import tagTheme from './tagTheme'
import theme from './theme'

const props = withDefaults(defineProps<TagGroupProps<T>>(), {
  items: () => [],
  selectionMode: 'none',
})

const emit = defineEmits<TagGroupEmits>()
const slots = defineSlots<TagGroupSlots<T>>()

/** The selected tag ids. Bind with `v-model:selected`. */
const selectedModel = defineModel<string[]>('selected')

const ui = useComponentUI('tagGroup', { theme: theme, variantProps: () => ({}), props })

const tagUi = useComponentUI('tag', {
  theme: tagTheme,
  variantProps: () => ({ size: props.size ?? formField.size.value, variant: props.variant }),
  // Each tag's root (`base`) takes `ui.tag`.
  props: {
    get ui() {
      return { base: props.ui?.tag, removeButton: props.ui?.removeButton }
    },
  },
})

const selected = computed(() => selectedModel.value ?? props.defaultSelected ?? [])
const isSelected = (itemId: string) => {
  return selected.value.includes(itemId)
}

const isItemDisabled = (item: TagGroupItem) => {
  return !!(props.disabled || item.disabled || props.disabledKeys?.includes(item.id))
}

// Anchor + Shift ranges, select-all and Escape (RAC `SelectionManager`, toggle behaviour)
const manager = useSelectionManager<string>({
  mode: () => props.selectionMode,
  keys: () => props.items.map((it) => it.id),
  isDisabled: (itemId) => {
    const item = props.items.find((it) => it.id === itemId)

    return !item || isItemDisabled(item)
  },
  selected: () => selected.value,
  setSelected: (ids) => {
    selectedModel.value = ids
  },
})

// Shift+press extends the range from the anchor; other presses toggle (RAC `useSelectableItem`)
const pressItem = (itemId: string, isShiftPress: boolean) => {
  if (isShiftPress && props.selectionMode === 'multiple') {
    manager.extend(itemId)
    return
  }

  manager.toggle(itemId)
}

const onPress = (item: TagGroupItem, event?: MouseEvent | PointerEvent) => {
  pressItem(item.id, !!event?.shiftKey)
}

const removeTags = (item: TagGroupItem, ids: string[]) => {
  restoreFocusAfterRemoval(item)
  emit('remove', ids)
  dropPendingFocus()
}

// Clicking the remove button always removes just that one tag; Delete/Backspace while a tag is
// focused removes the whole selection when that tag is part of it. Matches RAC's `useTag`.
const removeOne = (item: TagGroupItem) => {
  if (isItemDisabled(item)) return

  removeTags(item, [item.id])
}

const removeViaKeyboard = (item: TagGroupItem) => {
  if (isItemDisabled(item)) return

  const ids = isSelected(item.id) ? [...selected.value] : [item.id]
  removeTags(item, ids)
}

// The consumer drops the removed tags from `items`; the focused one unmounts with focus on it. Like RAC's
// collection focus repair, move focus to the next remaining enabled tag, else the previous one, else the list.
const listEl = useTemplateRef<HTMLElement>('list')
let pendingFocus: { items: T[]; index: number } | undefined

const restoreFocusAfterRemoval = (item: TagGroupItem) => {
  if (!listEl.value?.contains(document.activeElement)) return

  const focused = document.activeElement!.closest<HTMLElement>('[data-slot=tag]')
  const focusedIndex = focused ? tagElements().indexOf(focused) : -1
  const removedIndex = props.items.findIndex((it) => it.id === item.id)
  pendingFocus = {
    items: [...props.items],
    index: focusedIndex === -1 ? removedIndex : focusedIndex,
  }
}

// Called after `emit('remove')`, so this tick runs after the re-render of a consumer that removed the tags;
// nothing is left to repair when the consumer kept them
const dropPendingFocus = () => {
  nextTick(() => {
    pendingFocus = undefined
  })
}

const repairFocus = (items: T[], pending: { items: T[]; index: number }) => {
  const isRemaining = (candidate: T) => items.includes(candidate) && !isItemDisabled(candidate)
  const after = pending.items.slice(pending.index + 1).find(isRemaining)
  const before = pending.items.slice(0, pending.index).reverse().find(isRemaining)
  const target = after ?? before

  if (!target) {
    focusedId.value = undefined
    listEl.value?.focus()

    return
  }

  focusedId.value = target.id
  tagElements()[items.indexOf(target)]?.focus()
}

watch(
  () => props.items,
  (items) => {
    const pending = pendingFocus
    pendingFocus = undefined
    if (!pending || listEl.value?.contains(document.activeElement)) return

    repairFocus(items, pending)
  },
  { flush: 'post' },
)

// Reka has no TagGroup/grid primitive, and its RovingFocus collection can't carry a `data-disabled`
// value distinct from its own skip marker, so roving tabindex and arrow-key navigation (which must
// skip disabled tags, matching RAC) are implemented directly here instead.
const focusedId = ref<string>()
const defaultFocusableId = computed(() => props.items.find((it) => !isItemDisabled(it))?.id)

const tabindexFor = (item: TagGroupItem): 0 | -1 => {
  return item.id === (focusedId.value ?? defaultFocusableId.value) ? 0 : -1
}

const tagElements = () => {
  return Array.from(listEl.value?.querySelectorAll<HTMLElement>(':scope > [data-slot=tag]') ?? [])
}

const onListFocusIn = (event: FocusEvent) => {
  const index = tagElements().indexOf(event.target as HTMLElement)
  if (index !== -1) focusedId.value = props.items[index]?.id
}

// Arrow keys move one enabled tag (wrapping); Home/End jump to the first/last enabled one
const arrowSteps = new Map<string, 1 | -1>([
  ['ArrowRight', 1],
  ['ArrowDown', 1],
  ['ArrowLeft', -1],
  ['ArrowUp', -1],
])

const nextEnabledIndex = (key: string, currentIndex: number): number | undefined => {
  const enabledIndices = props.items
    .map((_, i) => i)
    .filter((i) => !isItemDisabled(props.items[i]!))

  if (!enabledIndices.length) return undefined
  if (key === 'Home') return enabledIndices[0]
  if (key === 'End') return enabledIndices.at(-1)

  const step = arrowSteps.get(key)!
  const pos = enabledIndices.indexOf(currentIndex)
  const startPos = pos === -1 ? 0 : pos
  const nextPos = (startPos + step + enabledIndices.length) % enabledIndices.length

  return enabledIndices[nextPos]
}

const onListKeydown = (event: KeyboardEvent) => {
  const tagEls = tagElements()
  const currentIndex = tagEls.indexOf(event.target as HTMLElement)
  const item = props.items[currentIndex]
  if (!item) return

  // Escape clears (RAC `escapeKeyBehavior: 'clearSelection'`), Meta/Ctrl+A selects every enabled tag
  if (manager.onKeydown(event)) return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    pressItem(item.id, event.shiftKey)

    return
  }

  if (props.removable && (event.key === 'Delete' || event.key === 'Backspace')) {
    event.preventDefault()
    removeViaKeyboard(item)

    return
  }

  const isNavigationKey = arrowSteps.has(event.key) || event.key === 'Home' || event.key === 'End'
  if (!isNavigationKey) return

  event.preventDefault()

  const nextIndex = nextEnabledIndex(event.key, currentIndex)
  if (nextIndex === undefined) return

  const next = props.items[nextIndex]!
  focusedId.value = next.id
  tagEls[nextIndex]?.focus()

  // Shift+navigation extends the selection from the anchor; Ctrl+navigation only moves focus
  if (event.shiftKey && props.selectionMode === 'multiple') manager.extend(next.id, item.id)
}

// HeroUI's TagGroup has no validation: its error is the always-mounted `ErrorMessage`, so the chrome gets no `invalid`.
const { labelId, hasLabel, describedBy, formField, FieldLabel, FieldDescription, FieldError } =
  useFieldChrome({
    props,
    slots,
    disabled: () => props.disabled,
    errorPart: 'errorMessage',
  })
</script>
