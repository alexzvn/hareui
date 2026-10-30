<template>
  <Timeline :items="items" :default-value="2" class="w-full max-w-sm">
    <template #indicator="{ index, state }">
      <Icon v-if="state === 'completed'" icon="gravity-ui:check" />
      <span v-else>{{ index + 1 }}</span>
    </template>
  </Timeline>
</template>

<script setup lang="ts">
import type { TimelineItem } from '@hareui/vue'
import { Timeline } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const items: TimelineItem[] = [
  { title: 'Preheat the oven', description: '220 °C with the stone inside.' },
  { title: 'Stretch the dough', description: 'Thin centre, thicker rim.' },
  { title: 'Add the toppings', description: 'Sauce first, cheese last.' },
  { title: 'Bake', description: 'Eight minutes, then rest for two.' },
]
</script>
