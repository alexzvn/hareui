<template>
  <div data-slot="prompt-suggestion" :data-variant="variant" :class="ui.base()">
    <div v-if="hasHeader" data-slot="prompt-suggestion-header" :class="ui.header()">
      <slot name="header">
        <h2 v-if="title || slots.title" data-slot="prompt-suggestion-title" :class="ui.title()">
          <slot name="title">{{ title }}</slot>
        </h2>
        <p
          v-if="description || slots.description"
          data-slot="prompt-suggestion-description"
          :class="ui.description()"
        >
          <slot name="description">{{ description }}</slot>
        </p>
      </slot>
    </div>

    <div v-if="rootItems.length" data-slot="prompt-suggestion-items" :class="ui.items()">
      <PromptSuggestionButton
        v-for="(item, index) in rootItems"
        :key="`${index}-${item.label}`"
        :item="item"
        :variant="variant"
        :disabled="disabled || !!item.disabled"
        :trailing-icon="trailingIcon"
        :ui="ui"
        :slots="slots"
        @select="onSelect"
      />
    </div>

    <section
      v-for="(group, groupIndex) in groupList"
      :key="`${groupIndex}-${group.label}`"
      data-slot="prompt-suggestion-group"
      :class="ui.group()"
    >
      <div
        v-if="group.label || group.description || slots['group-header']"
        data-slot="prompt-suggestion-group-header"
        :class="ui.groupHeader()"
      >
        <slot name="group-header" :group="group.source">
          <h3 v-if="group.label" data-slot="prompt-suggestion-group-label" :class="ui.groupLabel()">
            {{ group.label }}
          </h3>
          <p
            v-if="group.description"
            data-slot="prompt-suggestion-group-description"
            :class="ui.groupDescription()"
          >
            {{ group.description }}
          </p>
        </slot>
      </div>
      <div data-slot="prompt-suggestion-items" :class="ui.items()">
        <PromptSuggestionButton
          v-for="(item, index) in group.items"
          :key="`${index}-${item.label}`"
          :item="item"
          :variant="variant"
          :disabled="disabled || !!item.disabled"
          :trailing-icon="trailingIcon"
          :ui="ui"
          :slots="slots"
          @select="onSelect"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts" generic="T extends PromptSuggestionItem = PromptSuggestionItem">
import { computed } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import type {
  PromptSuggestionEmits,
  PromptSuggestionItem,
  PromptSuggestionProps,
  PromptSuggestionSlots,
} from './PromptSuggestion.types'
import PromptSuggestionButton from './PromptSuggestionButton.vue'
import theme from './theme'

const props = withDefaults(defineProps<PromptSuggestionProps<T>>(), {
  variant: 'pill',
  // `false` in the type makes Vue cast an absent prop to `false`; keep it undefined so the default chevron shows
  trailingIcon: undefined,
})

const emit = defineEmits<PromptSuggestionEmits<T>>()
const slots = defineSlots<PromptSuggestionSlots<T>>()

const ui = useComponentUI('promptSuggestion', {
  theme,
  variantProps: () => ({ variant: props.variant }),
  props,
})

const hasHeader = computed(
  () => !!(props.title || props.description || slots.header || slots.title || slots.description),
)

// A string suggestion is shorthand for `{ label }`
const toItems = (items: (T | string)[]) =>
  items.map((item) => (typeof item === 'string' ? ({ label: item } as T) : item))

const rootItems = computed(() => toItems(props.items ?? []))

const groupList = computed(() =>
  (props.groups ?? []).map((group) => ({
    label: group.label,
    description: group.description,
    items: toItems(group.items),
    source: group,
  })),
)

const onSelect = (item: PromptSuggestionItem) => {
  emit('select', item.prompt ?? item.label, item as T)
}
</script>
