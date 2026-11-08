<template>
  <component
    :is="source.href ? 'a' : 'span'"
    data-slot="chat-source-trigger"
    :href="source.href"
    :target="source.href ? target : undefined"
    :rel="source.href ? 'noopener noreferrer' : undefined"
    :tabindex="!source.href && isFocusable ? 0 : undefined"
    :class="ui.trigger()"
  >
    <slot name="icon">
      <FileTextIcon
        v-if="source.type === 'document'"
        data-slot="chat-source-icon"
        :class="ui.icon()"
      />
      <img
        v-else-if="source.favicon"
        data-slot="chat-source-icon"
        :src="source.favicon"
        alt=""
        :class="ui.favicon()"
      />
      <span
        v-else-if="initial"
        data-slot="chat-source-icon"
        aria-hidden="true"
        :class="ui.iconFallback()"
      >
        {{ initial }}
      </span>
    </slot>
    <span data-slot="chat-source-title" :class="ui.title()">
      <slot>{{ title }}</slot>
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VNode } from 'vue'

import { FileTextIcon } from '@/components/chat-attachment/icons'
import type { ComponentUI } from '@/types/tv'

import type { ResolvedSource } from './sourcePart'
import { sourceDomain } from './sourcePart'
import type theme from './theme'

// The chip of `ChatSource`, split out so the hover preview can wrap it without repeating the markup
const props = defineProps<{
  source: ResolvedSource
  target: string
  isFocusable: boolean
  ui: ComponentUI<typeof theme>
}>()

defineSlots<{ icon?: () => VNode[]; default?: () => VNode[] }>()

const domain = computed(() => sourceDomain(props.source.href))
const title = computed(() => props.source.title || domain.value || props.source.href)
const initial = computed(() => (domain.value || props.source.title || '').charAt(0).toUpperCase())
</script>
