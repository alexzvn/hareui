<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <AlertDialog
    class="sm:max-w-[420px]"
    status="danger"
    title="Permanently delete your account?"
    variant="blur"
    :ui="{
      backdrop:
        'bg-linear-to-t from-red-950/90 via-red-950/50 to-transparent dark:from-red-950/95 dark:via-red-950/60',
      header: 'items-center text-center',
      footer: 'flex-col-reverse',
    }"
  >
    <Button variant="danger"> Delete Account </Button>
    <template #icon>
      <Icon class="size-5" icon="gravity-ui:triangle-exclamation" />
    </template>
    <template #body>
      <p>
        This action cannot be undone. All your data, settings, and content will be permanently
        removed from our servers. The dramatic red backdrop emphasizes the severity and
        irreversibility of this decision.
      </p>
    </template>
    <template #footer="{ close }">
      <Button class="w-full" @click="close"> Keep Account </Button>
      <Button class="w-full" variant="danger" @click="close"> Delete Forever </Button>
    </template>
  </AlertDialog>
</template>
