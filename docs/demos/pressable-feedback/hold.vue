<template>
  <div class="flex flex-col items-start gap-4">
    <div class="flex flex-wrap gap-3">
      <PressableFeedback
        :as="Button"
        variant="danger-soft"
        hold
        :ui="{ hold: 'bg-danger text-danger-foreground' }"
        @confirm="log = 'Workspace archived'"
      >
        <Icon icon="gravity-ui:archive" />
        Hold to archive
      </PressableFeedback>
      <PressableFeedback :as="Button" variant="secondary" hold @confirm="log = 'Changes reverted'">
        <Icon icon="gravity-ui:arrow-rotate-left" />
        Hold to revert
      </PressableFeedback>
      <PressableFeedback
        :as="Button"
        variant="danger-soft"
        icon-only
        :hold="{ sweep: 'up' }"
        :ui="{ hold: 'bg-danger text-danger-foreground' }"
        aria-label="Hold to sign out"
        @confirm="log = 'Signed out'"
      >
        <Icon icon="gravity-ui:power" />
      </PressableFeedback>
    </div>
    <p class="text-xs text-muted">{{ log }}</p>
  </div>
</template>

<script setup lang="ts">
import { Button, PressableFeedback } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const log = ref('Press and hold a button, with the pointer, Space or Enter.')
</script>
