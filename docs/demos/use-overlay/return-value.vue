<template>
  <div class="flex flex-col items-center gap-3">
    <Button variant="danger" @click="onRemove">Remove Jordan</Button>
    <p class="text-sm text-muted">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import { Button, useOverlay } from '@hareui/vue'
import { ref } from 'vue'

import ConfirmRemoveDialog from './components/ConfirmRemoveDialog.vue'

const overlay = useOverlay()
const confirmRemove = overlay.create(ConfirmRemoveDialog)

const status = ref('Jordan is a member of this workspace.')

const onRemove = async () => {
  // Resolves with the payload of the dialog's `close` event, or `undefined` if it was dismissed.
  const confirmed = await confirmRemove.open({ member: 'Jordan' })

  status.value = confirmed ? 'Jordan was removed.' : 'Jordan is still a member.'
}
</script>
