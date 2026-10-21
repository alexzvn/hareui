<script setup lang="ts">
import type { NavigationMenuPopoverProps } from './types'
import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import { usePortal } from '../../composables/usePortal'
import Popover from '../popover/Popover.vue'
import popoverTheme from '../popover/theme'

// The popover shown for a collapsed item with children. HareUI's `Popover` opens on click only, so
// `mode: 'hover'` (the default) is built on Reka's HoverCard with the same surface classes.
const props = withDefaults(defineProps<NavigationMenuPopoverProps>(), {
  mode: 'hover',
  side: 'right',
  align: 'start',
  sideOffset: 8,
  alignOffset: 2,
  openDelay: 0,
  closeDelay: 100,
  portal: undefined,
})
defineSlots<{
  /** The trigger element. */
  default?: () => unknown
  /** The popover's content. */
  content?: (props: { close: () => void }) => unknown
}>()

const ui = useComponentUI('popover', popoverTheme, () => ({}))
const portalTarget = usePortal(() => props.portal)
const open = ref(false)

// Reka's `tooltip.open` event closes every other tooltip at once. Opening a hover popover sends it too,
// and listens for it, so moving down a collapsed rail swaps tooltips and popovers instantly instead of
// the previous one lingering for its close delay next to the new one.
const TOOLTIP_OPEN = 'tooltip.open'
let announcing = false
watch(open, (value) => {
  if (!value)
    return
  announcing = true
  document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN))
  announcing = false
})
function onOtherOpen() {
  if (!announcing)
    open.value = false
}
onMounted(() => document.addEventListener(TOOLTIP_OPEN, onOtherOpen))
onBeforeUnmount(() => document.removeEventListener(TOOLTIP_OPEN, onOtherOpen))
</script>

<template>
  <Popover
    v-if="mode === 'click'"
    :side="side"
    :align="align"
    :side-offset="sideOffset"
    :portal="portal"
    :class="props.class"
    :ui="{ dialog: 'p-0' }"
  >
    <slot />
    <template #content="{ close }">
      <slot name="content" :close="close" />
    </template>
  </Popover>
  <HoverCardRoot v-else v-model:open="open" :open-delay="openDelay" :close-delay="closeDelay">
    <HoverCardTrigger as-child>
      <slot />
    </HoverCardTrigger>
    <HoverCardPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
      <HoverCardContent
        data-slot="popover"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
        :collision-padding="8"
        :class="ui.base({ class: ['origin-(--reka-hover-card-content-transform-origin)', props.class] })"
      >
        <slot name="content" :close="() => { open = false }" />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
