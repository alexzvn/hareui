<template>
  <ListboxRoot
    ref="root"
    :as="as"
    :model-value="modelValue"
    :default-value="defaultValue"
    :multiple="multiple"
    :disabled="disabled"
    :highlight-on-hover="highlightOnHover"
    :loop="loop"
    :by="by"
    :selection-behavior="selectionBehavior"
    data-slot="command-palette"
    :class="ui.root()"
    @update:model-value="(value) => emit('update:modelValue', value)"
    @highlight="(payload) => emit('highlight', payload)"
    @entry-focus="(event) => emit('entryFocus', event)"
    @leave="(event) => emit('leave', event)"
  >
    <div v-if="slots.header" data-slot="command-palette-header" :class="ui.header()">
      <slot name="header" :ui="ui" />
    </div>

    <div v-if="input !== false" data-slot="command-palette-input" :class="ui.input()">
      <slot v-if="isBackShown" name="back" :ui="ui" :on-back="onBack">
        <Button
          v-if="back !== false"
          variant="ghost"
          size="sm"
          icon-only
          aria-label="Back"
          v-bind="backAttrs"
          data-slot="command-palette-back"
          :class="ui.back({ override: backAttrs.class })"
          @click="onBack"
        >
          <IconRenderer :icon="backIcon ?? BackIcon" />
        </Button>
      </slot>
      <IconRenderer
        v-else-if="icon !== false"
        :icon="icon ?? SearchIcon"
        data-slot="command-palette-input-icon"
        :class="ui.inputIcon()"
      />

      <ListboxFilter
        v-model="searchTerm"
        :auto-focus="autofocus"
        :disabled="disabled"
        :placeholder="placeholder"
        autocomplete="off"
        v-bind="inputAttrs"
        data-slot="command-palette-input-field"
        :class="ui.inputField({ override: inputAttrs.class })"
        @keydown.backspace="onBackspace"
      />

      <IconRenderer
        v-if="loading"
        :icon="loadingIcon"
        data-slot="command-palette-loading"
        :class="ui.loading()"
      />
      <IconRenderer
        v-else-if="trailingIcon"
        :icon="trailingIcon"
        data-slot="command-palette-input-trailing-icon"
        :class="ui.inputTrailingIcon()"
      />

      <slot name="close" :ui="ui">
        <CloseButton
          v-if="close"
          aria-label="Close"
          v-bind="closeAttrs"
          data-slot="command-palette-close"
          :class="ui.close({ override: closeAttrs.class })"
          @click="emit('update:open', false)"
        >
          <IconRenderer v-if="closeIcon" :icon="closeIcon" />
        </CloseButton>
      </slot>
    </div>

    <ListboxContent data-slot="command-palette-content" aria-label="Results" :class="ui.content()">
      <div
        v-if="filteredGroups.length"
        role="presentation"
        data-slot="command-palette-viewport"
        :class="ui.viewport()"
      >
        <ListboxVirtualizer
          v-if="virtualize"
          v-slot="{ option, virtualItem }"
          :options="filteredItems"
          :text-content="getLabel"
          :overscan="virtualizer.overscan"
          :estimate-size="virtualizer.estimateSize"
        >
          <CommandPaletteOption
            :item="option"
            :index="virtualItem.index"
            :group="rowGroups[virtualItem.index]"
          />
        </ListboxVirtualizer>

        <template v-else>
          <ListboxGroup
            v-for="group in filteredGroups"
            :key="`group-${group.id}`"
            data-slot="command-palette-group"
            :class="ui.group()"
          >
            <ListboxGroupLabel
              v-if="getLabel(group) || slots[groupLabelSlot(group)]"
              data-slot="command-palette-label"
              :class="ui.label()"
            >
              <SlotOutlet
                :name="groupLabelSlot(group)"
                :slot-props="{ group, label: getLabel(group), ui }"
              >
                {{ getLabel(group) }}
              </SlotOutlet>
            </ListboxGroupLabel>

            <CommandPaletteOption
              v-for="(item, index) in group.items"
              :key="`group-${group.id}-${index}`"
              :item="item"
              :index="index"
              :group="group"
            />
          </ListboxGroup>
        </template>
      </div>

      <div v-else data-slot="command-palette-empty" :class="ui.empty()">
        <slot name="empty" :search-term="searchTerm">
          {{ searchTerm ? `No matching data for "${searchTerm}"` : 'No data' }}
        </slot>
      </div>
    </ListboxContent>

    <div v-if="slots.footer" data-slot="command-palette-footer" :class="ui.footer()">
      <slot name="footer" :ui="ui" />
    </div>
  </ListboxRoot>
