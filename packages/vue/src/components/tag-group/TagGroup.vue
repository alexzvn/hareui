<script lang="ts">
import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import tagTheme from './tagTheme'
import theme from './theme'

type TagGroup = typeof theme
type Tag = typeof tagTheme

export interface TagGroupItem {
  /** Unique identifier. Selected via `v-model:selected`, removed via the `remove` event. */
  id: string
  /** The tag label. */
  label?: string
  /** Whether this tag is disabled. */
  disabled?: boolean
}

export interface TagGroupProps<T extends TagGroupItem = TagGroupItem> {
  /** The tags to render. */
  items?: T[]
  /**
   * The type of selection allowed.
   * @defaultValue 'none'
   */
  selectionMode?: 'none' | 'single' | 'multiple'
  /**
   * The ids selected initially when uncontrolled.
   * @defaultValue []
   */
  defaultSelected?: string[]
  /** Ids of tags that are disabled, in addition to each item's own `disabled`. */
  disabledKeys?: string[]
  /**
   * Whether tags show a remove button and can be removed by pressing it, or Delete / Backspace
   * while the tag is focused.
   * @defaultValue false
   */
  removable?: boolean
  /**
   * Size of the tags.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Tag>['size']
  /**
   * Visual style of the tags.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<Tag>['variant']
  /** The group label. */
  label?: string
  /** Help text rendered below the tags. */
  description?: string
  /**
   * Error message rendered below the description. Rendered whenever this is given (even `''`) or
   * `#errorMessage` is, matching HeroUI's always-mounted `<ErrorMessage>`.
   */
  errorMessage?: string
  /**
   * Whether the whole group is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** Accessible name of the tag list, required when `label` / `#label` is omitted. */
  'aria-label'?: string
  /** Base id of the group; label/description/error ids derive from it. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. `tag` and `removeButton` are the `tag` theme's slots. */
  ui?: ComponentSlots<TagGroup> & { tag?: any, removeButton?: any }
}

export interface TagGroupSlots<T extends TagGroupItem = TagGroupItem> {
  /** The group label content. Replaces the `label` prop. */
  'label'?: () => any
  /** The group description content. Replaces the `description` prop. */
  'description'?: () => any
  /** The error content. Replaces the `errorMessage` prop. Rendered whenever either is given. */
  'errorMessage'?: () => any
  /** Content of each tag. Replaces `item.label`. */
  'item'?: (props: { item: T, index: number, selected: boolean, disabled: boolean }) => any
  /** Content of each tag's remove button (shown when `removable`). Replaces the default close icon. */
  'removeButton'?: (props: { item: T, index: number }) => any
  /**
   * Content rendered inside the list when `items` is empty (HeroUI's `renderEmptyState`), usually an
   * `<EmptyState>`. Nothing is rendered when omitted.
   */
  'empty'?: () => any
}

export interface TagGroupEmits {
  /** Emitted with the removed ids, via the remove button or Delete / Backspace. */
  remove: [ids: string[]]
}
</script>

<script setup lang="ts" generic="T extends TagGroupItem = TagGroupItem">
import { computed, ref, useId } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import Description from '../description/Description.vue'
import ErrorMessage from '../error-message/ErrorMessage.vue'
import Label from '../label/Label.vue'
import TagGroupTag from './TagGroupTag.vue'

const props = withDefaults(defineProps<TagGroupProps<T>>(), { items: () => [], selectionMode: 'none' })
const emit = defineEmits<TagGroupEmits>()
const slots = defineSlots<TagGroupSlots<T>>()
/** The selected tag ids. Bind with `v-model:selected`. */
const selectedModel = defineModel<string[]>('selected')

const ui = useComponentUI('tagGroup', theme, () => ({}))
const tagUi = useComponentUI('tag', tagTheme, () => ({ size: props.size, variant: props.variant }))

const autoId = useId()
const id = computed(() => props.id ?? autoId)
const labelId = computed(() => `${id.value}-label`)
const descriptionId = computed(() => `${id.value}-description`)
const errorId = computed(() => `${id.value}-error`)

const selected = computed(() => selectedModel.value ?? props.defaultSelected ?? [])
function isSelected(itemId: string) {
  return selected.value.includes(itemId)
}
function isItemDisabled(item: TagGroupItem) {
  return !!(props.disabled || item.disabled || props.disabledKeys?.includes(item.id))
}

function toggle(item: TagGroupItem) {
  if (isItemDisabled(item) || props.selectionMode === 'none')
    return
  const already = isSelected(item.id)
  if (props.selectionMode === 'single')
    selectedModel.value = already ? [] : [item.id]
  else
    selectedModel.value = already ? selected.value.filter(i => i !== item.id) : [...selected.value, item.id]
}

