<template>
  <component
    :is="accordion ? AccordionItem : RekaNavigationMenuItem"
    as="li"
    v-bind="accordion ? { disabled: !!item.disabled } : {}"
    :value="value"
    :data-slot="level > 0 ? 'childItem' : 'item'"
    :class="
      level > 0
        ? ui.childItem({ override: item.ui?.childItem })
        : ui.item({ override: item.ui?.item })
    "
  >
    <div
      v-if="isGroupLabel"
      :id="disclosure ? disclosureIds.link : undefined"
      data-slot="label"
      :class="ui.label({ override: [item.ui?.label, item.class] })"
    >
      <NavigationMenuLinkBody
        :item="item"
        :index="index"
        :active="false"
        :disclosure="disclosure"
      />
    </div>

    <LinkResolver
      v-else-if="item.type !== 'label'"
      v-slot="link"
      :item="item"
      :button="accordion && hasChildren && item.type === 'trigger'"
    >
      <component
        :is="hasActions ? 'div' : Passthrough"
        v-bind="
          hasActions
            ? {
                'data-slot': 'linkRow',
                'data-active': activeOf(link) || undefined,
                class: ui.linkRow({ override: item.ui?.linkRow }),
              }
            : {}
        "
      >
        <component :is="outer" v-bind="outerProps">
          <component :is="kindOf(link)" v-bind="kindProps(kindOf(link), link)">
            <component
              :is="link.as"
              data-slot="link"
              :class="linkClass(link.active)"
              v-bind="linkAttrs(link)"
            >
              <NavigationMenuLinkBody
                :item="item"
                :index="index"
                :active="activeOf(link)"
                :disclosure="link.attrs.href ? disclosure : undefined"
              />
            </component>
          </component>

          <template v-if="popoverEnabled" #content="{ close }">
            <SlotOutlet
              :name="slotName(item, 'content')"
              :slot-props="{ item, active: activeOf(link), index, ui, close }"
            >
              <ul data-slot="childList" :class="ui.childList({ override: item.ui?.childList })">
                <li
                  data-slot="childLabel"
                  :class="ui.childLabel({ override: item.ui?.childLabel })"
                >
                  {{ label }}
                </li>
                <NavigationMenuChildLink
                  v-for="(child, childIndex) in item.children"
                  :key="childIndex"
                  :child="child"
                  :parent="item"
                />
              </ul>
            </SlotOutlet>
          </template>
        </component>

        <!-- A sibling of the link, never inside it: laid over the row's end. -->
        <div
          v-if="hasActions"
          :ref="setActionsEl"
          data-slot="linkActions"
          :class="ui.linkActions({ override: item.ui?.linkActions })"
        >
          <SlotOutlet
            :name="slotName(item, 'actions')"
            :slot-props="{ item, index, active: activeOf(link), ui }"
          />
          <Dropdown
            v-if="item.actions?.length"
            :items="item.actions"
            side="right"
            align="start"
            :side-offset="6"
            :disabled="!!item.disabled"
            :class="
              ui.linkActionsMenu({
                override: item.ui?.linkActionsMenu,
              })
            "
            @action="onAction"
          >
            <button
              type="button"
              data-slot="linkAction"
              :aria-label="`More actions for ${label}`"
              :class="ui.linkAction({ override: item.ui?.linkAction })"
            >
              <EllipsisVerticalIcon />
            </button>
            <template #item-leading="{ item: entry }">
              <IconRenderer
                v-if="entry.icon"
                :icon="entry.icon"
                data-slot="linkActionsItemIcon"
                :class="
                  ui.linkActionsItemIcon({
                    override: item.ui?.linkActionsItemIcon,
                    danger: entry.variant === 'danger',
                  })
                "
              />
            </template>
          </Dropdown>
        </div>
      </component>

      <NavigationMenuTabBridge v-if="horizontalContent" />
      <NavigationMenuContent
        v-if="horizontalContent"
        v-bind="ctx.props.content"
        data-slot="content"
        :class="ui.content({ override: item.ui?.content })"
      >
        <SlotOutlet
          :name="slotName(item, 'content')"
          :slot-props="{ item, active: activeOf(link), index, ui }"
        >
          <ul data-slot="childList" :class="ui.childList({ override: item.ui?.childList })">
            <NavigationMenuChildLink
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
              :child="child"
              :parent="item"
              detailed
            />
          </ul>
        </SlotOutlet>
      </NavigationMenuContent>
    </LinkResolver>

    <NavigationMenuAccordionContent
      v-if="accordion && hasChildren"
      :id="disclosureIds.region"
      :labelledby="disclosureIds.link"
      data-slot="content"
      :class="ui.content({ override: item.ui?.content })"
    >
      <AccordionRoot
        v-bind="ctx.accordionProps.value"
        :default-value="
          ctx.getAccordionDefaultValue(item.children!, { level: level + 1, listIndex })
        "
        as="ul"
        data-slot="childList"
        :class="ui.childList({ override: item.ui?.childList })"
      >
        <NavigationMenuNode
          v-for="(child, childIndex) in item.children"
          :key="childIndex"
          :item="child"
          :index="childIndex"
          :level="level + 1"
          :list-index="listIndex"
        />
      </AccordionRoot>
    </NavigationMenuAccordionContent>
  </component>
