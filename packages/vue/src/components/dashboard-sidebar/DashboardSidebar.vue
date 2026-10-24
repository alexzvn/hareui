<script lang="ts">
import type { ButtonProps } from '../button/Button.vue'
import type { DrawerProps } from '../drawer/Drawer.vue'
import type { ModalProps } from '../modal/Modal.vue'
import type { ComponentSlots, ComponentUI } from '../../types/tv'
import theme from './theme'

type DashboardSidebar = typeof theme

/** How the sidebar opens below the `md` breakpoint: a side sheet (`slideover`), a bottom sheet (`drawer`) or a full-screen dialog (`modal`). */
export type DashboardSidebarMode = 'slideover' | 'drawer' | 'modal'

/** Props forwarded to the menu overlay: `Modal` props for `mode="modal"`, `Drawer` props otherwise. */
export type DashboardSidebarMenuProps = Partial<DrawerProps> | Partial<ModalProps>

export interface DashboardSidebarProps {
  /**
   * Identifies the sidebar in the storage (`${storageKey}-sidebar-${id}`) and as its element id.
   * @defaultValue useId()
   */
  id?: string
  /**
   * The side of the dashboard the sidebar sits on. `right` is the aside panel: it has its own `open`/`collapsed` state in the group context (`sidebars.right`).
   * @defaultValue 'left'
   */
  side?: 'left' | 'right'
  /**
   * The minimum size of the sidebar, in the group's `unit`.
   * @defaultValue 10
   */
  minSize?: number
  /**
   * The maximum size of the sidebar, in the group's `unit`.
   * @defaultValue 20
   */
  maxSize?: number
  /**
   * The size of the sidebar, in the group's `unit`, until the user resizes it.
   * @defaultValue 15
   */
  defaultSize?: number
  /**
   * Whether the sidebar can be resized with a drag handle. The handle is also a keyboard-operable separator.
   * @defaultValue false
   */
  resizable?: boolean
  /**
   * Whether the sidebar collapses to an icon rail (`collapsedSize`) when dragged near its edge, toggled from the handle, or via `v-model:collapsed`.
   * @defaultValue false
   */
  collapsible?: boolean
  /**
   * The size of the sidebar while collapsed, in the group's `unit`. The sidebar never gets narrower than 3rem.
   * @defaultValue 0
   */
  collapsedSize?: number
  /**
   * How the sidebar opens below the `md` breakpoint.
   * @defaultValue 'slideover'
   */
  mode?: DashboardSidebarMode
  /** Props for the menu overlay (`Modal` for `mode="modal"`, otherwise `Drawer`). `title` is used as its accessible name. */
  menu?: DashboardSidebarMenuProps
  /**
   * The toggle button of the menu header; an object customizes the `Button`.
   * @defaultValue true
   */
  toggle?: boolean | Omit<ButtonProps, 'as'>
  /**
   * The side of the menu header the toggle is rendered on. `right` (the default) puts the close button at the end of
   * the brand row, where the other overlays place it.
   * @defaultValue 'right'
   */
  toggleSide?: 'left' | 'right'
  /**
   * Closes the menu when a link inside it is clicked.
   * @defaultValue true
   */
  autoClose?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DashboardSidebar>
}

export interface DashboardSidebarEmits {
  /** Emitted when the mobile menu opens or closes. */
  'update:open': [value: boolean]
  /** Emitted when the sidebar collapses or expands. */
  'update:collapsed': [value: boolean]
}

export interface DashboardSidebarToggleSlotProps {
  open: boolean
  toggle: () => void
  ui: DashboardSidebarUI
}

export interface DashboardSidebarResizeHandleSlotProps {
  onPointerDown: (e: PointerEvent) => void
  onMouseDown: (e: MouseEvent) => void
  onTouchStart: (e: TouchEvent) => void
  onDoubleClick: (e: MouseEvent) => void
  onKeyDown: (e: KeyboardEvent) => void
  /** `aria-valuenow`/`min`/`max` and `tabindex` for a `role="separator"` handle. */
  attrs: Record<string, unknown>
  /** Whether the sidebar is being dragged. */
  dragging: boolean
  ui: DashboardSidebarUI
}

