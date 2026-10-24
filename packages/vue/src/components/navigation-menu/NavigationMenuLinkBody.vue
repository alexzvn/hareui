<template>
  <SlotOutlet :name="slotName(item, '')" :slot-props="{ item, index, active, ui }">
    <SlotOutlet :name="slotName(item, 'leading')" :slot-props="{ item, active, index, ui }">
      <Avatar
        v-if="item.avatar"
        size="sm"
        v-bind="item.avatar"
        data-slot="linkLeadingAvatar"
        :class="
          ui.linkLeadingAvatar({
            class: [ctx.props.ui?.linkLeadingAvatar, item.ui?.linkLeadingAvatar],
            ...variantsOf(),
          })
        "
      />
      <Badge
        v-else-if="item.icon && item.chip"
        size="sm"
        v-bind="chipProps"
        data-slot="linkLeadingChip"
        :class="
          ui.linkLeadingChip({ class: [ctx.props.ui?.linkLeadingChip, item.ui?.linkLeadingChip] })
        "
      >
        <NavigationMenuIcon
          :icon="item.icon"
          data-slot="linkLeadingIcon"
          :class="
            ui.linkLeadingIcon({
              class: [ctx.props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon],
              ...variantsOf(),
            })
          "
        />
      </Badge>
      <NavigationMenuIcon
        v-else-if="item.icon"
        :icon="item.icon"
        data-slot="linkLeadingIcon"
        :class="
          ui.linkLeadingIcon({
            class: [ctx.props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon],
            ...variantsOf(),
          })
        "
      />
    </SlotOutlet>

    <span
      v-if="label || hasLabelSlot"
      data-slot="linkLabel"
      :class="ui.linkLabel({ class: [ctx.props.ui?.linkLabel, item.ui?.linkLabel] })"
    >
      <SlotOutlet :name="slotName(item, 'label')" :slot-props="{ item, active, index }">
        {{ label }}
      </SlotOutlet>
      <NavigationMenuIcon
        v-if="shouldShowExternal && externalIcon"
        :icon="externalIcon"
        data-slot="linkLabelExternalIcon"
        :class="
          ui.linkLabelExternalIcon({
            class: [ctx.props.ui?.linkLabelExternalIcon, item.ui?.linkLabelExternalIcon],
            active,
          })
        "
      />
      <ExternalIcon
        v-else-if="shouldShowExternal"
        data-slot="linkLabelExternalIcon"
        :class="
          ui.linkLabelExternalIcon({
            class: [ctx.props.ui?.linkLabelExternalIcon, item.ui?.linkLabelExternalIcon],
            active,
          })
        "
      />
    </span>

    <span
      v-if="hasTrailing"
      data-slot="linkTrailing"
      :data-state="trailingIsTrigger ? (disclosure!.open ? 'open' : 'closed') : undefined"
      :class="ui.linkTrailing({ class: [ctx.props.ui?.linkTrailing, item.ui?.linkTrailing] })"
      @click="onTrailingClick"
    >
      <SlotOutlet :name="slotName(item, 'trailing')" :slot-props="{ item, active, index, ui }">
        <Chip
          v-if="hasBadge"
          size="sm"
          variant="tertiary"
          v-bind="badgeProps"
          data-slot="linkTrailingBadge"
          :class="
            ui.linkTrailingBadge({
              class: [ctx.props.ui?.linkTrailingBadge, item.ui?.linkTrailingBadge],
            })
          "
        />
        <Kbd
          v-if="item.kbds?.length"
          :keys="kbd.keys"
          data-slot="linkTrailingKbd"
          :class="
            ui.linkTrailingKbd({ class: [ctx.props.ui?.linkTrailingKbd, item.ui?.linkTrailingKbd] })
          "
        >
          <template v-if="kbd.text" #default>
            {{ kbd.text }}
          </template>
        </Kbd>
        <NavigationMenuIcon
          v-if="hasIndicator && indicatorIcon"
          :icon="indicatorIcon"
          data-slot="linkTrailingIcon"
          :class="
            ui.linkTrailingIcon({
              class: [ctx.props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon],
              active,
            })
          "
        />
        <ChevronRightIcon
          v-else-if="hasIndicator && isVertical"
          data-slot="linkTrailingIcon"
          :class="
            ui.linkTrailingIcon({
              class: [ctx.props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon],
              active,
            })
          "
        />
        <ChevronDownIcon
          v-else-if="hasIndicator"
          data-slot="linkTrailingIcon"
          :class="
            ui.linkTrailingIcon({
              class: [ctx.props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon],
              active,
            })
          "
        />
        <NavigationMenuIcon
          v-else-if="item.trailingIcon"
          :icon="item.trailingIcon"
          data-slot="linkTrailingIcon"
          :class="
            ui.linkTrailingIcon({
              class: [ctx.props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon],
              active,
            })
          "
        />
      </SlotOutlet>
    </span>
  </SlotOutlet>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Avatar from '@/components/avatar/Avatar.vue'
