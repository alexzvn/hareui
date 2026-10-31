<template>
  <li data-slot="childItem" :class="ui.childItem({ override: parent.ui?.childItem })">
    <LinkResolver v-slot="{ as, active, attrs }" :item="child">
      <NavigationMenuLink as-child :active="active" @select="onSelect">
        <component
          :is="as"
          v-bind="attrs"
          data-slot="childLink"
          :class="
            ui.childLink({
              override: [parent.ui?.childLink, child.class],
              active,
              disabled: !!child.disabled,
            })
          "
        >
          <IconRenderer
            v-if="child.icon"
            :icon="child.icon"
            data-slot="childLinkIcon"
            :class="
              ui.childLinkIcon({
                override: parent.ui?.childLinkIcon,
                active,
              })
            "
          />

          <div
            v-if="detailed"
            data-slot="childLinkWrapper"
            :class="
              ui.childLinkWrapper({
                override: parent.ui?.childLinkWrapper,
              })
            "
          >
            <p
              data-slot="childLinkLabel"
              :class="
                ui.childLinkLabel({
                  override: parent.ui?.childLinkLabel,
                  active,
                })
              "
            >
              {{ label() }}
              <IconRenderer
                v-if="showExternal() && customExternal()"
                :icon="customExternal()!"
                data-slot="childLinkLabelExternalIcon"
                :class="
                  ui.childLinkLabelExternalIcon({
                    override: parent.ui?.childLinkLabelExternalIcon,
                    active,
                  })
                "
              />
              <ExternalIcon
                v-else-if="showExternal()"
                data-slot="childLinkLabelExternalIcon"
                :class="
                  ui.childLinkLabelExternalIcon({
                    override: parent.ui?.childLinkLabelExternalIcon,
                    active,
                  })
                "
              />
            </p>
            <p
              v-if="child.description"
              data-slot="childLinkDescription"
              :class="
                ui.childLinkDescription({
                  override: parent.ui?.childLinkDescription,
                  active,
                })
              "
            >
              {{ child.description }}
            </p>
          </div>
          <span
            v-else
            data-slot="childLinkLabel"
            :class="
              ui.childLinkLabel({
                override: parent.ui?.childLinkLabel,
                active,
              })
            "
          >
            {{ label() }}
            <IconRenderer
              v-if="showExternal() && customExternal()"
              :icon="customExternal()!"
              data-slot="childLinkLabelExternalIcon"
              :class="
                ui.childLinkLabelExternalIcon({
                  override: parent.ui?.childLinkLabelExternalIcon,
                  active,
                })
              "
            />
            <ExternalIcon
              v-else-if="showExternal()"
              data-slot="childLinkLabelExternalIcon"
              :class="
                ui.childLinkLabelExternalIcon({
                  override: parent.ui?.childLinkLabelExternalIcon,
                  active,
                })
              "
            />
          </span>
        </component>
      </NavigationMenuLink>
    </LinkResolver>
  </li>
</template>

<script setup lang="ts">
import { NavigationMenuLink } from 'reka-ui'

import { get } from '@/utils/get'
import { IconRenderer } from '@/utils/icon'

import { useNavigationMenu } from './context'
import { ExternalIcon } from './icons'
import LinkResolver from './LinkResolver'
import type { NavigationMenuChildItem, NavigationMenuItem } from './NavigationMenu.types'

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

const onSelect = (event: Event) => {
  if (!props.child.disabled) props.child.onSelect?.(event)
}

const label = () => get(props.child, ctx.props.labelKey as string) as string | undefined
const showExternal = () => props.child.target === '_blank' && ctx.props.externalIcon !== false

const customExternal = () =>
  typeof ctx.props.externalIcon === 'boolean' ? undefined : ctx.props.externalIcon
</script>
