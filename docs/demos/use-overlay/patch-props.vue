<template>
  <Button variant="secondary" @click="onExport">Export report</Button>
</template>

<script setup lang="ts">
import { Button, useOverlay } from '@hareui/vue'
import { onBeforeUnmount } from 'vue'

import ExportModal from './components/ExportModal.vue'

const overlay = useOverlay()
const exportModal = overlay.create(ExportModal, {
  props: { fileName: 'q3-revenue.csv', progress: 0 },
})

let timer: ReturnType<typeof setInterval> | undefined

const stopTimer = () => clearInterval(timer)

const onExport = async () => {
  let progress = 0

  // `open()` starts from the props given to `create()`, so every export starts at 0%.
  const closed = exportModal.open()

  timer = setInterval(() => {
    progress = Math.min(progress + 20, 100)
    exportModal.patch({ progress })
    if (progress === 100) stopTimer()
  }, 400)

  await closed
  stopTimer()
}

onBeforeUnmount(stopTimer)
</script>
