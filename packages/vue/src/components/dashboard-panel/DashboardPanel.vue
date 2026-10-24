<template>
  <div
    :id="id"
    ref="el"
    data-slot="dashboard-panel"
    v-bind="$attrs"
    :data-dragging="isDragging"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="size ? { '--width': `${size}${unit}` } : undefined"
  >
    <slot>
      <slot name="header" />

      <div data-slot="dashboard-panel-body" :class="ui.body({ class: props.ui?.body })">
        <slot name="body" />
      </div>

      <slot name="footer" />
    </slot>
  </div>

  <slot v-if="resizable" name="resize-handle" v-bind="handleSlotProps">
    <DashboardResizeHandle
      v-bind="handleSlotProps.attrs"
      :data-dragging="isDragging"
      :class="ui.handle({ class: props.ui?.handle })"
      @pointerdown="onPointerDown"
      @dblclick="onDoubleClick"
      @keydown="onKeyDown"
    />
  </slot>
</template>

<script lang="ts">
import type { ComponentSlots } from '../../types/tv'
import theme from './theme'

type DashboardPanel = typeof theme

export interface DashboardPanelProps {
  /**
   * Identifies the panel in the storage (`${storageKey}-panel-${id}`) and as its element id. Set it when several panels live in different pages.
   * @defaultValue useId()
   */
  id?: string
  /**
   * The minimum size of the panel, in the group's `unit`.
   * @defaultValue 15
   */
  minSize?: number
  /**
   * The maximum size of the panel, in the group's `unit`.
   * @defaultValue 100
   */
  maxSize?: number
  /**
   * The initial size of the panel, in the group's `unit`. Without it (or while `0`) the panel fills the remaining space.
   * @defaultValue 0
   */
  defaultSize?: number
  /**
   * Whether the panel can be resized with a drag handle on its end edge.
   * @defaultValue false
   */
  resizable?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DashboardPanel>
}

export interface DashboardPanelResizeHandleSlotProps {
  onPointerDown: (e: PointerEvent) => void
  onMouseDown: (e: MouseEvent) => void
  onTouchStart: (e: TouchEvent) => void
  onDoubleClick: (e: MouseEvent) => void
  onKeyDown: (e: KeyboardEvent) => void
  /** `aria-valuenow`/`min`/`max` and `tabindex` for a `role="separator"` handle. */
  attrs: Record<string, unknown>
  /** Whether the panel is being dragged. */
  dragging: boolean
}

export interface DashboardPanelSlots {
  /** Replaces the header, body and footer (use it when you don't want a scrollable, padded body). */
  default?: () => any
  /** Rendered above the body, e.g. a navbar. */
  header?: () => any
  /** The scrollable, padded body. */
  body?: () => any
  /** Rendered below the body. */
  footer?: () => any
  /** Replaces the resize handle. Rendered only when `resizable`. */
  'resize-handle'?: (props: DashboardPanelResizeHandleSlotProps) => any
}
</script>

<script setup lang="ts">
import { computed, useId, useTemplateRef } from 'vue'

import { useComponentUI } from '../../composables/useComponentUI'
import { useDashboard } from '../../composables/useDashboard'
import { useResizable } from '../../composables/useResizable'
import DashboardResizeHandle from '../dashboard-resize-handle/DashboardResizeHandle.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DashboardPanelProps>(), {
  minSize: 15,
  maxSize: 100,
  defaultSize: 0,
  resizable: false,
})
defineSlots<DashboardPanelSlots>()

const dashboard = useDashboard()
const fallbackId = useId()
const id = `${dashboard?.storageKey ?? 'dashboard'}-panel-${props.id ?? fallbackId}`

const el = useTemplateRef<HTMLElement>('el')
const {
  size,
  isDragging,
  onPointerDown,
  onMouseDown,
  onTouchStart,
  onDoubleClick,
  onKeyDown,
  handleAttrs,
} = useResizable({
  key: id,
  options: () => ({
    side: 'left',
    minSize: props.minSize,
    maxSize: props.maxSize,
    defaultSize: props.defaultSize,
    resizable: props.resizable,
    storage: dashboard?.storage,
    persistent: dashboard?.persistent,
    unit: dashboard?.unit,
  }),
  element: el,
})

const ui = useComponentUI('dashboardPanel', theme, () => ({ size: !!size.value }))

const unit = computed(() => dashboard?.unit ?? '%')
const handleSlotProps = computed<DashboardPanelResizeHandleSlotProps>(() => ({
  onPointerDown,
  onMouseDown,
  onTouchStart,
  onDoubleClick,
  onKeyDown,
  attrs: { ...handleAttrs.value, 'aria-controls': id, 'aria-label': 'Resize panel' },
  dragging: isDragging.value,
}))
</script>