// Clicking the remove button always removes just that one tag; Delete/Backspace while a tag is
// focused removes the whole selection when that tag is part of it. Matches RAC's `useTag`.
function removeOne(item: TagGroupItem) {
  if (isItemDisabled(item))
    return
  emit('remove', [item.id])
}
function removeViaKeyboard(item: TagGroupItem) {
  if (isItemDisabled(item))
    return
  emit('remove', isSelected(item.id) ? [...selected.value] : [item.id])
}

// Reka has no TagGroup/grid primitive, and its RovingFocus collection can't carry a `data-disabled`
// value distinct from its own skip marker, so roving tabindex and arrow-key navigation (which must
// skip disabled tags, matching RAC) are implemented directly here instead.
const focusedId = ref<string>()
const defaultFocusableId = computed(() => props.items.find(it => !isItemDisabled(it))?.id)
function tabindexFor(item: TagGroupItem): 0 | -1 {
  return item.id === (focusedId.value ?? defaultFocusableId.value) ? 0 : -1
}
function onListFocusIn(event: FocusEvent) {
  const list = event.currentTarget as HTMLElement
  const tagEls = Array.from(list.querySelectorAll<HTMLElement>(':scope > [data-slot=tag]'))
  const index = tagEls.indexOf(event.target as HTMLElement)
  if (index !== -1)
    focusedId.value = props.items[index]?.id
}

function onListKeydown(event: KeyboardEvent) {
  const list = event.currentTarget as HTMLElement
  const tagEls = Array.from(list.querySelectorAll<HTMLElement>(':scope > [data-slot=tag]'))
  const currentIndex = tagEls.indexOf(event.target as HTMLElement)
  const item = props.items[currentIndex]
  if (!item)
    return

  // Matches RAC's `escapeKeyBehavior: 'clearSelection'` default.
  if (event.key === 'Escape') {
    if (props.selectionMode !== 'none' && selected.value.length > 0) {
      event.preventDefault()
      selectedModel.value = []
    }
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggle(item)
    return
  }
  if (props.removable && (event.key === 'Delete' || event.key === 'Backspace')) {
    event.preventDefault()
    removeViaKeyboard(item)
    return
  }

  const step = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    ? 1
    : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : undefined
  const edge = event.key === 'Home' ? 'first' : event.key === 'End' ? 'last' : undefined
  if (step === undefined && edge === undefined)
    return
  event.preventDefault()
  const enabledIndices = props.items.map((_, i) => i).filter(i => !isItemDisabled(props.items[i]!))
  if (!enabledIndices.length)
    return
  let nextIndex: number
  if (edge === 'first')
    nextIndex = enabledIndices[0]!
  else if (edge === 'last')
    nextIndex = enabledIndices.at(-1)!
  else {
    const pos = enabledIndices.indexOf(currentIndex)
    const nextPos = ((pos === -1 ? 0 : pos) + step! + enabledIndices.length) % enabledIndices.length
    nextIndex = enabledIndices[nextPos]!
  }
  focusedId.value = props.items[nextIndex]!.id
  tagEls[nextIndex]?.focus()
}

const hasLabel = computed(() => !!(props.label || slots.label))
const hasDescription = computed(() => !!(props.description || slots.description))
const hasError = computed(() => props.errorMessage !== undefined || !!slots.errorMessage)
const describedBy = computed(() => [hasDescription.value && descriptionId.value, hasError.value && errorId.value].filter(Boolean).join(' ') || undefined)
</script>

<template>
  <div
    data-slot="tag-group"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <Label v-if="hasLabel" :id="labelId" as="span" :disabled="disabled">
      <slot name="label">{{ label }}</slot>
    </Label>
    <div
      role="grid"
      data-slot="tag-group-list"
      :aria-multiselectable="selectionMode === 'multiple' ? 'true' : undefined"
      :aria-label="props['aria-label']"
      :aria-labelledby="hasLabel ? labelId : undefined"
      :aria-describedby="describedBy"
      :data-empty="items.length ? undefined : 'true'"
      :class="ui.list({ class: props.ui?.list })"
      @keydown="onListKeydown"
      @focusin="onListFocusIn"
    >
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
        :ui="props.ui"
        @toggle="toggle(item)"
        @remove="removeOne(item)"
      >
        <template v-if="slots.item" #default="state">
          <slot name="item" v-bind="state as { item: T, index: number, selected: boolean, disabled: boolean }" />
        </template>
        <template v-if="slots.removeButton" #removeButton="state">
          <slot name="removeButton" v-bind="state as { item: T, index: number }" />
        </template>
      </TagGroupTag>
      <slot v-if="!items.length" name="empty" />
    </div>
    <Description v-if="hasDescription" :id="descriptionId">
      <slot name="description">{{ description }}</slot>
    </Description>
    <ErrorMessage v-if="hasError" :id="errorId">
      <slot name="errorMessage">{{ errorMessage }}</slot>
    </ErrorMessage>
  </div>
</template>
