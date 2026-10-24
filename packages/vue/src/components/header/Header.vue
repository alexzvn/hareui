<template>
  <Primitive
    ref="root"
    v-bind="$attrs"
    :as="as"
    data-slot="header"
    :data-hidden="hidden ? 'true' : undefined"
    :data-menu-open="open ? 'true' : undefined"
    :style="heightStyle"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @focusin="onFocusIn"
  >
    <slot name="top" />

    <div
      ref="bar"
      data-slot="header-container"
      :class="ui.container({ class: props.ui?.container })"
    >
      <Left />

      <div data-slot="header-center" :class="ui.center({ class: props.ui?.center })">
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

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import type { ButtonProps } from '@/components/button/Button.vue'
import type { DrawerProps } from '@/components/drawer/Drawer.vue'
import type { ModalProps } from '@/components/modal/Modal.vue'
import type { ComponentSlots, ComponentUI, ComponentVariants } from '@/types/tv'

import theme from './theme'

type Header = typeof theme

export type HeaderMode = 'modal' | 'slideover' | 'drawer'

type MenuProps =
  | Omit<ModalProps, 'open' | 'defaultOpen'>
  | Omit<DrawerProps, 'open' | 'defaultOpen'>

export type HeaderProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'header'
   */
  as?: PrimitiveProps['as']
  /**
   * Title rendered in the default `left` slot. Also used as the link's `aria-label`: set it when filling the `title` slot with a logo.
   * @defaultValue 'HareUI'
   */
  title?: string
  /**
   * The URL the title links to.
   * @defaultValue '/'
   */
  to?: string
  /**
   * How the mobile menu is presented: a `Modal` filling the area from the bar down (its header row lands on the bar, so the toggle turns into the close button in place),
   * a `Drawer` sliding in from the `right` (`slideover`), or a `Drawer` sheet from the bottom (`drawer`). The menu spans the header's width.
   * @defaultValue 'modal'
   */
  mode?: HeaderMode
  /** Props forwarded to the menu component (`Modal` for `modal`, `Drawer` for `slideover` and `drawer`), e.g. `{ placement: 'left' }`. `portal` places the menu's anchor element. */
  menu?: MenuProps
  /**
   * The toggle button that opens the menu (only rendered when the `body` or `content` slot is used). `true` renders the default animated hamburger;
   * an object is forwarded to the `Button` (`variant`, `size`, `class`, ...); `false` hides it.
   * @defaultValue true
   */
  toggle?: boolean | Omit<ButtonProps, 'as' | 'iconOnly'>
  /**
   * The side to render the toggle button on.
   * @defaultValue 'right'
   */
  toggleSide?: 'left' | 'right'
  /**
   * The viewport width from which the `default` slot shows inline and the toggle and menu are dropped. `none` keeps the collapsed layout at every width.
   * @defaultValue 'lg'
   */
  breakpoint?: ComponentVariants<Header>['breakpoint']
  /**
   * Close the menu when a link inside it is clicked or the page navigates (`popstate`/`hashchange`).
   * @defaultValue true
   */
  autoClose?: boolean
  /**
   * Hide the bar when scrolling down and reveal it when scrolling up. The bar slides out with a transform, so layout is unaffected.
   * @defaultValue false
   */
  hideOnScroll?: boolean
  /**
   * The scroll container watched by `hideOnScroll`: an element, a CSS selector, or `window`.
   * Defaults to the nearest scrollable ancestor, falling back to the window.
   */
  scrollTarget?: string | HTMLElement | Window | null
  /**
   * Height of the bar, any CSS length. Sets the `--header-height` CSS variable (default `4rem`).
   * @example '2.75rem'
   */
  height?: string
  /**
   * Lock page scroll while the mobile menu is open.
   * @defaultValue true
   */
  shouldBlockScroll?: boolean
  /**
   * Accessible label of the toggle while the menu is closed.
   * @defaultValue 'Open menu'
   */
  openLabel?: string
  /**
   * Accessible label of the toggle while the menu is open.
   * @defaultValue 'Close menu'
   */
  closeLabel?: string
  /**
   * Accessible title of the menu dialog.
   * @defaultValue 'Navigation menu'
   */
  menuTitle?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Header>
}

