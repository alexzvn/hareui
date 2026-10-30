<template>
  <div class="flex w-full max-w-lg flex-col gap-10">
    <Stepper :items="items" :default-value="1">
      <template #indicator>
        <span class="size-2 rounded-full bg-current" />
      </template>
    </Stepper>

    <Stepper :items="items" orientation="vertical" :default-value="1">
      <template #indicator>
        <span class="size-2 rounded-full bg-current" />
      </template>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'

const items: StepperItem[] = [
  { title: 'Signed up', description: 'Monday' },
  { title: 'First project', description: 'Today' },
  { title: 'Teammates', description: 'Up next' },
  { title: 'Upgrade', description: 'Later' },
]
</script>
