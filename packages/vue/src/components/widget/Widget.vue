<template>
  <Primitive :as="as" data-slot="widget" :class="ui.base()">
    <slot v-if="slots.header" name="header" />
    <div v-else-if="hasHeader" data-slot="widget-header" :class="ui.header()">
      <span v-if="title || slots.title" data-slot="widget-title" :class="ui.title()">
        <slot name="title">{{ title }}</slot>
      </span>
      <span
        v-if="description || slots.description"
        data-slot="widget-description"
        :class="ui.description()"
      >
        <slot name="description">{{ description }}</slot>
      </span>
      <slot v-if="legend?.length || slots.legend" name="legend" :items="legend ?? []">
        <ul data-slot="widget-legend" :class="ui.legend()">
          <li
            v-for="item in legend"
            :key="item.label"
            data-slot="widget-legend-item"
            :class="ui.legendItem()"
          >
            <span
              aria-hidden="true"
              data-slot="widget-legend-item-dot"
              :class="ui.legendItemDot()"
              :style="{ backgroundColor: item.color }"
            />
            <span data-slot="widget-legend-item-label" :class="ui.legendItemLabel()">
              {{ item.label }}
            </span>
          </li>
        </ul>
      </slot>
    </div>
    <div data-slot="widget-content" :class="ui.content()">
      <slot />
    </div>
    <div v-if="slots.footer" data-slot="widget-footer" :class="ui.footer()">
      <slot name="footer" />
    </div>
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import theme from './theme'
import type { WidgetProps, WidgetSlots } from './Widget.types'

const props = withDefaults(defineProps<WidgetProps>(), { as: 'div' })
const slots = defineSlots<WidgetSlots>()

const ui = useComponentUI('widget', { theme: theme, variantProps: () => ({}), props })

const hasHeader = computed(
  () =>
    !!props.title ||
    !!props.description ||
    !!props.legend?.length ||
    !!slots.title ||
    !!slots.description ||
    !!slots.legend,
)
</script>