</template>

<script setup lang="ts">
import {
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
  injectAccordionRootContext,
  NavigationMenuContent,
  NavigationMenuItem as RekaNavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from 'reka-ui'
import { computed, useId } from 'vue'

import type {
  DropdownEntry,
  DropdownItem,
  DropdownValue,
} from '@/components/dropdown/Dropdown.types'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import Tooltip from '@/components/tooltip/Tooltip.vue'
import { IconRenderer } from '@/utils/icon'

import { SlotOutlet, slotName, useNavigationMenu } from './context'
import { EllipsisVerticalIcon } from './icons'
import type { ResolvedLink } from './LinkResolver'
import LinkResolver from './LinkResolver'
import type { NavigationMenuItem } from './NavigationMenu.types'
import NavigationMenuAccordionContent from './NavigationMenuAccordionContent.vue'
import NavigationMenuChildLink from './NavigationMenuChildLink.vue'
import NavigationMenuLinkBody from './NavigationMenuLinkBody.vue'
import NavigationMenuPopover from './NavigationMenuPopover.vue'
import NavigationMenuTabBridge from './NavigationMenuTabBridge'

// One item of the menu (recursive for vertical children).
const props = withDefaults(
  defineProps<{
    item: NavigationMenuItem
    index: number
    /** Nesting depth; 0 for top-level items. */
    level?: number
    /** Index of the list (group) the item belongs to. */
    listIndex?: number
  }>(),
  { level: 0, listIndex: 0 },
)

const ctx = useNavigationMenu()
const { ui } = ctx

// Renders a slot's children as-is: the "no tooltip / no popover" wrapper.
const Passthrough = (_: unknown, { slots }: { slots: { default?: () => unknown } }) =>
  slots.default?.()

const isVertical = computed(() => ctx.props.orientation === 'vertical')
const isCollapsed = computed(() => !!ctx.props.collapsed)
const accordion = computed(() => isVertical.value && !isCollapsed.value)
const hasChildren = computed(() => !!props.item.children?.length)
const hasContentSlot = computed(() => !!ctx.slots[slotName(props.item, 'content')])
const horizontalContent = computed(
  () => !isVertical.value && (hasChildren.value || hasContentSlot.value),
)

const label = computed(() => ctx.getLabel(props.item))

const value = computed(() =>
  ctx.getItemValue(props.item, {
    index: props.index,
    level: props.level,
    listIndex: props.listIndex,
  }),
)

const isGroupLabel = computed(() => isVertical.value && props.item.type === 'label')

const popoverEnabled = computed(
  () =>
    isVertical.value &&
    isCollapsed.value &&
    hasChildren.value &&
    (!!ctx.props.popover || !!props.item.popover),
)

const tooltipEnabled = computed(
  () =>
    (isVertical.value && isCollapsed.value && (!!ctx.props.tooltip || !!props.item.tooltip)) ||
    (!isVertical.value && !!props.item.tooltip),
)

const outer = computed(() => {
  if (popoverEnabled.value) return NavigationMenuPopover

  return tooltipEnabled.value ? Tooltip : Passthrough
})

const outerProps = computed(() => {
  if (popoverEnabled.value) {
    return {
      ...ctx.popoverProps.value,
      ...(typeof props.item.popover === 'object' ? props.item.popover : {}),
      class: ui.value.content({ override: props.item.ui?.content }),
    }
  }

  if (tooltipEnabled.value)
    return {
      text: label.value,
      ...ctx.tooltipProps.value,
      ...(typeof props.item.tooltip === 'object' ? props.item.tooltip : {}),
    }

  return {}
})

// Per-item actions: vertical expanded rows with `actions` or an actions slot.
const hasActions = computed(
  () =>
    accordion.value &&
    (!!props.item.actions?.length || !!ctx.slots[slotName(props.item, 'actions')]),
)

const linkClass = (active: boolean) => {
  return ui.value.link({
    override: [props.item.ui?.link, props.item.class],
    active: active || !!props.item.active,
    disabled: !!props.item.disabled,
    level: !isVertical.value || props.level > 0,
    actions: hasActions.value,
  })
}

// A stable function ref: Vue calls it on mount and unmount only.
let stopObservingActions: (() => void) | undefined
const setActionsEl = (el: unknown) => {
  stopObservingActions?.()
  stopObservingActions = el instanceof HTMLElement ? ctx.observeActions(el) : undefined
}

// The entry a Dropdown `action` names: an item, or one inside a section or a submenu.
const findAction = (entries: DropdownEntry[], value: DropdownValue): DropdownItem | undefined => {
  for (const entry of entries) {
    if ('value' in entry && entry.value === value) return entry
    const nested = 'items' in entry && entry.items ? findAction(entry.items, value) : undefined
    if (nested) return nested
  }

  return undefined
}

const onAction = (value: DropdownValue) => {
  const onSelect = findAction(props.item.actions ?? [], value)?.onSelect
  if (typeof onSelect === 'function') onSelect()
}

type Kind = typeof NavigationMenuTrigger | typeof AccordionTrigger | typeof NavigationMenuLink

const kindOf = (link: ResolvedLink): Kind => {
  if (horizontalContent.value) return NavigationMenuTrigger
  if (accordion.value && hasChildren.value && !link.attrs.href) return AccordionTrigger

  return NavigationMenuLink
}

const onSelect = (event: Event) => {
  if (!props.item.disabled) props.item.onSelect?.(event)
}

// Reka's link emits `select`; triggers don't, so their clicks stand in for it.
const kindProps = (kind: Kind, link: ResolvedLink) => {
  if (kind === NavigationMenuLink)
    return { asChild: true, active: link.active || !!props.item.active, onSelect: onSelect }

  return { asChild: true, disabled: !!props.item.disabled, onClick: onSelect }
}

const activeOf = (link: ResolvedLink) => link.active || !!props.item.active

// A vertical link with children: its chevron sits inside the anchor, so it can't be a button. The link itself
// carries the disclosure state (`aria-expanded` / `aria-controls`) and toggles with the arrow keys (ArrowRight
// expands, ArrowLeft collapses; mirrored in RTL, like Reka's vertical entry key); the chevron toggles on click.
const accordionRoot = injectAccordionRootContext(null)
const disclosureIds = { link: useId(), region: useId() }

const expanded = computed(() => {
  const open = accordionRoot?.modelValue.value
  return Array.isArray(open) ? open.includes(value.value) : open === value.value
})

const toggleExpanded = () => {
  // Same guard as Reka's AccordionTrigger: a single, non-collapsible accordion keeps its open item open.
  if (
    !accordionRoot ||
    props.item.disabled ||
    (accordionRoot.isSingle.value && expanded.value && !accordionRoot.collapsible)
  )
    return

  accordionRoot.changeModelValue(value.value)
}

const disclosure = computed(() =>
  accordion.value && hasChildren.value
    ? { open: expanded.value, toggle: toggleExpanded }
    : undefined,
)

// Which arrow collapses or expands the disclosure: ArrowLeft / ArrowRight, mirrored in RTL.
const DISCLOSURE_TOGGLE_KEYS = {
  ltr: { collapse: 'ArrowLeft', expand: 'ArrowRight' },
  rtl: { collapse: 'ArrowRight', expand: 'ArrowLeft' },
} as const

const onDisclosureKeydown = (event: KeyboardEvent) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return

  const isRtl = accordionRoot?.direction.value === 'rtl'
  const keys = isRtl ? DISCLOSURE_TOGGLE_KEYS.rtl : DISCLOSURE_TOGGLE_KEYS.ltr
  const toggleKey = expanded.value ? keys.collapse : keys.expand
  if (event.key !== toggleKey) return

  event.preventDefault()
  toggleExpanded()
}

const linkAttrs = (link: ResolvedLink) => {
  const attrs: Record<string, unknown> = { ...link.attrs }

  // The collapsed rail hides labels: name the icon-only link by its label.
  if (isVertical.value && isCollapsed.value && label.value) attrs['aria-label'] = label.value

  // A link (not an AccordionTrigger button, which names the region itself) labels its nested list.
  if (disclosure.value && kindOf(link) === NavigationMenuLink) attrs.id = disclosureIds.link

  if (disclosure.value && link.attrs.href)
    Object.assign(attrs, {
      'aria-expanded': expanded.value,
      'aria-controls': disclosureIds.region,
      onKeydown: onDisclosureKeydown,
    })

  return attrs
}
</script>
