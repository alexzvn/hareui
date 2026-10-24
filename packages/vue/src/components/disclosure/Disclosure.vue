<template>
  <Primitive
    :as="as"
    data-slot="disclosure"
    :data-expanded="isOpen ? 'true' : undefined"
    :data-disabled="isDisabled ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <h3
      data-slot="disclosure-heading"
      :class="ui.heading({ class: props.ui?.heading }) || undefined"
    >
      <Primitive
        :as="slots.trigger ? undefined : 'button'"
        :as-child="!!slots.trigger"
        v-bind="triggerAttrs"
        @click="toggle"
      >
        <slot name="trigger" :open="isOpen" :indicator="Indicator">
          {{ title }}
          <slot name="indicator" :open="isOpen">
            <Indicator />
          </slot>
        </slot>
      </Primitive>
    </h3>
    <div
      :id="panelId"
      ref="panel"
      role="group"
      :aria-labelledby="triggerId"
      :aria-hidden="isOpen ? 'false' : 'true'"
      data-slot="disclosure-content"
      :data-expanded="isOpen ? 'true' : undefined"
      :class="ui.content({ class: props.ui?.content })"
    >
      <div
        v-if="!!slots.default"
        data-slot="disclosure-body"
        :class="ui.body({ class: props.ui?.body })"
      >
        <div :class="ui.bodyInner({ class: props.ui?.bodyInner }) || undefined">
          <slot />
        </div>
      </div>
    </div>
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import {
  computed,
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  useSlots,
  useTemplateRef,
  watch,
} from 'vue'

import { disclosureGroupContextKey } from '@/components/disclosure-group/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { animatePanel, onPanelReveal, setPanelStatic } from '@/utils/disclosurePanel'

import type { DisclosureEmits, DisclosureProps, DisclosureSlots } from './Disclosure.types'
import theme from './theme'

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply
const props = withDefaults(defineProps<DisclosureProps>(), { as: 'div', open: undefined })
const emit = defineEmits<DisclosureEmits>()
const slots = useSlots()
defineSlots<DisclosureSlots>()

const ui = useComponentUI('disclosure', { theme, variantProps: () => ({}) })

// Inside a DisclosureGroup the group owns the expanded state (HeroUI's DisclosureGroup `expandedKeys`).
const group = inject(disclosureGroupContextKey, null)
const fallbackValue = useId()
const value = computed(() => props.value ?? fallbackValue)
const isDisabled = computed(() => props.disabled || !!group?.disabled.value)

const uncontrolled = ref(props.defaultOpen)
const isOpen = computed(() =>
  group ? group.isExpanded(value.value) : (props.open ?? uncontrolled.value),
)

const storeOpen = (open: boolean) => {
  if (group) {
    group.setExpanded(value.value, open)
    return
  }

  uncontrolled.value = open
}

const setOpen = (open: boolean) => {
  storeOpen(open)
  emit('update:open', open)
}

const toggle = () => {
  if (!isDisabled.value) setOpen(!isOpen.value)
}

// The chevron, also handed to `#trigger` so custom triggers can render the themed indicator
// (HeroUI's `Disclosure.Indicator`). Extra attrs/classes merge onto the <svg>.
const Indicator = defineComponent({
  name: 'DisclosureIndicator',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        'svg',
        {
          ...attrs,
          'aria-hidden': 'true',
          'data-slot': 'disclosure-indicator',
          fill: 'none',
          height: '16',
          role: 'presentation',
          viewBox: '0 0 16 16',
          width: '16',
          xmlns: 'http://www.w3.org/2000/svg',
          'data-expanded': isOpen.value ? 'true' : undefined,
          class: ui.value.indicator({ class: [props.ui?.indicator, attrs.class as string] }),
        },
        [
          h('path', {
            'clip-rule': 'evenodd',
            d: 'M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06',
            fill: 'currentColor',
            'fill-rule': 'evenodd',
          }),
        ],
      )
  },
})

const triggerId = useId()
const panelId = useId()

// Without `#trigger` the trigger is our own <button>; with it, Reka's Slot merges these attrs onto the
// slotted element. Keys are omitted rather than `undefined` so they don't erase the child's own attrs
// (e.g. Button's `data-slot="button"`).
const triggerAttrs = computed(() => ({
  id: triggerId,
  type: 'button',
  'aria-expanded': isOpen.value ? 'true' : 'false',
  'aria-controls': panelId,
  ...(isDisabled.value ? { disabled: true } : {}),
  ...(slots.trigger
    ? {}
    : { 'data-slot': 'disclosure-trigger', class: ui.value.trigger({ class: props.ui?.trigger }) }),
}))

const panel = useTemplateRef<HTMLElement>('panel')
let stopReveal: (() => void) | undefined
onMounted(() => {
  setPanelStatic(panel.value!, isOpen.value)
  stopReveal = onPanelReveal(panel.value!, () => setOpen(!isOpen.value))
})

onBeforeUnmount(() => stopReveal?.())

watch(
  isOpen,
  (open) => {
    if (panel.value) animatePanel(panel.value, open)
  },
  { flush: 'post' },
)
</script>
