<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import type { KbdKey } from './kbdKeys'
import theme from './theme'

type Kbd = typeof theme

export interface KbdProps {
  /**
   * The element or component to render as.
   * @defaultValue 'kbd'
   */
  as?: PrimitiveProps['as']
  /** Modifier or special keys rendered as symbols before the content (HeroUI's `Kbd.Abbr keyValue`), each with its name as `title`. */
  keys?: KbdKey | KbdKey[]
  /** Visual variant. */
  variant?: ComponentVariants<Kbd>['variant']
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Kbd>
}

export interface KbdSlots {
  /** The key text after the symbols, wrapped in the `content` element (HeroUI's `Kbd.Content`). */
  default?: () => any
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'

import { useComponentUI } from '../../composables/useComponentUI'
import { kbdKeysLabelMap, kbdKeysMap } from './kbdKeys'

const props = withDefaults(defineProps<KbdProps>(), { as: 'kbd' })
const slots = defineSlots<KbdSlots>()

const ui = useComponentUI('kbd', theme, () => ({ variant: props.variant }))
const keyList = computed(() =>
  props.keys === undefined ? [] : Array.isArray(props.keys) ? props.keys : [props.keys],
)
</script>

<template>
  <Primitive :as="as" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <abbr
      v-for="(key, index) in keyList"
      :key="index"
      :class="ui.abbr({ class: props.ui?.abbr })"
      :title="kbdKeysLabelMap[key]"
      >{{ kbdKeysMap[key] }}</abbr
    ><span v-if="slots.default" :class="ui.content({ class: props.ui?.content })"><slot /></span>
  </Primitive>
</template>