</template>

<script setup lang="ts" generic="T extends CommandPaletteItem = CommandPaletteItem">
import { defu } from 'defu'
import type { AcceptableValue } from 'reka-ui'
import {
  ListboxContent,
  ListboxFilter,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxRoot,
  ListboxVirtualizer,
} from 'reka-ui'
import type { Slots } from 'vue'
import { computed, nextTick, provide, shallowRef, toRef, useTemplateRef, watch } from 'vue'

import Button from '@/components/button/Button.vue'
import CloseButton from '@/components/close-button/CloseButton.vue'
import Spinner from '@/components/spinner/Spinner.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import type { IconValue } from '@/types/icon'
import { get } from '@/utils/get'
import { IconRenderer } from '@/utils/icon'
import { toText } from '@/utils/text'

import type {
  CommandPaletteEmits,
  CommandPaletteFuseOptions,
  CommandPaletteGroup,
  CommandPaletteItem,
  CommandPaletteProps,
  CommandPaletteResolvedItem,
  CommandPaletteSlots,
} from './CommandPalette.types'
import CommandPaletteOption from './CommandPaletteOption.vue'
import type { CommandPaletteContext } from './context'
import { commandPaletteKey, SlotOutlet } from './context'
import { BackIcon, SearchIcon } from './icons'
import theme from './theme'
import { useCommandPaletteSearch } from './useCommandPaletteSearch'

const props = withDefaults(defineProps<CommandPaletteProps<T>>(), {
  as: 'div',
  modelValue: undefined,
  defaultValue: undefined,
  highlightOnHover: true,
  selectionBehavior: 'toggle',
  placeholder: 'Type a command or search...',
  // `false` in its type would make Vue cast an absent `icon` to `false` (hidden).
  icon: undefined,
  autofocus: true,
  size: 'md',
  loading: false,
  close: false,
  back: true,
  input: true,
  virtualize: false,
  labelKey: 'label',
  descriptionKey: 'description',
  searchDelay: 0,
})

const emit = defineEmits<CommandPaletteEmits>()
const slots = defineSlots<CommandPaletteSlots<T>>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const ui = useComponentUI('commandPalette', {
  theme,
  variantProps: () => ({ size: props.size }),
  props,
  classSlot: 'root',
})

const root = useTemplateRef('root')

// Selecting an item with `children` pushes them as a group; the last one replaces `groups` until going back.
const history = shallowRef<(CommandPaletteGroup & { placeholder?: string })[]>([])

const currentNested = computed(() => history.value.at(-1))

// Searched as plain items: nested children aren't `T`.
const groups = computed<CommandPaletteGroup[]>(() =>
  currentNested.value ? [currentNested.value] : (props.groups ?? []),
)

const placeholder = computed(() => currentNested.value?.placeholder || props.placeholder)

const isBackShown = computed(() => !!currentNested.value && (props.back !== false || !!slots.back))

const { filteredGroups, filteredItems, fuseSearchTerm, fuse } = useCommandPaletteSearch({
  groups: () => groups.value,
  searchTerm,
  options: () => ({
    fuse: props.fuse as CommandPaletteFuseOptions | undefined,
    labelKey: props.labelKey,
    descriptionKey: props.descriptionKey,
    preserveGroupOrder: props.preserveGroupOrder,
    ignoreFilter: props.ignoreFilter,
    searchDelay: props.searchDelay,
  }),
})

