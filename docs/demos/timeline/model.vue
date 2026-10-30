<template>
  <div class="flex w-full max-w-sm flex-col gap-6">
    <Timeline v-model="step" :items="items" />

    <div class="flex gap-2">
      <Button size="sm" variant="secondary" :disabled="step === 0" @click="step--">Back</Button>
      <Button size="sm" :disabled="step === items.length - 1" @click="step++">Next stop</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TimelineItem } from '@hareui/vue'
import { Button, Timeline } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const step = ref(1)

const items: TimelineItem[] = [
  { title: 'Order placed', date: 'Tue 09:20', icon: icon('shopping-cart') },
  { title: 'Packed at the warehouse', date: 'Tue 15:45', icon: icon('box') },
  { title: 'Out for delivery', date: 'Wed 07:30', icon: icon('car') },
  { title: 'Delivered', date: 'Wed 12:10', icon: icon('house') },
]
</script>
