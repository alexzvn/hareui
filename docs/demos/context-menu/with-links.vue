<template>
  <div class="flex flex-col items-center gap-3">
    <ContextMenu :items="items">
      <img
        alt="A bowl of cherries"
        class="h-48 w-72 rounded-xl object-cover select-none"
        :src="photo"
      />
    </ContextMenu>
    <p class="text-sm text-muted">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ContextMenuEntry } from '@hareui/vue'
import { ContextMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const photo = 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/cherries.jpeg'
const message = ref('Right-click the photo')

const items: ContextMenuEntry[] = [
  {
    value: 'open',
    label: 'Open image in new tab',
    icon: icon('arrow-up-right-from-square'),
    href: photo,
    target: '_blank',
  },
  { type: 'separator' },
  {
    value: 'favourite',
    label: 'Add to favourites',
    icon: icon('star'),
    onSelect: () => {
      message.value = 'Added to favourites'
    },
  },
]
</script>
