<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm text-muted">
      The panel's <code>transform</code> makes it the containing block, so the backdrop covers only
      the panel.
    </p>
    <div
      ref="portalRef"
      class="relative flex h-[380px] items-center justify-center overflow-hidden rounded bg-muted/20"
      style="transform: translate(0)"
    >
      <AlertDialog
        v-if="portalRef"
        class="sm:max-w-[400px]"
        :portal="portalRef"
        status="warning"
        title="Leave this page?"
        :ui="{ backdrop: 'h-full', container: 'h-full max-h-full' }"
      >
        <Button>Leave Page</Button>
        <template #body>
          <p>Your reply to Sam hasn't been sent yet. It will be kept as a draft.</p>
        </template>
        <template #footer="{ close }">
          <Button variant="tertiary" @click="close"> Stay </Button>
          <Button @click="close"> Leave </Button>
        </template>
      </AlertDialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'
import { useTemplateRef } from 'vue'

const portalRef = useTemplateRef<HTMLElement>('portalRef')
</script>
