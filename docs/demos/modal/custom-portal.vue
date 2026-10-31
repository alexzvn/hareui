<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm text-muted">
      The panel's <code>transform</code> makes it the containing block, so the backdrop covers only
      the panel.
    </p>
    <div
      ref="container"
      class="relative flex h-[380px] items-center justify-center overflow-hidden rounded bg-muted/20"
      style="transform: translate(0)"
    >
      <Modal
        v-if="container"
        :portal="container"
        :ui="{ backdrop: 'h-full', container: 'h-full max-h-full' }"
      >
        <Button>Open Modal</Button>
        <template #title> Session expiring </template>
        <template #body>
          <p>You'll be signed out in 2 minutes. Save your work or stay signed in.</p>
        </template>
        <template #footer="{ close }">
          <Button @click="close"> Stay Signed In </Button>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Modal } from '@hareui/vue'
import { useTemplateRef } from 'vue'

const container = useTemplateRef<HTMLElement>('container')
</script>
