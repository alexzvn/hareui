<template>
  <div
    role="group"
    data-slot="item-card-group"
    :data-layout="layout"
    :data-variant="variant"
    :aria-labelledby="hasTitle ? titleId : undefined"
    :aria-describedby="hasDescription ? descriptionId : undefined"
    :style="layout === 'grid' ? { '--item-card-group-columns': columns } : undefined"
    :class="ui.base()"
  >
    <div v-if="hasHeader" data-slot="item-card-group-header" :class="ui.header()">
      <slot name="header">
        <h3 v-if="hasTitle" :id="titleId" data-slot="item-card-group-title" :class="ui.title()">
          <slot name="title">{{ title }}</slot>
        </h3>
        <p
          v-if="hasDescription"
          :id="descriptionId"
          data-slot="item-card-group-description"
          :class="ui.description()"
        >
          <slot name="description">{{ description }}</slot>
        </p>
      </slot>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, useId } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import { itemCardGroupContextKey } from './context'
import type { ItemCardGroupProps, ItemCardGroupSlots } from './ItemCardGroup.types'
import theme from './theme'

const props = withDefaults(defineProps<ItemCardGroupProps>(), {
  layout: 'list',
  variant: 'default',
  columns: 2,
})

const slots = defineSlots<ItemCardGroupSlots>()

const ui = useComponentUI('itemCardGroup', {
  theme,
  variantProps: () => ({ variant: props.variant, layout: props.layout }),
  props,
})

const id = useId()
const titleId = `${id}-title`
const descriptionId = `${id}-description`

// A custom `#header` brings its own heading, so the ids only label the group when the built-in one renders
const hasTitle = computed(() => !slots.header && (!!props.title || !!slots.title))

const hasDescription = computed(() => !slots.header && (!!props.description || !!slots.description))

const hasHeader = computed(() => !!slots.header || hasTitle.value || hasDescription.value)

provide(itemCardGroupContextKey, {
  variant: computed(() => props.variant),
  layout: computed(() => props.layout),
})
</script>
