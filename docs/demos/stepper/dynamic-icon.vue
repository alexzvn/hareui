<template>
  <Stepper :items="items" :default-value="1" class="w-full max-w-lg">
    <template #indicator="{ state, ui }">
      <Icon :icon="icons[state]" :class="ui.icon()" />
    </template>
  </Stepper>
</template>

<script setup lang="ts">
import type { StepperItem, StepperItemState } from '@hareui/vue'
import { Stepper } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const icons: Record<StepperItemState, string> = {
  completed: 'gravity-ui:lock-open',
  active: 'gravity-ui:key',
  inactive: 'gravity-ui:lock',
}

const items: StepperItem[] = [{ title: 'Level 1' }, { title: 'Level 2' }, { title: 'Level 3' }]
</script>
