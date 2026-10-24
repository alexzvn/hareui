<template>
  <NavigationMenuRoot
    data-slot="root"
    v-bind="{
      ...rootProps,
      ...(isVertical
        ? {}
        : {
            modelValue: props.modelValue as string | undefined,
            defaultValue: props.defaultValue as string | undefined,
            'onUpdate:modelValue': (value: string) => emit('update:modelValue', value),
          }),
      ...$attrs,
    }"
    :data-collapsed="props.collapsed"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <slot name="list-leading" />

    <template v-for="(list, listIndex) in lists" :key="`list-${listIndex}`">
      <component
        :is="isVertical && !isCollapsed ? AccordionRoot : NavigationMenuList"
        v-bind="listProps(list, listIndex)"
        as="ul"
        data-slot="list"
        :class="ui.list({ class: props.ui?.list })"
      >
        <NavigationMenuNode
          v-for="(item, index) in list"
          :key="`list-${listIndex}-${index}`"
          :item="item"
          :index="index"
          :list-index="listIndex"
        />
      </component>

      <div
        v-if="isVertical && listIndex < lists.length - 1"
        role="separator"
        data-slot="separator"
        :class="ui.separator({ class: props.ui?.separator })"
      />
    </template>

    <slot name="list-trailing" />

    <div
      v-if="!isVertical"
      data-slot="viewportWrapper"
      :class="ui.viewportWrapper({ class: props.ui?.viewportWrapper })"
    >
      <NavigationMenuIndicator
        v-if="props.arrow"
        data-slot="indicator"
        :class="ui.indicator({ class: props.ui?.indicator })"
      >
        <div data-slot="arrow" :class="ui.arrow({ class: props.ui?.arrow })" />
      </NavigationMenuIndicator>

      <NavigationMenuViewport
        v-bind="props.viewport"
        data-slot="viewport"
        :class="ui.viewport({ class: props.ui?.viewport })"
      />
    </div>
  </NavigationMenuRoot>
</template>

<script setup lang="ts" generic="T extends NavigationMenuItem = NavigationMenuItem">
import {
  AccordionRoot,
  NavigationMenuIndicator,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuViewport,
} from 'reka-ui'
import { computed, onBeforeUnmount, provide, useSlots } from 'vue'

import type { TooltipProps } from '@/components/tooltip/Tooltip.types'
import { useComponentUI } from '@/composables/useComponentUI'

import { get, navigationMenuKey } from './context'
import type { NavigationMenuItemPosition } from './context'
import type {
  NavigationMenuItem,
  NavigationMenuProps,
  NavigationMenuEmits,
  NavigationMenuSlots,
} from './NavigationMenu.types'
import NavigationMenuNode from './NavigationMenuNode.vue'
import theme from './theme'
import type { NavigationMenuPopoverProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<NavigationMenuProps<T>>(), {
  orientation: 'horizontal',
  contentOrientation: 'horizontal',
  externalIcon: true,
  delayDuration: 0,
  type: 'multiple',
  collapsible: true,
  unmountOnHide: true,
  valueKey: 'value',
  labelKey: 'label',
  as: undefined,
  modelValue: undefined,
  defaultValue: undefined,
})

const emit = defineEmits<NavigationMenuEmits>()
const slots = useSlots()
defineSlots<NavigationMenuSlots<T>>()

const isVertical = computed(() => props.orientation === 'vertical')
const isCollapsed = computed(() => !!props.collapsed)

const ui = useComponentUI('navigationMenu', {
  theme,
  variantProps: () => ({
    orientation: props.orientation,
    contentOrientation: isVertical.value ? undefined : props.contentOrientation,
    collapsed: !!props.collapsed,
    color: props.color,
    variant: props.variant,
    highlight: !!props.highlight,
    highlightColor: props.highlightColor || props.color,
  }),
})

