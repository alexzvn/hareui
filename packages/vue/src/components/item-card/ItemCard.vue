<template>
  <LinkResolver v-slot="resolved" :link="link" :button="!isLink" fallback="div">
    <component
      :is="isLink ? resolved.as : tag"
      v-bind="{ ...(isLink ? resolved.attrs : nativeAttrs), ...$attrs }"
      data-slot="item-card"
      :data-variant="variant"
      :data-active="isLink && resolved.active ? 'true' : undefined"
      :class="ui.base()"
      @click="onClick?.($event)"
    >
      <div v-if="icon || slots.icon" data-slot="item-card-icon" :class="ui.icon()">
        <slot name="icon">
          <IconRenderer v-if="icon" :icon="icon" />
        </slot>
      </div>
      <div data-slot="item-card-content" :class="ui.content()">
        <span v-if="title || slots.title" data-slot="item-card-title" :class="ui.title()">
          <slot name="title">{{ title }}</slot>
        </span>
        <span
          v-if="description || slots.description"
          data-slot="item-card-description"
          :class="ui.description()"
        >
          <slot name="description">{{ description }}</slot>
        </span>
        <slot />
      </div>
      <div v-if="slots.action" data-slot="item-card-action" :class="ui.action()">
        <slot name="action" />
      </div>
    </component>
  </LinkResolver>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

import { itemCardGroupContextKey } from '@/components/item-card-group/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { IconRenderer } from '@/utils/icon'
import type { LinkTarget } from '@/utils/link'
import { LinkResolver } from '@/utils/link'

import type { ItemCardProps, ItemCardSlots } from './ItemCard.types'
import theme from './theme'

// Attributes go on the rendered element: under a router the resolver's root is `RouterLink`, not the card
defineOptions({ inheritAttrs: false })

// `as` stays undefined so a card with a click listener can default to a `button`; an absent `active` leaves the
// router's match in charge, and an absent `download` adds no attribute
const props = withDefaults(defineProps<ItemCardProps>(), {
  as: undefined,
  variant: undefined,
  active: undefined,
  download: undefined,
})

const slots = defineSlots<ItemCardSlots>()

const group = inject(itemCardGroupContextKey, null)

const variant = computed(() => props.variant ?? group?.variant.value ?? 'default')
const isLink = computed(() => props.to !== undefined || props.href !== undefined)
const tag = computed(() => props.as ?? (props.onClick ? 'button' : 'div'))

// A component `as` (a framework link) renders the link itself; a string `as` only applies without a link
const link = computed<LinkTarget>(() => ({
  as: typeof props.as === 'string' ? undefined : props.as,
  to: props.to,
  href: props.href,
  target: props.target,
  rel: props.rel,
  download: props.download,
  external: props.external,
  replace: props.replace,
  exact: props.exact,
  active: props.active,
  disabled: props.disabled,
}))

const nativeAttrs = computed(() =>
  tag.value === 'button' ? { type: 'button', disabled: props.disabled || undefined } : {},
)

const ui = useComponentUI('itemCard', {
  theme,
  variantProps: () => ({
    variant: variant.value,
    group: group?.layout.value ?? 'none',
    pressable: isLink.value || !!props.onClick,
    disabled: props.disabled,
  }),
  props,
})
</script>
