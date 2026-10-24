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

  <slot v-if="resizable" name="resize-handle" v-bind="resizeHandleSlotProps">
    <DashboardResizeHandle
      v-bind="resizeHandleSlotProps.attrs"
      :data-dragging="isDragging"
      :class="ui.handle({ class: props.ui?.handle })"
      @pointerdown="onPointerDown"
      @dblclick="onDoubleClick"
      @keydown="onKeyDown"
    />
  </slot>
</template>

<script setup lang="ts">
import { computed, useId, useTemplateRef } from 'vue'

import DashboardResizeHandle from '@/components/dashboard-resize-handle/DashboardResizeHandle.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useDashboard } from '@/composables/useDashboard'
import { useResizable } from '@/composables/useResizable'

import type {
  DashboardPanelProps,
  DashboardPanelResizeHandleSlotProps,
  DashboardPanelSlots,
} from './DashboardPanel.types'
import theme from './theme'

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

const ui = useComponentUI('dashboardPanel', {
  theme,
  variantProps: () => ({ size: !!size.value }),
})

const unit = computed(() => dashboard?.unit ?? '%')

const resizeHandleSlotProps = computed<DashboardPanelResizeHandleSlotProps>(() => ({
  onPointerDown,
  onMouseDown,
  onTouchStart,
  onDoubleClick,
  onKeyDown,
  attrs: { ...handleAttrs.value, 'aria-controls': id, 'aria-label': 'Resize panel' },
  dragging: isDragging.value,
}))
</script>
