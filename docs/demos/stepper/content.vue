<template>
  <div class="flex w-full max-w-2xl flex-col gap-6 sm:flex-row">
    <Stepper
      ref="stepper"
      v-model="step"
      :items="items"
      orientation="vertical"
      class="w-full gap-8"
      :ui="{ header: 'w-48 shrink-0' }"
    >
      <template #content="{ item }">
        <div class="flex flex-col gap-4">
          <Card>
            <template #header>
              <h3 class="text-base font-semibold text-foreground">{{ item.title }}</h3>
            </template>
            <p class="text-sm text-muted">{{ item.content }}</p>
          </Card>

          <div class="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="tertiary"
              :disabled="!stepper?.hasPrev"
              @click="stepper?.prev()"
            >
              Previous
            </Button>
            <Button size="sm" :disabled="!stepper?.hasNext" @click="stepper?.next()">Next</Button>
          </div>
        </div>
      </template>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Button, Card, Stepper } from '@hareui/vue'
import { ref, useTemplateRef } from 'vue'

const step = ref(0)
const stepper = useTemplateRef('stepper')

const items: StepperItem[] = [
  {
    title: 'Repository',
    description: 'Connect your code',
    content: 'Pick the repository and branch to deploy from.',
  },
  {
    title: 'Build',
    description: 'Set the commands',
    content: 'Choose the install and build commands and the output folder.',
  },
  {
    title: 'Environment',
    description: 'Add secrets',
    content: 'Add the variables your app reads at runtime.',
  },
  {
    title: 'Deploy',
    description: 'Go live',
    content: 'Review the settings and start the first deployment.',
  },
]
</script>
