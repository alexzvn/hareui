<template>
  <LinkResolver v-slot="resolved" :link="link" :button="!isLink">
    <component
      :is="tag"
      v-bind="rootAttrs"
      data-slot="item-card"
      :data-variant="variant"
      :data-active="isLink && resolved.active ? 'true' : undefined"
      :class="ui.base()"
    >
      <div v-if="icon || slots.icon" data-slot="item-card-icon" :class="ui.icon()">
        <slot name="icon">
          <IconRenderer v-if="icon" :icon="icon" />
        </slot>
      </div>
      <div data-slot="item-card-content" :class="ui.content()">
        <component
          :is="resolved.as"
          v-if="isPressable"
          v-bind="resolved.attrs"
          :aria-label="hasTitle ? undefined : attrs['aria-label']"
          :aria-labelledby="
            hasTitle
              ? undefined
              : (attrs['aria-labelledby'] ?? (hasDescription ? descriptionId : undefined))
          "
          :aria-describedby="hasTitle && hasDescription ? descriptionId : undefined"
          data-slot="item-card-title"
          :class="ui.title()"
          @click="onPress"
        >
          <slot name="title">{{ title }}</slot>
        </component>
        <span v-else-if="hasTitle" data-slot="item-card-title" :class="ui.title()">
          <slot name="title">{{ title }}</slot>
        </span>
        <span
          v-if="hasDescription"
          :id="descriptionId"
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
import { computed, inject, useAttrs, useId } from 'vue'

import { itemCardGroupContextKey } from '@/components/item-card-group/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { IconRenderer } from '@/utils/icon'
import { hasLink, LINK_PROP_DEFAULTS, LinkResolver, pickLinkProps } from '@/utils/link'
import { warn } from '@/utils/warn'

import type { ItemCardProps, ItemCardSlots } from './ItemCard.types'
import theme from './theme'

// Attributes go on the card element: under a router the resolver's root is `RouterLink`, not the card
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ItemCardProps>(), {
  ...LINK_PROP_DEFAULTS,
  as: 'div',
  variant: undefined,
})

const slots = defineSlots<ItemCardSlots>()

const group = inject(itemCardGroupContextKey, null)

const variant = computed(() => props.variant ?? group?.variant.value ?? 'default')
const isLink = computed(() => hasLink(props))
const hasTitle = computed(() => !!props.title || !!slots.title)
const hasDescription = computed(() => !!props.description || !!slots.description)

// The press target stretches over the card; without a title or description it would be an unnamed control
const attrs = useAttrs()
const hasAttrName = computed(() => !!attrs['aria-label'] || !!attrs['aria-labelledby'])
const isNamed = computed(() => hasTitle.value || hasDescription.value || hasAttrName.value)
const isPressable = computed(() => (isLink.value || !!props.onClick) && isNamed.value)

if ((isLink.value || props.onClick) && !isNamed.value)
  warn(
    'ItemCard: a pressable card needs a `title`, `description`, `aria-label` or `aria-labelledby` to name it; it renders without a press target.',
  )

const descriptionId = useId()

// A component `as` (a framework link) renders the link itself; any other `as` is the card's element
const isLinkComponent = computed(() => isLink.value && typeof props.as !== 'string')
const tag = computed(() => (isLinkComponent.value ? 'div' : props.as))

// Without a title the press target carries the consumer's name instead of the card
const rootAttrs = computed(() => {
  if (!isPressable.value || hasTitle.value) return attrs
  const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs

  return rest
})

const link = computed(() => ({
  ...pickLinkProps(props),
  as: isLinkComponent.value ? props.as : undefined,
}))

// The title is the press target: a disabled link has no `href` but still receives clicks
const onPress = (event: MouseEvent) => {
  if (props.disabled) return

  props.onClick?.(event)
}

const ui = useComponentUI('itemCard', {
  theme,
  variantProps: () => ({
    variant: variant.value,
    group: group?.layout.value ?? 'none',
    pressable: isPressable.value,
    disabled: props.disabled,
  }),
  props,
})
</script>