import Badge from '@/components/badge/Badge.vue'
import Chip from '@/components/chip/Chip.vue'
import Kbd from '@/components/kbd/Kbd.vue'
import { kbdKeysMap } from '@/components/kbd/kbdKeys'

import { SlotOutlet, slotName, useNavigationMenu } from './context'
import { ChevronDownIcon, ChevronRightIcon, ExternalIcon, NavigationMenuIcon } from './icons'
import type { NavigationMenuItem } from './NavigationMenu.types'

// The contents of an item's link: leading (avatar / icon / chip), label, trailing (badge / kbds / chevron).
const props = defineProps<{
  item: NavigationMenuItem
  index: number
  active: boolean
  /**
   * The item's nested-list state (vertical items that are also links or group labels): the chevron then
   * toggles it on click. Pointer-only: the link carries the keyboard and ARIA side.
   */
  disclosure?: { open: boolean; toggle: () => void }
}>()

const ctx = useNavigationMenu()
const { ui } = ctx

const isVertical = computed(() => ctx.props.orientation === 'vertical')
const hasChildren = computed(() => !!props.item.children?.length)
const hasContentSlot = computed(() => !!ctx.slots[slotName(props.item, 'content')])
const hasLabelSlot = computed(() => !!ctx.slots[slotName(props.item, 'label')])
const hasTrailingSlot = computed(() => !!ctx.slots[slotName(props.item, 'trailing')])

const isDisabled = computed(() => !!props.item.disabled)
const label = computed(() => ctx.getLabel(props.item))
const hasBadge = computed(() => !!props.item.badge || props.item.badge === 0)

const hasIndicator = computed(
  () =>
    (!isVertical.value && (hasChildren.value || hasContentSlot.value)) ||
    (isVertical.value && hasChildren.value),
)

const hasTrailing = computed(
  () =>
    hasBadge.value ||
    !!props.item.kbds?.length ||
    hasIndicator.value ||
    !!props.item.trailingIcon ||
    hasTrailingSlot.value,
)

const trailingIsTrigger = computed(
  () => isVertical.value && hasChildren.value && !ctx.props.collapsed && !!props.disclosure,
)

const badgeProps = computed(() =>
  typeof props.item.badge === 'object' ? props.item.badge : { label: props.item.badge },
)

const chipProps = computed(() => (typeof props.item.chip === 'object' ? props.item.chip : {}))

const isKbdKey = (key: string): key is keyof typeof kbdKeysMap => key in kbdKeysMap

// Known keys render as their symbols; anything else is joined into literal text.
const kbd = computed(() => {
  const kbds = props.item.kbds ?? []

  return {
    keys: kbds.filter(isKbdKey),
    text: kbds.filter((key) => !isKbdKey(key)).join(''),
  }
})

const indicatorIcon = computed(() => props.item.trailingIcon || ctx.props.trailingIcon)

const externalIcon = computed(() =>
  typeof ctx.props.externalIcon === 'boolean' ? undefined : ctx.props.externalIcon,
)

const shouldShowExternal = computed(
  () => props.item.target === '_blank' && ctx.props.externalIcon !== false,
)

const variantsOf = () => {
  return { active: props.active, disabled: isDisabled.value }
}

// A click on the chevron of a link that has children toggles it instead of navigating.
const onTrailingClick = (event: Event) => {
  if (trailingIsTrigger.value) {
    event.preventDefault()
    event.stopPropagation()
    props.disclosure!.toggle()
  }
}
</script>
