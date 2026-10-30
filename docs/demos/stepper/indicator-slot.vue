<template>
  <Stepper :items="items" orientation="vertical" :default-value="1">
    <template #indicator="{ state, ui }">
      <Icon v-if="state === 'completed'" icon="gravity-ui:check" :class="ui.icon()" />
      <span v-else class="size-2 rounded-full bg-current" />
    </template>
  </Stepper>
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const items: StepperItem[] = [
  { title: 'Soak', description: 'Overnight in cold water' },
  { title: 'Simmer', description: 'Two hours, lid on' },
  { title: 'Season', description: 'Salt at the end' },
  { title: 'Serve', description: 'With fresh herbs' },
]
</script>
