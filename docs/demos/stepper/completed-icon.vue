<template>
  <Stepper :items="items" :default-value="2" class="w-full max-w-lg">
    <template #indicator="{ index, state, ui }">
      <Icon v-if="state === 'completed'" icon="gravity-ui:circle-check-fill" :class="ui.icon()" />
      <template v-else>{{ index + 1 }}</template>
    </template>
  </Stepper>
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const items: StepperItem[] = [
  { title: 'Wash' },
  { title: 'Dry' },
  { title: 'Iron' },
  { title: 'Fold' },
]
</script>
