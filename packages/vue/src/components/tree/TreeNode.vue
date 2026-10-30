<template>
  <li
    role="presentation"
    data-slot="tree-item"
    :style="attrs.style as StyleValue"
    :class="ui.item({ override: item.ui?.item })"
  >
    <TreeItemPrimitive
      v-slot="state"
      :value="item"
      :level="level"
      :disabled="item.disabled"
      :aria-setsize="setSize"
      :aria-posinset="index + 1"
      as-child
      @select="ctx.onSelect($event, item)"
      @toggle="ctx.onToggle($event, item)"
    >
      <WrapperOutlet
        v-if="ctx.slots[slotName('wrapper')]"
        :scope="scopeOf(state)"
        :data-index="attrs['data-index']"
      />
      <component
        :is="ctx.linkAs()"
        v-else
        :type="ctx.linkAs() === 'button' ? 'button' : undefined"
        :disabled="isRowDisabled || undefined"
        :data-index="attrs['data-index']"
        data-slot="tree-link"
        :style="{ '--tree-level': level }"
        :class="ui.link({ override: [item.ui?.link, item.class] })"
      >
        <span
          v-for="guide in level - 1"
          :key="guide"
          aria-hidden="true"
          data-slot="tree-guide-line"
          :style="{ '--tree-guide': guide - 1 }"
          :class="ui.guideLine({ override: item.ui?.guideLine })"
        />
        <!-- The row stays the only tab stop and owns the click: the checkbox only toggles the selection -->
        <Checkbox
          v-if="ctx.hasCheckbox()"
          :model-value="state.isIndeterminate ? 'indeterminate' : state.isSelected"
          :disabled="isRowDisabled"
          :aria-label="`Select ${label}`"
          tabindex="-1"
          :class="ui.linkCheckbox({ override: item.ui?.linkCheckbox })"
          @update:model-value="state.handleSelect()"
          @click.stop
        />
        <span
          aria-hidden="true"
          data-slot="tree-chevron"
          :data-leaf="isExpandable ? undefined : ''"
          :class="ui.linkChevron({ override: item.ui?.linkChevron })"
        >
          <TreeIcon
            :icon="ctx.icons().indicator"
            data-slot="tree-indicator"
            :class="ui.linkIndicator({ override: item.ui?.linkIndicator })"
          />
        </span>
        <component
          :is="ctx.slots[slotName()]"
          v-if="ctx.slots[slotName()]"
          v-bind="scopeOf(state)"
        />
        <template v-else>
          <component
            :is="ctx.slots[slotName('leading')]"
            v-if="ctx.slots[slotName('leading')]"
            v-bind="scopeOf(state)"
          />
          <TreeIcon
            v-else-if="leadingIcon(state.isExpanded)"
            :icon="leadingIcon(state.isExpanded)!"
            data-slot="tree-leading-icon"
            :class="ui.linkLeadingIcon({ override: item.ui?.linkLeadingIcon })"
          />
          <span
            v-if="label || ctx.slots[slotName('label')]"
            data-slot="tree-label"
            :class="ui.linkLabel({ override: item.ui?.linkLabel })"
          >
            <component
              :is="ctx.slots[slotName('label')]"
              v-if="ctx.slots[slotName('label')]"
              v-bind="scopeOf(state)"
            />
            <template v-else>{{ label }}</template>
          </span>
          <span
            v-if="item.trailingIcon || ctx.slots[slotName('trailing')]"
            data-slot="tree-trailing"
            :class="ui.linkTrailing({ override: item.ui?.linkTrailing })"
          >
            <component
              :is="ctx.slots[slotName('trailing')]"
              v-if="ctx.slots[slotName('trailing')]"
              v-bind="scopeOf(state)"
            />
            <TreeIcon
              v-else-if="item.trailingIcon"
              :icon="item.trailingIcon"
              data-slot="tree-trailing-icon"
              :class="ui.linkTrailingIcon({ override: item.ui?.linkTrailingIcon })"
            />
          </span>
        </template>
      </component>
      <DeferredClose
        v-if="ctx.isNested()"
        v-slot="{ open }"
        :open="isExpandable && state.isExpanded"
      >
        <Transition
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @after-enter="clearMotion"
          @enter-cancelled="clearMotion"
          @before-leave="onBeforeLeave"
          @leave="onLeave"
        >
          <ul
            v-if="open"
            role="group"
            data-slot="tree-group"
            :class="ui.listWithChildren({ override: item.ui?.listWithChildren })"
          >
            <TreeNode
              v-for="(child, childIndex) in item.children"
              :key="ctx.getKey(child)"
              :item="child"
              :index="childIndex"
              :set-size="item.children!.length"
              :level="level + 1"
            />
          </ul>
        </Transition>
      </DeferredClose>
    </TreeItemPrimitive>
  </li>
