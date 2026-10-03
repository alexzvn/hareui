<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { Component } from 'vue'
import type { ComponentSlots } from '../../types/tv'
import theme from './theme'

type Disclosure = typeof theme

export interface DisclosureProps {
  /**
   * The element or component to render the root as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** Text rendered by the default trigger. Ignored when `#trigger` is used. */
  title?: string
  /**
   * Identifies this disclosure inside a `DisclosureGroup` (HeroUI's `id`): the group's
   * `v-model` holds these values. Defaults to a generated id.
   */
  value?: string | number
  /** The controlled expanded state of the disclosure. Use with `v-model:open`. */
  open?: boolean
  /**
   * The expanded state of the disclosure when it is initially rendered. Use when you do not
   * need to control its expanded state.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /**
   * Whether the disclosure is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Disclosure>
}

export interface DisclosureSlots {
  /**
   * Replaces the whole trigger content (default: the `title` text followed by `#indicator`).
   * Compose it with your own interactive element (e.g. `Button`) for full control of the
   * trigger's look; the disclosure wires expand/collapse behavior onto that element.
   */
  trigger?: (props: {
    open: boolean
    /** The themed chevron (HeroUI's `Disclosure.Indicator`): render it with `<component :is="indicator" />`. */
    indicator: Component
  }) => any
  /** Replaces the chevron indicator rendered inside the default trigger. */
  indicator?: (props: { open: boolean }) => any
  /** The disclosure's panel content. */
  default?: () => any
}

export interface DisclosureEmits {
  /** Emitted when the expanded state changes. */
  'update:open': [value: boolean]
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, defineComponent, h, inject, onBeforeUnmount, onMounted, ref, useId, useSlots, watch } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import { animatePanel, onPanelReveal, setPanelStatic } from '../../utils/disclosurePanel'
import { disclosureGroupContextKey } from '../disclosure-group/context'

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply
const props = withDefaults(defineProps<DisclosureProps>(), { as: 'div', open: undefined })
const emit = defineEmits<DisclosureEmits>()
const slots = useSlots()
defineSlots<DisclosureSlots>()

const ui = useComponentUI('disclosure', theme, () => ({}))

// Inside a DisclosureGroup the group owns the expanded state (HeroUI's DisclosureGroup `expandedKeys`).
const group = inject(disclosureGroupContextKey, null)
const fallbackValue = useId()
const value = computed(() => props.value ?? fallbackValue)
const isDisabled = computed(() => props.disabled || !!group?.disabled.value)

const uncontrolled = ref(props.defaultOpen)
const isOpen = computed(() => group ? group.isExpanded(value.value) : props.open ?? uncontrolled.value)
function setOpen(open: boolean) {
  if (group) group.setExpanded(value.value, open)
  else uncontrolled.value = open
  emit('update:open', open)
}
function toggle() {
  if (!isDisabled.value) setOpen(!isOpen.value)
}

// The chevron, also handed to `#trigger` so custom triggers can render the themed indicator
// (HeroUI's `Disclosure.Indicator`). Extra attrs/classes merge onto the <svg>.
const Indicator = defineComponent({
  name: 'DisclosureIndicator',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h('svg', {
      ...attrs,
      'aria-hidden': 'true',
      'data-slot': 'disclosure-indicator',
      'fill': 'none',
      'height': '16',
      'role': 'presentation',
      'viewBox': '0 0 16 16',
      'width': '16',
      'xmlns': 'http://www.w3.org/2000/svg',
      'data-expanded': isOpen.value ? 'true' : undefined,
      'class': ui.value.indicator({ class: [props.ui?.indicator, attrs.class as string] }),
    }, [h('path', {
      'clip-rule': 'evenodd',
      'd': 'M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06',
      'fill': 'currentColor',
      'fill-rule': 'evenodd',
    })])
  },
})

const triggerId = useId()
const panelId = useId()

// Without `#trigger` the trigger is our own <button>; with it, Reka's Slot merges these attrs onto the
// slotted element. Keys are omitted rather than `undefined` so they don't erase the child's own attrs
// (e.g. Button's `data-slot="button"`).
const triggerAttrs = computed(() => ({
  'id': triggerId,
  'type': 'button',
  'aria-expanded': isOpen.value ? 'true' : 'false',
  'aria-controls': panelId,
  ...(isDisabled.value ? { disabled: true } : {}),
  ...(slots.trigger ? {} : { 'data-slot': 'disclosure-trigger', 'class': ui.value.trigger({ class: props.ui?.trigger }) }),
}))

const panel = ref<HTMLElement>()
let stopReveal: (() => void) | undefined
onMounted(() => {
  setPanelStatic(panel.value!, isOpen.value)
  stopReveal = onPanelReveal(panel.value!, () => setOpen(!isOpen.value))
})
onBeforeUnmount(() => stopReveal?.())

watch(isOpen, (open) => {
  if (panel.value) animatePanel(panel.value, open)
}, { flush: 'post' })
</script>

<template>
  <Primitive
    :as="as"
    data-slot="disclosure"
    :data-expanded="isOpen ? 'true' : undefined"
    :data-disabled="isDisabled ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <h3 data-slot="disclosure-heading" :class="ui.heading({ class: props.ui?.heading }) || undefined">
      <Primitive :as="slots.trigger ? undefined : 'button'" :as-child="!!slots.trigger" v-bind="triggerAttrs" @click="toggle">
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
      <div v-if="!!slots.default" data-slot="disclosure-body" :class="ui.body({ class: props.ui?.body })">
        <div :class="ui.bodyInner({ class: props.ui?.bodyInner }) || undefined">
          <slot />
        </div>
      </div>
    </div>
  </Primitive>
</template>
