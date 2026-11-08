<template>
  <Teleport :to="portalTarget.to" :disabled="portalTarget.disabled">
    <div
      v-if="open"
      :id="listboxId"
      ref="floating"
      role="listbox"
      v-bind="$attrs"
      :class="ui.base()"
      :style="floatingStyles"
      :aria-busy="loading || undefined"
      @mousedown.prevent
    >
      <div :class="ui.viewport()" role="presentation">
        <div v-if="loading" :class="ui.empty()" role="presentation" data-slot="loading">
          <Spinner size="sm" color="current" />
        </div>
        <div v-else-if="!groups.length" :class="ui.empty()" role="presentation" data-slot="empty">
          <slot name="empty" :search-term="searchTerm" />
        </div>
        <template v-for="(group, groupIndex) in loading ? [] : groups" :key="groupIndex">
          <div v-if="groupIndex > 0" :class="ui.separator()" role="separator" />
          <div
            :class="ui.group({ class: group.section?.class })"
            role="group"
            :aria-labelledby="group.section?.label ? `${listboxId}-group-${groupIndex}` : undefined"
          >
            <div
              v-if="group.section?.label"
              :id="`${listboxId}-group-${groupIndex}`"
              :class="ui.label()"
              role="presentation"
            >
              <slot name="section-label" :section="group.section">{{ group.section.label }}</slot>
            </div>
            <div
              v-for="(entry, entryIndex) in group.options"
              :id="entry.index >= 0 ? optionId(entry.index) : undefined"
              :key="entryIndex"
              role="option"
              :aria-selected="entry.index === highlightedIndex"
              :aria-disabled="entry.index < 0 || undefined"
              :data-highlighted="entry.index === highlightedIndex"
              :class="ui.item({ class: entry.item.class })"
              @pointermove="emit('highlight', entry.index)"
              @click="emit('select', entry.index)"
            >
              <slot
                name="item"
                :item="entry.item"
                :highlighted="entry.index === highlightedIndex"
                :disabled="entry.index < 0"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts" generic="T extends EditorMenuItemBase & { class?: ClassValue }">
import { autoUpdate, computePosition } from '@floating-ui/dom'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import type { VNode } from 'vue'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  useTemplateRef,
  watch,
  watchEffect,
} from 'vue'

import Spinner from '@/components/spinner/Spinner.vue'
import { usePortal } from '@/composables/usePortal'
import type { PortalTarget } from '@/config'
import type { ClassValue } from '@/utils/tv'

import type { EditorMenuSection } from './EditorSuggestionMenu.types'
import { floatingMiddleware } from './floating'
import type { EditorMenuGroup, EditorMenuItemBase } from './useEditorMenu'

type MenuSlot = (classes?: { class?: ClassValue }) => string

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    editor: TiptapEditor
    open: boolean
    groups: EditorMenuGroup<T>[]
    highlightedIndex: number
    clientRect: (() => DOMRect | null) | null
    searchTerm: string
    loading?: boolean
    side?: 'top' | 'bottom'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    portal?: PortalTarget
    ui: Record<'base' | 'viewport' | 'group' | 'label' | 'separator' | 'item' | 'empty', MenuSlot>
  }>(),
  // Without it Vue reads a missing `portal` as `false`, as it can be a boolean.
  { portal: undefined, side: 'bottom', align: 'start', sideOffset: 8 },
)

const emit = defineEmits<{
  select: [index: number]
  highlight: [index: number]
}>()

defineSlots<{
  item: (props: { item: T; highlighted: boolean; disabled: boolean }) => VNode[]
  'section-label': (props: { section: EditorMenuSection<T> }) => VNode[]
  empty: (props: { searchTerm: string }) => VNode[]
}>()

const portalTarget = usePortal(() => props.portal)
const floating = useTemplateRef<HTMLElement>('floating')
const position = ref<{ x: number; y: number }>()

const listboxId = `editor-menu-${useId()}`
const optionId = (index: number) => `${listboxId}-option-${index}`

const placement = computed(() =>
  props.align === 'center' ? props.side : (`${props.side}-${props.align}` as const),
)

const floatingStyles = computed(() => ({
  position: 'absolute' as const,
  top: '0',
  left: '0',
  transform: position.value ? `translate(${position.value.x}px, ${position.value.y}px)` : undefined,
  visibility: position.value ? undefined : ('hidden' as const),
}))

watchEffect((onCleanup) => {
  const element = floating.value
  const rect = props.clientRect

  if (!element || !rect) {
    position.value = undefined

    return
  }

  // The trigger's rect is gone for a moment while the plugin redraws its decoration; keep the last one meanwhile.
  let lastRect = new DOMRect()
  const reference = {
    contextElement: props.editor.view.dom,
    getBoundingClientRect: () => {
      lastRect = rect() ?? lastRect

      return lastRect
    },
  }

  const update = async () => {
    const result = await computePosition(reference, element, {
      placement: placement.value,
      middleware: floatingMiddleware({
        placement: placement.value,
        offset: props.sideOffset,
        flip: true,
        shift: true,
      }),
    })

    position.value = { x: Math.round(result.x), y: Math.round(result.y) }
  }

  onCleanup(autoUpdate(reference, element, update))
})

// The editor keeps focus while the menu is open, so it carries the combobox state for screen readers.
const COMBOBOX_ATTRIBUTES = [
  'aria-expanded',
  'aria-controls',
  'aria-activedescendant',
  'aria-autocomplete',
]

const clearComboboxAttributes = () => {
  if (props.editor.isDestroyed) return
  for (const name of COMBOBOX_ATTRIBUTES) props.editor.view.dom.removeAttribute(name)
}

watch(
  () => [props.open, props.highlightedIndex, props.groups, props.loading] as const,
  async ([open]) => {
    if (!open) return clearComboboxAttributes()
    await nextTick()
    if (props.editor.isDestroyed) return

    const dom = props.editor.view.dom
    const active = floating.value?.querySelector(`#${CSS.escape(optionId(props.highlightedIndex))}`)
    dom.setAttribute('aria-expanded', 'true')
    dom.setAttribute('aria-controls', listboxId)
    dom.setAttribute('aria-autocomplete', 'list')
    dom.toggleAttribute('aria-activedescendant', !!active)
    if (active) dom.setAttribute('aria-activedescendant', active.id)
  },
  { immediate: true },
)

onBeforeUnmount(clearComboboxAttributes)

// Arrow keys move the highlight without moving focus, so the highlighted option is scrolled into view by hand. The
// first option of a group brings its heading along.
watch(
  () => props.highlightedIndex,
  async () => {
    await nextTick()
    const option = floating.value?.querySelector<HTMLElement>('[data-highlighted="true"]')
    const group = option?.closest('[role="group"]')
    const target = group?.querySelector('[role="option"]') === option ? group : option

    target?.scrollIntoView({ block: 'nearest' })
  },
)
</script>
