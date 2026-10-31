<template>
  <div class="grid w-full max-w-xl gap-4">
    <Alert
      v-model:open="isBackupOpen"
      close-button
      status="success"
      title="Backup finished"
      description="All 1,284 files were copied to the archive."
    />
    <Alert
      v-model:open="isTipOpen"
      status="accent"
      title="Tip"
      description="Drag files onto the sidebar to move them between folders."
      :close-button="{ icon: CircleXmark, label: 'Hide tip' }"
    />
    <Button
      v-if="!isBackupOpen || !isTipOpen"
      class="justify-self-start"
      variant="secondary"
      @click="showAlerts"
    >
      Show alerts again
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Alert, Button } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const CircleXmark = () => h(Icon, { icon: 'gravity-ui:circle-xmark' })

const isBackupOpen = ref(true)
const isTipOpen = ref(true)

const showAlerts = () => {
  isBackupOpen.value = true
  isTipOpen.value = true
}
</script>
