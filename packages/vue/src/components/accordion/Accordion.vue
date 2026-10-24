<template>
  <div data-slot="accordion" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <div
      v-for="(item, index) in items"
      :key="valueOf(item, index)"
      data-slot="accordion-item"
      :data-expanded="isExpanded(valueOf(item, index)) ? 'true' : undefined"
      :data-disabled="isItemDisabled(item) ? 'true' : undefined"
      :data-hide-separator="hideSeparator ? 'true' : undefined"
      :class="ui.item({ class: props.ui?.item })"
    >
      <h3 data-slot="accordion-heading" :class="ui.heading({ class: props.ui?.heading })">
        <button
          :id="`${id}-trigger-${index}`"
          type="button"
          data-slot="accordion-trigger"
          :aria-expanded="isExpanded(valueOf(item, index)) ? 'true' : 'false'"
          :aria-controls="`${id}-panel-${index}`"
          :disabled="isItemDisabled(item) || undefined"
          :class="ui.trigger({ class: props.ui?.trigger })"
          @click="toggle(item, index)"
        >
          <slot
            name="leading"
            :item="item"
            :index="index"
            :open="isExpanded(valueOf(item, index))"
          />
          <slot name="label" :item="item" :index="index" :open="isExpanded(valueOf(item, index))">
            {{ item.label }}
          </slot>
          <Indicator :item="item" :index="index" :open="isExpanded(valueOf(item, index))" />
        </button>
      </h3>
      <div
        :id="`${id}-panel-${index}`"
        :ref="(el) => registerPanel(valueOf(item, index), el)"
        role="group"
        :aria-labelledby="`${id}-trigger-${index}`"
        :aria-hidden="isExpanded(valueOf(item, index)) ? 'false' : 'true'"
        data-slot="accordion-panel"
        :data-expanded="isExpanded(valueOf(item, index)) ? 'true' : undefined"
        :class="ui.panel({ class: props.ui?.panel })"
      >
        <div data-slot="accordion-body" :class="ui.body({ class: props.ui?.body })">
          <div :class="ui.bodyInner({ class: props.ui?.bodyInner })">
            <slot
              :name="(item.slot || 'content') as 'content'"
              :item="item"
              :index="index"
              :open="isExpanded(valueOf(item, index))"
            >
              {{ item.content }}
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { ExpandedValue } from '@/composables/useExpandedValues'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'

import theme from './theme'

type Accordion = typeof theme

export type AccordionItem = {
  /** The trigger text, shown unless `#label` is used. */
  label?: string
  /** The value identifying this item (HeroUI's `id`). Defaults to the item's index. */
  value?: ExpandedValue
  /** Whether this item is disabled. */
  disabled?: boolean
  /** Name of a dynamic slot to render this item's body, taking precedence over `#content`. */
  slot?: string
  /** Fallback body text, used when no `#content`/`[item.slot]` slot is provided. */
  content?: string
  /** Extra fields (icons, subtitles, …) are passed through to the slots as `item`. */
  [key: string]: any
}

export type AccordionProps<T extends AccordionItem = AccordionItem> = {
  /** The items to render. */
  items: T[]
  /** The expanded item values. Use `v-model` to control them. */
  modelValue?: ExpandedValue[]
  /** The values expanded on first render (uncontrolled). */
  defaultValue?: ExpandedValue[]
  /**
   * Whether multiple items can be expanded at once (HeroUI's `allowsMultipleExpanded`).
   * @defaultValue false
   */
  multiple?: boolean
  /**
   * Whether the entire accordion is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * The visual variant of the accordion.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<Accordion>['variant']
  /**
   * Hide separator lines between accordion items.
   * @defaultValue false
   */
  hideSeparator?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Accordion>
}

type ItemSlotProps<T extends AccordionItem = AccordionItem> = {
  item: T
  index: number
  open: boolean
}

export type AccordionSlots<T extends AccordionItem = AccordionItem> = {
  /** Rendered in the trigger before the label (e.g. an icon). */
  leading?: (props: ItemSlotProps<T>) => any
  /** Replaces the trigger's label text. */
  label?: (props: ItemSlotProps<T>) => any
  /**
   * Replaces the chevron (HeroUI's `Accordion.Indicator` children). A single root element
   * receives the themed indicator classes and `data-expanded`, so it rotates like the default.
   */
  indicator?: (props: ItemSlotProps<T>) => any
  /** Body content for every item, overridden by `[item.slot]`. */
  content?: (props: ItemSlotProps<T>) => any
  /** Body content of the items whose `slot` names it. */
  [slot: string]: ((props: ItemSlotProps<T>) => any) | undefined
}

