<template>
  <Handle v-if="side === 'right'" />

  <aside
    :id="id"
    ref="el"
    data-slot="dashboard-sidebar"
    v-bind="$attrs"
    :data-side="side"
    :data-collapsed="isCollapsed"
    :data-dragging="isDragging"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="{ '--width': `${size || 0}${unit}` }"
  >
    <div
      v-if="!!slots.header"
      data-slot="dashboard-sidebar-header"
      :class="ui.header({ class: props.ui?.header })"
    >
      <slot name="header" :collapsed="isCollapsed" :collapse="collapse" />
    </div>

    <div data-slot="dashboard-sidebar-body" :class="ui.body({ class: props.ui?.body })">
      <slot :collapsed="isCollapsed" :collapse="collapse" />
    </div>

    <div
      v-if="!!slots.footer"
      data-slot="dashboard-sidebar-footer"
      :class="ui.footer({ class: props.ui?.footer })"
    >
      <slot name="footer" :collapsed="isCollapsed" :collapse="collapse" />
    </div>
  </aside>

  <Handle v-if="side === 'left'" />

  <component :is="Menu" v-model:open="open" v-bind="menuProps" :ui="menuClasses">
    <template #content="{ close }">
      <div :id="menuId" data-slot="dashboard-sidebar-menu" class="contents">
        <slot name="content" :close="close">
          <VisuallyHidden as-child>
            <DialogTitle>{{ menuTitle }}</DialogTitle>
          </VisuallyHidden>

          <div
            v-if="mode === 'drawer'"
            aria-hidden="true"
            data-slot="drawer-handle"
            class="flex items-center justify-center pt-2 pb-1"
          >
            <div class="h-1 w-9 rounded-xs bg-separator" />
          </div>

          <div class="contents" @click="onMenuClick">
            <div
              v-if="!!slots.header || mode !== 'drawer'"
              data-slot="dashboard-sidebar-header"
              :class="ui.header({ class: props.ui?.header })"
            >
              <Toggle v-if="mode !== 'drawer' && toggleSide === 'left'" />

              <slot name="header" :collapsed="false" :collapse="() => {}" />

              <Toggle v-if="mode !== 'drawer' && toggleSide === 'right'" />
            </div>

            <div data-slot="dashboard-sidebar-body" :class="ui.body({ class: props.ui?.body })">
              <slot :collapsed="false" :collapse="() => {}" />
            </div>

            <div
              v-if="!!slots.footer"
              data-slot="dashboard-sidebar-footer"
              :class="ui.footer({ class: props.ui?.footer })"
            >
              <slot name="footer" :collapsed="false" :collapse="() => {}" />
            </div>
          </div>
        </slot>
      </div>
    </template>
  </component>
</template>

<script setup lang="ts">
import { DialogTitle, VisuallyHidden } from 'reka-ui'
import type { FunctionalComponent } from 'vue'
import { computed, h, onBeforeUnmount, ref, useId, useTemplateRef, watch } from 'vue'

import Button from '@/components/button/Button.vue'
import DashboardResizeHandle from '@/components/dashboard-resize-handle/DashboardResizeHandle.vue'
import Drawer from '@/components/drawer/Drawer.vue'
import Modal from '@/components/modal/Modal.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { createDashboardSidebarState, useDashboard } from '@/composables/useDashboard'
import { useResizable } from '@/composables/useResizable'
import type { ClassValue } from '@/utils/tv'

import type {
  DashboardSidebarMode,
  DashboardSidebarProps,
  DashboardSidebarResizeHandleSlotProps,
  DashboardSidebarSlots,
} from './DashboardSidebar.types'
import theme from './theme'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DashboardSidebarProps>(), {
  side: 'left',
  mode: 'slideover',
  autoClose: true,
  toggle: true,
  toggleSide: 'right',
  minSize: 10,
  maxSize: 20,
  defaultSize: 15,
  resizable: false,
  collapsible: false,
  collapsedSize: 0,
})

const slots = defineSlots<DashboardSidebarSlots>()

const open = defineModel<boolean>('open', { default: false })
const collapsedModel = defineModel<boolean>('collapsed', { default: false })

const dashboard = useDashboard()

// Outside a `DashboardGroup` the sidebar keeps its own (unshared) state.
const standalone = createDashboardSidebarState()
const state = computed(() => dashboard?.sidebars[props.side] ?? standalone)

const fallbackId = useId()
const id = `${dashboard?.storageKey ?? 'dashboard'}-sidebar-${props.id ?? fallbackId}`

// The menu content wrapper, referenced by the toggle's `aria-controls` while the menu is open.
const menuId = `${id}-menu`

// The toggle and collapse buttons point their `aria-controls` at the sidebar through the shared state.
watch(
  state,
  (current, previous) => {
    if (previous?.id.value === id) previous.id.value = undefined
    current.id.value = id
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (state.value.id.value === id) state.value.id.value = undefined
})

