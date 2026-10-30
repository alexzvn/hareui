<template>
  <Primitive
    ref="root"
    v-bind="$attrs"
    :as="as"
    data-slot="header"
    :data-hidden="hidden ? 'true' : undefined"
    :data-menu-open="open ? 'true' : undefined"
    :style="heightStyle"
    :class="ui.root()"
    @focusin="onFocusIn"
  >
    <slot name="top" />

    <div ref="bar" data-slot="header-container" :class="ui.container()">
      <Left />

      <div data-slot="header-center" :class="ui.center()">
        <slot />
      </div>

      <Right />
    </div>

    <slot name="bottom" />
  </Primitive>

  <Teleport v-if="hasMenu" :to="portal.to" :disabled="portal.disabled">
    <div ref="anchor" data-slot="header-menu-anchor" class="contents" :style="anchorStyle">
      <Modal v-if="mode === 'modal'" v-model:open="open" v-bind="modalProps">
        <template #content="{ close }">
          <MenuContent :close="close" />
        </template>
      </Modal>

      <Drawer v-else v-model:open="open" v-bind="drawerProps">
        <template #content="{ close }">
          <MenuContent :close="close" />
        </template>
      </Drawer>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { DialogTitle, Primitive, VisuallyHidden } from 'reka-ui'
import { computed, getCurrentInstance, h, useTemplateRef } from 'vue'
import type { FunctionalComponent } from 'vue'

import type { ButtonProps } from '@/components/button/Button.types'
import Button from '@/components/button/Button.vue'
import Drawer from '@/components/drawer/Drawer.vue'
import Modal from '@/components/modal/Modal.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useMenuAutoClose } from '@/composables/useMenuAutoClose'
import { usePortal } from '@/composables/usePortal'

import type { DrawerMenuProps, HeaderProps, HeaderSlots, ModalMenuProps } from './Header.types'
import theme from './theme'
import { useHeaderHideOnScroll } from './useHeaderHideOnScroll'
import { useHeaderMenuAnchor } from './useHeaderMenuAnchor'
import { useHeaderScrollUnlock } from './useHeaderScrollUnlock'
import { useHeaderToggleIcon } from './useHeaderToggleIcon'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<HeaderProps>(), {
  as: 'header',
  title: 'HareUI',
  to: '/',
  mode: 'modal',
  toggle: true,
  toggleSide: 'right',
  autoClose: true,
  hideOnScroll: false,
  shouldBlockScroll: true,
  openLabel: 'Open menu',
  closeLabel: 'Close menu',
  menuTitle: 'Navigation menu',
})

const slots = defineSlots<HeaderSlots>()

const open = defineModel<boolean>('open', { default: false })
const hidden = defineModel<boolean>('hidden', { default: false })

const ui = useComponentUI('header', {
  theme,
  variantProps: () => ({
    toggleSide: props.toggleSide,
    breakpoint: props.breakpoint,
    mode: props.mode,
  }),
  props,
  classSlot: 'root',
})

const root = useTemplateRef<{ $el: HTMLElement }>('root')
const bar = useTemplateRef<HTMLElement>('bar')
const anchor = useTemplateRef<HTMLElement>('anchor')

const hasMenu = computed(() => !!(slots.body || slots.content))
const showToggle = computed(() => !!slots.toggle || (!!props.toggle && hasMenu.value))

// Applied inline so it also reaches the menu's header, which is teleported out of the root.
const heightStyle = computed(() => (props.height ? { '--header-height': props.height } : undefined))

const toggleOpen = () => {
  open.value = !open.value
}

const { isIconOpen } = useHeaderToggleIcon(open)

// Bar pieces rendered twice (in the bar and in the menu's own header), hence functional components rather than template duplication.
const Toggle: FunctionalComponent = () => {
  if (slots.toggle) return slots.toggle({ open: open.value, toggle: toggleOpen, ui: ui.value })
  if (!showToggle.value) return null

  const options: Omit<ButtonProps, 'as' | 'iconOnly'> =
    typeof props.toggle === 'object' ? props.toggle : {}

  const renderIcon = () =>
    h('span', {
      'aria-hidden': 'true',
      'data-slot': 'header-toggle-icon',
      'data-open': isIconOpen.value ? 'true' : 'false',
      class: ui.value.toggleIcon(),
    })

  return h(
    Button,
    {
      variant: 'ghost',
      ...options,
      iconOnly: true,
      'aria-label': open.value ? props.closeLabel : props.openLabel,
      'aria-expanded': open.value,
      'data-slot': 'header-toggle',
      class: ui.value.toggle({ override: options.class }),
      onClick: toggleOpen,
    },
    renderIcon,
  )
}

