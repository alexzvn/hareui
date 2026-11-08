<template>
  <div class="flex flex-col items-start gap-4">
    <div class="flex flex-wrap gap-3">
      <PressableFeedback
        :as="Button"
        variant="secondary"
        progress
        @complete="status = 'Report sent'"
      >
        <Icon icon="gravity-ui:paper-plane" />
        Send report
        <template #progress="{ complete }">
          <Icon :icon="complete ? 'gravity-ui:check' : 'gravity-ui:paper-plane'" />
          {{ complete ? 'Sent' : 'Send report' }}
        </template>
      </PressableFeedback>
      <PressableFeedback
        :as="Button"
        variant="tertiary"
        :progress="{ duration: 3000, resetDelay: 2000 }"
        :ui="{ progress: 'bg-success text-success-foreground' }"
        @complete="status = 'Backup uploaded'"
      >
        <Icon icon="gravity-ui:cloud-arrow-up-in" />
        Upload backup
        <template #progress="{ complete }">
          <Icon :icon="complete ? 'gravity-ui:check' : 'gravity-ui:cloud-arrow-up-in'" />
          {{ complete ? 'Uploaded' : 'Upload backup' }}
        </template>
      </PressableFeedback>
    </div>
    <p class="text-xs text-muted" role="status">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import { Button, PressableFeedback } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const status = ref('')
</script>