const rootProps = computed(() => ({
  as: props.as,
  delayDuration: props.delayDuration,
  skipDelayDuration: props.skipDelayDuration,
  orientation: props.orientation,
  disableClickTrigger: props.disableClickTrigger,
  disableHoverTrigger: props.disableHoverTrigger,
  disablePointerLeaveClose: props.disablePointerLeaveClose,
  unmountOnHide: props.unmountOnHide,
}))

const accordionProps = computed(() => ({
  collapsible: props.collapsible,
  disabled: props.disabled,
  type: props.type,
  unmountOnHide: props.unmountOnHide,
}))

const tooltipProps = computed<TooltipProps>(() => ({
  ...(isVertical.value ? { delay: 0, side: 'right' as const } : {}),
  ...(typeof props.tooltip === 'object' ? props.tooltip : {}),
}))

const popoverProps = computed<NavigationMenuPopoverProps>(() => ({
  mode: 'hover',
  side: 'right',
  align: 'start',
  ...(typeof props.popover === 'object' ? props.popover : {}),
}))

const lists = computed<NavigationMenuItem[][]>(() => {
  const items = props.items
  if (!items?.length) return []

  return Array.isArray(items[0])
    ? (items as NavigationMenuItem[][])
    : [items as NavigationMenuItem[]]
})

const getLabel = (item: NavigationMenuItem) => {
  return get(item, props.labelKey) as string | undefined
}

const getItemValue = (item: NavigationMenuItem, position: NavigationMenuItemPosition) => {
  const { index, level, listIndex } = position
  const prefix = lists.value.length > 1 ? `group-${listIndex}-` : ''

  return (
    (get(item, props.valueKey) as string | undefined) ??
    (level > 0 ? `${prefix}item-${level}-${index}` : `${prefix}item-${index}`)
  )
}

const getAccordionDefaultValue = (
  list: NavigationMenuItem[],
  { level, listIndex }: Omit<NavigationMenuItemPosition, 'index'>,
) => {
  const openValues = list.flatMap((item, index) =>
    item.defaultOpen || item.open ? [getItemValue(item, { index, level, listIndex })] : [],
  )

  return props.type === 'single' ? openValues[0] : openValues
}

const listProps = (list: NavigationMenuItem[], listIndex: number) => {
  if (!isVertical.value || isCollapsed.value) return {}

  return {
    ...accordionProps.value,
    modelValue: props.modelValue,
    defaultValue: props.defaultValue ?? getAccordionDefaultValue(list, { level: 0, listIndex }),
    'onUpdate:modelValue': (value: string | string[] | undefined) =>
      emit('update:modelValue', value),
  }
}

// One observer for every row's actions. The link's end padding is what the buttons cover of the row (their
// width plus their end inset) and a 12px gap before the label. Hidden actions (`display: none`) fall back to
// the one-button default.
let actionsObserver: ResizeObserver | undefined
const observeActions = (el: HTMLElement) => {
  if (typeof ResizeObserver === 'undefined') return () => {}

  actionsObserver ??= new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const row = target.parentElement
      if (!row) continue
      const box = target.getBoundingClientRect()
      if (!box.width) {
        row.style.removeProperty('--navigation-menu-actions-inset')
        continue
      }

      const rowBox = row.getBoundingClientRect()
      const covered =
        getComputedStyle(row).direction === 'rtl'
          ? box.right - rowBox.left
          : rowBox.right - box.left

      row.style.setProperty('--navigation-menu-actions-inset', `${covered + 12}px`)
    }
  })

  actionsObserver.observe(el)

  return () => actionsObserver?.unobserve(el)
}

onBeforeUnmount(() => actionsObserver?.disconnect())

provide(navigationMenuKey, {
  props: props as unknown as NavigationMenuProps,
  ui: ui as never,
  slots,
  accordionProps,
  tooltipProps,
  popoverProps,
  getLabel,
  getItemValue,
  getAccordionDefaultValue,
  observeActions,
})
</script>