const el = useTemplateRef<HTMLElement>('el')
const {
  size,
  isDragging,
  isCollapsed,
  collapse,
  onPointerDown,
  onMouseDown,
  onTouchStart,
  onDoubleClick,
  onKeyDown,
  handleAttrs,
} = useResizable({
  key: id,
  options: () => ({
    side: props.side,
    minSize: props.minSize,
    maxSize: props.maxSize,
    defaultSize: props.defaultSize,
    resizable: props.resizable,
    collapsible: props.collapsible,
    collapsedSize: props.collapsedSize,
    storage: dashboard?.storage,
    persistent: dashboard?.persistent,
    unit: dashboard?.unit,
  }),
  element: el,
  initialCollapsed: collapsedModel.value,
})

const unit = computed(() => dashboard?.unit ?? '%')

// `v-model:open` <-> group context (the context toggles/collapses drive the sidebar from anywhere in the group).
watch(
  open,
  (value) => {
    state.value.open.value = value
  },
  { immediate: true },
)

watch(
  () => state.value.open.value,
  (value) => {
    open.value = value
  },
)

// `isCollapsed` is the source of truth (it applies `collapsible` and the persisted value); the models follow it and feed back through `collapse`.
watch(
  isCollapsed,
  (value) => {
    collapsedModel.value = value
    state.value.collapsed.value = value
  },
  { immediate: true },
)

watch(collapsedModel, (value) => collapse(value))

watch(
  () => state.value.collapsed.value,
  (value) => collapse(value),
)

const ui = useComponentUI('dashboardSidebar', {
  theme,
  variantProps: () => ({
    side: props.side,
    toggleSide: props.toggleSide,
    mode: props.mode,
  }),
})

const menuTitle = computed(() => (props.menu as { title?: string } | undefined)?.title ?? 'Sidebar')

const Menu = computed(() => (props.mode === 'modal' ? Modal : Drawer))

const menuProps = computed(() => {
  const { title: _title, ui: _ui, ...rest } = (props.menu ?? {}) as Record<string, unknown>

  const defaultsByMode = {
    modal: { size: 'full' },
    slideover: { placement: props.side, variant: 'blur' },
    drawer: { placement: 'bottom', variant: 'blur' },
  } satisfies Record<DashboardSidebarMode, Record<string, unknown>>

  const defaults: Record<string, unknown> = defaultsByMode[props.mode]

  return { ...defaults, ...rest }
})

// The user's `menu.ui` is forwarded as is; `backdrop` / `dialog` are merged with the sidebar's `overlay` / `content` slots.
const menuClasses = computed(() => {
  const user: Partial<Record<string, ClassValue>> = props.menu?.ui ?? {}
  return {
    ...user,
    backdrop: [ui.value.overlay({ class: props.ui?.overlay }), user.backdrop],
    dialog: ['p-0 gap-0', ui.value.content({ class: props.ui?.content }), user.dialog],
  }
})

const toggleOpen = () => {
  open.value = !open.value
}

// The sheet slides in under a pointer that hasn't moved since it clicked the trigger, and a right sheet's close
// button lands right where the navbar's toggle was. Its hover fill waits for the pointer to move over it, so the
// sheet doesn't open with a grey circle that reads as focus.
const isToggleIdle = ref(false)
watch(open, (value) => {
  if (value) isToggleIdle.value = true
})

const onMenuClick = (event: MouseEvent) => {
  if (props.autoClose && (event.target as Element | null)?.closest?.('a[href]')) open.value = false
}

const resizeHandleSlotProps = computed<DashboardSidebarResizeHandleSlotProps>(() => ({
  onPointerDown,
  onMouseDown,
  onTouchStart,
  onDoubleClick,
  onKeyDown,
  attrs: { ...handleAttrs.value, 'aria-controls': id, 'aria-label': 'Resize sidebar' },
  dragging: isDragging.value,
  ui: ui.value,
}))

// Pieces rendered in more than one place, hence functional components rather than template duplication.
const Handle: FunctionalComponent = () => {
  if (!props.resizable) return null
  if (slots['resize-handle']) return slots['resize-handle'](resizeHandleSlotProps.value)

  return h(DashboardResizeHandle, {
    ...resizeHandleSlotProps.value.attrs,
    'data-dragging': isDragging.value,
    'data-side': props.side,
    class: ui.value.handle({ class: props.ui?.handle }),
    onPointerdown: onPointerDown,
    onDblclick: onDoubleClick,
    onKeydown: onKeyDown,
  })
}

const Toggle: FunctionalComponent = () => {
  const slotProps = { open: open.value, toggle: toggleOpen, ui: ui.value }
  if (slots.toggle) return slots.toggle(slotProps)
  if (!props.toggle) return null
  const custom = typeof props.toggle === 'object' ? props.toggle : {}

  return h(
    Button,
    {
      variant: 'ghost',
      size: 'sm',
      iconOnly: true,
      'aria-label': 'Close sidebar',
      ...custom,
      'data-slot': 'dashboard-sidebar-toggle',
      'data-idle': isToggleIdle.value || undefined,
      class: ui.value.toggle({ class: [props.ui?.toggle, custom.class] }),
      onClick: toggleOpen,
      onPointermove: () => {
        isToggleIdle.value = false
      },
    },
    () =>
      h(
        'svg',
        {
          'aria-hidden': 'true',
          viewBox: '0 0 16 16',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 1.5,
          'stroke-linecap': 'round',
        },
        [h('path', { d: 'M4 4l8 8M12 4l-8 8' })],
      ),
  )
}
</script>
