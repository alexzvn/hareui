<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex max-w-2xl flex-col gap-8">
    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-semibold">
        Using the footer slot's close()
      </h3>
      <p class="text-sm text-muted">
        The simplest way to close a dialog. The <code>#footer</code> slot receives a
        <code>close</code> function — bind it to any Button's <code>@click</code> handler.
        When clicked, it will automatically close the dialog.
      </p>
      <AlertDialog class="sm:max-w-[400px]" :close-button="false" status="accent" title="Using footer close()">
        <Button variant="secondary">
          Open Dialog
        </Button>
        <template #body>
          <p>
            Click either button below - both call the <code>close</code> function passed to the
            <code>#footer</code> slot and will close the dialog automatically.
          </p>
        </template>
        <template #footer="{ close }">
          <Button variant="tertiary" @click="close">
            Cancel
          </Button>
          <Button @click="close">
            Confirm
          </Button>
        </template>
      </AlertDialog>
    </div>

    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-semibold">
        Using the #content slot's close()
      </h3>
      <p class="text-sm text-muted">
        Access the <code>close</code> function from the <code>#content</code> slot, which
        replaces the entire dialog content. This gives you full control over when and how to
        close the dialog, allowing you to add custom logic before closing.
      </p>
      <AlertDialog class="sm:max-w-[400px]" title="Using #content slot's close()">
        <Button variant="secondary">
          Open Dialog
        </Button>
        <template #content="{ close }">
          <div class="flex flex-col gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-3xl bg-success-soft text-success-soft-foreground select-none">
              <Icon class="size-5" icon="gravity-ui:circle-check" />
            </div>
            <p class="align-middle text-base font-medium text-foreground">
              Using #content slot's close()
            </p>
          </div>
          <div class="mt-2 text-sm leading-[1.43] text-muted">
            <p>
              The buttons below use the <code>close</code> function from the
              <code>#content</code> slot's scope. You can add validation or other logic
              before calling <code>close()</code>.
            </p>
          </div>
          <div class="mt-5 flex flex-row items-center justify-end gap-2">
            <Button variant="tertiary" @click="close">
              Cancel
            </Button>
            <Button @click="close">
              Confirm
            </Button>
          </div>
        </template>
      </AlertDialog>
    </div>
  </div>
</template>
