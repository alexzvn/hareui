<script setup lang="ts">
import { App, Button, Modal } from '@hareui/vue'
</script>

<template>
  <App portal="#app-portal-target" :toaster="null">
    <!-- The portal target: overlays of this subtree teleport here instead of `document.body`. -->
    <div
      id="app-portal-target"
      class="relative flex h-80 w-full max-w-xl items-center justify-center overflow-hidden rounded-3xl border border-dashed border-border bg-surface"
    >
      <code class="absolute start-4 top-4 font-mono text-xs text-muted">#app-portal-target</code>
      <!-- The theme sizes the backdrop to the viewport: size it to the target instead. -->
      <Modal
        title="Rendered in the target"
        placement="center"
        :ui="{ backdrop: 'absolute h-full', container: 'h-full' }"
      >
        <Button variant="secondary">Open modal</Button>
        <template #body>
          <p>
            The dialog and its backdrop render inside the dashed container instead of
            <code>document.body</code>.
          </p>
        </template>
        <template #footer="{ close }">
          <Button size="sm" @click="close">Got it</Button>
        </template>
      </Modal>
    </div>
  </App>
</template>