export type HeaderSlots = {
  /** Replaces the title text inside the default title link. */
  title?: () => any
  /** Replaces the whole start area (title link). The toggle is still rendered before it when `toggleSide="left"`. */
  left?: () => any
  /** Centered navigation, shown from the `lg` breakpoint. */
  default?: () => any
  /** End area (actions). The toggle is rendered after it when `toggleSide="right"`. */
  right?: () => any
  /** Replaces the toggle button. */
  toggle?: (props: { open: boolean; toggle: () => void; ui: ComponentUI<Header> }) => any
  /** Rendered above the bar, inside the root element. */
  top?: () => any
  /** Rendered below the bar, inside the root element. */
  bottom?: () => any
  /** The menu body, below the menu's own header (`modal` and `slideover`) or alone (`drawer`). */
  body?: () => any
  /** Replaces the entire menu content. */
  content?: (props: { close: () => void }) => any
}

export type HeaderEmits = {
  /** Emitted when the menu opens or closes. */
  'update:open': [value: boolean]
  /** Emitted when `hideOnScroll` hides or reveals the bar. */
  'update:hidden': [value: boolean]
}
</script>

<script setup lang="ts">
import { DialogTitle, Primitive, VisuallyHidden } from 'reka-ui'
import {
  computed,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
} from 'vue'
import type { FunctionalComponent } from 'vue'

import Button from '@/components/button/Button.vue'
import Drawer from '@/components/drawer/Drawer.vue'
import Modal from '@/components/modal/Modal.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { usePortal } from '@/composables/usePortal'

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

const ui = useComponentUI('header', theme, () => ({
  toggleSide: props.toggleSide,
  breakpoint: props.breakpoint,
  mode: props.mode,
}))

const hasMenu = computed(() => !!(slots.body || slots.content))
const showToggle = computed(() => !!slots.toggle || (!!props.toggle && hasMenu.value))
// Applied inline so it also reaches the menu's header, which is teleported out of the root.
const heightStyle = computed(() => (props.height ? { '--header-height': props.height } : undefined))

function toggleOpen() {
  open.value = !open.value
}

// The hamburger -> X morph starts two frames after opening: the menu's own toggle is mounted closed, and needs one
// rendered frame in that state for its transition to run in step with the bar's toggle underneath.
const iconOpen = ref(open.value)
let iconFrame = 0
watch(open, (value) => {
  cancelAnimationFrame(iconFrame)
  if (!value) {
    iconOpen.value = false
    return
  }
  iconFrame = requestAnimationFrame(() => {
    iconFrame = requestAnimationFrame(() => {
      iconOpen.value = true
    })
  })
})

// Bar pieces rendered twice (in the bar and in the menu's own header), hence functional components rather than template duplication.
const Toggle: FunctionalComponent = () => {
  if (slots.toggle) return slots.toggle({ open: open.value, toggle: toggleOpen, ui: ui.value })
  if (!showToggle.value) return null
  const options: Omit<ButtonProps, 'as' | 'iconOnly'> =
    typeof props.toggle === 'object' ? props.toggle : {}
  return h(
    Button,
    {
      variant: 'ghost',
      ...options,
      iconOnly: true,
      'aria-label': open.value ? props.closeLabel : props.openLabel,
      'aria-expanded': open.value,
      'data-slot': 'header-toggle',
      class: ui.value.toggle({ class: [props.ui?.toggle, options.class] }),
      onClick: toggleOpen,
    },
    () =>
      h('span', {
        'aria-hidden': 'true',
        'data-slot': 'header-toggle-icon',
        'data-open': iconOpen.value ? 'true' : 'false',
        class: ui.value.toggleIcon({ class: props.ui?.toggleIcon }),
      }),
  )
}

