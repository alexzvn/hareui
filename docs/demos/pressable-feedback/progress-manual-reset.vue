<template>
  <div class="flex flex-col items-start gap-4">
    <div class="flex items-center gap-2">
      <PressableFeedback
        ref="exportButton"
        :as="Button"
        variant="secondary"
        :progress="{ autoReset: false }"
        :ui="{ progress: 'bg-success text-success-foreground' }"
        @complete="status = 'export.csv is ready to download'"
      >
        <Icon icon="gravity-ui:file-arrow-down" />
        Export CSV
        <template #progress="{ complete }">
          <Icon :icon="complete ? 'gravity-ui:check' : 'gravity-ui:file-arrow-down'" />
          {{ complete ? 'CSV ready' : 'Export CSV' }}
        </template>
      </PressableFeedback>
      <Button size="sm" variant="ghost" @click="onReset">Reset</Button>
    </div>
    <p class="text-xs text-muted" role="status">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import { Button, PressableFeedback } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref, useTemplateRef } from 'vue'

const exportButton = useTemplateRef('exportButton')
const status = ref('')

const onReset = () => {
  exportButton.value?.reset()
  status.value = ''
}
</script>
