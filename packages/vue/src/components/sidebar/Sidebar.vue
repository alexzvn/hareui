<template>
  <Primitive
    :as="as"
    data-slot="sidebar"
    v-bind="$attrs"
    :data-state="isCollapsible ? state : undefined"
    :data-collapsible="isCollapsible ? collapsible : undefined"
    :data-variant="variant"
    :data-side="side"
    :class="ui.root()"
  >
    <div data-slot="sidebar-container" :class="ui.container()">
      <Content />

      <template v-if="hasRail">
        <slot name="rail" :state="state" :ui="ui">
          <button
            type="button"
            data-slot="sidebar-rail"
            :aria-label="t('sidebar.toggle')"
            tabindex="-1"
            :class="ui.rail()"
            @click="toggleSidebar"
          />
        </slot>
      </template>
    </div>
  </Primitive>

  <component
    :is="Menu"
    v-if="isMenu"
    v-model:open="isMenuOpen"
    v-bind="menuProps"
    :title="menuTitle"
    :ui="menuClasses"
  >
    <template #content="{ close }">
      <div class="contents" @click="onMenuClick">
        <slot name="content" :close="close">
          <div
            v-if="mode === 'drawer'"
            aria-hidden="true"
            data-slot="sidebar-handle"
            :class="ui.handle()"
          >
            <div data-slot="sidebar-handle-bar" />
          </div>

          <Content />
        </slot>
      </div>
    </template>
  </component>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, getCurrentInstance, h, ref, watch } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'
import { useMenuAutoClose } from '@/composables/useMenuAutoClose'
import { useSidebarMenu } from '@/composables/useSidebarMenu'

import type {
  SidebarPartSlotProps,
  SidebarProps,
  SidebarSectionSlotProps,
  SidebarSlots,
  SidebarState,
} from './Sidebar.types'
import SidebarContent from './SidebarContent.vue'
import theme from './theme'
import { useBelowBreakpoint } from './useBelowBreakpoint'

defineOptions({ inheritAttrs: false })

const { t } = useLocale()

const props = withDefaults(defineProps<SidebarProps>(), {
  as: 'aside',
  variant: 'sidebar',
  collapsible: 'offcanvas',
  side: 'left',
  close: false,
  rail: false,
  transition: true,
  breakpoint: 'md',
  mode: 'slideover',
  autoClose: true,
})

const slots = defineSlots<SidebarSlots>()

const modelOpen = defineModel<boolean>('open', { default: true })

const isCollapsible = computed(() => props.collapsible !== 'none')
const isBelowBreakpoint = useBelowBreakpoint(() => props.breakpoint)

// Below the breakpoint a collapsible sidebar is hidden and opens as a menu; `collapsible="none"` always stays inline.
const isMenu = computed(() => isCollapsible.value && isBelowBreakpoint.value)
const isMenuOpen = ref(false)

// The desktop state, kept while the sidebar is a menu so widening the viewport restores the sidebar as it was.
const desktopOpen = ref(modelOpen.value)

// `v-model:open` is viewport-aware: it expands/collapses the sidebar on desktop and opens/closes the menu on mobile.
const isOpen = computed(() => {
  if (!isCollapsible.value) return true

  return isMenu.value ? isMenuOpen.value : modelOpen.value
})

const setOpen = (value: boolean) => {
  if (isMenu.value) {
    isMenuOpen.value = value
    return
  }

  modelOpen.value = value
}

watch(isMenu, (menu) => {
  if (menu) {
    desktopOpen.value = modelOpen.value
    modelOpen.value = false

    return
  }

  isMenuOpen.value = false
  modelOpen.value = desktopOpen.value
})

watch(modelOpen, (value) => {
  if (isMenu.value) isMenuOpen.value = value
})

// The menu also closes itself (backdrop click, Escape, swipe): report it through the model.
watch(isMenuOpen, (value) => {
  if (isMenu.value) modelOpen.value = value
})

const state = computed<SidebarState>(() => (isOpen.value ? 'expanded' : 'collapsed'))
const hasRail = computed(() => props.rail && isCollapsible.value)

const closeSidebar = () => setOpen(false)
const toggleSidebar = () => setOpen(!isOpen.value)

const ui = useComponentUI('sidebar', {
  theme,
  variantProps: () => ({
    variant: props.variant,
    collapsible: props.collapsible,
    side: props.side,
    transition: props.transition,
    breakpoint: props.breakpoint,
    mode: props.mode,
  }),
  props,
  classSlot: 'root',
})

const contentProps = computed(() => ({
  ui: ui.value,
  state: state.value,
  open: isOpen.value,
  title: props.title,
  description: props.description,
  canClose: isCollapsible.value && (!!props.close || isMenu.value),
  closeButton: props.close,
}))

const forwardedNames = [
  'header',
  'title',
  'description',
  'actions',
  'close',
  'default',
  'footer',
] as const satisfies ReadonlyArray<keyof SidebarSlots>

// With dynamic slot names, TS types the props a slot receives as the union over every slot; at runtime each slot
// gets back exactly the props `SidebarContent` passed to it.
const forwardProps = (slotProps: unknown) =>
  slotProps as SidebarSectionSlotProps & SidebarPartSlotProps

// The sidebar's content with the user's slots, rendered inline on desktop and inside the menu below the breakpoint.
const Content = () =>
  h(
    SidebarContent,
    { ...contentProps.value, onClose: closeSidebar },
    Object.fromEntries(
      forwardedNames
        .filter((name) => !!slots[name])
        .map((name) => [name, (slotProps: unknown) => slots[name]?.(forwardProps(slotProps))]),
    ),
  )

const { Menu, menuProps, menuClasses } = useSidebarMenu(() => ({
  mode: props.mode,
  side: props.side,
  menu: props.menu,
  classes: { backdrop: ui.value.overlay(), dialog: ui.value.content() },
}))

const menuTitle = computed(() => props.menu?.title ?? props.title ?? t('sidebar.title'))

const instance = getCurrentInstance()

// Only the menu closes: on desktop a navigation leaves the sidebar as it is.
const { onMenuClick } = useMenuAutoClose({
  open: isMenuOpen,
  isEnabled: () => props.autoClose,
  routePath: () => instance?.appContext.config.globalProperties.$route?.fullPath,
})
</script>
