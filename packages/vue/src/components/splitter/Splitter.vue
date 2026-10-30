<template>
  <SplitterGroup
    :id="id"
    :as="as"
    :auto-save-id="autoSaveId"
    :class="ui.root()"
    data-slot="splitter"
    :direction="orientation"
    :keyboard-resize-by="keyboardResizeBy"
    :storage="storage"
    @layout="emit('layout', $event)"
  >
    <template v-for="(item, index) in items" :key="item.id ?? index">
      <SplitterPanel
        :id="getPanelId({ item, index })"
        :ref="(el) => setPanelRef(index, el)"
        v-slot="{ isCollapsed, collapse, expand, resize }"
        :class="ui.panel({ override: [item.ui?.panel, item.class] })"
        :collapsed-size="item.collapsedSize"
        :collapsible="item.collapsible"
        data-slot="splitter-panel"
        :default-size="item.defaultSize"
        :max-size="item.maxSize"
        :min-size="item.minSize"
        :order="item.order"
        :size-unit="item.sizeUnit"
        @collapse="emit('collapse', index)"
        @expand="emit('expand', index)"
        @resize="(size, prevSize) => emit('resize', index, size, prevSize)"
      >
        <slot
          :collapse="collapse"
          :collapsed="isCollapsed"
          :expand="expand"
          :index="index"
          :item="item"
          :name="item.slot || `panel-${index}`"
          :resize="resize"
          :ui="ui"
        />
      </SplitterPanel>

      <SplitterResizeHandle
        v-if="index < items.length - 1"
        :id="getHandleId(index)"
        :class="ui.handle()"
        data-slot="splitter-handle"
        :data-type="type"
        :data-variant="variant"
        :disabled="disabled"
        :hit-area-margins="hitAreaMargins"
        @dragging="(dragging) => emit('dragging', index, dragging)"
        @keydown.enter.prevent="onHandleEnter(index)"
      >
        <slot :index="index" name="resize-handle" :ui="ui">
          <span
            v-if="hasIndicator"
            aria-hidden="true"
            :class="ui.indicator()"
            data-slot="splitter-indicator"
          >
            <svg
              v-if="type === 'drag'"
              :class="ui.icon()"
              fill="none"
              height="16"
              role="presentation"
              viewBox="0 0 16 16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                :d="orientation === 'vertical' ? GRIP_HORIZONTAL : GRIP"
                fill="currentColor"
                fill-rule="evenodd"
              />
            </svg>
          </span>
        </slot>
      </SplitterResizeHandle>
    </template>
  </SplitterGroup>
</template>

<script setup lang="ts" generic="T extends SplitterItem = SplitterItem">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import type { ComponentPublicInstance } from 'vue'
import { computed, onBeforeUpdate } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import type {
  SplitterEmits,
  SplitterItem,
  SplitterPanelApi,
  SplitterProps,
  SplitterSlots,
} from './Splitter.types'
import theme from './theme'

type SplitterPanelInstance = InstanceType<typeof SplitterPanel>

// Grip dots: 2×3 across a vertical line, 3×2 across a horizontal one.
const GRIP =
  'M7 3a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0M5.5 9.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m5 0a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m0-5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3M7 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m3.5 1.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3'

const GRIP_HORIZONTAL =
  'M3 9a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m6.5 1.5a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0m0-5a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0m-5 0a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0M13 9a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m1.5-3.5a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0'

const props = withDefaults(defineProps<SplitterProps<T>>(), {
  as: 'div',
  orientation: 'horizontal',
  items: () => [],
  disabled: false,
  keyboardResizeBy: 10,
  type: 'line',
  variant: 'primary',
  indicator: false,
})

const emit = defineEmits<SplitterEmits>()

defineSlots<SplitterSlots<T>>()

const ui = useComponentUI('splitter', {
  theme,
  variantProps: () => ({
    orientation: props.orientation,
    variant: props.variant,
    type: props.type,
  }),
  props,
  classSlot: 'root',
})

const hasIndicator = computed(() => props.type !== 'line' || props.indicator)

// Indexed by item, rebuilt on every render: removing an item would otherwise leave the panel that took its index
// behind as `null`, since the unmounted panel clears its ref after the new one is set.
const panelsRef: SplitterPanelApi[] = []

onBeforeUpdate(() => {
  panelsRef.length = 0
})

const setPanelRef = (index: number, el: Element | ComponentPublicInstance | null) => {
  if (!el) return

  // Typed through the instance so the public shape stays checked against the panel it comes from
  const panel: SplitterPanelApi = el as SplitterPanelInstance
  panelsRef[index] = panel
}

// Panels and handles are matched by id, so they derive from the splitter's id to match between server and client.
const getPanelId = ({ item, index }: { item: T; index: number }) => {
  if (item.id) return item.id

  return props.id ? `${props.id}-panel-${index}` : undefined
}

const getHandleId = (index: number) => (props.id ? `${props.id}-handle-${index}` : undefined)

// Enter toggles the collapsible panel next to the handle: the one before it, else the one after it. The template's
// `.prevent` stops reka's own Enter handling, which would run next and re-expand the panel to its `minSize`.
const onHandleEnter = (index: number) => {
  if (props.disabled) return

  const items = props.items
  const target = items[index]?.collapsible ? index : index + 1
  if (!items[target]?.collapsible) return

  const panel = panelsRef[target]
  if (!panel) return

  if (panel.isCollapsed) {
    panel.expand()
    return
  }

  panel.collapse()
}

defineExpose({
  /** The panel instances by item index: `collapse()`, `expand()`, `resize(size)`, `getSize()`, `isCollapsed`, `isExpanded`. */
  panelsRef,
})
</script>
