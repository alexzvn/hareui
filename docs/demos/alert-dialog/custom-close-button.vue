<template>
  <div class="flex flex-wrap gap-3">
    <AlertDialog title="Default close button">
      <Button variant="secondary"> Default </Button>
      <template #body>
        <p>The close button is on by default and labelled "Close".</p>
      </template>
    </AlertDialog>
    <AlertDialog
      title="Custom close button"
      :close-button="{ icon: CircleXmark, label: 'Dismiss dialog' }"
    >
      <Button variant="secondary"> Custom icon and label </Button>
      <template #body>
        <p>This close button shows a different icon and announces itself as "Dismiss dialog".</p>
      </template>
    </AlertDialog>
    <AlertDialog title="No close button" :close-button="false">
      <Button variant="secondary"> Without close button </Button>
      <template #body>
        <p>Close this one with the footer button.</p>
      </template>
      <template #footer="{ close }">
        <Button @click="close"> Done </Button>
      </template>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { Button, AlertDialog } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const CircleXmark = () => h(Icon, { icon: 'gravity-ui:circle-xmark' })
</script>