// With vue-router installed (a global `RouterLink`), a path `to` navigates client-side and the route drives `autoClose`.
const instance = getCurrentInstance()
const RouterLink = instance?.appContext.components.RouterLink

const titleAttrs = computed(() => ({
  to: props.to,
  'aria-label': props.title.trim(),
  'data-slot': 'header-title',
  class: ui.value.title(),
}))

const titleContent = () => (slots.title ? slots.title() : props.title)

const renderTitleLink = () => {
  if (RouterLink && props.to.startsWith('/')) {
    return h(RouterLink, titleAttrs.value, () => titleContent())
  }

  const { class: className, 'aria-label': ariaLabel } = titleAttrs.value
  const linkAttrs = {
    'aria-label': ariaLabel,
    'data-slot': 'header-title',
    class: className,
    href: props.to,
  }

  return h('a', linkAttrs, titleContent())
}

const Left: FunctionalComponent = () =>
  h('div', { 'data-slot': 'header-left', class: ui.value.left() }, [
    props.toggleSide === 'left' ? h(Toggle) : null,
    slots.left ? slots.left() : renderTitleLink(),
  ])

const Right: FunctionalComponent = () =>
  h('div', { 'data-slot': 'header-right', class: ui.value.right() }, [
    slots.right?.(),
    props.toggleSide === 'right' ? h(Toggle) : null,
  ])

// --- Mobile menu --------------------------------------------------------------------------------

const portal = usePortal(() => props.menu?.portal)
const { anchorStyle } = useHeaderMenuAnchor({ open, root, bar, anchor })

const modalProps = computed((): ModalMenuProps => {
  // In `modal` mode `menu` holds Modal props (the prop type is the union of both menus).
  const menu = (props.menu ?? {}) as ModalMenuProps

  return {
    size: 'full',
    variant: 'transparent',
    closeButton: false,
    ...menu,
    portal: false,
    ui: {
      ...menu.ui,
      backdrop: [ui.value.overlay(), menu.ui?.backdrop],

      // Fade only: Modal's `full` size has no zoom or slide.
      container: ['h-full w-full', menu.ui?.container],
      dialog: [ui.value.content(), menu.ui?.dialog],
    },
  }
})

const drawerProps = computed((): DrawerMenuProps => {
  // In `slideover` and `drawer` modes `menu` holds Drawer props.
  const menu = (props.menu ?? {}) as DrawerMenuProps

  return {
    placement: props.mode === 'slideover' ? 'right' : 'bottom',
    closeButton: false,
    ...menu,
    portal: false,
    ui: {
      ...menu.ui,
      backdrop: [ui.value.overlay(), menu.ui?.backdrop],

      // Drawer content already fills the backdrop (the anchored region); clip the sliding panel to it.
      content: ['overflow-hidden', menu.ui?.content],
      dialog: [ui.value.content(), menu.ui?.dialog],
    },
  }
})

const { onMenuClick } = useMenuAutoClose({
  open,
  isEnabled: () => props.autoClose,
  routePath: () => instance?.appContext.config.globalProperties.$route?.fullPath,
})

// The menu's own header row: a copy of the bar, so the toggle lands on the bar's toggle. `drawer` has none.
const renderMenuHeader = () => {
  if (props.mode === 'drawer') return null

  const container = h(
    'div',
    {
      'data-slot': 'header-menu-container',
      class: ui.value.container(),
    },
    [h(Left), h(Right)],
  )

  return h(
    'div',
    {
      'data-slot': 'header-menu-header',
      style: heightStyle.value,
      class: ui.value.header(),
      onClick: onMenuClick,
    },
    [container],
  )
}

const renderMenuBody = () =>
  h(
    'div',
    {
      'data-slot': 'header-menu-body',
      class: ui.value.body(),
      onClick: onMenuClick,
    },
    slots.body?.(),
  )

const MenuContent: FunctionalComponent<{ close: () => void }> = ({ close }) => {
  if (slots.content) return slots.content({ close })

  const title = h(VisuallyHidden, { asChild: true }, () =>
    h(DialogTitle, null, () => props.menuTitle),
  )

  return [title, renderMenuHeader(), renderMenuBody()]
}

useHeaderScrollUnlock({ open, shouldBlockScroll: () => props.shouldBlockScroll })

// --- Hide on scroll -----------------------------------------------------------------------------

const { onFocusIn } = useHeaderHideOnScroll({
  root,
  open,
  hidden,
  isEnabled: () => props.hideOnScroll,
  scrollTarget: () => props.scrollTarget,
})
</script>
