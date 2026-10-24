<template>
  <Primitive :as="as" data-slot="card" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot name="leading" />
    <div
      v-if="!!slots.header || title || !!slots.title || description || !!slots.description"
      data-slot="card-header"
      :class="ui.header({ class: props.ui?.header })"
    >
      <slot name="header">
        <h3
          v-if="title || !!slots.title"
          data-slot="card-title"
          :class="ui.title({ class: props.ui?.title })"
        >
          <slot name="title">
            {{ title }}
          </slot>
        </h3>
        <p
          v-if="description || !!slots.description"
          data-slot="card-description"
          :class="ui.description({ class: props.ui?.description })"
        >
          <slot name="description">
            {{ description }}
          </slot>
        </p>
      </slot>
    </div>
    <div
      v-if="!!slots.default"
      data-slot="card-content"
      :class="ui.content({ class: props.ui?.content })"
    >
      <slot />
    </div>
    <div
      v-if="!!slots.footer"
      data-slot="card-footer"
      :class="ui.footer({ class: props.ui?.footer })"
    >
      <slot name="footer" />
    </div>
  </Primitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type Card = typeof theme

export type CardProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * Visual style of the card surface.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<Card>['variant']
  /** Title rendered in the header. */
  title?: string
  /** Description rendered under the title. */
  description?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Card>
}

export type CardSlots = {
  /**
   * Content rendered directly inside the root, before the header, without a wrapper
   * (e.g. an icon, an image, or a full-bleed background).
   */
  leading?: () => VNode[]
  /** Replaces the whole header (title and description). */
  header?: () => VNode[]
  /** Replaces the title text. */
  title?: () => VNode[]
  /** Replaces the description text. */
  description?: () => VNode[]
  /** Card content. */
  default?: () => VNode[]
  /** Card footer. */
  footer?: () => VNode[]
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

const props = withDefaults(defineProps<CardProps>(), { as: 'div' })
const slots = defineSlots<CardSlots>()

const ui = useComponentUI('card', theme, () => ({ variant: props.variant }))
</script>
