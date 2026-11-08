<template>
  <div class="flex flex-wrap gap-3">
    <PressableFeedback :as="Button" variant="secondary" ripple>Default</PressableFeedback>
    <PressableFeedback :as="Button" variant="secondary" :ripple="{ duration: 450 }">
      Slow grow
    </PressableFeedback>
    <PressableFeedback
      :as="Button"
      variant="secondary"
      :ripple="{ hoverOpacity: 0, pressedOpacity: 0.24 }"
    >
      Stronger press
    </PressableFeedback>
    <PressableFeedback :as="Button" variant="secondary" ripple :ui="{ ripple: 'text-accent' }">
      Accent ripple
    </PressableFeedback>
  </div>
</template>

<script setup lang="ts">
import { Button, PressableFeedback } from '@hareui/vue'
</script>