// With vue-router installed (a global `RouterLink`), a path `to` navigates client-side and the route drives `autoClose`.
const instance = getCurrentInstance()
const RouterLink = instance?.appContext.components.RouterLink

const titleAttrs = computed(() => ({
  to: props.to,
  'aria-label': props.title.trim(),
  'data-slot': 'header-title',
  class: ui.value.title({ class: props.ui?.title }),
}))
const titleContent = () => (slots.title ? slots.title() : props.title)

const Left: FunctionalComponent = () =>
  h('div', { 'data-slot': 'header-left', class: ui.value.left({ class: props.ui?.left }) }, [
    props.toggleSide === 'left' ? h(Toggle) : null,
    slots.left
      ? slots.left()
      : RouterLink && props.to.startsWith('/')
        ? h(RouterLink, titleAttrs.value, () => titleContent())
        : h(
            'a',
            {
              'aria-label': titleAttrs.value['aria-label'],
              'data-slot': 'header-title',
              class: titleAttrs.value.class,
              href: props.to,
            },
            titleContent(),
          ),
  ])

const Right: FunctionalComponent = () =>
  h('div', { 'data-slot': 'header-right', class: ui.value.right({ class: props.ui?.right }) }, [
    slots.right?.(),
    props.toggleSide === 'right' ? h(Toggle) : null,
  ])

// --- Mobile menu --------------------------------------------------------------------------------

type ModalMenuProps = Omit<ModalProps, 'open' | 'defaultOpen'>
type DrawerMenuProps = Omit<DrawerProps, 'open' | 'defaultOpen'>

const root = useTemplateRef<{ $el: HTMLElement }>('root')
const bar = useTemplateRef<HTMLElement>('bar')

// The menu is anchored to the bar rather than the viewport: its region starts at the bar's top edge and spans the bar's
// width, so the menu's own header row lands exactly on the bar (same brand and toggle position; the toggle morphs in
// place). For a full-width sticky header that region is the viewport; inside a containing block (a portal target with
// `contain: layout` or a transform) it is clamped to that block. The Header portals an anchor carrying the region
// as CSS variables, and renders the overlay inside it unportalled.
const portal = usePortal(() => props.menu?.portal)
const anchor = useTemplateRef<HTMLElement>('anchor')
const anchorStyle = ref<Record<string, string>>({})

// The bar's hide-on-scroll offset (`translate`), so the region is where the bar rests, not where it is mid-slide.
function barOffsetY(el: HTMLElement) {
  const y = getComputedStyle(el).translate.split(' ')[1]
  if (!y) return 0
  const value = Number.parseFloat(y)
  if (Number.isNaN(value)) return 0
  return y.endsWith('%') ? (value * el.offsetHeight) / 100 : value
}

// The box `position: fixed` layers inside the portal target resolve against: the viewport, or the nearest ancestor that
// becomes their containing block (a transform, filter or layout/paint containment, e.g. an app portalling into a panel).
const transformProps = [
  'transform',
  'translate',
  'scale',
  'rotate',
  'perspective',
  'filter',
  'backdropFilter',
] as const
function fixedContainingBlock(from: Element | null | undefined): HTMLElement | null {
  for (let el = from; el && el !== document.documentElement; el = el.parentElement) {
    const style = getComputedStyle(el)
    // Unsupported properties read as empty, so only an explicit non-`none` value counts.
    if (
      transformProps.some((key) => style[key] && style[key] !== 'none') ||
      /layout|paint|strict|content/.test(style.contain ?? '') ||
      /transform|perspective|filter/.test(style.willChange ?? '')
    ) {
      return el as HTMLElement
    }
  }
  return null
}

