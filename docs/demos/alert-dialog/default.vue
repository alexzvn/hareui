<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'
</script>

<template>
  <AlertDialog class="sm:max-w-[400px]" status="danger" title="Delete project permanently?">
    <Button variant="danger">
      Delete Project
    </Button>
    <template #body>
      <p>
        This will permanently delete <strong>My Awesome Project</strong> and all of its
        data. This action cannot be undone.
      </p>
    </template>
    <template #footer="{ close }">
      <Button variant="tertiary" @click="close">
        Cancel
      </Button>
      <Button variant="danger" @click="close">
        Delete Project
      </Button>
    </template>
  </AlertDialog>
</template>
