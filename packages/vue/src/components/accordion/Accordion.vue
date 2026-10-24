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

<script setup lang="ts" generic="T extends AccordionItem = AccordionItem">
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
import type { VNode } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { useExpandedValues } from '@/composables/useExpandedValues'
import type { ExpandedValue } from '@/composables/useExpandedValues'
import { animatePanel, onPanelReveal, setPanelStatic } from '@/utils/disclosurePanel'

import type {
  AccordionEmits,
  AccordionItem,
  AccordionProps,
  AccordionSlots,
  ItemSlotProps,
} from './Accordion.types'
import theme from './theme'

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

const toggle = (item: AccordionItem, index: number) => {
  if (isItemDisabled(item)) return

  const value = valueOf(item, index)
  setExpanded(value, !isExpanded(value))
}

const CHEVRON_DOWN =
  'M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06'

// HeroUI's `Accordion.Indicator`: a single child element is cloned with the indicator classes
// and state (React's `cloneElement`); anything else falls back to the default chevron.
const Indicator = ({ item, index, open }: ItemSlotProps) => {
  const shared = {
    class: ui.value.indicator({ class: props.ui?.indicator }),
    'data-slot': 'accordion-indicator',
    'data-expanded': open ? 'true' : undefined,
  }

  const rendered = slots.indicator?.({ item, index, open }) ?? []
  const children = rendered.filter((v: VNode) => v.type !== Comment)
  const [onlyChild] = children
  const isSingleElement =
    children.length === 1 && isVNode(onlyChild) && typeof onlyChild.type !== 'symbol'

  if (isSingleElement) return cloneVNode(onlyChild, shared, true)

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

// Panels animate with the same `--disclosure-panel-height` sequence as Disclosure. Inline
// function refs are re-invoked (null, then the element) on every render, so registration is
// keyed by element identity and cleaned up only when the element changes or on unmount.
const panels = new Map<ExpandedValue, { el: HTMLElement; stop: () => void }>()

const registerPanel = (value: ExpandedValue, el: unknown) => {
  if (!(el instanceof HTMLElement)) return

  const registered = panels.get(value)
  if (registered?.el === el) return

  registered?.stop()
  setPanelStatic(el, isExpanded(value))

  const stop = onPanelReveal(el, () => setExpanded(value, !isExpanded(value)))
  panels.set(value, { el, stop })
}

onBeforeUnmount(() => panels.forEach((p) => p.stop()))

const openStates = computed(() =>
  props.items.map((item, index) => {
    const value = valueOf(item, index)

    return [value, isExpanded(value)] as const
  }),
)

watch(
  openStates,
  (next, prev) => {
    const before = new Map(prev)

    for (const [value, open] of next) {
      const panel = panels.get(value)
      const hasToggled = before.has(value) && before.get(value) !== open
      if (panel && hasToggled) animatePanel(panel.el, open)
    }
  },
  { flush: 'post' },
)
</script>