function updateAnchor() {
  const el = root.value?.$el
  if (!el || !bar.value) return
  const box = el.getBoundingClientRect()
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight
  // The region runs from the bar's top edge to the bottom of the viewport, clamped to the containing block when there is one.
  let originTop = 0
  let originLeft = 0
  let bottom = viewportHeight
  const block = fixedContainingBlock(anchor.value?.parentElement)
  if (block) {
    const rect = block.getBoundingClientRect()
    originTop = rect.top + block.clientTop
    originLeft = rect.left + block.clientLeft
    bottom = Math.min(bottom, originTop + block.clientHeight)
  }
  const top = Math.max(0, originTop, bar.value.getBoundingClientRect().top - barOffsetY(el))
  anchorStyle.value = {
    '--header-menu-top': `${top - originTop}px`,
    '--header-menu-left': `${box.left - originLeft}px`,
    '--header-menu-width': `${box.width}px`,
    '--header-menu-height': `${Math.max(0, bottom - top)}px`,
  }
}

// The frame id is only kept while its callback is pending (`scheduled`), so a callback that runs before
// `requestAnimationFrame` returns cannot leave a stale id behind.
let anchorFrame = 0
let anchorScheduled = false
function scheduleAnchorUpdate() {
  if (anchorScheduled) return
  anchorScheduled = true
  anchorFrame = requestAnimationFrame(() => {
    anchorScheduled = false
    updateAnchor()
  })
}

function stopAnchorTracking() {
  window.removeEventListener('resize', scheduleAnchorUpdate)
  window.removeEventListener('scroll', scheduleAnchorUpdate, true)
  if (anchorScheduled) {
    cancelAnimationFrame(anchorFrame)
    anchorScheduled = false
  }
}

// Measured before the menu renders (`flush: 'sync'`), so its first frame is already in place.
watch(
  open,
  (value) => {
    stopAnchorTracking()
    if (!value) return
    updateAnchor()
    window.addEventListener('resize', scheduleAnchorUpdate, { passive: true })
    window.addEventListener('scroll', scheduleAnchorUpdate, { capture: true, passive: true })
  },
  { flush: 'sync' },
)

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
      backdrop: [ui.value.overlay({ class: props.ui?.overlay }), menu.ui?.backdrop],
      // Fade only: Modal's `full` size has no zoom or slide.
      container: ['h-full w-full', menu.ui?.container],
      dialog: [ui.value.content({ class: props.ui?.content }), menu.ui?.dialog],
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
      backdrop: [ui.value.overlay({ class: props.ui?.overlay }), menu.ui?.backdrop],
      // Fill the anchored region instead of the viewport, and clip the sliding panel to it.
      content: ['absolute h-full overflow-hidden', menu.ui?.content],
      dialog: [ui.value.content({ class: props.ui?.content }), menu.ui?.dialog],
    },
  }
})

function onMenuClick(event: MouseEvent) {
  if (props.autoClose && (event.target as HTMLElement).closest('a[href]')) open.value = false
}

const MenuContent: FunctionalComponent<{ close: () => void }> = ({ close }) => {
  if (slots.content) return slots.content({ close })
  return [
    h(VisuallyHidden, { asChild: true }, () => h(DialogTitle, null, () => props.menuTitle)),
    props.mode === 'drawer'
      ? null
      : h(
          'div',
          {
            'data-slot': 'header-menu-header',
            style: heightStyle.value,
            class: ui.value.header({ class: props.ui?.header }),
            onClick: onMenuClick,
          },
          [
            h(
              'div',
              {
                'data-slot': 'header-menu-container',
                class: ui.value.container({ class: props.ui?.container }),
              },
              [h(Left), h(Right)],
            ),
          ],
        ),
    h(
      'div',
      {
        'data-slot': 'header-menu-body',
        class: ui.value.body({ class: props.ui?.body }),
        onClick: onMenuClick,
      },
      slots.body?.(),
    ),
  ]
}

watch(
  () => instance?.appContext.config.globalProperties.$route?.fullPath,
  () => closeOnNavigation(),
)

function closeOnNavigation() {
  if (props.autoClose) open.value = false
}

