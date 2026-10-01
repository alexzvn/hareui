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
      <Modal :dismissible="false">
        <Button variant="secondary">
          Open Modal
        </Button>
        <template #icon>
          <Icon class="text-foreground" icon="gravity-ui:circle-info" />
        </template>
        <template #header>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-3xl bg-default text-foreground">
                <Icon icon="gravity-ui:circle-info" />
              </div>
              <p class="text-base font-medium text-foreground">
                dismissible = false
              </p>
            </div>
            <p class="text-sm leading-5 text-muted">
              Clicking the backdrop or pressing Escape won't close this modal
            </p>
          </div>
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
