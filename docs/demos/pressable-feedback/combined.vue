<template>
  <div class="flex flex-wrap gap-3">
    <PressableFeedback
      :as="Button"
      variant="danger-soft"
      ripple
      hold
      :ui="{ hold: 'bg-danger text-danger-foreground' }"
    >
      <Icon icon="gravity-ui:trash-bin" />
      Delete project
    </PressableFeedback>
    <PressableFeedback :as="Button" variant="secondary" highlight progress>
      <Icon icon="gravity-ui:arrow-down-to-line" />
      Download report
    </PressableFeedback>
  </div>
</template>

<script setup lang="ts">
import { Button, PressableFeedback } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
