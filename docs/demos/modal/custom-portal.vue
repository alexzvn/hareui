<script setup lang="ts">
import { Button, Modal } from 'herouse'
import { ref } from 'vue'

const portalRef = ref<HTMLElement>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div>
      <p class="text-sm">
        Render modals inside a custom container instead of <code>document.body</code>
      </p>
      <p class="text-sm text-muted">
        Apply <code class="rounded px-1 py-0.5 text-xs">transform: translateZ(0)</code> to the
        container to create a new stacking context.
      </p>
    </div>
    <div
      ref="portalRef"
      class="relative flex h-[380px] items-center justify-center overflow-hidden rounded bg-muted/20"
      style="transform: translate(0)"
    >
      <Modal v-if="portalRef" :portal="portalRef" :ui="{ backdrop: 'h-full' }">
        <Button>Open Modal</Button>
        <template #title>
          Custom Portal
        </template>
        <template #body>
          <p class="text-sm text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p class="text-sm text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p class="text-sm text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </template>
        <template #footer="{ close }">
          <Button variant="secondary" @click="close">
            Close
          </Button>
        </template>
      </Modal>
    </div>
  </div>
</template>
