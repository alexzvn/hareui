<template>
  <div class="flex flex-wrap gap-3">
    <PressableFeedback :as="Button" variant="secondary" ripple>Ripple</PressableFeedback>
    <PressableFeedback :as="Button" variant="secondary" highlight>Highlight</PressableFeedback>
  </div>
</template>

<script setup lang="ts">
import { Button, PressableFeedback } from '@hareui/vue'
</script>
