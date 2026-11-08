<template>
  <div class="flex flex-wrap gap-3">
    <PressableFeedback :as="Button" ripple disabled>Ripple</PressableFeedback>
    <PressableFeedback :as="Button" variant="secondary" highlight disabled
      >Highlight</PressableFeedback
    >
    <PressableFeedback :as="Button" variant="danger-soft" hold disabled
      >Hold to delete</PressableFeedback
    >
  </div>
</template>

<script setup lang="ts">
import { Button, PressableFeedback } from '@hareui/vue'
</script>
