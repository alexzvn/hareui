<template>
  <button
    type="button"
    data-slot="prompt-suggestion-item"
    :disabled="disabled"
    :class="ui.item({ override: item.class })"
    @click="emit('select', item)"
  >
    <component :is="getSlot()" v-if="getSlot()" v-bind="scope" />
    <template v-else>
      <span data-slot="prompt-suggestion-item-text" :class="ui.itemText()">
        <span data-slot="prompt-suggestion-item-label" :class="ui.itemLabel()">
          <component :is="getSlot('leading')" v-if="getSlot('leading')" v-bind="scope" />
          <IconRenderer
            v-else-if="item.icon"
            :icon="item.icon"
            data-slot="prompt-suggestion-item-icon"
            :class="ui.itemIcon()"
          />
          <span>
            <component :is="getSlot('label')" v-if="getSlot('label')" v-bind="scope" />
            <template v-else>{{ item.label }}</template>
          </span>
        </span>
        <span
          v-if="item.description || getSlot('description')"
          data-slot="prompt-suggestion-item-description"
          :class="ui.itemDescription()"
        >
          <component :is="getSlot('description')" v-if="getSlot('description')" v-bind="scope" />
          <template v-else>{{ item.description }}</template>
        </span>
      </span>

      <span v-if="hasFooter" data-slot="prompt-suggestion-item-footer" :class="ui.itemFooter()">
        <component :is="getSlot('footer')" v-if="getSlot('footer')" v-bind="scope" />
        <template v-else>
          <span v-if="item.meta" data-slot="prompt-suggestion-item-meta" :class="ui.itemMeta()">
            {{ item.meta }}
          </span>
          <span
            v-if="item.tags?.length"
            data-slot="prompt-suggestion-item-tags"
            :class="ui.itemTags()"
          >
            <Chip v-for="tag in item.tags" :key="tag" as="span" size="sm" :label="tag" />
          </span>
        </template>
      </span>

      <template v-if="hasTrailing">
        <component :is="getSlot('trailing')" v-if="getSlot('trailing')" v-bind="scope" />
        <IconRenderer
          v-else-if="trailingIcon"
          :icon="trailingIcon"
          aria-hidden="true"
          data-slot="prompt-suggestion-item-trailing"
          :class="ui.itemTrailing()"
        />
        <svg
          v-else
          data-slot="prompt-suggestion-item-trailing"
          aria-hidden="true"
          fill="none"
          height="16"
          role="presentation"
          viewBox="0 0 16 16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
          :class="ui.itemTrailing()"
        >
          <path
            clip-rule="evenodd"
            d="M5.47 13.03a.75.75 0 0 1 0-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0"
            fill="currentColor"
            fill-rule="evenodd"
          />
        </svg>
      </template>
    </template>
  </button>
</template>

<script setup lang="ts">
// Internal: one suggestion of a PromptSuggestion, a native button. A pill puts the label and an end chevron on
// one row; a card stacks the label and description over a footer for `meta` and `tags`.
import type { VNode } from 'vue'
import { computed } from 'vue'

import Chip from '@/components/chip/Chip.vue'
import type { IconValue } from '@/types/icon'
import { IconRenderer } from '@/utils/icon'
import { resolveSlotName } from '@/utils/slotName'

import type {
  PromptSuggestionItem,
  PromptSuggestionItemSlotProps,
  PromptSuggestionUI,
} from './PromptSuggestion.types'

const props = withDefaults(
  defineProps<{
    item: PromptSuggestionItem
    variant: 'pill' | 'card'
    disabled: boolean
    trailingIcon?: IconValue | false
    ui: PromptSuggestionUI
    slots: Record<string, ((props: never) => VNode[]) | undefined>
  }>(),
  { trailingIcon: undefined },
)

const emit = defineEmits<{
  select: [item: PromptSuggestionItem]
}>()

const scope = computed<PromptSuggestionItemSlotProps>(() => ({
  item: props.item,
  disabled: props.disabled,
  ui: props.ui,
}))

type ItemPart = 'leading' | 'label' | 'description' | 'trailing' | 'footer'

// `#item`, `#item-leading`, … or, for an item with a `slot` field, `#{slot}`, `#{slot}-leading`, …
const getSlot = (part?: ItemPart) =>
  props.slots[resolveSlotName({ slot: props.item.slot, suffix: part })] as
    | ((props: PromptSuggestionItemSlotProps) => VNode[])
    | undefined

const isCard = computed(() => props.variant === 'card')

const hasFooter = computed(
  () => isCard.value && !!(props.item.meta || props.item.tags?.length || getSlot('footer')),
)

const hasTrailing = computed(() => !isCard.value && props.trailingIcon !== false)
</script>
