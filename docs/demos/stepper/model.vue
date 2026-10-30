<template>
  <div class="flex w-full max-w-xl flex-col gap-6">
    <Stepper ref="stepper" v-model="step" :items="items" />

    <div class="flex items-center justify-between">
      <Button size="sm" variant="tertiary" :disabled="!stepper?.hasPrev" @click="stepper?.prev()">
        Back
      </Button>
      <span class="text-sm text-muted">
        {{ isFinished ? 'All set' : `Step ${step + 1} of ${items.length}` }}
      </span>
      <Button v-if="isFinished" size="sm" variant="tertiary" @click="step = 0">Start over</Button>
      <Button v-else-if="stepper?.hasNext" size="sm" @click="stepper?.next()">Continue</Button>
      <!-- A value past the last step marks every step completed -->
      <Button v-else size="sm" @click="step = items.length">Finish</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Button, Stepper } from '@hareui/vue'
import { computed, ref, useTemplateRef } from 'vue'

const step = ref(0)
const stepper = useTemplateRef('stepper')

const items: StepperItem[] = [
  { title: 'Event', description: 'Name and date' },
  { title: 'Venue', description: 'Pick a location' },
  { title: 'Guests', description: 'Send invites' },
  { title: 'Confirm', description: 'Review all' },
]

const isFinished = computed(() => step.value >= items.length)
</script>