// Virtualized rows render outside their `ListboxGroup`: the group of each row, by index, for its slots and
// highlighted icon.
const rowGroups = computed(() =>
  filteredGroups.value.flatMap((group) => group.items.map(() => group)),
)

const backOptions = computed(() => (typeof props.back === 'object' ? props.back : {}))
const backIcon = computed(() => backOptions.value.icon)

const backAttrs = computed(() => {
  const { icon: _icon, ...attrs } = backOptions.value

  return attrs
})

const closeOptions = computed(() => (typeof props.close === 'object' ? props.close : {}))
const closeIcon = computed(() => closeOptions.value.icon)

const closeAttrs = computed(() => {
  const { icon: _icon, ...attrs } = closeOptions.value

  return attrs
})

const inputAttrs = computed(() => (typeof props.input === 'object' ? props.input : {}))

// The input's spinner and loading items share it.
const loadingIcon = computed<IconValue>(
  () => (typeof props.loading === 'object' ? props.loading.icon : undefined) ?? Spinner,
)

const getLabel = (source: unknown) => toText(get(source, props.labelKey))

const groupLabelSlot = (group: CommandPaletteGroup) =>
  group.slot ? `${group.slot}-group-label` : 'group-label'

// Row heights (px) without / with a description line, at every size; the item theme pins them with `min-h-9` and
// paddings.
const ITEM_HEIGHT = 36
const ITEM_HEIGHT_WITH_DESCRIPTION = 52

const estimateItemSize = (index: number) => {
  if (slots['item-description']) return ITEM_HEIGHT_WITH_DESCRIPTION

  const item = filteredItems.value[index]

  return item && get(item, props.descriptionKey) ? ITEM_HEIGHT_WITH_DESCRIPTION : ITEM_HEIGHT
}

const virtualizer = computed(() => {
  const options = typeof props.virtualize === 'object' ? props.virtualize : {}

  return defu(options, { overscan: 12, estimateSize: estimateItemSize })
})

const getValue = (item: CommandPaletteResolvedItem): AcceptableValue => {
  if (props.valueKey) return get(item, props.valueKey) as AcceptableValue

  const {
    matches: _matches,
    group: _group,
    onSelect: _onSelect,
    children: _children,
    ...value
  } = item

  return value
}

const navigate = (item: CommandPaletteItem) => {
  history.value = [
    ...history.value,
    {
      id: `history-${history.value.length}`,
      label: item.label,
      slot: item.slot,
      placeholder: item.placeholder,
      items: item.children,
    },
  ]

  searchTerm.value = ''
  root.value?.highlightFirstItem()
}

const onBack = () => {
  if (history.value.length === 0) return

  history.value = history.value.slice(0, -1)
  searchTerm.value = ''
  root.value?.highlightFirstItem()
}

const onBackspace = () => {
  if (!searchTerm.value) onBack()
}

const onSelect = ({ event, item }: { event: Event; item: CommandPaletteResolvedItem }) => {
  if (!item.children?.length) {
    item.onSelect?.(event)
    return
  }

  event.preventDefault()
  navigate(item)
}

// New results highlight their first item. Without focus inside, only the selection is marked, so results
// arriving while the palette is off screen don't scroll the page to it.
watch(filteredGroups, () => {
  nextTick(() => {
    const element = (root.value as { $el?: HTMLElement } | null)?.$el
    if (element?.contains(document.activeElement)) {
      root.value?.highlightFirstItem()
      return
    }

    root.value?.highlightSelected(undefined, false)
  })
})

provide(commandPaletteKey, {
  props: props as CommandPaletteContext['props'],
  slots: slots as Slots,
  ui,
  searchTerm: fuseSearchTerm,
  isTokenSearch: toRef(() => !!fuse.value.fuseOptions.useTokenSearch),
  getValue,
  loadingIcon,
  onSelect,
})
</script>
