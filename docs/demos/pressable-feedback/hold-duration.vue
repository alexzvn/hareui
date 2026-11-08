<template>
  <div class="flex flex-wrap gap-3">
    <PressableFeedback
      v-for="option in options"
      :key="option.duration"
      :as="Button"
      variant="danger-soft"
      :hold="{ duration: option.duration }"
      :ui="{ hold: 'bg-danger text-danger-foreground' }"
    >
      <Icon icon="gravity-ui:trash-bin" />
      {{ option.label }}
    </PressableFeedback>
  </div>
</template>

<script setup lang="ts">
import { Button, PressableFeedback } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const options = [
  { duration: 600, label: 'Quick (0.6s)' },
  { duration: 2000, label: 'Default (2s)' },
  { duration: 3500, label: 'Careful (3.5s)' },
]
</script>
