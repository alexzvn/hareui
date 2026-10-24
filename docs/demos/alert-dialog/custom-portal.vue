<template>
  <div class="flex flex-col gap-4">
    <div>
      <p class="text-sm">
        Render alert dialogs inside a custom container instead of <code>document.body</code>
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
      <AlertDialog
        v-if="portalRef"
        class="h-full max-h-full sm:max-w-md"
        :portal="portalRef"
        status="accent"
        title="Custom Portal"
        :ui="{ backdrop: 'h-full', container: 'h-full max-h-full' }"
      >
        <Button>Open Alert Dialog</Button>
        <template #body>
          <p class="text-sm text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p class="text-sm text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p class="text-sm text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </template>
        <template #footer="{ close }">
          <Button variant="tertiary" @click="close"> Cancel </Button>
          <Button @click="close"> Confirm </Button>
        </template>
      </AlertDialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'
import { ref } from 'vue'

const portalRef = ref<HTMLElement>()
</script>
