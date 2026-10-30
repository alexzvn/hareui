<template>
  <Stepper :items="items" :default-value="1" class="w-full max-w-lg">
    <template #upload-description="{ item, state }">
      <span v-if="state === 'active'" class="text-accent">{{ uploaded }} of 12 photos</span>
      <span v-else>{{ item.description }}</span>
    </template>

    <template #upload>
      <p class="text-sm text-muted">Drop your photos here, or pick them from your library.</p>
    </template>

    <template #content="{ item }">
      <p class="text-sm text-muted">{{ item.content }}</p>
    </template>
  </Stepper>
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'

const uploaded = 7

const items: StepperItem[] = [
  { title: 'Album', description: 'Name it', content: 'Give your album a name.' },
  { title: 'Photos', description: 'Add pictures', slot: 'upload' },
  { title: 'Share', description: 'Invite friends', content: 'Choose who can see it.' },
]
</script>
