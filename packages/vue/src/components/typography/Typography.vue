<template>
  <Primitive
    v-if="prose"
    :as="as ?? 'div'"
    data-slot="prose"
    :class="ui.prose({ class: [props.ui?.prose, props.class] })"
  >
    <slot />
  </Primitive>
  <Primitive
    v-else
    :as="element"
    data-slot="typography"
    :data-type="type"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot />
  </Primitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type Typography = typeof theme

/** The semantic element each `type` renders by default (overridden by `as`). */
const defaultElementByType: Record<NonNullable<ComponentVariants<Typography>['type']>, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  'body-sm': 'p',
  'body-xs': 'p',
  code: 'code',
}

export type TypographyProps = {
  /**
   * The element or component to render as, overriding the element implied by `type`
   * (equivalent to HeroUI's `render` prop).
   */
  as?: PrimitiveProps['as']
  /**
   * Semantic typography style.
   * @defaultValue 'body'
   */
  type?: ComponentVariants<Typography>['type']
  /**
   * Text alignment.
   * @defaultValue 'start'
   */
  align?: ComponentVariants<Typography>['align']
  /**
   * Text color.
   * @defaultValue 'default'
   */
  color?: ComponentVariants<Typography>['color']
  /** Font weight override. */
  weight?: ComponentVariants<Typography>['weight']
  /**
   * Truncates the text to one line with ellipsis.
   * @defaultValue false
   */
  truncate?: boolean
  /**
   * Renders a rich prose container instead: children are plain HTML (headings, paragraphs,
   * links, lists, code, …) and receive HeroUI's default typography rhythm. `type`, `align`,
   * `color`, `weight` and `truncate` are ignored in this mode.
   * @defaultValue false
   */
  prose?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Typography>
}

export type TypographySlots = {
  /** Typography content. */
  default?: () => VNode[]
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

const props = withDefaults(defineProps<TypographyProps>(), {
  type: 'body',
  align: 'start',
  color: 'default',
  truncate: false,
  prose: false,
})

defineSlots<TypographySlots>()

const ui = useComponentUI('typography', theme, () => ({
  type: props.type,
  align: props.align,
  color: props.color,
  weight: props.weight,
  truncate: props.truncate,
}))

const element = computed(() => props.as ?? defaultElementByType[props.type ?? 'body'])
</script>
