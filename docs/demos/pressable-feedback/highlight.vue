<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap gap-3">
      <PressableFeedback :as="Button" highlight>Publish</PressableFeedback>
      <PressableFeedback :as="Button" variant="secondary" highlight>Preview</PressableFeedback>
      <PressableFeedback :as="Button" variant="tertiary" highlight>Duplicate</PressableFeedback>
      <PressableFeedback :as="Button" variant="outline" highlight>Export</PressableFeedback>
      <PressableFeedback :as="Button" variant="ghost" highlight>Skip</PressableFeedback>
      <PressableFeedback :as="Button" variant="danger" highlight>Discard</PressableFeedback>
    </div>

    <div class="flex gap-3">
      <PressableFeedback :as="Button" variant="tertiary" icon-only highlight aria-label="More">
        <Icon icon="gravity-ui:ellipsis" />
      </PressableFeedback>
      <PressableFeedback
        :as="Button"
        variant="secondary"
        icon-only
        :highlight="{ hoverOpacity: 0.12, pressedOpacity: 0.2 }"
        aria-label="Settings"
      >
        <Icon icon="gravity-ui:gear" />
      </PressableFeedback>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, PressableFeedback } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
