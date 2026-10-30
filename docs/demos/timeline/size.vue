<template>
  <div class="grid w-full gap-8 sm:grid-cols-3">
    <Timeline v-for="size in sizes" :key="size" :items="items" :size="size" />
  </div>
</template>

<script setup lang="ts">
import type { TimelineItem } from '@hareui/vue'
import { Timeline } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const sizes = ['sm', 'md', 'lg'] as const

const items: TimelineItem[] = [
  { title: 'Kiln loaded', description: '24 mugs, bisque firing', icon: icon('box') },
  { title: 'Glazes mixed', description: 'Celadon and iron red', icon: icon('paintbrush') },
  { title: 'Final firing', description: 'Cone 6, overnight', icon: icon('thunderbolt') },
]
</script>
