<template>
  <Disclosure
    data-slot="chat-sources"
    :open="isOpen"
    :disabled="disabled"
    :ui="{
      base: ui.base(),
      heading: ui.heading(),
      content: ui.content(),
      body: ui.body(),
    }"
    @update:open="setOpen"
  >
    <template #trigger="{ indicator }">
      <button data-slot="chat-sources-trigger" :class="ui.trigger()">
        <span :class="ui.label()">
          <slot name="label" :count="resolved.length">
            <span v-if="stacked.length" data-slot="chat-sources-favicons" :class="ui.favicons()">
              <img
                v-for="source in stacked"
                :key="source.key"
                :src="source.favicon"
                alt=""
                :class="ui.favicon()"
              />
            </span>
            <span>{{ triggerLabel }}</span>
          </slot>
        </span>
        <component :is="indicator" :class="ui.indicator()" />
      </button>
    </template>
    <slot :open="isOpen">
      <div data-slot="chat-sources-list" :class="ui.list()">
        <template v-for="({ source, item }, index) in entries" :key="source.key">
          <slot name="source" :source="item" :index="index">
            <ChatSource
              :href="source.href"
              :title="source.title"
              :description="source.description"
              :favicon="source.favicon"
              :type="source.type"
              :target="target"
            />
          </slot>
        </template>
      </div>
    </slot>
  </Disclosure>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Disclosure from '@/components/disclosure/Disclosure.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useControllableOpen } from '@/composables/useControllableOpen'
import { useLocale } from '@/composables/useLocale'

import ChatSource from './ChatSource.vue'
import type { ChatSourcesEmits, ChatSourcesProps, ChatSourcesSlots } from './ChatSources.types'
import { resolveSource } from './sourcePart'
import sourcesTheme from './sourcesTheme'

// `open: undefined` keeps an absent prop uncontrolled instead of Vue's boolean `false`
const props = withDefaults(defineProps<ChatSourcesProps>(), {
  open: undefined,
  maxFavicons: 0,
  target: '_blank',
})

const emit = defineEmits<ChatSourcesEmits>()
defineSlots<ChatSourcesSlots>()

const { t } = useLocale()

const entries = computed(() =>
  (props.sources ?? []).map((item, index) => ({ item, source: resolveSource(item, index) })),
)

const resolved = computed(() => entries.value.map((entry) => entry.source))
const stacked = computed(() =>
  resolved.value.filter((source) => source.favicon).slice(0, props.maxFavicons),
)

const triggerLabel = computed(() => {
  const count = resolved.value.length

  return props.label ?? t(count === 1 ? 'chatSource.source' : 'chatSource.sources', { count })
})

const ui = useComponentUI('chatSources', { theme: sourcesTheme, variantProps: () => ({}), props })

const { isOpen, setOpen } = useControllableOpen({
  open: () => props.open,
  defaultOpen: props.defaultOpen,
  onUpdate: (open) => emit('update:open', open),
})
</script>
