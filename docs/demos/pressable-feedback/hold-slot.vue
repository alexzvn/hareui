<template>
  <div class="flex flex-col items-start gap-4">
    <PressableFeedback
      ref="verify"
      :as="Button"
      variant="tertiary"
      :hold="{ duration: 1200, resetOnComplete: false }"
      :ui="{ hold: 'bg-success text-success-foreground' }"
      @confirm="onConfirm"
    >
      <Icon icon="gravity-ui:shield-check" />
      Hold to verify
      <template #hold="{ complete }">
        <Icon :icon="complete ? 'gravity-ui:check' : 'gravity-ui:shield-check'" />
        {{ complete ? 'Verified' : 'Hold to verify' }}
      </template>
    </PressableFeedback>
    <p class="text-xs text-muted" role="status">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import { Button, PressableFeedback } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref, useTemplateRef } from 'vue'

const verify = useTemplateRef('verify')
const status = ref('')

const onConfirm = () => {
  status.value = 'Device verified'

  setTimeout(() => {
    verify.value?.reset()
    status.value = ''
  }, 1500)
}
</script>