type DashboardSidebarUI = ComponentUI<DashboardSidebar>

export interface DashboardSidebarSlots {
  /** The sidebar header (logo, team switcher...). Hidden when omitted. */
  header?: (props: { collapsed: boolean, collapse: (value: boolean) => void }) => any
  /** The scrollable sidebar body. */
  default?: (props: { collapsed: boolean, collapse: (value: boolean) => void }) => any
  /** The sidebar footer (user menu...). Hidden when omitted. */
  footer?: (props: { collapsed: boolean, collapse: (value: boolean) => void }) => any
  /** Replaces the toggle button of the menu header. */
  toggle?: (props: DashboardSidebarToggleSlotProps) => any
  /** Replaces the whole menu content (header, body and footer). */
  content?: (props: { close: () => void }) => any
  /** Replaces the resize handle. Rendered only when `resizable`. */
  'resize-handle'?: (props: DashboardSidebarResizeHandleSlotProps) => any
}
</script>

<script setup lang="ts">
import type { FunctionalComponent } from 'vue'
import { DialogTitle, VisuallyHidden } from 'reka-ui'
import { computed, h, onBeforeUnmount, ref, useId, useTemplateRef, watch } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import { createDashboardSidebarState, useDashboard } from '../../composables/useDashboard'
import { useResizable } from '../../composables/useResizable'
import Button from '../button/Button.vue'
import DashboardResizeHandle from '../dashboard-resize-handle/DashboardResizeHandle.vue'
import Drawer from '../drawer/Drawer.vue'
import Modal from '../modal/Modal.vue'

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
watch(state, (current, previous) => {
  if (previous?.id.value === id)
    previous.id.value = undefined
  current.id.value = id
}, { immediate: true })
onBeforeUnmount(() => {
  if (state.value.id.value === id)
    state.value.id.value = undefined
})

