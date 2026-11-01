<template>
  <div class="flex flex-wrap gap-3">
    <Drawer title="Default close button">
      <Button variant="secondary"> Default </Button>
      <template #body>
        <p>The close button is on by default and labelled "Close".</p>
      </template>
    </Drawer>
    <Drawer title="Custom close button" :close-button="{ icon: CircleXmark, label: 'Close panel' }">
      <Button variant="secondary"> Custom icon and label </Button>
      <template #body>
        <p>This close button shows a different icon and announces itself as "Close panel".</p>
      </template>
    </Drawer>
    <Drawer title="No close button" :close-button="false">
      <Button variant="secondary"> Without close button </Button>
      <template #body>
        <p>Close this one with the footer button.</p>
      </template>
      <template #footer="{ close }">
        <Button @click="close"> Done </Button>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { Button, Drawer } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const CircleXmark = () => h(Icon, { icon: 'gravity-ui:circle-xmark' })
</script>
