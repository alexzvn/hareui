<script setup lang="ts">
import { AlertDialog, Button } from 'herouse'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex max-w-sm flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-semibold">
        dismissible
      </h3>
      <p class="text-sm text-muted">
        Controls whether the alert dialog can be dismissed by clicking the overlay backdrop. Alert
        dialogs typically require explicit action, so this defaults to <code>false</code>. Set to
        <code>true</code> for less critical confirmations.
      </p>
      <AlertDialog class="sm:max-w-[400px]" :dismissible="false">
        <Button variant="secondary">
          Open Alert Dialog
        </Button>
        <template #header>
          <div data-slot="alert-dialog-icon" class="flex size-10 shrink-0 items-center justify-center rounded-3xl select-none bg-danger-soft text-danger-soft-foreground">
            <Icon class="size-5" icon="gravity-ui:circle-info" />
          </div>
          <p class="align-middle text-base font-medium text-foreground">
            dismissible = false
          </p>
          <p class="text-sm leading-5 text-muted">
            Clicking the backdrop won't close this alert dialog
          </p>
        </template>
        <template #body>
          <p>
            Try clicking outside this alert dialog on the overlay - it won't close. You must
            use the action buttons to dismiss it.
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
        keyboardDismissible
      </h3>
      <p class="text-sm text-muted">
        Controls whether the ESC key can dismiss the alert dialog. Alert dialogs typically require
        explicit action, so this defaults to <code>false</code>. When set to <code>true</code>,
        the ESC key will be enabled.
      </p>
      <AlertDialog class="sm:max-w-[400px]" :keyboard-dismissible="false">
        <Button variant="secondary">
          Open Alert Dialog
        </Button>
        <template #header>
          <div data-slot="alert-dialog-icon" class="flex size-10 shrink-0 items-center justify-center rounded-3xl select-none bg-accent-soft text-accent-soft-foreground">
            <Icon class="size-5" icon="gravity-ui:circle-info" />
          </div>
          <p class="align-middle text-base font-medium text-foreground">
            keyboardDismissible = false
          </p>
          <p class="text-sm leading-5 text-muted">
            ESC key is disabled
          </p>
        </template>
        <template #body>
          <p>
            Press ESC - nothing happens. You must use the action buttons to dismiss this
            alert dialog.
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
  </div>
</template>
