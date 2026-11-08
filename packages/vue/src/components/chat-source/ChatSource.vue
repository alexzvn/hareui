<template>
  <span data-slot="chat-source" :data-source-type="source.type" :class="ui.base()">
    <Popover
      v-if="hasPreview"
      mode="hover"
      :ui="{ base: ui.preview(), dialog: ui.previewDialog() }"
    >
      <ChatSourceChip :source="source" :target="target" is-focusable :ui="ui">
        <template v-if="slots.icon" #icon><slot name="icon" /></template>
        <template v-if="slots.default" #default><slot /></template>
      </ChatSourceChip>
      <template #content>
        <slot name="preview">
          <component
            :is="source.href ? 'a' : 'div'"
            data-slot="chat-source-preview"
            :href="source.href"
            :target="source.href ? target : undefined"
            :rel="source.href ? 'noopener noreferrer' : undefined"
            :class="ui.previewLink()"
          >
            <span v-if="domain" :class="ui.previewHeader()">
              <img v-if="source.favicon" :src="source.favicon" alt="" :class="ui.favicon()" />
              <span :class="ui.previewDomain()">{{ domain }}</span>
            </span>
            <span v-if="source.title" :class="ui.previewTitle()">{{ source.title }}</span>
            <span v-if="source.description" :class="ui.previewDescription()">{{
              source.description
            }}</span>
          </component>
        </slot>
      </template>
    </Popover>
    <ChatSourceChip v-else :source="source" :target="target" :is-focusable="false" :ui="ui">
      <template v-if="slots.icon" #icon><slot name="icon" /></template>
      <template v-if="slots.default" #default><slot /></template>
    </ChatSourceChip>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Popover from '@/components/popover/Popover.vue'
import { useComponentUI } from '@/composables/useComponentUI'

import type { ChatSourceProps, ChatSourceSlots } from './ChatSource.types'
import ChatSourceChip from './ChatSourceChip.vue'
import { resolveSource, sourceDomain } from './sourcePart'
import theme from './theme'

// `preview: undefined` keeps the automatic preview instead of Vue's boolean `false`
const props = withDefaults(defineProps<ChatSourceProps>(), { preview: undefined, target: '_blank' })
const slots = defineSlots<ChatSourceSlots>()

const source = computed(() => {
  const fromPart = props.part ? resolveSource(props.part, 0) : undefined

  return {
    key: fromPart?.key ?? '',
    type: props.type ?? fromPart?.type ?? (props.href ? 'url' : 'document'),
    href: props.href ?? fromPart?.href,
    title: props.title ?? fromPart?.title,
    description: props.description,
    favicon: props.favicon,
  } as const
})

const domain = computed(() => sourceDomain(source.value.href))

const hasPreview = computed(
  () => props.preview ?? (source.value.type === 'url' && !!source.value.description),
)

const ui = useComponentUI('chatSource', {
  theme,
  variantProps: () => ({ link: !!source.value.href }),
  props,
})
</script>
