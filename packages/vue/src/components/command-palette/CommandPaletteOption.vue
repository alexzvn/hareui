<template>
  <ListboxItem
    :value="value"
    :disabled="item.disabled"
    :aria-disabled="item.disabled || undefined"
    :as="link.as"
    v-bind="link.attrs"
    data-slot="command-palette-item"
    :class="ui.item({ active: !!item.active, override: [item.ui?.item, item.class] })"
    @select="onItemSelect"
  >
    <SlotOutlet :name="slotName(target, '')" :slot-props="slotProps">
      <SlotOutlet :name="slotName(target, 'leading')" :slot-props="slotProps">
        <IconRenderer
          v-if="item.loading"
          :icon="ctx.loadingIcon.value"
          data-slot="command-palette-item-leading-icon"
          :class="ui.itemLeadingIcon({ override: item.ui?.itemLeadingIcon })"
        />
        <IconRenderer
          v-else-if="item.icon"
          :icon="item.icon"
          data-slot="command-palette-item-leading-icon"
          :class="ui.itemLeadingIcon({ active: !!item.active, override: item.ui?.itemLeadingIcon })"
        />
        <Avatar
          v-else-if="item.avatar"
          size="sm"
          v-bind="item.avatar"
          data-slot="command-palette-item-leading-avatar"
          :class="
            ui.itemLeadingAvatar({ override: [item.ui?.itemLeadingAvatar, item.avatar.class] })
          "
        />
        <Badge
          v-else-if="item.chip"
          color="accent"
          variant="primary"
          size="sm"
          v-bind="chipProps"
          data-slot="command-palette-item-leading-chip"
          :class="ui.itemLeadingChip({ override: [item.ui?.itemLeadingChip, chipProps.class] })"
        />
      </SlotOutlet>

      <span
        v-if="hasWrapper"
        data-slot="command-palette-item-wrapper"
        :class="ui.itemWrapper({ override: item.ui?.itemWrapper })"
      >
        <span
          data-slot="command-palette-item-label"
          :class="ui.itemLabel({ override: item.ui?.itemLabel })"
        >
          <SlotOutlet :name="slotName(target, 'label')" :slot-props="slotProps">
            <span
              v-if="item.prefix"
              data-slot="command-palette-item-label-prefix"
              :class="ui.itemLabelPrefix({ override: item.ui?.itemLabelPrefix })"
              >{{ item.prefix }}</span
            >
            <span
              data-slot="command-palette-item-label-base"
              :class="ui.itemLabelBase({ override: item.ui?.itemLabelBase })"
            >
              <Highlighted :segments="highlights.label" :text="label" />
            </span>
            <span
              v-if="item.suffix"
              data-slot="command-palette-item-label-suffix"
              :class="ui.itemLabelSuffix({ override: item.ui?.itemLabelSuffix })"
            >
              <Highlighted :segments="highlights.suffix" :text="item.suffix" />
            </span>
          </SlotOutlet>
        </span>

        <span
          v-if="description || hasSlot('description')"
          data-slot="command-palette-item-description"
          :class="ui.itemDescription({ override: item.ui?.itemDescription })"
        >
          <SlotOutlet :name="slotName(target, 'description')" :slot-props="slotProps">
            <Highlighted :segments="highlights.description" :text="description" />
          </SlotOutlet>
        </span>
      </span>

      <span
        data-slot="command-palette-item-trailing"
        :class="ui.itemTrailing({ override: item.ui?.itemTrailing })"
      >
        <SlotOutlet :name="slotName(target, 'trailing')" :slot-props="slotProps">
          <IconRenderer
            v-if="hasChildren"
            :icon="ctx.props.childrenIcon ?? ChildrenIcon"
            data-slot="command-palette-item-trailing-icon"
            :class="ui.itemTrailingIcon({ override: item.ui?.itemTrailingIcon })"
          />
          <span
            v-else-if="item.kbds?.length"
            data-slot="command-palette-item-trailing-kbds"
            :class="ui.itemTrailingKbds({ override: item.ui?.itemTrailingKbds })"
          >
            <Kbd
              v-for="(kbd, kbdIndex) in kbds"
              :key="kbdIndex"
              :keys="kbd.keys"
              :class="ui.itemTrailingKbd({ override: item.ui?.itemTrailingKbd })"
            >
              <template v-if="kbd.text" #default>{{ kbd.text }}</template>
            </Kbd>
          </span>
          <IconRenderer
            v-else-if="group?.highlightedIcon"
            :icon="group.highlightedIcon"
            data-slot="command-palette-item-trailing-highlighted-icon"
            :class="
              ui.itemTrailingHighlightedIcon({ override: item.ui?.itemTrailingHighlightedIcon })
            "
          />
        </SlotOutlet>

        <ListboxItemIndicator v-if="!hasChildren" as-child>
          <IconRenderer
            :icon="ctx.props.selectedIcon ?? SelectedIcon"
            data-slot="command-palette-item-selected-icon"
            :class="ui.itemTrailingIcon({ override: item.ui?.itemTrailingIcon })"
          />
        </ListboxItemIndicator>
      </span>
    </SlotOutlet>
  </ListboxItem>