export type AccordionEmits = {
  /** Emitted when the expanded items change. */
  'update:modelValue': [value: ExpandedValue[]]
}
</script>

<script setup lang="ts" generic="T extends AccordionItem = AccordionItem">
import type { VNode } from 'vue'
import {
  cloneVNode,
  Comment,
  computed,
  h,
  isVNode,
  onBeforeUnmount,
  useId,
  useSlots,
  watch,
} from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { useExpandedValues } from '@/composables/useExpandedValues'
import { animatePanel, onPanelReveal, setPanelStatic } from '@/utils/disclosurePanel'

// `modelValue: undefined` keeps the uncontrolled mode when no `v-model` is bound.
const props = withDefaults(defineProps<AccordionProps<T>>(), { modelValue: undefined })
const emit = defineEmits<AccordionEmits>()
const slots = useSlots()
defineSlots<AccordionSlots<T>>()

const ui = useComponentUI('accordion', theme, () => ({ variant: props.variant }))

const { isExpanded, setExpanded } = useExpandedValues(props, (value) =>
  emit('update:modelValue', value),
)

const id = useId()
const valueOf = (item: AccordionItem, index: number) => item.value ?? index
const isItemDisabled = (item: AccordionItem) => props.disabled || !!item.disabled
function toggle(item: AccordionItem, index: number) {
  if (isItemDisabled(item)) return
  const value = valueOf(item, index)
  setExpanded(value, !isExpanded(value))
}

const CHEVRON_DOWN =
  'M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06'

// HeroUI's `Accordion.Indicator`: a single child element is cloned with the indicator classes
// and state (React's `cloneElement`); anything else falls back to the default chevron.
function renderIndicator(item: AccordionItem, index: number, open: boolean) {
  const shared = {
    class: ui.value.indicator({ class: props.ui?.indicator }),
    'data-slot': 'accordion-indicator',
    'data-expanded': open ? 'true' : undefined,
  }
  const children = (slots.indicator?.({ item, index, open }) ?? []).filter(
    (v: VNode) => v.type !== Comment,
  )
  if (children.length === 1 && isVNode(children[0]) && typeof children[0].type !== 'symbol')
    return cloneVNode(children[0], shared, true)
  return h(
    'svg',
    {
      ...shared,
      'aria-hidden': 'true',
      fill: 'none',
      height: '16',
      role: 'presentation',
      viewBox: '0 0 16 16',
      width: '16',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    [
      h('path', {
        'clip-rule': 'evenodd',
        d: CHEVRON_DOWN,
        fill: 'currentColor',
        'fill-rule': 'evenodd',
      }),
    ],
  )
}
const Indicator = (p: { item: AccordionItem; index: number; open: boolean }) =>
  renderIndicator(p.item, p.index, p.open)

// Panels animate with the same `--disclosure-panel-height` sequence as Disclosure. Inline
// function refs are re-invoked (null, then the element) on every render, so registration is
// keyed by element identity and cleaned up only when the element changes or on unmount.
const panels = new Map<ExpandedValue, { el: HTMLElement; stop: () => void }>()
function registerPanel(value: ExpandedValue, el: unknown) {
  if (!(el instanceof HTMLElement) || panels.get(value)?.el === el) return
  panels.get(value)?.stop()
  setPanelStatic(el, isExpanded(value))
  panels.set(value, { el, stop: onPanelReveal(el, () => setExpanded(value, !isExpanded(value))) })
}
onBeforeUnmount(() => panels.forEach((p) => p.stop()))

const openStates = computed(() =>
  props.items.map(
    (item, index) => [valueOf(item, index), isExpanded(valueOf(item, index))] as const,
  ),
)
watch(
  openStates,
  (next, prev) => {
    const before = new Map(prev)
    for (const [value, open] of next) {
      const panel = panels.get(value)
      if (panel && before.has(value) && before.get(value) !== open) animatePanel(panel.el, open)
    }
  },
  { flush: 'post' },
)
</script>
