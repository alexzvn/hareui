<template>
  <div class="flex flex-wrap gap-3">
    <PressableFeedback
      v-for="sweep in sweeps"
      :key="sweep"
      :as="Button"
      variant="secondary"
      :hold="{ sweep }"
    >
      <Icon :icon="`gravity-ui:arrow-${sweep}`" />
      Sweep {{ sweep }}
    </PressableFeedback>
  </div>
</template>

<script setup lang="ts">
import type { PressableFeedbackSweep } from '@hareui/vue'
import { Button, PressableFeedback } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const sweeps: PressableFeedbackSweep[] = ['right', 'left', 'down', 'up']
</script>