</template>

<script setup lang="ts">
import { ListboxItem, ListboxItemIndicator } from 'reka-ui'
import { computed, getCurrentInstance } from 'vue'

import Avatar from '@/components/avatar/Avatar.vue'
import Badge from '@/components/badge/Badge.vue'
import Kbd from '@/components/kbd/Kbd.vue'
import type { KbdKey } from '@/components/kbd/kbdKeys'
import { kbdKeysMap } from '@/components/kbd/kbdKeys'
import { get } from '@/utils/get'
import { IconRenderer } from '@/utils/icon'
import { toText } from '@/utils/text'

import type {
  CommandPaletteGroup,
  CommandPaletteItemSlotProps,
  CommandPaletteResolvedItem,
} from './CommandPalette.types'
import { getHighlight } from './commandPaletteSearch'
import { Highlighted, SlotOutlet, slotName, useCommandPalette } from './context'
import { ChildrenIcon, SelectedIcon } from './icons'

// One command row: leading icon / avatar / chip, label and description (with search highlights), and trailing
// children icon, shortcut or highlighted icon, plus the selected check.
const props = defineProps<{
  item: CommandPaletteResolvedItem
  index: number
  group?: CommandPaletteGroup
}>()

const ctx = useCommandPalette()
const ui = computed(() => ctx.ui.value)

const target = computed(() => ({ item: props.item, group: props.group }))

const slotProps = computed<CommandPaletteItemSlotProps>(() => ({
  item: props.item,
  index: props.index,
  ui: ctx.ui.value,
}))

const hasSlot = (suffix: 'label' | 'description') => !!ctx.slots[slotName(target.value, suffix)]

const hasChildren = computed(() => !!props.item.children?.length)

// The app's `RouterLink` (vue-router), when it has one.
const RouterLink = getCurrentInstance()?.appContext.components.RouterLink

const toLinkAttrs = (attrs: Record<string, unknown>) => {
  return Object.fromEntries(Object.entries(attrs).filter(([, entry]) => entry !== undefined))
}

// What the row renders as: a router link for `to`, an anchor for `href`, a custom `as`, or a plain `div`. The row
// stays the single root element, so the virtualizer can position it.
const link = computed(() => {
  const {
    href,
    to,
    as,
    target: linkTarget,
    rel,
    download,
    external,
    replace,
    disabled,
  } = props.item

  const common = {
    target: linkTarget,
    rel: rel ?? (linkTarget === '_blank' ? 'noopener noreferrer' : undefined),
    download,
  }

  if (as !== undefined) return { as, attrs: toLinkAttrs({ ...common, to, href }) }

  const canRoute = to !== undefined && RouterLink && !external && linkTarget !== '_blank'
  if (canRoute && !disabled)
    return { as: RouterLink, attrs: toLinkAttrs({ ...common, to, replace }) }

  const url = href ?? (typeof to === 'string' ? to : undefined)
  if (url === undefined) return { as: 'div', attrs: {} }

  return { as: 'a', attrs: toLinkAttrs({ ...common, href: disabled ? undefined : url }) }
})

const value = computed(() => ctx.getValue(props.item))

const label = computed(() => toText(get(props.item, ctx.props.labelKey)))

const description = computed(() => toText(get(props.item, ctx.props.descriptionKey)))

const hasWrapper = computed(
  () =>
    !!(props.item.prefix || label.value || props.item.suffix || description.value) ||
    hasSlot('label') ||
    hasSlot('description'),
)

const highlights = computed(() => {
  const options = { searchTerm: ctx.searchTerm.value, useTokenSearch: ctx.isTokenSearch.value }
  const matches = props.item.matches

  return {
    label: getHighlight(matches, { ...options, key: ctx.props.labelKey }),
    suffix: getHighlight(matches, { ...options, key: 'suffix' }),
    description: getHighlight(matches, {
      ...options,
      key: ctx.props.descriptionKey,
    }),
  }
})

const chipProps = computed(() => (typeof props.item.chip === 'object' ? props.item.chip : {}))

const isKbdKey = (key: string): key is KbdKey => key in kbdKeysMap

// One `Kbd` per entry: a known key renders as its symbol, anything else as text.
const kbds = computed(() =>
  (props.item.kbds ?? []).map((key) =>
    isKbdKey(key) ? { keys: [key], text: '' } : { keys: [] as KbdKey[], text: key },
  ),
)

const onItemSelect = (event: Event) => ctx.onSelect({ event, item: props.item })
</script>
