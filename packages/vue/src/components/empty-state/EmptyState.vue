<template>
  <div v-if="!isStructured" data-slot="empty-state" :class="ui.base()">
    <slot>{{ t('emptyState.label') }}</slot>
  </div>
  <div
    v-else
    data-slot="empty-state"
    :data-size="props.size"
    :data-variant="props.variant"
    :class="ui.base()"
  >
    <div v-if="hasHeader" data-slot="empty-state-header" :class="ui.header()">
      <div
        v-if="hasMedia"
        data-slot="empty-state-media"
        :data-variant="mediaKind === 'icon' ? 'icon' : 'default'"
        :class="ui.media()"
      >
        <slot name="leading">
          <Avatar v-if="props.avatar" :size="avatarSize" v-bind="props.avatar" />
          <IconRenderer v-else-if="props.icon" :icon="props.icon" />
        </slot>
      </div>
      <h3 v-if="props.title || slots.title" data-slot="empty-state-title" :class="ui.title()">
        <slot name="title">{{ props.title }}</slot>
      </h3>
      <p
        v-if="props.description || slots.description"
        data-slot="empty-state-description"
        :class="ui.description()"
      >
        <slot name="description">{{ props.description }}</slot>
      </p>
    </div>
    <div
      v-if="props.actions?.length || slots.actions"
      data-slot="empty-state-actions"
      :class="ui.actions()"
    >
      <slot name="actions">
        <Button
          v-for="(action, index) in props.actions"
          :key="index"
          v-bind="action"
          :size="action.size ?? props.size"
        />
      </slot>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Avatar from '@/components/avatar/Avatar.vue'
import Button from '@/components/button/Button.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'
import { IconRenderer } from '@/utils/icon'

import type { EmptyStateProps, EmptyStateSlots } from './EmptyState.types'
import theme from './theme'

const { t } = useLocale()

const props = withDefaults(defineProps<EmptyStateProps>(), { size: 'md', variant: 'default' })
const slots = defineSlots<EmptyStateSlots>()

// The media is a muted circle around an icon; an avatar or custom `#leading` content brings its own shape.
const mediaKind = computed(() => {
  if (slots.leading) return 'custom'
  if (props.avatar) return 'avatar'
  if (props.icon) return 'icon'

  return undefined
})

const hasMedia = computed(() => mediaKind.value !== undefined)

const hasHeader = computed(
  () =>
    hasMedia.value || !!props.title || !!slots.title || !!props.description || !!slots.description,
)

// Any part beyond the default slot switches from the plain line used inside lists and tables to the centred layout.
const isStructured = computed(() => hasHeader.value || !!props.actions?.length || !!slots.actions)

// The avatar is a step larger than the size: 40px at sm, 48px at md and lg.
const avatarSize = computed(() => (props.size === 'sm' ? 'md' : 'lg'))

const ui = useComponentUI('emptyState', {
  theme,
  variantProps: () => ({
    size: props.size,
    variant: props.variant,
    structured: isStructured.value,
    media: mediaKind.value ?? 'none',
  }),
  props,
})
</script>