const el = useTemplateRef<HTMLElement>('el')
const { size, isDragging, isCollapsed, collapse, onPointerDown, onMouseDown, onTouchStart, onDoubleClick, onKeyDown, handleAttrs } = useResizable({
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
watch(open, (value) => {
  state.value.open.value = value
}, { immediate: true })
watch(() => state.value.open.value, (value) => {
  open.value = value
})

// `isCollapsed` is the source of truth (it applies `collapsible` and the persisted value); the models follow it and feed back through `collapse`.
watch(isCollapsed, (value) => {
  collapsedModel.value = value
  state.value.collapsed.value = value
}, { immediate: true })
watch(collapsedModel, value => collapse(value))
watch(() => state.value.collapsed.value, value => collapse(value))

const ui = useComponentUI('dashboardSidebar', theme, () => ({ side: props.side, toggleSide: props.toggleSide, mode: props.mode }))

const menuTitle = computed(() => (props.menu as { title?: string } | undefined)?.title ?? 'Sidebar')

const Menu = computed(() => props.mode === 'modal' ? Modal : Drawer)
const menuProps = computed(() => {
  const { title: _title, ui: _ui, ...rest } = (props.menu ?? {}) as Record<string, unknown>
  const defaults: Record<string, unknown> = props.mode === 'modal'
    ? { size: 'full' }
    : props.mode === 'slideover'
      ? { placement: props.side, variant: 'blur' }
      : { placement: 'bottom', variant: 'blur' }
  return { ...defaults, ...rest }
})
// The user's `menu.ui` is forwarded as is; `backdrop` / `dialog` are merged with the sidebar's `overlay` / `content` slots.
const menuClasses = computed(() => {
  const user: Record<string, any> = (props.menu as { ui?: Record<string, any> } | undefined)?.ui ?? {}
  return {
    ...user,
    backdrop: [ui.value.overlay({ class: props.ui?.overlay }), user.backdrop],
    dialog: ['p-0 gap-0', ui.value.content({ class: props.ui?.content }), user.dialog],
  }
})

function toggleOpen() {
  open.value = !open.value
}

// The sheet slides in under a pointer that hasn't moved since it clicked the trigger, and a right sheet's close
// button lands right where the navbar's toggle was. Its hover fill waits for the pointer to move over it, so the
// sheet doesn't open with a grey circle that reads as focus.
const toggleIdle = ref(false)
watch(open, (value) => {
  if (value)
    toggleIdle.value = true
})

function onMenuClick(event: MouseEvent) {
  if (props.autoClose && (event.target as Element | null)?.closest?.('a[href]'))
    open.value = false
}

const handleSlotProps = computed<DashboardSidebarResizeHandleSlotProps>(() => ({
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
  if (!props.resizable)
    return null
  if (slots['resize-handle'])
    return slots['resize-handle'](handleSlotProps.value)
  return h(DashboardResizeHandle, {
    ...handleSlotProps.value.attrs,
    'data-dragging': isDragging.value,
    'data-side': props.side,
    'class': ui.value.handle({ class: props.ui?.handle }),
    'onPointerdown': onPointerDown,
    'onDblclick': onDoubleClick,
    'onKeydown': onKeyDown,
  })
}

const Toggle: FunctionalComponent = () => {
  const slotProps = { open: open.value, toggle: toggleOpen, ui: ui.value }
  if (slots.toggle)
    return slots.toggle(slotProps)
  if (!props.toggle)
    return null
  const custom = typeof props.toggle === 'object' ? props.toggle : {}
  return h(Button, {
    'variant': 'ghost',
    'size': 'sm',
    'iconOnly': true,
    'aria-label': 'Close sidebar',
    ...custom,
    'data-slot': 'dashboard-sidebar-toggle',
    'data-idle': toggleIdle.value || undefined,
    'class': ui.value.toggle({ class: [props.ui?.toggle, custom.class] }),
    'onClick': toggleOpen,
    'onPointermove': () => { toggleIdle.value = false },
  }, () => h('svg', { 'aria-hidden': 'true', 'viewBox': '0 0 16 16', 'fill': 'none', 'stroke': 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round' }, [h('path', { d: 'M4 4l8 8M12 4l-8 8' })]))
}
</script>

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
    <div v-if="!!slots.header" data-slot="dashboard-sidebar-header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" :collapsed="isCollapsed" :collapse="collapse" />
    </div>

    <div data-slot="dashboard-sidebar-body" :class="ui.body({ class: props.ui?.body })">
      <slot :collapsed="isCollapsed" :collapse="collapse" />
    </div>

    <div v-if="!!slots.footer" data-slot="dashboard-sidebar-footer" :class="ui.footer({ class: props.ui?.footer })">
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

          <div v-if="mode === 'drawer'" aria-hidden="true" data-slot="drawer-handle" class="flex items-center justify-center pt-2 pb-1">
            <div class="h-1 w-9 rounded-xs bg-separator" />
          </div>

          <div class="contents" @click="onMenuClick">
            <div v-if="!!slots.header || mode !== 'drawer'" data-slot="dashboard-sidebar-header" :class="ui.header({ class: props.ui?.header })">
              <Toggle v-if="mode !== 'drawer' && toggleSide === 'left'" />

              <slot name="header" :collapsed="false" :collapse="() => {}" />

              <Toggle v-if="mode !== 'drawer' && toggleSide === 'right'" />
            </div>

            <div data-slot="dashboard-sidebar-body" :class="ui.body({ class: props.ui?.body })">
              <slot :collapsed="false" :collapse="() => {}" />
            </div>

            <div v-if="!!slots.footer" data-slot="dashboard-sidebar-footer" :class="ui.footer({ class: props.ui?.footer })">
              <slot name="footer" :collapsed="false" :collapse="() => {}" />
            </div>
          </div>
        </slot>
      </div>
    </template>
  </component>
</template>
