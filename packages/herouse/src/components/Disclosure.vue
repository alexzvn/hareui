<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { Component } from 'vue'
import type { ComponentSlots } from '../types/tv'
import theme from '../theme/disclosure'

type Disclosure = typeof theme

export interface DisclosureProps {
  /**
   * The element or component to render the root as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** Text rendered by the default trigger. Ignored when `#trigger` is used. */
  title?: string
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
import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref, useId, useSlots, watch } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply
const props = withDefaults(defineProps<DisclosureProps>(), { as: 'div', open: undefined })
const emit = defineEmits<DisclosureEmits>()
const slots = useSlots()
defineSlots<DisclosureSlots>()

const ui = useComponentUI('disclosure', theme, () => ({}))

const uncontrolled = ref(props.defaultOpen)
const isOpen = computed(() => props.open ?? uncontrolled.value)
function setOpen(value: boolean) {
  uncontrolled.value = value
  emit('update:open', value)
}
function toggle() {
  if (!props.disabled) setOpen(!isOpen.value)
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
  ...(props.disabled ? { disabled: true } : {}),
  ...(slots.trigger ? {} : { 'data-slot': 'disclosure-trigger', 'class': ui.value.trigger({ class: props.ui?.trigger }) }),
}))

// Panel size animation, ported from react-aria's `useDisclosure` so the `--disclosure-panel-height`
// variable HeroUI's CSS transitions follows the same auto -> px -> 0px sequence.
const panel = ref<HTMLElement>()
function setSize(el: HTMLElement, size: 'auto' | '0px' | 'measure') {
  el.style.setProperty('--disclosure-panel-width', size === 'measure' ? `${el.scrollWidth}px` : size)
  el.style.setProperty('--disclosure-panel-height', size === 'measure' ? `${el.scrollHeight}px` : size)
}
const afterAnimations = (el: HTMLElement) => Promise.all(el.getAnimations().map(a => a.finished))

function setStatic(el: HTMLElement, open: boolean) {
  if (open) el.removeAttribute('hidden')
  else el.setAttribute('hidden', 'until-found')
  setSize(el, open ? 'auto' : '0px')
}

function onBeforeMatch() {
  // Find-in-page revealed the collapsed panel: restore `hidden` and let the state change open it.
  requestAnimationFrame(() => panel.value?.setAttribute('hidden', 'until-found'))
  setOpen(!isOpen.value)
}

onMounted(() => {
  setStatic(panel.value!, isOpen.value)
  panel.value!.addEventListener('beforematch', onBeforeMatch)
})
onBeforeUnmount(() => panel.value?.removeEventListener('beforematch', onBeforeMatch))

watch(isOpen, (open) => {
  const el = panel.value
  if (!el) return
  if (typeof el.getAnimations !== 'function') return setStatic(el, open)
  if (open) {
    el.removeAttribute('hidden')
    // Pixel size so it can animate; back to auto afterwards so the content can resize.
    setSize(el, 'measure')
    afterAnimations(el).then(() => setSize(el, 'auto')).catch(() => {})
  }
  else {
    setSize(el, 'measure')
    // Force style recalculation so the change to 0px animates.
    void getComputedStyle(el).height
    setSize(el, '0px')
    afterAnimations(el).then(() => el.setAttribute('hidden', 'until-found')).catch(() => {})
  }
}, { flush: 'post' })
</script>

<template>
  <Primitive
    :as="as"
    data-slot="disclosure"
    :data-expanded="isOpen ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
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
