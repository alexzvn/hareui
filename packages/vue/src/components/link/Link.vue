<template>
  <Primitive
    :as="as"
    :href="isDisabled ? undefined : href"
    :role="hrefless ? 'link' : undefined"
    :tabindex="hrefless && !isDisabled ? 0 : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :data-disabled="isDisabled ? 'true' : undefined"
    data-slot="link"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @click="onClick"
    @keydown="onKeydown"
  >
    <Icon v-if="showIcon && iconPlacement === 'start'" />
    <slot />
    <Icon v-if="showIcon && iconPlacement === 'end'" />
  </Primitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import type { ComponentSlots } from '../../types/tv'
import theme from './theme'

type Link = typeof theme

export interface LinkProps {
  /**
   * The element or component to render as, e.g. a router link component.
   * @defaultValue 'a'
   */
  as?: PrimitiveProps['as']
  /** The URL the link points to. */
  href?: string
  /** Whether the link is disabled: sets `aria-disabled` and blocks navigation. */
  disabled?: boolean
  /**
   * Show the icon (HeroUI's `Link.Icon`). Defaults to the external-link arrow; fill `#icon` to replace it.
   * @defaultValue false
   */
  icon?: boolean
  /**
   * Which side of the text the icon goes on.
   * @defaultValue 'end'
   */
  iconPlacement?: 'start' | 'end'
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Link>
}

export interface LinkSlots {
  /** The link text. */
  default?: () => any
  /** Custom icon content; renders the icon wrapper even when `icon` is not set. */
  icon?: () => any
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, h } from 'vue'

import { useComponentUI } from '../../composables/useComponentUI'
import { useFieldsetDisabled } from '../fieldset/context'

const props = withDefaults(defineProps<LinkProps>(), { as: 'a', iconPlacement: 'end' })
const slots = defineSlots<LinkSlots>()

const ui = useComponentUI('link', theme, () => ({}))
const isDisabled = useFieldsetDisabled(() => props.disabled)
const showIcon = computed(() => props.icon || !!slots.icon)

// HeroUI's ExternalLinkIcon (9×9, viewBox 0 0 7 7).
const defaultIcon = () =>
  h(
    'svg',
    {
      'aria-hidden': 'true',
      'data-slot': 'link-default-icon',
      fill: 'none',
      height: '9',
      role: 'presentation',
      viewBox: '0 0 7 7',
      width: '9',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    [
      h('path', {
        d: 'M1.20592 6.84333L0.379822 6.01723L4.52594 1.8672H1.37819L1.38601 0.731812H6.48742V5.83714H5.34421L5.35203 2.6933L1.20592 6.84333Z',
        fill: 'currentColor',
      }),
    ],
  )
const Icon = () =>
  h(
    'span',
    {
      class: ui.value.icon({ class: props.ui?.icon }),
      'data-default-icon': slots.icon ? undefined : 'true',
      'data-slot': 'link-icon',
    },
    slots.icon ? slots.icon() : defaultIcon(),
  )

// React Aria renders a Link without an href (or a disabled one) as `role="link"`, focusable unless disabled and
// activated by Enter; a native anchor only gets that from its href.
const hrefless = computed(() => props.as === 'a' && (isDisabled.value || !props.href))

function onClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (hrefless.value && !isDisabled.value && event.key === 'Enter' && !event.repeat) {
    event.preventDefault()
    ;(event.currentTarget as HTMLElement).click()
  }
}
</script>
