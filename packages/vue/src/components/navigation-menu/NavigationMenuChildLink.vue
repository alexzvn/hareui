<script setup lang="ts">
import type { NavigationMenuChildItem, NavigationMenuItem } from './NavigationMenu.vue'
import { NavigationMenuLink } from 'reka-ui'
import { get, useNavigationMenu } from './context'
import { ExternalIcon, NavigationMenuIcon } from './icons'
import LinkResolver from './LinkResolver'

// One link of an item's child list, in a dropdown content (`detailed`: label + description) or in
// the collapsed-rail popover (compact).
const props = defineProps<{
  child: NavigationMenuChildItem
  /** The item whose `children` this belongs to; its `ui` overrides apply. */
  parent: NavigationMenuItem
  detailed?: boolean
}>()

const ctx = useNavigationMenu()
const { ui } = ctx

function onSelect(event: Event) {
  if (!props.child.disabled)
    props.child.onSelect?.(event)
}

const label = () => get(props.child, ctx.props.labelKey as string) as string | undefined
const showExternal = () => props.child.target === '_blank' && ctx.props.externalIcon !== false
const customExternal = () => typeof ctx.props.externalIcon === 'boolean' ? undefined : ctx.props.externalIcon
</script>

<template>
  <li data-slot="childItem" :class="ui.childItem({ class: [ctx.props.ui?.childItem, parent.ui?.childItem] })">
    <LinkResolver v-slot="{ as, active, attrs }" :item="child">
      <NavigationMenuLink as-child :active="active" @select="onSelect">
        <component
          :is="as"
          v-bind="attrs"
          data-slot="childLink"
          :class="ui.childLink({ class: [ctx.props.ui?.childLink, parent.ui?.childLink, child.class], active, disabled: !!child.disabled })"
        >
          <NavigationMenuIcon v-if="child.icon" :icon="child.icon" data-slot="childLinkIcon" :class="ui.childLinkIcon({ class: [ctx.props.ui?.childLinkIcon, parent.ui?.childLinkIcon], active })" />

          <div v-if="detailed" data-slot="childLinkWrapper" :class="ui.childLinkWrapper({ class: [ctx.props.ui?.childLinkWrapper, parent.ui?.childLinkWrapper] })">
            <p data-slot="childLinkLabel" :class="ui.childLinkLabel({ class: [ctx.props.ui?.childLinkLabel, parent.ui?.childLinkLabel], active })">
              {{ label() }}
              <NavigationMenuIcon v-if="showExternal() && customExternal()" :icon="customExternal()!" data-slot="childLinkLabelExternalIcon" :class="ui.childLinkLabelExternalIcon({ class: [ctx.props.ui?.childLinkLabelExternalIcon, parent.ui?.childLinkLabelExternalIcon], active })" />
              <ExternalIcon v-else-if="showExternal()" data-slot="childLinkLabelExternalIcon" :class="ui.childLinkLabelExternalIcon({ class: [ctx.props.ui?.childLinkLabelExternalIcon, parent.ui?.childLinkLabelExternalIcon], active })" />
            </p>
            <p v-if="child.description" data-slot="childLinkDescription" :class="ui.childLinkDescription({ class: [ctx.props.ui?.childLinkDescription, parent.ui?.childLinkDescription], active })">
              {{ child.description }}
            </p>
          </div>
          <span v-else data-slot="childLinkLabel" :class="ui.childLinkLabel({ class: [ctx.props.ui?.childLinkLabel, parent.ui?.childLinkLabel], active })">
            {{ label() }}
            <NavigationMenuIcon v-if="showExternal() && customExternal()" :icon="customExternal()!" data-slot="childLinkLabelExternalIcon" :class="ui.childLinkLabelExternalIcon({ class: [ctx.props.ui?.childLinkLabelExternalIcon, parent.ui?.childLinkLabelExternalIcon], active })" />
            <ExternalIcon v-else-if="showExternal()" data-slot="childLinkLabelExternalIcon" :class="ui.childLinkLabelExternalIcon({ class: [ctx.props.ui?.childLinkLabelExternalIcon, parent.ui?.childLinkLabelExternalIcon], active })" />
          </span>
        </component>
      </NavigationMenuLink>
    </LinkResolver>
  </li>
</template>
