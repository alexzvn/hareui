<template>
  <Sheet
    close-button
    title="Parent Sheet"
    class="mx-auto max-w-[420px]"
    :ui="{ dialog: 'h-[320px]', body: 'flex flex-col justify-between pb-4' }"
  >
    <Button variant="secondary"> Open Parent Sheet </Button>
    <template #body>
      <p class="mb-4 text-sm text-muted">
        This is the parent sheet. Opening a sheet from it pushes this one back while the new one
        slides over it.
      </p>
      <Sheet
        close-button
        title="Nested Sheet"
        class="mx-auto max-w-[420px]"
        :ui="{ dialog: 'h-[320px]' }"
      >
        <Button class="w-full" variant="secondary"> Open Nested Sheet </Button>
        <template #body>
          <p class="mb-4 text-sm text-muted">
            This sheet sits on top of the parent. Swipe it down to go back to the parent sheet.
          </p>
          <Sheet
            close-button
            title="Third Level"
            class="mx-auto max-w-[420px]"
            :ui="{ dialog: 'h-[320px]' }"
          >
            <Button class="w-full" variant="secondary"> Go Deeper </Button>
            <template #body>
              <p class="text-sm text-muted">
                Three sheets deep. Each sheet below shrinks back a little more as the next one
                opens.
              </p>
            </template>
            <template #footer="{ close }">
              <Button class="w-full" @click="close"> Close </Button>
            </template>
          </Sheet>
        </template>
        <template #footer="{ close }">
          <Button variant="secondary" @click="close"> Back </Button>
        </template>
      </Sheet>
    </template>
  </Sheet>
</template>

<script setup lang="ts">
import { Button, Sheet } from '@hareui/vue'
</script>