// Reka locks page scroll on every modal overlay. With `shouldBlockScroll: false` the body styles it applies are put
// back as they land (it sets them a tick after the overlay mounts, hence the observer rather than a one-off reset).
let bodyStyles: { overflow: string; paddingRight: string; marginRight: string } | null = null
let scrollLockObserver: MutationObserver | null = null

function restoreBodyStyles() {
  if (!bodyStyles) return
  // Only write on a difference: writing an identical value still queues a mutation record, which would loop the observer.
  const { style } = document.body
  for (const key of ['overflow', 'paddingRight', 'marginRight'] as const) {
    if (style[key] !== bodyStyles[key]) style[key] = bodyStyles[key]
  }
}

function stopRestoringBodyStyles() {
  scrollLockObserver?.disconnect()
  scrollLockObserver = null
}

watch(
  open,
  (value) => {
    if (value) {
      const { overflow, paddingRight, marginRight } = document.body.style
      bodyStyles = { overflow, paddingRight, marginRight }
    }
  },
  { flush: 'sync' },
)

watch([open, () => props.shouldBlockScroll], ([isOpen, block]) => {
  stopRestoringBodyStyles()
  if (!isOpen || block) return
  scrollLockObserver = new MutationObserver(restoreBodyStyles)
  scrollLockObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] })
  restoreBodyStyles()
})

// --- Hide on scroll -----------------------------------------------------------------------------

let scroller: HTMLElement | Window | null = null
let lastY = 0
let frame = 0
let frameScheduled = false

function resolveScroller(): HTMLElement | Window {
  const target = props.scrollTarget
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target) ?? window
  if (target) return target
  // The nearest scrollable ancestor: that is what a sticky bar sticks to.
  for (
    let el = root.value?.$el?.parentElement;
    el && el !== document.body && el !== document.documentElement;
    el = el.parentElement
  ) {
    const { overflowY } = getComputedStyle(el)
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') return el
  }
  return window
}

function scrollY() {
  return Math.max(0, scroller === window ? window.scrollY : (scroller as HTMLElement).scrollTop)
}

function update() {
  frameScheduled = false
  const y = scrollY()
  const delta = y - lastY
  lastY = y
  // Keep the bar while the menu is open, and whenever the page sits within its own height of the top.
  if (open.value || y <= (root.value?.$el?.offsetHeight ?? 0)) hidden.value = false
  else if (delta > 0) hidden.value = true
  else if (delta < 0) hidden.value = false
}

function onScroll() {
  if (frameScheduled) return
  frameScheduled = true
  frame = requestAnimationFrame(update)
}

function stopScrollTracking() {
  scroller?.removeEventListener('scroll', onScroll)
  scroller = null
  if (frameScheduled) {
    cancelAnimationFrame(frame)
    frameScheduled = false
  }
}

function startScrollTracking() {
  stopScrollTracking()
  scroller = resolveScroller()
  lastY = scrollY()
  scroller.addEventListener('scroll', onScroll, { passive: true })
}

onMounted(() => {
  if (props.hideOnScroll) startScrollTracking()
  window.addEventListener('popstate', closeOnNavigation)
  window.addEventListener('hashchange', closeOnNavigation)
})

onBeforeUnmount(() => {
  stopScrollTracking()
  stopAnchorTracking()
  cancelAnimationFrame(iconFrame)
  stopRestoringBodyStyles()
  window.removeEventListener('popstate', closeOnNavigation)
  window.removeEventListener('hashchange', closeOnNavigation)
})

watch(open, (value) => {
  if (value) hidden.value = false
})

watch(
  () => [props.hideOnScroll, props.scrollTarget] as const,
  ([enabled]) => {
    if (enabled) {
      startScrollTracking()
    } else {
      stopScrollTracking()
      hidden.value = false
    }
  },
)

// A bar that holds the keyboard focus must not slide away.
function onFocusIn() {
  if (hidden.value) hidden.value = false
}
</script>
