<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Accordion } from '@hareui/vue'

const items = [
  {
    content: 'Stay informed about your account activity with real-time notifications.',
    iconUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/3dicons/bell-small.png',
    subtitle: 'Receive account activity updates',
    label: 'Set Up Notifications',
  },
  {
    content: 'Enhance your browsing experience by installing our official browser extension',
    iconUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/3dicons/compass-small.png',
    subtitle: 'Connect your browser to your account',
    label: 'Set up Browser Extension',
  },
  {
    content: 'Begin your journey into the world of digital collectibles by creating your first NFT. ',
    iconUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/3dicons/mint-collective-small.png',
    subtitle: 'Create your first collectible',
    label: 'Mint Collectible',
  },
]

const ui = {
  item: "group/item first:**:data-[slot=accordion-trigger]:rounded-t-2xl last:[&:not(:has([data-slot=accordion-trigger][aria-expanded='true']))_[data-slot=accordion-trigger]]:rounded-b-2xl",
  trigger: 'group flex items-center gap-2 transition-none hover:bg-surface',
  indicator: 'text-muted/50 [&>svg]:size-4',
  bodyInner: 'text-muted/80',
}
</script>

<template>
  <Accordion class="bg-surface-1/10 w-full max-w-md rounded-2xl" :items="items" :ui="ui" variant="surface">
    <template #leading="{ item }">
      <img
        :alt="item.label"
        class="h-11 w-11 transition-[scale,rotate] duration-300 ease-out group-hover/item:scale-120 group-hover/item:-rotate-10 group-hover/item:drop-shadow-lg"
        :src="item.iconUrl"
      >
    </template>
    <template #label="{ item }">
      <div class="flex flex-col gap-0">
        <span class="leading-5 font-medium">{{ item.label }}</span>
        <span class="leading-6 font-normal text-muted/80">{{ item.subtitle }}</span>
      </div>
    </template>
    <template #indicator>
      <Icon height="16" icon="gravity-ui:chevron-down" width="16" />
    </template>
  </Accordion>
</template>
