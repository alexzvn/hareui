<template>
  <div class="flex max-w-2xl flex-col gap-8">
    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-semibold">Using the footer slot's close()</h3>
      <p class="text-sm text-muted">
        The simplest way to close a modal. The <code>#footer</code> slot receives a
        <code>close</code> function — bind it to any Button's <code>@click</code> handler.
      </p>
      <Modal>
        <Button variant="secondary"> Open Modal </Button>
        <template #icon>
          <Icon class="text-accent-soft-foreground" icon="gravity-ui:circle-info" />
        </template>
        <template #title> Using footer close() </template>
        <template #body>
          <p>
            Click either button below — both call the <code>close</code> function passed to the
            <code>#footer</code> slot and will close the modal automatically.
          </p>
        </template>
        <template #footer="{ close }">
          <Button variant="secondary" @click="close"> Cancel </Button>
          <Button @click="close"> Confirm </Button>
        </template>
      </Modal>
    </div>

    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-semibold">Using the #content slot's close()</h3>
      <p class="text-sm text-muted">
        Access the <code>close</code> function from the <code>#content</code> slot, which replaces
        the entire dialog body. This gives you full control over when and how to close the modal,
        allowing you to add custom logic before closing.
      </p>
      <Modal title="Using #content slot's close()">
        <Button variant="secondary"> Open Modal </Button>
        <template #content="{ close }">
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-3xl bg-success-soft text-success-soft-foreground"
              >
                <Icon icon="gravity-ui:circle-check" />
              </div>
              <p class="text-base font-medium text-foreground">Using #content slot's close()</p>
            </div>
            <p class="text-sm text-muted">
              The buttons below use the <code>close</code> function from the
              <code>#content</code> slot's scope. You can add validation or other logic before
              calling <code>close()</code>.
            </p>
            <div class="mt-2 flex justify-end gap-2">
              <Button variant="secondary" @click="close"> Cancel </Button>
              <Button @click="close"> Confirm </Button>
            </div>
          </div>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Modal } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