</template>

<script setup lang="ts">
import { TreeItem as TreeItemPrimitive } from 'reka-ui'
import { Comment, computed, defineComponent, inject, ref, useAttrs, watch } from 'vue'
import type { FunctionalComponent, StyleValue } from 'vue'

import Checkbox from '@/components/checkbox/Checkbox.vue'
import { resolveSlotName } from '@/utils/slotName'

import { treeContextKey } from './context'
import { TreeIcon } from './icons'
import type { TreeItem, TreeItemSlotProps } from './Tree.types'

defineOptions({ name: 'TreeNode', inheritAttrs: false })

const props = defineProps<{
  item: TreeItem
  /** The item's position among its siblings. */
  index: number
  /** The number of siblings, the item included. */
  setSize: number
  level: number
}>()

const ctx = inject(treeContextKey)!
const attrs = useAttrs()
const ui = computed(() => ctx.ui())

const label = computed(() => ctx.getLabel(props.item))
const isExpandable = computed(() => !!props.item.children?.length)
const isFolder = computed(() => Array.isArray(props.item.children))
const isRowDisabled = computed(() => ctx.isDisabled() || !!props.item.disabled)

type ItemState = {
  isExpanded: boolean
  isSelected: boolean
  isIndeterminate: boolean | undefined
  handleSelect: () => void
  handleToggle: () => void
}

// `#item`, `#item-leading`, … or, for an item with a `slot` field, `#{slot}`, `#{slot}-leading`, …
const slotName = (part?: 'wrapper' | 'leading' | 'label' | 'trailing') =>
  resolveSlotName({ slot: props.item.slot, suffix: part })

const scopeOf = (state: ItemState): TreeItemSlotProps => ({
  item: props.item,
  index: props.index,
  level: props.level,
  expanded: state.isExpanded,
  selected: state.isSelected,
  indeterminate: state.isIndeterminate,
  select: state.handleSelect,
  toggle: state.handleToggle,
  ui: ctx.ui(),
})

// The wrapper's root element becomes the treeitem. Declaring `scope` as the only prop makes Vue pass every other
// attribute `as-child` merges in (role, aria-*, tabindex, handlers) through to that element, which must be the
// slot's only root: a fragment can't take attributes.
const WrapperOutlet: FunctionalComponent<{ scope: TreeItemSlotProps }> = ({ scope }) => {
  const nodes = ctx.slots[slotName('wrapper')]?.(scope) ?? []

  return nodes.find((node) => node.type !== Comment)
}

WrapperOutlet.props = ['scope']

// A leaving group's rows are unmounted before they animate out, so they keep the state of their last render. When
// one update both collapses the group and changes its rows (a click that selects the folder alone), the group stays
// for one more render, which shows the rows' new state, and leaves after it. Opening isn't deferred.
const DeferredClose = defineComponent({
  props: { open: Boolean },
  setup(props, { slots }) {
    const wasOpen = ref(props.open)
    watch(
      () => props.open,
      (open) => {
        wasOpen.value = open
      },
      { flush: 'post' },
    )

    return () => slots.default?.({ open: props.open || wasOpen.value })
  },
})

const leadingIcon = (isExpanded: boolean) => {
  if (props.item.icon) return props.item.icon
  if (!isFolder.value) return undefined

  const { expanded, collapsed } = ctx.icons()

  return isExpanded ? expanded : collapsed
}

// Expand and collapse animate the list's height between 0 and its content height; the theme's transition sets the
// timing, and without one (reduced motion) Vue ends the transition at once.
const setMotion = (el: Element, { height, opacity }: { height: string; opacity: string }) => {
  const style = (el as HTMLElement).style
  style.overflow = 'hidden'
  style.height = height
  style.opacity = opacity
}

const clearMotion = (el: Element) => {
  const style = (el as HTMLElement).style
  style.removeProperty('overflow')
  style.removeProperty('height')
  style.removeProperty('opacity')
}

const onBeforeEnter = (el: Element) => setMotion(el, { height: '0px', opacity: '0' })

const onEnter = (el: Element) => {
  // Lay out the collapsed size first, so the change to the content height transitions.
  void (el as HTMLElement).offsetHeight
  setMotion(el, { height: `${el.scrollHeight}px`, opacity: '1' })
}

const onBeforeLeave = (el: Element) =>
  setMotion(el, { height: `${el.scrollHeight}px`, opacity: '1' })

const onLeave = (el: Element) => {
  void (el as HTMLElement).offsetHeight
  setMotion(el, { height: '0px', opacity: '0' })
}
</script>
