<template>
  <div class="flex flex-wrap gap-3">
    <AlertDialog class="sm:max-w-[400px]" status="danger" title="Delete 3 files?">
      <Button variant="secondary"> Default </Button>
      <template #body>
        <p>Escape and backdrop clicks do nothing. Pick an answer below.</p>
      </template>
      <template #footer="{ close }">
        <Button variant="tertiary" @click="close"> Cancel </Button>
        <Button variant="danger" @click="close"> Delete </Button>
      </template>
    </AlertDialog>

    <AlertDialog
      class="sm:max-w-[400px]"
      dismissible
      keyboard-dismissible
      status="accent"
      title="Turn on notifications?"
    >
      <Button variant="secondary"> Dismissible </Button>
      <template #body>
        <p>Press Escape or click outside to close this one.</p>
      </template>
      <template #footer="{ close }">
        <Button variant="tertiary" @click="close"> Not Now </Button>
        <Button @click="close"> Turn On </Button>
      </template>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'
</script>
