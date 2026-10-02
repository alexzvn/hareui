<script setup lang="ts">
import { Button, Modal } from 'herouse'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex max-w-sm flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-semibold">
        dismissible
      </h3>
      <p class="text-sm text-muted">
        Controls whether the modal can be dismissed by clicking the backdrop or pressing
        Escape. Defaults to <code>true</code>. Set to <code>false</code> to require an
        explicit close action.
      </p>
      <Modal :dismissible="false" class="sm:max-w-[360px]" :ui="{ icon: 'bg-default text-foreground' }">
        <Button variant="secondary">
          Open Modal
        </Button>
        <template #icon>
          <Icon class="size-5" icon="gravity-ui:circle-info" />
        </template>
        <template #title>
          dismissible = false
        </template>
        <template #description>
          <p class="text-sm leading-5 text-muted">
            Clicking the backdrop or pressing Escape won't close this modal
          </p>
        </template>
        <template #body>
          <p>
            Try clicking outside this modal or pressing Escape — nothing happens. You must
            use the close button to dismiss it.
          </p>
        </template>
        <template #footer="{ close }">
          <Button class="w-full" @click="close">
            Close
          </Button>
        </template>
      </Modal>
    </div>
  </div>
</template>
